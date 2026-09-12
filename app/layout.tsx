import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BlueLingo | រៀនភាសាអង់គ្លេស និងចិន",
  description: "វេទិការៀនភាសាអង់គ្លេស និងចិនជាភាសាខ្មែរ។",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="km">
      <body className="antialiased">{children}</body>
    </html>
  );
}
