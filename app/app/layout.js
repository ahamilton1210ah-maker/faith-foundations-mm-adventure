export const metadata = {
  title: "Faith Foundations: The M&M Adventure",
  description: "Every child's faith matters."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
