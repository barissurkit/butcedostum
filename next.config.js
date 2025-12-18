/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
  serverExternalPackages: [
    "@prisma/adapter-libsql",
    "@libsql/client",
    "@libsql/hrana-client",
    "@libsql/isomorphic-ws",
    "@libsql/win32-x64-msvc",
  ],

  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.(md|txt)$/i,
      type: "asset/source",
    });

    config.module.rules.push({
      test: /(LICENSE|NOTICE|COPYING)$/i,
      type: "asset/source",
    });

    if (isServer) {
      config.externals.push("@libsql/win32-x64-msvc");
    }

    return config;
  },
};

module.exports = nextConfig;
