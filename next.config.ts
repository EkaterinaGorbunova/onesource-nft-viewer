import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'api.onesource.io',
      'arweave.net',
      'ipfs.io',
      'gateway.pinata.cloud'
    ], // Common NFT image hosting domains
  },
};

export default nextConfig;

