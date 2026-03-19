import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { NextRequest, NextResponse } from 'next/server'
import type { Product } from '@/lib/types'

// Fallback response function when AI is unavailable
function generateFallbackResponse(userMessage: string, products: Product[] = []): string {
  const message = userMessage.toLowerCase()

  // Greeting responses
  if (message.includes('xin chào') || message.includes('hello') || message.includes('hi') || message.includes('chào')) {
    return 'Xin chào! Tôi là trợ lý mua sắm của **TechNova Store**. Tôi có thể giúp bạn tìm sản phẩm công nghệ phù hợp. Bạn đang tìm mua gì hôm nay?'
  }

  // Laptop inquiries
  if (message.includes('laptop') || message.includes('máy tính') || message.includes('computer')) {
    const laptops = products.filter(p => p.category?.name?.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('laptop'))
    if (laptops.length > 0) {
      const laptop = laptops[0]
      return `Chúng tôi có **${laptop.name}** với giá **${laptop.price?.toLocaleString('vi-VN')} VND**. Đây là một lựa chọn tuyệt vời cho công việc và giải trí. Bạn có nhu cầu cụ thể nào không?`
    }
    return 'Chúng tôi có nhiều mẫu laptop chất lượng với giá cả phải chăng. Bạn có thể cho tôi biết ngân sách và mục đích sử dụng không?'
  }

  // Phone inquiries
  if (message.includes('điện thoại') || message.includes('phone') || message.includes('smartphone') || message.includes('điện thoại thông minh')) {
    const phones = products.filter(p => p.category?.name?.toLowerCase().includes('phone') || p.name.toLowerCase().includes('phone'))
    if (phones.length > 0) {
      const phone = phones[0]
      return `Chúng tôi có **${phone.name}** với giá **${phone.price?.toLocaleString('vi-VN')} VND**. Đây là một chiếc điện thoại chất lượng cao. Bạn quan tâm đến tính năng nào?`
    }
    return 'Chúng tôi có nhiều mẫu điện thoại thông minh từ các hãng uy tín. Bạn có thể cho tôi biết ngân sách của bạn không?'
  }

  // Deal inquiries
  if (message.includes('khuyến mãi') || message.includes('deal') || message.includes('giảm giá') || message.includes('sale')) {
    const deals = products.filter(p => p.is_deal)
    if (deals.length > 0) {
      return `Hiện tại chúng tôi có **${deals.length}** sản phẩm đang khuyến mãi! Bao gồm ${deals.slice(0, 2).map(d => d.name).join(', ')}. Bạn quan tâm đến loại sản phẩm nào?`
    }
    return 'Hiện tại chúng tôi không có chương trình khuyến mãi đặc biệt, nhưng vẫn có giá cả cạnh tranh. Bạn có thể cho tôi biết sản phẩm bạn quan tâm không?'
  }

  // Price inquiries
  if (message.includes('giá') || message.includes('price') || message.includes('bao nhiêu')) {
    return 'Giá cả sản phẩm phụ thuộc vào model và cấu hình cụ thể. Bạn có thể cho tôi biết sản phẩm bạn quan tâm không? Tôi sẽ cung cấp thông tin giá chính xác.'
  }

  // Warranty inquiries
  if (message.includes('bảo hành') || message.includes('warranty') || message.includes('bảo hành')) {
    return `Tất cả sản phẩm của chúng tôi đều có bảo hành chính hãng. Thời gian bảo hành từ **12-24 tháng** tùy theo sản phẩm. Chúng tôi cũng hỗ trợ đổi trả trong **30 ngày**.`
  }

  // General response
  return 'Cảm ơn bạn đã liên hệ với **TechNova Store**! Chúng tôi chuyên cung cấp laptop, điện thoại và phụ kiện công nghệ chính hãng với giá tốt nhất. Bạn có thể cho tôi biết bạn đang tìm mua gì không? Tôi sẽ giúp bạn tìm sản phẩm phù hợp.'
}

