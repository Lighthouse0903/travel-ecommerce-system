import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import LoginModal from "@/components/common/dialogs/LoginModal";
import { LoginModalProvider } from "@/contexts/LoginModalContext";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "VietTravel",
  description: "Trang thương mại điện tử du lịch thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        <AuthProvider>
          <LoginModalProvider>
            <LoginModal />
            <Header />
            {children}
            <Toaster position="top-center" />
            <Footer />
          </LoginModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
