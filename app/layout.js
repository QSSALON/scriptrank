import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: '短剧评级工作台 · ScriptRank Studio',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="zh-CN">
        <body style={{ margin: 0, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b0b0f', fontFamily: 'system-ui, sans-serif' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
