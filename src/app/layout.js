import localFont from "next/font/local";
import SessionWrapper from "../components/SessionWrapper"; 
import Header from "../components/layout/header";
import Footer from "../components/layout/footer";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Pizzeria",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper> 
          <main className="max-w-4xl mx-auto p-4">
            <Header />
            {children}
            <Footer />
          </main>
        </SessionWrapper>
      </body>
    </html>
  );
}
