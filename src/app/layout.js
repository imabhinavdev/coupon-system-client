import localFont from "next/font/local";
import "./globals.css";
import NavigationBar from "@/components/navigation";
import {DM_Sans} from 'next/font/google'


const dmsans = DM_Sans({
  subsets: ['latin'],
  weights: [400, 500, 700],
  display: 'swap',
})

export const metadata = {
  title: "Coupon System",
  description: "This is a coupon system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmsans.className} antialiased max-w-screen-xl mx-auto`}
      >
        <NavigationBar />
        {children}
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </body>
    </html>
  );
}
