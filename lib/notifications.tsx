'use client'

import { toast as shadcnToast } from '@/hooks/use-toast'
import React from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ToastAction } from '@/components/ui/toast'

type Variant = 'success' | 'error' | 'warning' | 'info' | 'loading'

const ICONS: Record<Variant, React.FC<{ className?: string }>> = {
  success: (props) => <CheckCircle2 className={cn('h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400', props?.className)} />,
  error: (props) => <XCircle className={cn('h-5 w-5 shrink-0 text-red-600 dark:text-red-400', props?.className)} />,
  warning: (props) => <AlertTriangle className={cn('h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400', props?.className)} />,
  info: (props) => <Info className={cn('h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400', props?.className)} />,
  loading: (props) => <Loader2 className={cn('h-5 w-5 shrink-0 animate-spin text-slate-600 dark:text-slate-400', props?.className)} />
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
  const toastDescription = (
    <div className="flex items-center gap-3.5 w-full pr-2" role="alert" aria-live="polite">
      {/* Icon Background */}
      {variant === 'success' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
      )}
      {variant === 'error' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-500/15">
          <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
      )}
      {variant === 'warning' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500/15">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
      )}
      {variant === 'info' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/15">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      )}
      {variant === 'loading' && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-500/15">
          <Loader2 className="h-4 w-4 animate-spin text-slate-600 dark:text-slate-400" />
        </div>
      )}

      {/* Text Content */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium leading-tight text-foreground line-clamp-2">
          {content}
        </p>
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          TechNova Store
        </p>
      </div>
    </div>
  )

  const toastVariant = variant === 'error' ? 'destructive' : 'default'

  // Nút Hoàn Tác đã được tối ưu: Thêm shrink-0 để không bị bóp méo, đổi icon RotateCcw
  const toastAction = options.undo ? (
    <ToastAction 
      altText="Hoàn tác"
      onClick={(e) => {
        e.stopPropagation() // Ngăn chặn nổi bọt sự kiện
        if (options.undo) options.undo()
      }}
      className="ml-auto flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border/50 bg-background/80 px-3 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-secondary hover:text-secondary-foreground focus:ring-1 focus:ring-ring"
    >
      <RotateCcw className="h-3 w-3 shrink-0" />
      Hoàn tác
    </ToastAction>
  ) : undefined

  shadcnToast({
    variant: toastVariant,
    description: toastDescription,
    action: toastAction,
    duration: options.duration ?? (variant === 'loading' ? 6000 : 3500),
    className: cn(
      "group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl border bg-background/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:shadow-3xl !z-[99999] sm:max-w-[450px]",
      variant === 'error' ? 'border-red-500/30' : 'border-border/40'
    )
  })
}

// Generic helpers
export const notifySuccess = (content: React.ReactNode, options?: NotifyOptions) => notify(content, 'success', options)
export const notifyError = (content: React.ReactNode, options?: NotifyOptions) => notify(content, 'error', options)
export const notifyWarning = (content: React.ReactNode, options?: NotifyOptions) => notify(content, 'warning', options)
export const notifyInfo = (content: React.ReactNode, options?: NotifyOptions) => notify(content, 'info', options)
export const notifyLoading = (content: React.ReactNode, options?: NotifyOptions) => notify(content, 'loading', options)

// E-commerce specific notifications
export const notifyCartAdded = (name: string, undo?: () => void) => notifySuccess(MESSAGES.cartAdded(name), { duration: 2500, undo })
export const notifyWishlistAdded = (name: string, undo?: () => void) => notifySuccess(MESSAGES.wishlistAdded(name), { duration: 2500, undo })
export const notifyWishlistRemoved = (name: string) => notifyInfo(MESSAGES.wishlistRemoved(name), { duration: 2500 })
export const notifyComparisonAdded = (name: string) => notifySuccess(MESSAGES.comparisonAdded(name), { duration: 2500 })
export const notifyShareCopied = () => notifyInfo(MESSAGES.shareCopied, { duration: 2000 })
export const notifyLoginRequired = () => notifyWarning(MESSAGES.loginRequired, { duration: 2500 })
export const notifyOrderPlaced = (orderNumber: string) => notifySuccess(`Đơn hàng #${orderNumber} ${MESSAGES.orderPlaced}`, { duration: 3000 })
export const notifyPaymentSuccess = () => notifySuccess(MESSAGES.paymentSuccess, { duration: 3000 })
export const notifyOutOfStock = (name: string) => notifyError(`${name}: ${MESSAGES.outOfStock}`, { duration: 3000 })
export const notifyStockLow = (name: string) => notifyWarning(`${name}: ${MESSAGES.stockLow}`, { duration: 3500 })