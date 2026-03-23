import { toast } from 'sonner'
import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

type Variant = 'success' | 'error' | 'warning' | 'info' | 'loading'

const ICONS: Record<Variant, React.FC<{ className?: string }>> = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2
}

const MESSAGES = {
  cartAdded: (name: string) => `${name} đã được thêm vào giỏ hàng!`,
  wishlistAdded: (name: string) => `${name} đã được thêm vào danh sách yêu thích!`,
  wishlistRemoved: (name: string) => `${name} đã được xóa khỏi danh sách yêu thích`,
  comparisonAdded: (name: string) => `${name} đã được thêm vào so sánh!`,
  shareCopied: 'Đã sao chép liên kết sản phẩm!',
  loginRequired: 'Vui lòng đăng nhập để tiếp tục',
  genericError: 'Có lỗi xảy ra, vui lòng thử lại!',
  genericSuccess: 'Thành công!',
  orderPlaced: 'Đơn hàng đã được đặt thành công!',
  paymentSuccess: 'Thanh toán thành công!',
  stockLow: 'Sản phẩm sắp hết hàng!',
  outOfStock: 'Sản phẩm đã hết hàng!',
  checkoutStarted: 'Bắt đầu thanh toán...'
} as const

type NotifyOptions = {
  duration?: number
  undo?: () => void
  id?: string
}

export function notify(
  content: React.ReactNode,
  variant: Variant = 'info',
  options: NotifyOptions = {}
): string | number {
  const Icon = ICONS[variant]
  
  const ToastContent = () => (
    <div className="flex items-center gap-3" role="alert" aria-live="polite">
      <Icon className="h-5 w-5 shrink-0" />
      <span className="font-medium">{content}</span>
    </div>
  )

  const getVariantClass = (v: Variant): string => {
    const classes: Record<Variant, string> = {
      success: 'from-emerald-500/10 to-emerald-600/10 border-emerald-400/50 text-emerald-900',
      error: 'from-red-500/10 to-red-600/10 border-red-400/50 text-red-900',
      warning: 'from-amber-500/10 to-amber-600/10 border-amber-400/50 text-amber-900',
      info: 'from-blue-500/10 to-blue-600/10 border-blue-400/50 text-blue-900',
      loading: 'from-slate-500/10 to-slate-600/10 border-slate-400/50 text-slate-900'
    }
    return classes[v]
  }

  const config: Parameters<typeof toast>[1] = {
    duration: options.duration ?? (variant === 'loading' ? 10000 : 4000),
    id: options.id,
    closeButton: true,
    className: `border bg-gradient-to-r ${getVariantClass(variant)} backdrop-blur-sm shadow-xl`,
    ...(options.undo && {
      action: {
        label: 'Hoàn tác',
        onClick: () => {
          options.undo?.()
          if (options.id) toast.dismiss(options.id)
        }
      }
    }),
    ...options
  }

  return toast(ToastContent, config)
}

// Generic helpers
export const notifySuccess = (content: React.ReactNode, options?: NotifyOptions) => 
  notify(content, 'success', options)

export const notifyError = (content: React.ReactNode, options?: NotifyOptions) => 
  notify(content, 'error', options)

export const notifyWarning = (content: React.ReactNode, options?: NotifyOptions) => 
  notify(content, 'warning', options)

export const notifyInfo = (content: React.ReactNode, options?: NotifyOptions) => 
  notify(content, 'info', options)

export const notifyLoading = (content: React.ReactNode, options?: NotifyOptions) => 
  notify(content, 'loading', options)

// E-commerce specific notifications
export const notifyCartAdded = (name: string, undo?: () => void) => 
  notifySuccess(MESSAGES.cartAdded(name), { duration: 5000, undo, id: `cart-${name}` })

export const notifyWishlistAdded = (name: string, undo?: () => void) => 
  notifySuccess(MESSAGES.wishlistAdded(name), { duration: 5000, undo, id: `wishlist-${name}` })

export const notifyWishlistRemoved = (name: string) => 
  notifyInfo(MESSAGES.wishlistRemoved(name), { duration: 3000 })

export const notifyComparisonAdded = (name: string) => 
  notifySuccess(MESSAGES.comparisonAdded(name))

export const notifyShareCopied = () => 
  notifyInfo(MESSAGES.shareCopied)

export const notifyLoginRequired = () => 
  notifyWarning(MESSAGES.loginRequired)

export const notifyOrderPlaced = (orderNumber: string) => 
  notifySuccess(`Đơn hàng #${orderNumber} ${MESSAGES.orderPlaced}`)

export const notifyPaymentSuccess = () => 
  notifySuccess(MESSAGES.paymentSuccess)

export const notifyOutOfStock = (name: string) => 
  notifyError(`${name}: ${MESSAGES.outOfStock}`)

export const notifyStockLow = (name: string) => 
  notifyWarning(`${name}: ${MESSAGES.stockLow}`)

