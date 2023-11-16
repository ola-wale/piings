

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import StyledComponentsRegistry from "@/components/StyledComponentsRegistry"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Piings',
  description: 'Measure latency between your browser & different cloud providers.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  )
}
