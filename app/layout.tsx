import "./globals.css";

export const metadata = {
  title: "Nexa Chain",
  description: "Web3 & crypto platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}