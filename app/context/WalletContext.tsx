'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'
import { ethers } from 'ethers'
import contractABI from './RealEstateMarket.json' // You'll need to create this after compiling the contract

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL

interface UserProfile {
  name: string
  email: string
  bio: string
}

export interface RealEstateAsset {
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
  provider: ethers.providers.Web3Provider | null
  contract: ethers.Contract | null
  uploadToIPFS: (file: File) => Promise<string>
  createAsset: (asset: Omit<RealEstateAsset, 'id' | 'creator' | 'owner' | 'createdAt'>) => Promise<void>
  buyAsset: (id: number, price: number) => Promise<void>
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
    { id: 6, title: "Vineyard Estate", description: "Sprawling vineyard with main house and guest cottages", image: "/placeholder.svg?height=400&width=400", creator: "0x1234...5678", owner: "0x1234...5678", createdAt: "2023-06-10T13:30:00Z", listed: false, value: 1200, type: 'land', location: "Napa Valley, CA", size: "50 acres" }
  ])
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)

  // Load user's assets from MongoDB when wallet is connected
  useEffect(() => {
    if (walletAddress) {
      fetchUserAssets()
    }
  }, [walletAddress])

  const fetchUserAssets = async () => {
    try {
      const response = await fetch(`/api/assets?owner=${walletAddress}`)
      const data = await response.json()
      if (data.success) {
        setUserAssets(data.assets)
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
    }
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Request network switch to Amoy testnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${Number(NETWORK_ID).toString(16)}` }],
          })
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${Number(NETWORK_ID).toString(16)}`,
                  chainName: 'Polygon Amoy Testnet',
                  nativeCurrency: {
                    name: 'MATIC',
                    symbol: 'MATIC',
                    decimals: 18,
                  },
                  rpcUrls: [RPC_URL],
                  blockExplorerUrls: ['https://www.oklink.com/amoy'],
                },
              ],
            })
          }
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress!, contractABI, signer)
        
        setProvider(provider)
        setContract(contract)
        setIsConnected(true)
        const address = await signer.getAddress()
        setWalletAddress(address)

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId: string) => {
          if (chainId !== `0x${Number(NETWORK_ID).toString(16)}`) {
            disconnectWallet()
          }
        })

      } catch (error) {
        console.error('Error connecting wallet:', error)
      }
    }
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

  const uploadToIPFS = async (file: File) => {
    try {
      return `asset_${Date.now()}`
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  const createAsset = async (asset: Omit<RealEstateAsset, 'id' | 'creator' | 'owner' | 'createdAt'>) => {
    if (!contract || !walletAddress) return

    try {
      const assetHash = `asset_${Date.now()}`

      const tx = await contract.createAsset(
        asset.title,
        asset.description,
        asset.location,
        assetHash
      )
      await tx.wait()

      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: {
            ...asset,
            ipfsHash: assetHash,
          },
          walletAddress
        })
      })

      const data = await response.json()
      if (data.success) {
        fetchUserAssets()
      }

      return data
    } catch (error) {
      console.error('Error creating asset:', error)
      throw error
    }
  }

  const buyAsset = async (id: number, price: number) => {
    if (!contract) return
    try {
      const tx = await contract.buyAsset(id, {
        value: ethers.utils.parseEther(price.toString())
      })
      await tx.wait()
      // Update local state
    } catch (error) {
      console.error('Error buying asset:', error)
      throw error
    }
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
      getAssetById,
      provider,
      contract,
      uploadToIPFS,
      createAsset,
      buyAsset
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

