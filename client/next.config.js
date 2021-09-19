module.exports = {
  images: {
    domains: ['www.gravatar.com', process.env.APP_DOMAIN],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        // test: /\.(js|ts)x?$/,
        // for webpack 5 use
        and: [/\.(js|ts)x?$/],
      },

      use: ['@svgr/webpack'],
    });

    return config;
  },
};
