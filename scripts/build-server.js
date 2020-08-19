const scripts = require('react-micro-frontend-scripts');

function getSplitChunksOptions() {
  return {
    cacheGroups: {
    },
  };
}

function build() {
  // --- ENV for 'production' only ---
  // process.env.PUBLIC_DISABLE_REVISION = 'true';
  // process.env.PUBLIC_ROOT_URL = '/';
  process.env.PUBLIC_URL = '/';
  process.env.GENERATE_INDEX_HTML = 'false';
  process.env.GENERATE_SOURCEMAP = 'true';
  // process.env.INLINE_RUNTIME_CHUNK = 'true';
  process.env.MINIMIZE_IN_PRODUCTION = 'false';

  // process.env.WORKBOX_GENERATE_SW = 'true';
  // process.env.WORKBOX_INJECT_MANIFEST = 'true';

  // --- ENV for ALL ---
  process.env.ENSURE_NO_EXPORTS = 'true';
  // process.env.IMAGE_INLINE_SIZE_LIMIT = '1000';
  // process.env.REACT_MICRO_FRONTEND_SHORT = 'rmf';
  process.env.SPLIT_CHUNKS = 'false';
  process.env.RUNTIME_CHUNK = 'false';

  process.env.PREACT_MOBILE = 'true';

  scripts.runWebpack(scripts.envProduction, (config) => ({
    ...config,
    optimization: {
      ...config.optimization,
      splitChunks: (process.env.SPLIT_CHUNKS !== 'false') && getSplitChunksOptions(),
    },
    externals: {
      // preact: 'preact',
      fs: 'fs',
      http: 'http',
      path: 'path',
      url: 'url',
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
      // polyfill: scripts.resolvePath('src/polyfill'),
      // app: scripts.resolvePath('src/index'),
      server: scripts.resolvePath('server/index'),
    },
    output: {
      ...config.output,
      path: scripts.resolvePath('dist-server'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      library: undefined,
      libraryTarget: 'commonjs2',
    },
    target: 'node',
  }));
}

build();
