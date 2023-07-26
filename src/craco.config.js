// craco.config.js
module.exports = {
  style: {
    modules: {
      localIdentName: '[local]_[hash:base64:5]', // Opcional: para nombres de clases únicos en CSS Modules
    },
    css: {
      loaderOptions: (cssLoaderOptions) => ({
        ...cssLoaderOptions,
        modules: { localIdentName: '[local]_[hash:base64:5]' }, // Opcional: para nombres de clases únicos en CSS Modules
      }),
    },
    preProcessor: 'less',
  },
};
