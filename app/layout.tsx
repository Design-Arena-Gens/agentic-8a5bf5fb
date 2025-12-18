import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Synthetic Factory - AI Data Generation SaaS',
  description: 'Generate synthetic labeled datasets on-demand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
