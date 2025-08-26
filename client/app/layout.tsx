import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Keep Notes",
  description: "Notes app with Next.js and Django"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-5xl mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}