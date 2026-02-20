import "./globals.css";

export const metadata = {
  title: "LIT (Legal Intelligence Terminal)",
  description: "Enterprise-Grade Document Retrieval Strategy",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
