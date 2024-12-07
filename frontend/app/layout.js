import { Outfit } from "next/font/google";
import Header from "@/Components/Header";
import "./globals.css";
import Footer from "@/Components/Footer";

const outfit = Outfit({ subsets: ["latin"], weight: ['400', '500', '600', '700'] });

export const metadata = {
  title: "Coder Stack",
  description: "Website for Coder Stack helps you to learn and grow as a developer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.className} flex flex-col min-h-screen bg-no-repeat bg-center bg-cover z-0`}>
      <Header />
        {children}
      </body>
      <Footer />
    </html>
  );
}
