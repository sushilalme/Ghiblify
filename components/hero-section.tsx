"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ImagePlus, WandSparkles } from "lucide-react"
import { useRef, useState } from "react";

export default function HeroSection() {

  const [sliderPosition, setSliderPosition] = useState(50);
  const sliderContainerRef = useRef(null);

  const scrollToUploader = () => {
    const uploaderElement = document.getElementById("image-uploader");
    if (uploaderElement) {
      uploaderElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;

    const containerRect = sliderContainerRef.current.getBoundingClientRect();
    const percentage = ((clientX - containerRect.left) / containerRect.width) * 100;
    
    // Constrain the slider between 0 and 100
    const constrainedPercentage = Math.max(0, Math.min(100, percentage));
    setSliderPosition(constrainedPercentage);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  return (
    <div className="relative bg-gradient-to-br min-h-screen from-[#e1f5fe] to-[#b3e5fc] overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center relative z-10">
        <div className="md:w-1/2 space-y-6">
          <div className="flex items-center space-x-3 mb-4">
            <WandSparkles className="w-10 h-10 text-[#ff9800] animate-pulse" />
            <span className="text-lg font-medium text-[#1a237e]">Ghiblify your Image</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a237e] leading-tight">
            Anime Your Reality
          </h1>
          <p className="text-lg md:text-xl text-[#37474f] max-w-lg leading-relaxed">
            Unleash the magic of Studio Ghibli with our cutting-edge AI. Transform your memories into breathtaking, 
            hand-drawn anime masterpieces in just one click.
          </p>
          <div className="flex space-x-4">
            <Button 
              onClick={scrollToUploader}
              className="bg-[#ff9800] hover:bg-[#f57c00] text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2"
            >
              <ImagePlus className="w-5 h-5" />
              <span>Transform Your Photo</span>
            </Button>
            <Button 
              variant="outline" 
              className="border-[#1a237e] text-[#1a237e] px-6 py-3 rounded-full hover:bg-[#1a237e] hover:text-white transition-all duration-300"
            >
              How It Works
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center relative">
          <div className="relative w-80 h-80 md:w-96 md:h-96 group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#ff9800]/20 to-[#1a237e]/20 rounded-xl blur-xl group-hover:opacity-75 transition duration-300"></div>
            {/* Image Comparison Slider */}
        <div 
          ref={sliderContainerRef}
          className="relative w-full max-w-4xl mx-auto aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-xl"
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        >
          {/* Original Image */}
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'url("/samples/original-main.png")', 
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` 
            }}
          />
          
          {/* Ghibli Transformed Image */}
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
            style={{ 
              backgroundImage: 'url("/samples/ghibli-main.png")', 
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` 
            }}
          />
          
          {/* Slider Handle */}
          <div 
            className="absolute top-0 bottom-0 w-1 bg-white/70 backdrop-blur-sm shadow-lg cursor-ew-resize z-20"
            style={{ 
              left: `${sliderPosition}%`, 
              transform: 'translateX(-50%)' 
            }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#FF9800" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="9 12 12 15 15 12"></polyline>
              </svg>
            </div>
          </div>
        </div>

            <div className="absolute -bottom-4 -right-4 bg-white/80 backdrop-blur-md p-3 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="bg-[#ff9800] text-white rounded-full p-1">
                  <WandSparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#1a237e]">Ghibli Magic</div>
                  <div className="text-xs text-gray-600">Just ₹59 per image</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
        <svg 
          className="w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,0 L100,0 L100,100 C50,80 30,100 0,70 Z" 
            fill="#81c784" 
          />
        </svg>
      </div>
    </div>
  )
}