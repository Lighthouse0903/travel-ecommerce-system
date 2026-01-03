import PageTransition from "@/components/common/animations/PageTransition";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
