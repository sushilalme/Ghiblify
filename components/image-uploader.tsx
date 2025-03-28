"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, RefreshCw, Check, ImagePlus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import PaymentModal from "./payment-modal"

export default function ImageUploader() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [convertedImage, setConvertedImage] = useState<string | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [userEmail, setUserEmail] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string)
        setConvertedImage(null)
        setActiveTab("preview")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string)
        setConvertedImage(null)
        setActiveTab("preview")
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleConvert = () => {
    setIsPaymentModalOpen(true)
  }

  const handlePaymentSuccess = async (email: string, upiId: string) => {
    setIsPaymentModalOpen(false)
    setActiveTab("result")
    setIsConverting(true)
    setUserEmail(email)

    try {
      const formData = new FormData()
      const response = await fetch(originalImage!)
      const blob = await response.blob()

      formData.append("image", blob)
      formData.append("email", email)
      formData.append("upiId", upiId)

      const uploadResponse = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        console.error("API Error:", {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          error: errorData
        })
        throw new Error(`API Error: ${errorData.error || 'Unknown error'}`)
      }

      const data = await uploadResponse.json()
      console.log("Success Response:", {
        email,
        upiId,
        imageUrl: data.url,
        userId: data.userId,
        timestamp: new Date().toISOString()
      })

      setIsConverting(false)
    } catch (error) {
      console.error("Detailed Error:", {
        message: error.message,
        stack: error.stack,
        originalImage: !!originalImage,
        email,
        upiId
      })
      setIsConverting(false)
    }
  }

  const resetUpload = () => {
    setOriginalImage(null)
    setConvertedImage(null)
    setActiveTab("upload")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb]" id="image-uploader">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur-sm">
          <TabsTrigger 
            value="upload" 
            disabled={isConverting}
            className="data-[state=active]:bg-[#ff9800]/10 data-[state=active]:text-[#ff9800]"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload
          </TabsTrigger>
          <TabsTrigger 
            value="preview" 
            disabled={!originalImage || isConverting}
            className="data-[state=active]:bg-[#ff9800]/10 data-[state=active]:text-[#ff9800]"
          >
            <ImagePlus className="w-4 h-4 mr-2" /> Preview
          </TabsTrigger>
          <TabsTrigger 
            value="result" 
            disabled={!convertedImage}
            className="data-[state=active]:bg-[#ff9800]/10 data-[state=active]:text-[#ff9800]"
          >
            <Check className="w-4 h-4 mr-2" /> Result
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="p-6">
          <div
            className="border-2 border-dashed border-[#ff9800]/50 rounded-2xl p-12 text-center cursor-pointer hover:bg-[#ff9800]/5 transition-colors group"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <Upload className="w-16 h-16 mx-auto mb-4 text-[#ff9800] group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-medium mb-2 text-[#1a237e]">
              Upload Your Photo
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop or click to browse
            </p>
            <Button className="bg-[#ff9800] hover:bg-[#f57c00] group-hover:scale-105 transition-transform">
              Select Image
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="p-6">
          {originalImage && (
            <div className="space-y-6">
              <div className="aspect-video relative rounded-2xl overflow-hidden border-4 border-[#ff9800]/20 shadow-lg">
                <Image 
                  src={originalImage || "/placeholder.svg"} 
                  alt="Original image" 
                  fill 
                  className="object-contain" 
                />
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={resetUpload} 
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Upload Different Image</span>
                </Button>
                <Button 
                  className="bg-[#ff9800] hover:bg-[#f57c00] flex items-center space-x-2" 
                  onClick={handleConvert}
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>Convert to Ghibli Style (₹59)</span>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="result" className="p-6">
          {isConverting ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin text-[#ff9800] mb-4" />
              <h3 className="text-xl font-medium text-[#1a237e]">
                Processing Your Magical Transformation
              </h3>
              <p className="text-gray-600">
                Your Ghibli masterpiece is coming to life...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-[#ff9800]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-[#ff9800]" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-[#1a237e]">
                  Ghibli Magic Unleashed!
                </h3>
                <p className="text-lg text-gray-600 mb-2">
                  Your transformed image will be sent to:
                </p>
                <p className="text-xl font-medium text-[#1a237e] mb-6">
                  {userEmail}
                </p>
                <p className="text-gray-500">
                  Expect your anime-fied artwork within 60 minutes.
                </p>
              </div>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={resetUpload} 
                  className="flex items-center space-x-2"
                >
                  <ImagePlus className="w-4 h-4" />
                  <span>Transform Another Image</span>
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </Card>
  )
}