import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Living AI Neural Portfolio',
  description: 'Interactive 3D representation of a platform engineer and cloud architect',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  themeColor: '#010103',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased select-none bg-[#010103]">
        {children}
      </body>
    </html>
  )
}
