'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useWallet } from '@/app/context/WalletContext'
import { User, LogOut, Grid } from 'lucide-react'

export default function Header() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet()

  return (
    <header className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center">
        <Link href="/" className="text-2xl font-bold">IP NFT Marketplace</Link>
        <nav className="space-x-4 my-2 sm:my-0">
          <Link href="/marketplace" className="hover:text-primary">Marketplace</Link>
          <Link href="/create" className="hover:text-primary">Create Token</Link>
        </nav>
        {isConnected ? (
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm text-muted-foreground">{walletAddress}</span>
            <Link href="/profile">
              <Button variant="ghost" size="icon">
                <Grid className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" onClick={disconnectWallet}>
              <LogOut className="h-5 w-5 mr-2" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        )}
      </div>
    </header>
  )
}

