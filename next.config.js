// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   experimental: {
//     serverComponentsExternalPackages: ['mongoose', 'bcryptjs'],
//   },
// };

// export default nextConfig;
const nextConfig = {
  // Use the new property name
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  serverExternalPackages: ['mongoose', 'bcryptjs'],
}

export default nextConfig
