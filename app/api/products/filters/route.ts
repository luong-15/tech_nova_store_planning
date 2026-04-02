import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  
  // Base query for available products
  let query = supabase
    .from('products')
    .select('brand, specifications, category_id, coalesce(discount_price, price)')
    .eq('stock', true)
  
  if (search) {
    query = query.or('name.ilike.%' + search.toLowerCase().trim() + '%')
  }
  
  const { data: rawProducts } = await query
  const products: any[] = rawProducts || []
  
  if (!products || products.length === 0) {
    return NextResponse.json({
      brands: [],
      categories: [],
      ram: [],
      storage: [],
      cpu: [],
      screenSize: []
    })
  }
  
  // Aggregate distinct values with counts
  const brandsMap = new Map()
  const ramMap = new Map()
  const storageMap = new Map()
  const cpuMap = new Map()
  const screenMap = new Map()
  
  // Fetch categories for mapping
  const { data: categoriesRaw } = await supabase.from('categories').select('*')
  type Category = { id: string; name: string }
  const categories: Category[] = categoriesRaw || []
  const catMap = new Map(categories?.map(c => [c.id, c.name]) || [])
  
  products.forEach(p => {
    // Brand
    if (p.brand) {
      brandsMap.set(p.brand, (brandsMap.get(p.brand) || 0) + 1)
    }
    
    // Specs
    const specs = p.specifications as Record<string, string>
    if (specs) {
      if (specs.ram) ramMap.set(specs.ram, (ramMap.get(specs.ram)||0) + 1)
      if (specs.storage) storageMap.set(specs.storage, (storageMap.get(specs.storage)||0) + 1)
      if (specs.cpu) cpuMap.set(specs.cpu, (cpuMap.get(specs.cpu)||0) + 1)
      if (specs.screen) screenMap.set(specs.screen, (screenMap.get(specs.screen)||0) + 1)
    }
  })
  
  const formatOptions = (map: Map<string, number>): Array<{value: string, label: string, count: number}> => 
    Array.from(map.entries())
      .map(([value, count]) => ({ value, label: value.toUpperCase(), count }))
      .sort((a, b) => b.count - a.count)
  
  return NextResponse.json({
    brands: formatOptions(brandsMap),
    ram: formatOptions(ramMap),
    storage: formatOptions(storageMap),
    cpu: formatOptions(cpuMap),
    screenSize: formatOptions(screenMap),
    categories: categories?.map(c => ({ value: c.id, label: c.name, count: 0 })) || [] // Count per cat separate if needed
  })
}
