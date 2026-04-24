import { clsx, type ClassValue } from 'clsx'
import { type ServiceStatus, type Tone } from '../types/trading'

export function cn(...values: ClassValue[]) {
  return clsx(values)
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(value)
}

export function formatCompactCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(value)
}

export function formatPercent(value: number, digits = 2) {
  return `${value >= 0 ? '+' : ''}${value.toFixed(digits)}%`
}

export function formatSignedBasisPoints(value: number) {
  return `${value > 0 ? '+' : ''}${value} bps`
}

export function formatTime(timestamp: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(new Date(timestamp))
}

export function formatShortTime(timestamp: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  }).format(new Date(timestamp))
}

export function toneFromNumber(value: number): Tone {
  if (value > 0) return 'positive'
  if (value < 0) return 'negative'
  return 'neutral'
}

export function toneFromService(status: ServiceStatus): Tone {
  if (status === 'healthy') return 'positive'
  if (status === 'degraded') return 'warning'
  return 'negative'
}
