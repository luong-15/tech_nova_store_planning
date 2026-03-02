'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, Send, X, Bot, User, Camera, Sparkles } from 'lucide-react'
import type { Product } from '@/lib/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  images?: string[]
}

interface ChatAssistantProps {
  products: Product[]
}

// Hàm xử lý inline markdown
const parseInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return null

  const patterns = [
    { regex: /\*\*\*(.+?)\*\*\*/g, style: 'font-bold italic' },
    { regex: /\*\*(.+?)\*\*/g, style: 'font-bold' },
    { regex: /\*(.+?)\*/g, style: 'italic' },
    { regex: /__(.+?)__/g, style: 'underline' },
    { regex: /`([^`]+)`/g, isCode: true },
  ]

  let result: React.ReactNode[] = [text]
  
  patterns.forEach(({ regex, style, isCode }) => {
    const newResult: React.ReactNode[] = []
    result.forEach(part => {
      if (typeof part !== 'string') {
        newResult.push(part)
        return
      }
      
      let lastIndex = 0
      const matches = [...part.matchAll(regex)]
      
      if (matches.length === 0) {
        newResult.push(part)
        return
      }

      matches.forEach((match) => {
        if (match.index !== undefined) {
          if (match.index > lastIndex) {
            newResult.push(part.substring(lastIndex, match.index))
          }
          newResult.push(
            isCode 
              ? <code key={Math.random()} className="bg-slate-200 dark:bg-slate-700 px-1 rounded text-xs font-mono">{match[1]}</code>
              : <span key={Math.random()} className={style}>{match[1]}</span>
          )
          lastIndex = match.index + match[0].length
        }
      })
      
      if (lastIndex < part.length) {
        newResult.push(part.substring(lastIndex))
      }
    })
    result = newResult
  })

  return result
}

// Hàm xử lý markdown
const parseMarkdown = (text: string): React.ReactNode => {
  if (!text) return null

  const lines = text.split('\n')
  
  return lines.map((line, lineIndex) => {
    // Table row
    if (line.includes('|') && line.includes('---')) {
      return null
    }
    if (line.includes('|')) {
      const cells = line.split('|').filter(cell => cell.trim() !== '')
      if (cells.length > 1) {
        return (
          <div key={lineIndex} className="flex flex-wrap gap-1 py-0.5 text-xs">
            {cells.map((cell, cellIndex) => (
              <span key={cellIndex} className="px-1">{parseInlineMarkdown(cell.trim())}</span>
            ))}
          </div>
        )
      }
    }

    // Box format
    if (line.includes('┌') || line.includes('│') || line.includes('└') || line.includes('─')) {
      return <div key={lineIndex} className="font-mono text-xs my-1">{line}</div>
    }

    // Separator
    if (line.trim() === '---') {
      return <div key={lineIndex} className="border-t my-2"></div>
    }

    // List items
    if (line.trim().startsWith('•') || line.trim().startsWith('- ')) {
      const content = line.replace(/^[•\-]\s*/, '')
      return (
        <div key={lineIndex} className="flex gap-2 py-0.5 pl-2">
          <span>•</span>
          <span>{parseInlineMarkdown(content)}</span>
        </div>
      )
    }

    // Numbered list
    if (line.trim().match(/^\d+\./)) {
      const content = line.replace(/^\d+\.\s*/, '')
      const num = line.trim().charAt(0)
      return (
        <div key={lineIndex} className="flex gap-2 py-0.5 pl-2">
          <span>{num}.</span>
          <span>{parseInlineMarkdown(content)}</span>
        </div>
      )
    }

    // Regular line
    return lineIndex > 0 ? <div key={lineIndex} className="my-1">{parseInlineMarkdown(line)}</div> : parseInlineMarkdown(line)
  })
}

export function ChatAssistant({ products }: ChatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Xin chào! Tôi là trợ lý thông minh của TechNova. Tôi có thể giúp gì cho bạn hôm nay?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  
  // Ref để cuộn xuống cuối tin nhắn
  const scrollEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Hàm tự động cuộn mượt mà
  const scrollToBottom = () => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (isOpen) {
      scrollToBottom()
    }
  }, [messages, isLoading, isOpen])

  const handleSendMessage = async () => {
    if ((!input.trim() && selectedImages.length === 0) || isLoading) return

    const userImages = selectedImages.map(file => URL.createObjectURL(file))
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      images: userImages.length > 0 ? userImages : undefined,
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSelectedImages([])
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('messages', JSON.stringify([
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        { role: 'user', content: userMessage.content },
      ]))
      formData.append('products', JSON.stringify(products))

      selectedImages.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Xin lỗi, tôi gặp chút sự cố kết nối. Thử lại sau nhé!',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedImages(prev => [...prev, ...files].slice(0, 5))
    e.target.value = ''
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-blue-600 hover:bg-blue-700 transition-all z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 z-50 w-full sm:bottom-6 sm:right-6 sm:w-100 h-dvh sm:h-150 p-0 sm:p-0"
          >
            <Card className="w-full h-full shadow-2xl flex flex-col border-none overflow-hidden bg-background/95 backdrop-blur-md sm:rounded-2xl">
              {/* Header - Fixed Height */}
              <CardHeader className="bg-linear-to-r from-blue-600 to-indigo-600 text-white p-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">TechNova AI</CardTitle>
                      <p className="text-[10px] text-blue-100 flex items-center gap-1">
                        <Sparkles className="h-2 w-2" /> Đang trực tuyến
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white hover:bg-white/10">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              {/* Chat Content - Flexible and Scrollable */}
              <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
                <ScrollArea className="flex-1 w-full h-full">
                  <div className="p-4 space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${message.role === 'assistant' ? 'bg-blue-600' : 'bg-slate-200'}`}>
                            {message.role === 'assistant' ? <Bot className="h-4 w-4 text-white" /> : <User className="h-4 w-4 text-slate-600" />}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className={`px-4 py-2 shadow-sm text-sm ${message.role === 'user' ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none' : 'bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border'}`}>
                              {message.images && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {message.images.map((img, i) => <img key={i} src={img} alt="upload" className="max-w-30 rounded-lg border" />)}
                                </div>
                              )}
                              <div className="whitespace-pre-wrap">
                                {parseMarkdown(message.content)}
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground px-1">{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center"><Bot className="h-4 w-4 text-white" /></div>
                        <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      </div>
                    )}
                    {/* Element dùng để scroll tới */}
                    <div ref={scrollEndRef} className="h-2" />
                  </div>
                </ScrollArea>

                {/* Image Previews */}
                <AnimatePresence>
                  {selectedImages.length > 0 && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="px-4 py-2 border-t bg-background flex gap-2 overflow-x-auto">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative shrink-0">
                          <img src={URL.createObjectURL(file)} className="w-12 h-12 object-cover rounded-md border" />
                          <button onClick={() => setSelectedImages(p => p.filter((_, i) => i !== index))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Area - Fixed at Bottom */}
                <div className="p-3 bg-background border-t shrink-0">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1.5">
                    <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 shrink-0">
                      <Camera className="h-4 w-4 text-slate-500" />
                    </Button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" multiple onChange={handleImageSelect} />
                    
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1 resize-none max-h-24 outline-none"
                      rows={1}
                    />

                    <Button
                      onClick={handleSendMessage}
                      disabled={(!input.trim() && selectedImages.length === 0) || isLoading}
                      className="h-8 w-8 bg-blue-600 shrink-0 rounded-lg"
                      size="icon"
                    >
                      <Send className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
