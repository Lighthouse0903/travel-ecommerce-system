import Footer from "@/components/common/footer/Footer";
import Header from "../../components/common/header/Header";
import { Toaster } from "@/components/ui/sonner";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Header />
      {children}
      <Toaster position="top-center" />
      <Footer />
    </div>
  );
}
