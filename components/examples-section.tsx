import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const EXAMPLES = [
  {
    id: 1,
    original: "/samples/original1.jpeg?height=300&width=300",
    converted: "/samples/ghibli1.jpeg?height=300&width=300",
    title: "Urban Scenes",
  },
  {
    id: 2,
    original: "/samples/original2.jpeg?height=300&width=300",
    converted: "/samples/ghibli2.jpeg?height=300&width=300",
    title: "Portrait",
  },
  {
    id: 3,
    original: "/samples/original3.jpeg?height=300&width=300",
    converted: "/samples/ghibli3.jpeg?height=300&width=300",
    title: "Landscape",
  },
]

export default function ExamplesSection() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-[#1a237e]">See the Magic in Action</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {EXAMPLES.map((example) => (
          <Card key={example.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <div className="grid grid-cols-2">
                  <div className="aspect-square relative">
                    <Image
                      src={example.original || "/placeholder.svg"}
                      alt={`Original ${example.title}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-xs rounded">Original</div>
                  </div>
                  <div className="aspect-square relative">
                    <Image
                      src={example.converted || "/placeholder.svg"}
                      alt={`Converted ${example.title}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-white/80 px-2 py-1 text-xs rounded">Ghibli Style</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{example.title}</h3>
                  <p className="text-sm text-gray-500">See how our AI transforms this {example.title.toLowerCase()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

