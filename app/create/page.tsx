'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Upload, DollarSign } from 'lucide-react'

export default function CreateIPToken() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [documents, setDocuments] = useState<FileList | null>(null)
  const [value, setValue] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate token creation
    toast({
      title: "IP Token Created",
      description: "Your IP has been successfully tokenized as an NFT.",
    })
    router.push('/marketplace')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Create IP Token</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                  placeholder="e.g., New York, USA"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="documents">Verification Documents</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="documents"
                  type="file"
                  onChange={(e) => setDocuments(e.target.files)}
                  multiple
                  required
                  className="flex-grow"
                />
                <Button type="button" variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Upload any relevant documents to verify your IP (e.g., patents, copyrights, trademarks)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Estimated Value (ETH)</Label>
              <div className="relative">
                <DollarSign className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="pl-10"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Create Token</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

