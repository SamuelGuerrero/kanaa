const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PH7N8G6B";

/**
 * Inline Google Tag Manager bootloader, rendered as a raw `<script>` directly
 * in `<head>`. We deliberately do NOT use `next/script` here because:
 *
 * 1. In App Router, `next/script` with `strategy="afterInteractive"` for
 *    inline scripts injects the tag post-hydration, which causes Tag
 *    Assistant to report the container as "not found" on some routes
 *    (notably `/booking-success/`, where marketing was hitting it).
 * 2. The official GTM snippet is meant to be a synchronous `<script>` at
 *    the top of `<head>` — that's the form Tag Assistant, GA4, and Meta
 *    Pixel all assume when they look for `window.google_tag_manager`.
 *
 * The snippet itself is kept verbatim against the one GTM hands out, with
 * the container id interpolated. The container id falls back to the
 * hard-coded value marketing provided but can be overridden via
 * `NEXT_PUBLIC_GTM_ID` (useful when staging needs a different container).
 */
export const GoogleTagManagerScript = () => {
  if (!GTM_ID) return null;
  return (
    <script
      id="gtm-bootstrap"
      // eslint-disable-next-line react/no-danger
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
