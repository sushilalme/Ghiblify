import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#1a237e] text-white py-6">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">Ghibli Converter</h3>
          <p className="text-blue-200 text-sm">
            © {new Date().getFullYear()} Ghibli at 59
          </p>
        </div>
        <div className="flex items-center">
          <p className="text-blue-200 text-sm flex items-center">
            Made with <Heart className="w-4 h-4 mx-1 text-red-400" /> 
          </p>
        </div>
      </div>
    </footer>
  )
}