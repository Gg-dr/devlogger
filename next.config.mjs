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
  
  serverExternalPackages: ['mongoose', 'bcryptjs'],
}

export default nextConfig
