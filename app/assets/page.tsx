'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useWallet } from '../context/WalletContext'
import { DollarSign, Tag } from 'lucide-react'

export default function UserAssets() {
  const { userAssets, listAssetForSale, isConnected } = useWallet()
  const [prices, setPrices] = useState<{ [key: number]: string }>({})
  const router = useRouter()
  const { toast } = useToast()

  if (!isConnected) {
    router.push('/')
    return null
  }

  const handlePriceChange = (id: number, price: string) => {
    setPrices({ ...prices, [id]: price })
  }

  const handleListForSale = (id: number) => {
    const price = parseFloat(prices[id])
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      })
      return
    }
    listAssetForSale(id, price)
    toast({
      title: "Asset Listed",
      description: "Your IP asset has been listed for sale in the marketplace.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your IP Assets</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userAssets.map((asset) => (
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
              <p className="text-muted-foreground">{asset.description}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              {asset.listed ? (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Listed for {asset.price} ETH</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 w-full">
                    <DollarSign className="h-4 w-4" />
                    <Input
                      type="number"
                      placeholder="Price in ETH"
                      value={prices[asset.id] || ''}
                      onChange={(e) => handlePriceChange(asset.id, e.target.value)}
                      className="flex-grow"
                    />
                  </div>
                  <Button onClick={() => handleListForSale(asset.id)} className="w-full">
                    List for Sale
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

