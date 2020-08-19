const scripts = require('react-micro-frontend-scripts');
const devServerBefore = require('./devServerBefore');

function getSplitChunksOptions() {
  return {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/].+[\\/]/,
        name: 'vendor',
        chunks: 'all',
      },
    },
  };
}

function start() {
  process.env.BROWSERSLIST = scripts.pkgJson.getPkgJson().browserslist.development;

  // --- ENV for 'development' only ---
  // process.env.DISABLE_DEV_SERVER = 'true';

  // --- ENV for ALL ---
  process.env.ENSURE_NO_EXPORTS = 'true';
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  // process.env.SPLIT_CHUNKS = 'true';
  // process.env.RUNTIME_CHUNK = 'true';

  process.env.PREACT_MOBILE = 'true';

  scripts.runWebpack(scripts.envDevelopment, (config) => ({
    ...config,
    optimization: {
      ...config.optimization,
      splitChunks: (process.env.SPLIT_CHUNKS !== 'false') && getSplitChunksOptions(),
    },
    externals: {
    },
    resolve: {
      ...config.resolve,
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      },
    },
    entry: {
      app: ['preact/debug', scripts.resolvePath('src/index')],
    },
    devServer: {
      ...config.devServer,
      before: devServerBefore,
    },
  }));
}

start();
