import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          strategy="afterInteractive"
          src="https://ads.exoclick.com/ad-provider.js"
          data-idzone="5794992"
          data-sub=""
          data-debug="false"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}