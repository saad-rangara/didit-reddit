// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Resolve fallback for Node.js modules that don't work in the browser
    config.resolve.fallback = {
      fs: false, // Disable the fs module in the browser
      path: false, // Add more if needed (like `os`, `crypto`, etc.)
    };
    return config;
  },
};

export default nextConfig;
