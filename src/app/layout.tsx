import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import ToastContainer from "@/components/ToastContainer";
import BackToTop from "@/components/BackToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GoldTee – Premium Golf Accessories",
  description:
    "Premium golf gadgets and accessories crafted for those who play seriously. Based in South Africa.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <CartDrawer />
        <ToastContainer />
        <BackToTop />
        {children}
      </body>
    </html>
  );
}
