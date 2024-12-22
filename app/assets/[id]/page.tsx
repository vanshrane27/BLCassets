'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useWallet } from '@/app/context/WalletContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DollarSign, Tag, Clock, User, Briefcase, ArrowLeft } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function AssetDetails({ params }: { params: { id: string } }) {
  const { getAssetById, listAssetForSale, unlistAsset, isConnected } = useWallet()
  const [asset, setAsset] = useState<any>(null)
  const [price, setPrice] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (!isConnected) {
      router.push('/')
      return
    }

    const fetchedAsset = getAssetById(parseInt(params.id))
    if (fetchedAsset) {
      setAsset(fetchedAsset)
      setPrice(fetchedAsset.price?.toString() || '')
    } else {
      router.push('/profile')
    }
  }, [isConnected, params.id, getAssetById, router])

  if (!asset) return null

  const handleListForSale = () => {
    const numPrice = parseFloat(price)
    if (isNaN(numPrice) || numPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0.",
        variant: "destructive",
      })
      return
    }
    listAssetForSale(asset.id, numPrice)
    toast({
      title: "Asset Listed",
      description: "Your IP asset has been listed for sale in the marketplace.",
    })
    setAsset({ ...asset, listed: true, price: numPrice })
  }

  const handleUnlist = () => {
    unlistAsset(asset.id)
    toast({
      title: "Asset Unlisted",
      description: "Your IP asset has been removed from the marketplace.",
    })
    setAsset({ ...asset, listed: false, price: undefined })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">{asset.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Image
            src={asset.image}
            alt={asset.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-md"
          />
          <p className="text-muted-foreground">{asset.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span>Created: {new Date(asset.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span>Creator: {asset.creator}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span>Owner: {asset.owner}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span>Value: {asset.value} ETH</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          {asset.listed ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                <span>Listed for {asset.price} ETH</span>
              </div>
              <Button variant="outline" onClick={handleUnlist}>
                Unlist
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 w-full">
                <DollarSign className="h-5 w-5" />
                <Input
                  type="number"
                  placeholder="Price in ETH"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-grow"
                />
              </div>
              <Button onClick={handleListForSale} className="w-full">
                List for Sale
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

