import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PH7N8G6B";

/**
 * Inline Google Tag Manager bootloader. Rendered in the document `<head>`
 * via Next.js' Script component with `afterInteractive` strategy so it
 * doesn't block hydration. The container id falls back to the hard-coded
 * value the marketing team provided, but can be overridden by setting
 * `NEXT_PUBLIC_GTM_ID` (useful when staging needs a different container).
 */
export const GoogleTagManagerScript = () => {
  if (!GTM_ID) return null;
  return (
    <Script
      id="gtm-bootstrap"
      strategy="afterInteractive"
      // The snippet GTM hands out — kept verbatim so it can be audited
      // against marketing's reference. The container id is interpolated.
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
      }}
    />
  );
};

/**
 * The `<noscript>` fallback that GTM requires immediately after `<body>`.
 * Lets the container still fire pageviews for users with JS disabled.
 */
export const GoogleTagManagerNoscript = () => {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
};
