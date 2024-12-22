'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Shield, Coins, UserCircle } from 'lucide-react'
import { useWallet } from '@/app/context/WalletContext'

export default function Home() {
  const { isConnected, connectWallet } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to IP NFT Marketplace</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Tokenize your intellectual property as NFTs and trade them on our cutting-edge marketplace.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {isConnected ? (
          <>
            <Button asChild size="lg">
              <Link href="/create">
                Create IP Token
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/marketplace">View Marketplace</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/profile">
                <UserCircle className="mr-2 h-5 w-5" />
                Open Profile
              </Link>
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Fast & Secure</h2>
          <p className="text-muted-foreground">Lightning-fast transactions with top-notch security.</p>
        </div>
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">IP Protection</h2>
          <p className="text-muted-foreground">Your intellectual property is safe and verifiable on the blockchain.</p>
        </div>
        <div className="text-center">
          <Coins className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Global Marketplace</h2>
          <p className="text-muted-foreground">Connect with buyers and sellers from around the world.</p>
        </div>
      </div>
      <div className="bg-muted p-8 rounded-lg w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-4 text-center">Market Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-2">1,000+</h3>
            <p className="text-muted-foreground">IP Tokens Created</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-2">500+</h3>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-2">100 ETH</h3>
            <p className="text-muted-foreground">Total Volume</p>
          </div>
        </div>
      </div>
    </div>
  )
}

