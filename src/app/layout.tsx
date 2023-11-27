import type { Metadata } from 'next'
import './style/globals.css'

export const metadata: Metadata = {title: 'Click2Call POC'}

const RootLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default RootLayout