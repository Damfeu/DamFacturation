import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {}, // Désactive les règles spécifiques de Turbopack
    },
  },
};

export default nextConfig;

