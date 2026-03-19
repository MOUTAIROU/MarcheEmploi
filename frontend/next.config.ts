import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true, // actif une seule fois
  trailingSlash: false,
  env: {
    SERVER_HOST: 'http://192.168.100.7:4000',
    SERVER_CV: 'http://192.168.100.7:8000',
    CAPTCHA_SITE: '6LdjzEYrAAAAAKajTHVqHC8gQX2xEunOZjx7UzPG',
    LOCAL_HOST: 'http://192.168.100.7:3500',
    GOOGLE_CLIENT_ID: "354798832065-fdvlqt834nk6m1coel5i683dg7ip7nvg.apps.googleusercontent.com",
    REDIRECT_URI: "http://192.168.100.7:3050/api/auth/google/callback"
  },

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.100.7', // juste l'IP, pas http://
        port: '4000',
        pathname: '/uploads/**',     // autoriser tous les fichiers dans uploads
      },
      {
        protocol: 'https',
        hostname: 'info.lund.fullrencontre.fr',
      },
     
    ],
     unoptimized: true
  },
  allowedDevOrigins: [
    'http://192.168.100.7:4000', // autoriser le backend
    'http://192.168.100.7:3500', // autoriser le frontend si différent
  ],

};

export default nextConfig;
