import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { Product } from '@/lib/types'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(5, Number.parseInt(searchParams.get('limit') || '20')))
  
  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('category_id') || ''
  const brand = searchParams.get('brand') || ''
  const priceMin = Number.parseInt(searchParams.get('price_min') || '0')
  const priceMax = Number.parseInt(searchParams.get('price_max') || '100000000')
  const sort = searchParams.get('sort') || 'newest'
  
  let query = supabase
    .from('products')
    .select('*, categories(name, slug)', { count: 'exact', head: false })
    .gt('stock', 0)
  
  // Search
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,brand.ilike.%${search}%`)
  }
  
  // Category
  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }
  
  // Brand
  if (brand) {
    const brands = brand.split(',').map(b => b.trim()).filter(Boolean)
    query = query.in('brand', brands)
  }
  
  // Price range - use price/original_price
  query = query.gte('price', priceMin)
  query = query.lte('price', priceMax)
  
  // Sorting
  switch (sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'popular':
      query = query.order('review_count', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }
  
  const { data, error, count } = await query.range((page - 1) * limit, page * limit - 1)
  
  if (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
  
  return NextResponse.json({
    data: data as Product[],
    pagination: { page, limit, total: count || 0 }
  })
}
