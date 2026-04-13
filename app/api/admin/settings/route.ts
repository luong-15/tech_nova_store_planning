import { NextResponse } from 'next/server'
import { defaultSettings } from '@/lib/settings'

// Mock settings storage (use database in production)
let SETTINGS = { ...defaultSettings }

export async function GET() {
  return NextResponse.json(SETTINGS)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    SETTINGS = { ...SETTINGS, ...body }
    return NextResponse.json({ success: true, settings: SETTINGS })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

