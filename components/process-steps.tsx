import { Card, CardContent } from "@/components/ui/card"
import { Upload, Sparkles, CreditCard, Download } from "lucide-react"

const STEPS = [
  {
    id: 1,
    title: "Upload Your Image",
    description: "Select or drag & drop any photo you want to transform",
    icon: Upload,
    color: {
      bg: "bg-[#ff9800]/10",
      text: "text-[#ff9800]"
    },
  },
  {
    id: 2,
    title: "Quick Payment",
    description: "Pay just ₹59 per image with secure checkout",
    icon: CreditCard,
    color: {
      bg: "bg-green-100/50",
      text: "text-green-600"
    },
  },
  {
    id: 3,
    title: "Magic Conversion",
    description: "Our AI transforms your image into Ghibli-style artwork",
    icon: Sparkles,
    color: {
      bg: "bg-purple-100/50",
      text: "text-purple-600"
    },
  },
  {
    id: 4,
    title: "Download & Share",
    description: "Get your Ghibli-style image instantly",
    icon: Download,
    color: {
      bg: "bg-blue-100/50",
      text: "text-blue-600"
    },
  }
]

export default function ProcessSteps() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-[#1a237e] tracking-tight">
            Your Ghibli Transformation Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the magic of turning your everyday photos into enchanting Ghibli-style masterpieces
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <Card 
              key={step.id} 
              className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden group"
            >
              <CardContent className="pt-6 relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff9800] to-[#1a237e] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 rounded-full ${step.color.bg} ${step.color.text} flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-medium mb-2 text-[#1a237e]">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <div className="mt-2 text-6xl font-bold text-gray-200 absolute top-4 right-4 opacity-50">
                    {step.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}