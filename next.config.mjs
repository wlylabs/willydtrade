/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Coinbase Wallet SDK (dibawa RainbowKit) punya optional import ke
    // paket x402 (fitur pembayaran Coinbase) yang tidak kita pakai.
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/core/client": false,
      "@x402/core": false,
      "@x402/evm": false,
      "@x402/evm/exact/client": false,
      "@x402/evm/upto/client": false,
      "@x402/svm": false,
      "@x402/svm/exact/client": false,
    };

    // MetaMask SDK & WalletConnect logger punya optional dependency
    // untuk React Native / pretty-print logging yang tidak relevan di web.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };

    return config;
  },
};

export default nextConfig;