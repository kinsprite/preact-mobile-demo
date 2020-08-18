const scripts = require('react-micro-frontend-scripts');

function getSplitChunksOptions() {
  return {
    cacheGroups: {
      'vendor-preact': {
        test: /[\\/]node_modules[\\/]preact(-[a-z-]+)?[\\/]/,
        name: 'vendor-preact',
        chunks: 'all',
      },
      'vendor-redux': {
        test: /[\\/]node_modules[\\/](redux|react-redux|redux-thunk|redux-saga)[\\/]/,
        name: 'vendor-redux',
        chunks: 'all',
      },
      workbox: {
        test: /[\\/]node_modules[\\/]workbox-.+[\\/]/,
        name: 'workbox',
        chunks: 'all',
      },
    },
  };
}

function build() {
  // --- ENV for 'production' only ---
  // process.env.PUBLIC_DISABLE_REVISION = 'true';
  // process.env.PUBLIC_ROOT_URL = '/';
  process.env.PUBLIC_URL = '/';
  process.env.GENERATE_INDEX_HTML = 'true';
  process.env.GENERATE_SOURCEMAP = 'false';
  // process.env.INLINE_RUNTIME_CHUNK = 'true';
  // process.env.MINIMIZE_IN_PRODUCTION = 'false';

  // process.env.WORKBOX_GENERATE_SW = 'true';
  process.env.WORKBOX_INJECT_MANIFEST = 'true';

  // --- ENV for ALL ---
  process.env.ENSURE_NO_EXPORTS = 'true';
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  process.env.SPLIT_CHUNKS = 'true';
  process.env.RUNTIME_CHUNK = 'false';

  process.env.PREACT_MOBILE = 'true';

  scripts.runWebpack(scripts.envProduction, (config) => ({
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
      polyfill: scripts.resolvePath('src/polyfill'),
      app: scripts.resolvePath('src/index'),
    },
  }));
}

build();
