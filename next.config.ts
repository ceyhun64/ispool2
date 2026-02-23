/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**", // Tüm alt yollara izin verir
      },
    ],
  },
};

module.exports = nextConfig;
