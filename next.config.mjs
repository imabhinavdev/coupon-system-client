// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/v1/:path*", // Proxy to your external API
        // destination: "https://couponsystemserver.vercel.app/api/v1/:path*", // Proxy to your external API
      },
    ];
  },
};

export default nextConfig;
