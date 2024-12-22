'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from '@/app/context/WalletContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Tag, Briefcase, ShoppingBag, BarChart2, Zap, ExternalLink, PlusCircle, MapPin, Ruler } from 'lucide-react'
import type { RealEstateAsset } from '@/app/context/WalletContext'

interface AssetCardProps {
  asset: RealEstateAsset;
  showListingOptions?: boolean;
}

export default function UserDashboard() {
  const { userProfile, userAssets, listAssetForSale, unlistAsset, isConnected } = useWallet()
  const [prices, setPrices] = useState<{ [key: number]: string }>({})
  const router = useRouter()
  const { toast } = useToast()

  if (!isConnected) {
    router.push('/')
    return null
  }

  const createdAssets = userAssets.filter(asset => asset.creator === userProfile?.name)
  const ownedAssets = userAssets.filter(asset => asset.owner === userProfile?.name)
  const listedAssets = userAssets.filter(asset => asset.listed)

  const totalValue = ownedAssets.reduce((sum, asset) => sum + asset.value, 0)

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
      description: "Your real estate asset has been listed for sale in the marketplace.",
    })
  }

  const handleUnlist = (id: number) => {
    unlistAsset(id)
    toast({
      title: "Asset Unlisted",
      description: "Your real estate asset has been removed from the marketplace.",
    })
  }

  const AssetCard = ({ asset, showListingOptions = false }: AssetCardProps) => (
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
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4" />
          <span>{asset.location}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Ruler className="h-4 w-4" />
          <span>{asset.size}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          <span>Value: {asset.value} ETH</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        {asset.listed ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>Listed for {asset.price} ETH</span>
            </div>
            {showListingOptions && (
              <Button variant="outline" onClick={() => handleUnlist(asset.id)}>
                Unlist
              </Button>
            )}
          </div>
        ) : (
          showListingOptions && (
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
          )
        )}
        <Link href={`/assets/${asset.id}`} className="w-full">
          <Button variant="secondary" className="w-full">
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAssets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created Assets</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{createdAssets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Owned Assets</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownedAssets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Assets</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{listedAssets.length}</div>
          </CardContent></Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Real Estate Assets</h2>
        <Link href="/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Asset
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="created" className="space-y-4">
        <TabsList>
          <TabsTrigger value="created">Created Assets</TabsTrigger>
          <TabsTrigger value="owned">Owned Assets</TabsTrigger>
          <TabsTrigger value="listed">Listed Assets</TabsTrigger>
        </TabsList>
        <TabsContent value="created" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} showListingOptions={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="owned" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} showListingOptions={true} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="listed" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listedAssets.map(asset => (
              <AssetCard key={asset.id} asset={asset} showListingOptions={true} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

