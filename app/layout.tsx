import "./globals.css";
import { Libre_Baskerville } from "next/font/google";

const serif = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={serif.className}>
      <body>{children}</body>
    </html>
  );
}