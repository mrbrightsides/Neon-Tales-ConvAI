/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: '/:path*',
        headers: [
          {
            // Completely remove X-Frame-Options to allow all embedding including webviews
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            // Very permissive CSP for webview compatibility
            // Removed frame-ancestors restriction entirely for maximum compatibility
            key: 'Content-Security-Policy',
            value: "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; frame-ancestors *; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; img-src * data: blob:; font-src *; connect-src *; media-src *; object-src *; child-src *; frame-src *; worker-src *; form-action *; base-uri *; manifest-src *;",
          },
          {
            // Allow cross-origin requests
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            // Allow credentials in cross-origin requests
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            // Specify allowed methods
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS, PATCH, HEAD',
          },
          {
            // Specify allowed headers
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, Content-Type, Authorization, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since',
          },
          {
            // Prevent MIME type sniffing
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            // Allow loading in iframes from anywhere
            key: 'X-Permitted-Cross-Domain-Policies',
            value: 'all',
          },
        ],
      },
    ];
  },
  // Disable strict mode for better webview compatibility
  reactStrictMode: false,
  // Disable poweredByHeader for cleaner response
  poweredByHeader: false,
};

module.exports = nextConfig;