export async function POST(request: NextRequest) {
  // Temporarily disable SSL certificate verification for this request
  const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

  try {
    let messages, products, images = []

    // Check if the request is FormData (with images) or JSON (text-only)
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      messages = JSON.parse(formData.get('messages') as string)
      products = JSON.parse(formData.get('products') as string)

      // Extract images from form data
      const imageFiles = formData.getAll('images') as File[]
      images = imageFiles
    } else {
      const { messages: msgData, products: prodData } = await request.json()
      messages = msgData
      products = prodData
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    // Check if API key is available
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
    console.log('=== API Key Debug Info ===')
    console.log('GOOGLE_GENERATIVE_AI_API_KEY exists:', !!apiKey)
    console.log('API Key length:', apiKey?.length || 0)
    console.log('API Key starts with:', apiKey?.substring(0, 10) + '...')
    console.log('All env vars with GOOGLE/AI/GENERATIVE:', Object.keys(process.env).filter(key =>
      key.includes('GOOGLE') || key.includes('AI') || key.includes('GENERATIVE')
    ))
    console.log('All env vars starting with G:', Object.keys(process.env).filter(key => key.startsWith('G')))
    console.log('Current working directory:', process.cwd())
    console.log('===========================')

    if (!apiKey || apiKey.trim() === '') {
      console.error('GOOGLE_GENERATIVE_AI_API_KEY not found or empty')
      return NextResponse.json({
        error: 'API key not configured',
        message: 'Please add GOOGLE_GENERATIVE_AI_API_KEY to your .env.local file. Make sure the file is in the project root and the key is not empty.',
        debug: {
          envFileExists: true,
          keyLength: apiKey?.length || 0,
          availableKeys: Object.keys(process.env).filter(key => key.includes('GOOGLE') || key.includes('AI'))
        }
      }, { status: 500 })
    }

    // Create a system prompt with product information - Optimized for Clean Chat UI
const systemPrompt = `You are a professional shopping assistant for TechNova Store. 
Your task is to convert product data into a CLEAN, MINIMALIST chat format.

---
STRICT FORMATTING RULES:

1. PRODUCT CARD STRUCTURE (Sử dụng cấu trúc này cho mỗi sản phẩm):
   [Icon phù hợp] **[Tên sản phẩm - Viết hoa chữ cái đầu]**
   📝 *[Mô tả ngắn gọn, súc tích trong 1 dòng]*
   💰 Giá: **[Số tiền] VND**
   ⭐ Đánh giá: [Số sao]/5 ([Số lượt] đánh giá)
   ⚙️ Thông số: [Liệt kê 2-3 thông số quan trọng nhất, cách nhau bằng dấu phẩy]
   [Nếu có Deal]: 🔥 **ƯU ĐÃI ĐẶC BIỆT**
   ---

2. CHUẨN HÓA DỮ LIỆU (Data Cleaning):
   - GIÁ TIỀN: Luôn format dạng 10.000.000 VND (Có dấu chấm phân cách hàng nghìn).
   - NGÔN NGỮ: 100% Tiếng Việt. Chuyển các từ như "Specs" -> "Thông số", "Rating" -> "Đánh giá", "Deal" -> "Khuyến mãi".
   - KÝ TỰ: Tuyệt đối KHÔNG dùng các ký tự khung như │, ┌, └, ──. Chỉ dùng gạch ngang "---" để phân cách sản phẩm.

3. KHI SO SÁNH HOẶC LIỆT KÊ NHIỀU MÓN:
   - Nếu khách hỏi nhiều sản phẩm, hãy liệt kê tối đa 3 sản phẩm phù hợp nhất để tránh làm trôi tin nhắn.
   - Gắn icon 🏆 trước tên sản phẩm nếu đó là lựa chọn tốt nhất (Best Value).

4. KẾT THÚC:
   Luôn kết thúc bằng một câu hỏi gợi mở thân thiện.

---
DỮ LIỆU SẢN PHẨM:
${products?.map((p: Product) => `
- Tên: ${p.name}
- Mô tả: ${p.description}
- Giá: ${p.price}
- Đánh giá: ${p.rating} (${p.review_count})
- Thông số: ${p.specs ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join(', ') : 'Liên hệ'}
`).join('\n')}`;

    // Use only gemini-2.5-flash model
    const modelName = 'gemini-2.5-flash'

    let result

    try {
      console.log(`Using model: ${modelName}`)
      result = await generateText({
        model: google(modelName),
        system: systemPrompt,
        messages: messages,
      })
      console.log(`Success with model: ${modelName}`)
    } catch (error) {
      console.log(`Model ${modelName} failed:`, error instanceof Error ? error.message : 'Unknown error')
      // Fallback response when AI is unavailable
      console.log('AI model failed, using fallback response')
      const userMessage = messages[messages.length - 1]?.content || ''
      const fallbackResponse = generateFallbackResponse(userMessage, products)
      return NextResponse.json({ response: fallbackResponse })
    }

    return NextResponse.json({ response: result.text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    // Restore original SSL setting
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized
  }
}
