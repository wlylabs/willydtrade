/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.experiments = { ...config.experiments, asyncWebAssembly: true };

    // Coinbase Wallet SDK (dibawa oleh RainbowKit) punya optional import
    // ke paket x402 (fitur pembayaran Coinbase) yang tidak kita pakai.
    // Modul ini tidak ter-install dan memang tidak dibutuhkan, jadi diabaikan
    // saat build biar tidak gagal resolve.
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

    return config;
  },
};

export default nextConfig;