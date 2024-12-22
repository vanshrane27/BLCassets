'use client'

import React, { createContext, useState, useContext } from 'react'

interface UserProfile {
  name: string
  email: string
  bio: string
}

interface RealEstateAsset {
  id: number
  title: string
  description: string
  image: string
  creator: string
  owner: string
  createdAt: string
  listed: boolean
  price?: number
  value: number
  type: 'land' | 'building' | 'house'
  location: string
  size: string
}

interface WalletContextType {
  isConnected: boolean
  walletAddress: string | null
  userProfile: UserProfile | null
  userAssets: RealEstateAsset[]
  connectWallet: () => void
  disconnectWallet: () => void
  updateUserProfile: (profile: UserProfile) => void
  listAssetForSale: (id: number, price: number) => void
  unlistAsset: (id: number) => void
  getAssetById: (id: number) => RealEstateAsset | undefined
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userAssets, setUserAssets] = useState<RealEstateAsset[]>([
    { id: 1, title: "Downtown Apartment Building", description: "Modern apartment complex in the heart of the city", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-15T10:30:00Z", listed: false, value: 500, type: 'building', location: "New York, NY", size: "10,000 sqft" },
    { id: 2, title: "Beachfront Villa", description: "Luxurious villa with private beach access", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-14T14:45:00Z", listed: false, value: 750, type: 'house', location: "Miami, FL", size: "5,000 sqft" },
    { id: 3, title: "Commercial Land Plot", description: "Prime location for commercial development", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-13T09:15:00Z", listed: true, price: 300, value: 300, type: 'land', location: "Austin, TX", size: "2 acres" },
    { id: 4, title: "Mountain Cabin", description: "Cozy cabin with breathtaking mountain views", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-12T16:20:00Z", listed: false, value: 200, type: 'house', location: "Aspen, CO", size: "2,000 sqft" },
    { id: 5, title: "Urban Office Space", description: "Modern office space in a bustling business district", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-11T11:00:00Z", listed: true, price: 450, value: 450, type: 'building', location: "Chicago, IL", size: "15,000 sqft" },
    { id: 6, title: "Vineyard Estate", description: "Sprawling vineyard with main house and guest cottages", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-10T13:30:00Z", listed: false, value: 1200, type: 'land', location: "Napa Valley, CA", size: "50 acres" },
  ])

  const connectWallet = () => {
    setIsConnected(true)
    setWalletAddress('0x1234...5678')
    setUserProfile({ name: 'John Doe', email: 'john@example.com', bio: 'Real estate investor and developer' })
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress(null)
    setUserProfile(null)
  }

  const updateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile)
  }

  const listAssetForSale = (id: number, price: number) => {
    setUserAssets(userAssets.map(asset => 
      asset.id === id ? { ...asset, listed: true, price } : asset
    ))
  }

  const unlistAsset = (id: number) => {
    setUserAssets(userAssets.map(asset => 
      asset.id === id ? { ...asset, listed: false, price: undefined } : asset
    ))
  }

  const getAssetById = (id: number) => {
    return userAssets.find(asset => asset.id === id)
  }

  return (
    <WalletContext.Provider value={{ 
      isConnected, 
      walletAddress, 
      userProfile, 
      userAssets,
      connectWallet, 
      disconnectWallet, 
      updateUserProfile,
      listAssetForSale,
      unlistAsset,
      getAssetById
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

