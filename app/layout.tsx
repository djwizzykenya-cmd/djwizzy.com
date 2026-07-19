import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "DJ Wizzy - Your All-in-One DJ Ecosystem",
  description: "Experience DJ Wizzy's mixes, services, and community. Mix, share, and monetize your DJ content.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="bg-black text-white min-h-screen flex flex-col">
        {/* Epic Background Elements */}
        <div className="vinyl-top-left"></div>
        <div className="vinyl-bottom-right"></div>
        <div className="soundwave-line"></div>
        <div className="soundwave-line"></div>
        <div className="soundwave-line"></div>
        <div className="soundwave-line"></div>

        <AuthProvider>
          <Navbar />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
