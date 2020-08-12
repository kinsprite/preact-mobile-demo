const scripts = require('react-micro-frontend-scripts');

function build() {
  // --- ENV for 'production' only ---
  // process.env.PUBLIC_DISABLE_REVISION = 'true';
  // process.env.PUBLIC_ROOT_URL = '/';
  process.env.PUBLIC_URL = './';
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
  process.env.SPLIT_CHUNKS = 'false';
  process.env.RUNTIME_CHUNK = 'false';

  scripts.runWebpack(scripts.envProduction, (config) => ({
    ...config,
    externals: {
    },
    entry: {
      app: scripts.resolvePath('src/index'),
    },
  }));
}

build();
