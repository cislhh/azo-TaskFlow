import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainLayout } from "@/components/layout/main-layout"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: "任务管理系统",
  description: "个人日程管理系统",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className={`${inter.variable} antialiased bg-gray-50 text-gray-900`}>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}

