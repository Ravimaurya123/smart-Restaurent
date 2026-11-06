import "./globals.css";
import Navbar from "../components/Navbar";
import SocketProvider from "../components/SocketProvider";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Smart Restaurant",
  description:
    "Smart food ordering and restaurant management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <SocketProvider>
            <Navbar />
            {children}
          </SocketProvider>
        </CartProvider>
      </body>
    </html>
  );
}