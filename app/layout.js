import "./globals.css";

export const metadata = {
  title: "Dragoon Market",
  description: "Explore cryptocurrency prices and historical charts. Independent portfolio demo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">{children}</body>
    </html>
  );
}
