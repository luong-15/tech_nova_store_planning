import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createServerClient()
  
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  
  // Query all products for filter options (no stock filter)
  let query = supabase
      .from('products')
      .select('brand, specs, category_id')
  
  if (search) {
    query = query.or('name.ilike.%' + search.toLowerCase().trim() + '%')
  }
  
  const { data: rawProducts, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  const products: any[] = rawProducts || []
  
  if (products.length === 0) {
    return NextResponse.json({
      brands: [],
      categories: [],
      ram: [],
      storage: [],
      cpu: [],
      screenSize: []
    })
  }
  
  // Aggregate distinct values with counts from available products
  const brandsMap = new Map<string, number>()
  const categoryMap = new Map<string, number>()
  const ramMap = new Map<string, number>()
  const storageMap = new Map<string, number>()
  const cpuMap = new Map<string, number>()
  const screenMap = new Map<string, number>()
  
  // Fetch all categories for mapping
  const { data: categoriesRaw } = await supabase.from('categories').select('id, name')
  const categories: {id: string, name: string}[] = categoriesRaw || []
  const catNameMap = new Map(categories.map(c => [c.id, c.name]))
  
  products.forEach(p => {
    // Brand
    if (p.brand) {
      brandsMap.set(p.brand, (brandsMap.get(p.brand) || 0) + 1)
    }
    
    // Category
    if (p.category_id) {
      categoryMap.set(p.category_id, (categoryMap.get(p.category_id) || 0) + 1)
    }
    
    // Specs (jsonb)
    const specs = p.specs as Record<string, any>
    if (specs) {
      if (specs.ram) ramMap.set(specs.ram, (ramMap.get(specs.ram)||0) + 1)
      if (specs.storage) storageMap.set(specs.storage, (storageMap.get(specs.storage)||0) + 1)
      if (specs.cpu) cpuMap.set(specs.cpu, (cpuMap.get(specs.cpu)||0) + 1)
      if (specs.screenSize) screenMap.set(specs.screenSize, (screenMap.get(specs.screenSize)||0) + 1)  // assuming screenSize key
    }
  })
  
  const formatOptions = (map: Map<string, number>, labelFn: (v: string) => string = (v) => v.toUpperCase()): Array<{value: string, label: string, count: number}> => {
    return Array.from(map.entries())
      .map(([value, count]) => ({ value, label: labelFn(value), count }))
      .sort((a, b) => b.count - a.count)
  }

  // Format brands
  const brands = formatOptions(brandsMap)
  
  // Format categories with names
  const categoriesWithCounts = Array.from(categoryMap.entries())
    .map(([catId, count]) => {
      const name = catNameMap.get(catId)
      return name ? { value: catId, label: name, count } : null
    })
    .filter((item): item is { value: string, label: string, count: number } => item !== null)
    .sort((a, b) => b.count - a.count)
  
  return NextResponse.json({
    brands,
    categories: categoriesWithCounts,
    ram: formatOptions(ramMap),
    storage: formatOptions(storageMap),
    cpu: formatOptions(cpuMap),
    screenSize: formatOptions(screenMap)
  })
}
