import "./globals.css";
import { Provider } from "@/public/components/provider";
import Home from "@/components/images/home.svg";
import Store from "@/components/images/store.svg";
import Image from "next/image";
import Link from "next/link";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Provider>{children}</Provider>
        <div className="mt-auto mb-4 mr-4 ml-4 w-auto h-12 bg-blue-500 flex items-center place-content-around rounded-xl">
          <Link href="/"> 
            <Image src={Home} alt="Home" />
          </Link>
          <Link href="/blockchain">
            <Image src={Store} alt="Store" />
          </Link>
        </div>
      </body>
    </html>
  );
}
