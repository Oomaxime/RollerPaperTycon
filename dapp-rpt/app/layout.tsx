import "./globals.css";
import { Provider } from "@/provider/provider";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
