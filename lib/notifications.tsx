'use client'

import { toast as shadcnToast } from '@/hooks/use-toast'
import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastAction } from '@/components/ui/toast'

type Variant = 'success' | 'error' | 'warning' | 'info' | 'loading'

const ICONS: Record<Variant, React.FC<{ className?: string }>> = {
  success: (props) => <CheckCircle2 className={cn('h-5 w-5 shrink-0 text-emerald-500', props?.className)} />,
  error: (props) => <XCircle className={cn('h-5 w-5 shrink-0 text-red-500', props?.className)} />,
  warning: (props) => <AlertTriangle className={cn('h-5 w-5 shrink-0 text-amber-500', props?.className)} />,
  info: (props) => <Info className={cn('h-5 w-5 shrink-0 text-blue-500', props?.className)} />,
  loading: (props) => <Loader2 className={cn('h-5 w-5 shrink-0 animate-spin text-slate-500', props?.className)} />
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
}

export function notify(
  content: React.ReactNode,
  variant: Variant = 'info',
  options: NotifyOptions = {}
) {
  const Icon = ICONS[variant]
  
  const toastDescription = (
    <div className="flex items-center gap-3" role="alert" aria-live="polite">
      <Icon />
      <span className="font-medium">{content}</span>
    </div>
  )

  const toastVariant = variant === 'error' ? 'destructive' : 'default'

  const toastAction = options.undo ? (
    <ToastAction 
      altText="Hoàn tác"
      onClick={() => options.undo?.()}
      className="bg-transparent hover:bg-secondary text-sm font-medium"
    >
      Hoàn tác
    </ToastAction>
  ) : undefined

  shadcnToast({
    variant: toastVariant,
    description: toastDescription,
    action: toastAction,
    duration: options.duration ?? (variant === 'loading' ? 6000 : 2500)
  })
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
  notifySuccess(MESSAGES.cartAdded(name), { duration: 3500, undo })

export const notifyWishlistAdded = (name: string, undo?: () => void) => 
  notifySuccess(MESSAGES.wishlistAdded(name), { duration: 3500, undo })

export const notifyWishlistRemoved = (name: string) => 
  notifyInfo(MESSAGES.wishlistRemoved(name), { duration: 2500 })

export const notifyComparisonAdded = (name: string) => 
  notifySuccess(MESSAGES.comparisonAdded(name), { duration: 3000 })

export const notifyShareCopied = () => 
  notifyInfo(MESSAGES.shareCopied, { duration: 2500 })

export const notifyLoginRequired = () => 
  notifyWarning(MESSAGES.loginRequired, { duration: 3000 })

export const notifyOrderPlaced = (orderNumber: string) => 
  notifySuccess(`Đơn hàng #${orderNumber} ${MESSAGES.orderPlaced}`, { duration: 4000 })

export const notifyPaymentSuccess = () => 
  notifySuccess(MESSAGES.paymentSuccess, { duration: 4000 })

export const notifyOutOfStock = (name: string) => 
  notifyError(`${name}: ${MESSAGES.outOfStock}`, { duration: 4000 })

export const notifyStockLow = (name: string) => 
  notifyWarning(`${name}: ${MESSAGES.stockLow}`, { duration: 3500 })

