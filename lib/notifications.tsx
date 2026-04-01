'use client'

import { toast as shadcnToast } from '@/hooks/use-toast'
import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastAction } from '@/components/ui/toast'

type Variant = 'success' | 'error' | 'warning' | 'info' | 'loading'

const ICONS: Record<Variant, React.FC<{ className?: string }>> = {
  success: (props) => <CheckCircle2 className={cn('h-6 w-6 shrink-0 text-emerald-400 drop-shadow-md', props?.className)} />,
  error: (props) => <XCircle className={cn('h-6 w-6 shrink-0 text-red-400 drop-shadow-md', props?.className)} />,
  warning: (props) => <AlertTriangle className={cn('h-6 w-6 shrink-0 text-amber-400 drop-shadow-md', props?.className)} />,
  info: (props) => <Info className={cn('h-6 w-6 shrink-0 text-blue-400 drop-shadow-md', props?.className)} />,
  loading: (props) => <Loader2 className={cn('h-6 w-6 shrink-0 animate-spin text-slate-400 drop-shadow-sm', props?.className)} />
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
    <div className="flex items-start gap-3 p-3 sm:p-4" role="alert" aria-live="polite">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br">
        {variant === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-400 drop-shadow-lg animate-pulse" />}
        {variant === 'error' && <XCircle className="h-5 w-5 text-red-400 drop-shadow-lg" />}
        {variant === 'warning' && <AlertTriangle className="h-5 w-5 text-amber-400 drop-shadow-lg" />}
        {variant === 'info' && <Info className="h-5 w-5 text-blue-400 drop-shadow-lg" />}
        {variant === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-slate-400 drop-shadow-sm" />}
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="font-semibold text-sm leading-5 text-foreground line-clamp-2 group-hover:text-primary/95">
          {content}
        </p>
        <p className="text-xs text-muted-foreground/80 font-medium">TechNova Store</p>
      </div>
    </div>
  )

  const toastVariant = variant === 'error' ? 'destructive' : 'default'

  const toastAction = options.undo ? (
    <ToastAction 
      altText="Hoàn tác"
      onClick={() => options.undo?.()}
      className="gap-2 bg-linear-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 backdrop-blur-sm border border-emerald-200/50 hover:from-emerald-500/20 hover:to-indigo-500/20 hover:border-emerald-300/70 text-sm font-semibold h-9 px-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 hover:scale-[1.02] hover:ring-2 ring-emerald-200/50 active:scale-[0.98]"
    >
      <XCircle className="h-4 w-4 shrink-0" />
      Hoàn tác
    </ToastAction>
  ) : undefined

  shadcnToast({
    variant: toastVariant,
    description: toastDescription,
    action: toastAction,
    duration: options.duration ?? (variant === 'loading' ? 6000 : 3500),
    className: 'toaster group border border-border/30 bg-card backdrop-blur-xl shadow-xl ring-1 ring-border/20 max-w-sm sm:max-w-md mx-4 animate-in slide-in-from-top-2 fade-in duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-2xl hover:border-primary/50 hover:scale-[1.01] hover:ring-primary/30'
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
  notifySuccess(MESSAGES.cartAdded(name), { duration: 2500, undo })

export const notifyWishlistAdded = (name: string, undo?: () => void) => 
  notifySuccess(MESSAGES.wishlistAdded(name), { duration: 2500, undo })

export const notifyWishlistRemoved = (name: string) => 
  notifyInfo(MESSAGES.wishlistRemoved(name), { duration: 2500 })

export const notifyComparisonAdded = (name: string) => 
  notifySuccess(MESSAGES.comparisonAdded(name), { duration: 2500 })

export const notifyShareCopied = () => 
  notifyInfo(MESSAGES.shareCopied, { duration: 2000 })

export const notifyLoginRequired = () => 
  notifyWarning(MESSAGES.loginRequired, { duration: 2500 })

export const notifyOrderPlaced = (orderNumber: string) => 
  notifySuccess(`Đơn hàng #${orderNumber} ${MESSAGES.orderPlaced}`, { duration: 3000 })

export const notifyPaymentSuccess = () => 
  notifySuccess(MESSAGES.paymentSuccess, { duration: 3000 })

export const notifyOutOfStock = (name: string) => 
  notifyError(`${name}: ${MESSAGES.outOfStock}`, { duration: 3000 })

export const notifyStockLow = (name: string) => 
  notifyWarning(`${name}: ${MESSAGES.stockLow}`, { duration: 3500 })

