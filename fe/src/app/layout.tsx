import type { Metadata } from "next";
import { Montserrat, Inter } from "next/font/google";

import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/common/header/Header";
import Footer from "@/components/common/footer/Footer";
import { Toaster } from "@/components/ui/sonner";
import LoginModal from "@/components/common/dialogs/LoginModal";
import { LoginModalProvider } from "@/contexts/LoginModalContext";
import { AgencyProfileProvider } from "@/contexts/AgencyProfileContext";
import NextTopLoader from "nextjs-toploader";
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
          <AgencyProfileProvider>
            <LoginModalProvider>
              <LoginModal />
              <Header />
              <NextTopLoader
                color="#0ea5e9" // xanh du lịch (sky-500)
                height={3}
                showSpinner={false}
                crawlSpeed={200}
                easing="ease"
                speed={200}
              />
              {children}
              <Toaster position="top-center" />
              <Footer />
            </LoginModalProvider>
          </AgencyProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
