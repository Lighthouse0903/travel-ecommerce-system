import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.fna.fbcdn.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "travel-tours-media.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bvhttdl.mediacdn.vn",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "statics.vinpearl.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cafefcdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "wyndham-thanhthuy.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mia.vn",
        pathname: "/**",
      },
    ],
  },
};

export default config;
