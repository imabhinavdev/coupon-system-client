// layouts/RootLayout.js
import "./globals.css";
import NavigationBar from "@/components/navigation";
import { Poppins } from "next/font/google";
import Footer from "@/components/footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserProvider } from "@/context/UserContext";
import "react-loading-skeleton/dist/skeleton.css";
import QueryProvider from "@/providers/QueryClientProvider";

const dmsans = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata = {
  title: "Coupon System",
  description: "This is a coupon system for Event management and ticketing",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${dmsans.className}  max-w-screen-xl md:mx-auto flex-col flex min-h-screen justify-between gap-2`}
      >
        <QueryProvider>
          <UserProvider>
            <NavigationBar />
            <div className="flex-grow flex flex-col h-full md:px-0 px-4">
              {children}
            </div>
            <Footer />
            <ToastContainer />
          </UserProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
