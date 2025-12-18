import { NextRequest, NextResponse } from 'next/server'
import { generateSyntheticData } from '@/lib/synthetic-engine'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, pack_name, count } = body

    if (!user_id || !pack_name || !count) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, pack_name, count' },
        { status: 400 }
      )
    }

    if (count < 1 || count > 1000) {
      return NextResponse.json(
        { error: 'Count must be between 1 and 1000' },
        { status: 400 }
      )
    }

    const result = await generateSyntheticData({
      user_id,
      pack_name,
      count,
      timeout: 300,
      output_path: `/tmp/synthetic-${user_id}-${Date.now()}`
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
