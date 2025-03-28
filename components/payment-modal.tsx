"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Mail, QrCode } from "lucide-react"
import QRCode from "react-qr-code"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (email: string, upiId: string) => void
}

export default function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [upiId, setUpiId] = useState("")

  const UPI_LINK = process.env.NEXT_PUBLIC_UPI_LINK || ""

  const resetModal = () => {
    setStep(1)
    setEmail("")
    setUpiId("")
  }

  const handleContinue = () => {
    if (step === 1 && email) {
      setStep(2)
    } else if (step === 2 && upiId) {
      setStep(3)
      console.log({
        email,
        upiId,
        timestamp: new Date().toISOString()
      })
      setTimeout(() => {
        onSuccess(email, upiId)
        resetModal()
      }, 2000)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 flex flex-col items-center">
              <Mail className="w-12 h-12 text-[#ff9800] mb-4" />
              <h3 className="text-xl font-medium text-[#1a237e]">
                Where Should We Send Your Ghibli Magic?
              </h3>
              <p className="text-sm text-gray-600 max-w-md mt-2">
                Enter your email to receive your anime-transformed artwork
              </p>
            </div>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/50 backdrop-blur-sm border-[#ff9800]/30 focus:border-[#ff9800]"
              icon={<Mail className="text-[#ff9800]" />}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6 flex flex-col items-center">
              <QrCode className="w-12 h-12 text-[#ff9800] mb-4" />
              <h3 className="text-xl font-medium text-[#1a237e]">
                Complete Your Payment
              </h3>
              <p className="text-sm text-gray-600 max-w-md mt-2">
                Scan the QR code or enter your UPI ID to unlock the Ghibli transformation
              </p>
            </div>

            <div className="flex justify-center p-4 bg-white/50 backdrop-blur-sm rounded-lg shadow-md">
              <QRCode value={UPI_LINK} size={200} />
            </div>

            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter your UPI ID"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full bg-white/50 backdrop-blur-sm border-[#ff9800]/30 focus:border-[#ff9800]"
              />
              <p className="text-xs text-gray-500 text-center">
                Example: yourname@upi
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center py-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-[#ff9800]/10 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-[#ff9800]" />
            </div>
            <h3 className="text-xl font-medium text-[#1a237e]">
              Transformation Confirmed!
            </h3>
            <p className="text-gray-600 mt-2 max-w-md">
              We'll verify your payment and send your Ghibli-style artwork to {email}
            </p>
          </div>
        )
    }
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        if (!open) {
          resetModal()
          onClose()
        }
      }}
    >
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#1a237e]">
            {step === 3 
              ? "Payment Complete" 
              : step === 2 
                ? "Payment Details" 
                : "Contact Information"
            }
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">{renderStep()}</div>

        <DialogFooter>
          {step < 3 && (
            <>
              <Button 
                variant="outline" 
                onClick={onClose}
                className="border-[#1a237e] text-[#1a237e] hover:bg-[#1a237e]/10"
              >
                Cancel
              </Button>
              <Button
                className="bg-[#ff9800] hover:bg-[#f57c00] text-white"
                onClick={handleContinue}
                disabled={step === 1 ? !email : !upiId}
              >
                {step === 1 ? "Continue" : "Confirm Payment"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}