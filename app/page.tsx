import { Suspense } from "react"
import ImageUploader from "@/components/image-uploader"
import HeroSection from "@/components/hero-section"
import ExamplesSection from "@/components/examples-section"
import ProcessSteps from "@/components/process-steps"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
      <HeroSection />

      <div className="container mx-auto px-4 py-12">
        <Suspense fallback={<div className="h-96 flex items-center justify-center">Loading uploader...</div>}>
          <ImageUploader />
        </Suspense>

        <ProcessSteps />
        <ExamplesSection />
      </div>

      <Footer />
    </main>
  )
}

