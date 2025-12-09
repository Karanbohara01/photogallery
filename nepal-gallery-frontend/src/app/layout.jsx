import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        {/* Ad Script */}
        <Script
          async
          type="application/javascript"
          src="https://a.magsrv.com/ad-provider.js"
        />

        <ins className="eas6a97888e2" data-zoneid="5795068"></ins>

        <Script id="ad-provider-init">
          {`(AdProvider = window.AdProvider || []).push({ serve: {} });`}
        </Script>
      </body>
    </html>
  );
}
