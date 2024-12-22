import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db("real-estate-nft")
    const { asset, walletAddress } = await req.json()

    const result = await db.collection("assets").insertOne({
      ...asset,
      owner: walletAddress,
      createdAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const client = await clientPromise
    const db = client.db("real-estate-nft")
    const { searchParams } = new URL(req.url)
    const owner = searchParams.get('owner')

    const assets = await db.collection("assets")
      .find(owner ? { owner } : {})
      .toArray()

    return NextResponse.json({ success: true, assets })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
} 