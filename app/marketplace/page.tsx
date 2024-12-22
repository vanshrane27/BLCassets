'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Heart, Share2, Tag, MapPin, Ruler } from 'lucide-react'
import { useWallet } from '@/app/context/WalletContext'

export default function Marketplace() {
  const { userAssets } = useWallet()
  const [assets, setAssets] = useState(userAssets.filter(asset => asset.listed))
  const { toast } = useToast()

  const handleBuy = async (id: number, price: number) => {
    try {
      await buyAsset(id, price)
      toast({
        title: "Success",
        description: "Asset purchased successfully!",
      })
      // Refresh assets
      const response = await fetch('/api/assets')
      const data = await response.json()
      if (data.success) {
        setAssets(data.assets.filter(asset => asset.listed))
      }
    } catch (error) {
      console.error('Error buying asset:', error)
      toast({
        title: "Error",
        description: "Failed to purchase asset. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleLike = (id: number) => {
    toast({
      title: "Asset Liked",
      description: "This asset has been added to your favorites.",
    })
  }

  const handleShare = (id: number) => {
    toast({
      title: "Share Link Copied",
      description: "The share link has been copied to your clipboard.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Real Estate Marketplace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <Card key={asset.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{asset.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <Image
                src={asset.image}
                alt={asset.title}
                width={400}
                height={400}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <p className="text-muted-foreground mb-2">{asset.description}</p>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="font-bold">{asset.price} ETH</span>
                </div>
                <p className="text-sm text-muted-foreground">Owner: {asset.owner}</p>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{asset.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                <span>{asset.size}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => handleBuy(asset.id, asset.price)}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Buy Now
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleLike(asset.id)}>
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleShare(asset.id)}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

