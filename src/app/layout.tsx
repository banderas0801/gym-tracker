import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gym Tracker Pro | Nhật Ký & Giáo Án Thể Hình Thông Minh",
  description: "Ứng dụng theo dõi bài tập gym, ghi chép tải tăng tiến (Progressive Overload), công thức tạ cho người mới và phân tích chỉ số hình thể chuẩn khoa học.",
  applicationName: "Gym Tracker Pro",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GymTracker",
  },
  icons: {
    icon: "/icons/icon-512.svg",
    apple: "/icons/icon-192.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100 select-none">
        {children}
      </body>
    </html>
  );
}
