import {defineConfig, transformWithEsbuild} from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path';
import fs from 'fs';
import os from 'os';
import EnvironmentPlugin from 'vite-plugin-environment';
import {nodePolyfills} from 'vite-plugin-node-polyfills';

const APP_PORT = 10;

const localhost = '127.0.0.1';
const isProduction = process.env.NODE_ENV === 'production';
const environmentPath = !process.env.ENVIRONMENT ? '.env' : `.env.${process.env.ENVIRONMENT}`;
require('dotenv').config({path: path.resolve(__dirname, environmentPath)}); // read file .env.development
const host = process.env.HOST ? process.env.HOST.replace(/https?:\/\//, '') : localhost;
const isEmbed = process.env.IS_EMBEDDED_APP === 'yes';
const templateOutFile = isEmbed ? 'embed-template.html' : 'standalone.html';
const fePort = process.env.FRONTEND_PORT || 3000 + APP_PORT; // vite server port
const bePort = process.env.BACKEND_PORT || 5000 + APP_PORT; // hosting/API port

console.log('fe port', fePort, bePort, host);

const [sslKey, sslCert] = ['ssl.key', 'ssl.crt'].map(file => {
  try {
    return fs.readFileSync(path.resolve(__dirname, '../../../ssl/' + file), 'utf8');
  } catch (e) {
    return null;
  }
});
const isHttps = !!(sslKey && sslCert) && !process.env.DISABLE_HTTPS;

console.log(['Template file', fePort, bePort, host].join(' == '));

console.log('host', host);

const isLocalProxy = localhost !== host;
const isLocalDevShopify = host.includes('localhost');

function getProtocol() {
  if (isLocalDevShopify) {
    return 'ws';
  }
  if (isLocalProxy || isHttps) {
    return 'wss';
  }

  return 'ws';
}

function getHmrPort() {
  if (isLocalProxy) {
    return 443;
  }
  return 64999 + APP_PORT;
}

function getPort() {
  if (isLocalDevShopify) {
    return 443;
  }

  return isLocalProxy ? fePort : 64999 + APP_PORT;
}

/** @type {HmrOptions} */
const hmrConfig = {
  protocol: getProtocol(),
  host: isLocalDevShopify ? 'localhost' : host,
  port: getPort(),
  clientPort: getHmrPort(),
  overlay: true
};

const proxyOptions = {
  target: `http://${localhost}:${bePort}`,
  changeOrigin: false,
  secure: true,
  ws: false
};

const shopifyApiKey = process.env.SHOPIFY_API_KEY;
const shopifyApiSecret = process.env.SHOPIFY_API_SECRET;
if (!isProduction && shopifyApiKey) {
  try {
    const baseUrl = process.env.HOST.replace('https://', '');
    const runtimeFile = '../functions/.runtimeconfig.json';
    fs.readFile(runtimeFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      const configData = JSON.parse(data);
      if (
        configData.app.base_url === baseUrl &&
        configData.shopify.api_key === shopifyApiKey &&
        configData.shopify.secret === shopifyApiSecret
      ) {
        return;
      }

      configData.app.base_url = baseUrl;
      configData.shopify.api_key = shopifyApiKey;
      configData.shopify.secret = shopifyApiSecret;
      fs.writeFileSync(runtimeFile, JSON.stringify(configData));
    });
    updateEnvFile('.env.development', {
      VITE_SHOPIFY_API_KEY: shopifyApiKey
    });
    if (!isLocalDevShopify) {
      updateThemeAppExtFile('../../extensions/theme-extension/assets/avada-joy.js');
      updateThemeAppExtFile('../../extensions/theme-extension/assets/joy-blocks.js');
    }
    updateEnvFile('../scripttag/.env.development', {
      SHOPIFY_CDN_URL: `${process.env.HOST}/scripttag/`,
      PUBLIC_PATH: `${process.env.HOST}/scripttag/`,
      API_URL: baseUrl
    });
    updateEnvFile('../functions/.env', {
      BASE_URL: process.env.HOST.replace('https://', ''),
      APP_HOOK_URL: process.env.HOST,
      SHOPIFY_API_KEY: shopifyApiKey,
      SHOPIFY_SECRET: shopifyApiSecret
    });
  } catch (e) {
    console.error('Error changing the env file');
  }
}

/**
 *
 * @param file
 */
function updateThemeAppExtFile(file) {
  const fileContent = fs.readFileSync(file, 'utf8');
  const regex = /const BASE_URL\s*=\s*(['"`])(.*?)\1/;
  const url = `${process.env.HOST}/scripttag`;
  const updatedContent = fileContent.replace(regex, `const BASE_URL = '${url}'`);
  // write everything back to the file system
  fs.writeFileSync(file, updatedContent);
}

/**
 *
 * @param file
 * @param data
 */
function updateEnvFile(file, data) {
  const ENV_VARS = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  const keys = Object.keys(data);
  for (const key of keys) {
    // find the env we want based on the key
    const target = ENV_VARS.indexOf(ENV_VARS.find(line => line.match(new RegExp(key))));
    const replaceIndex = target === -1 ? ENV_VARS.length - 1 : target;

    // replace the key/value with the new value
    ENV_VARS[replaceIndex] = `${key}=${data[key]}`;
  }

  // write everything back to the file system
  fs.writeFileSync(file, ENV_VARS.join(os.EOL));
}

/** @type {ProxyOptions} */
const proxyConfig = {
  '^/api(/|(\\?.*)?$)': proxyOptions,
  '^/embed(/|(\\?.*)?$)': proxyOptions,
  '^/apiV2(/|(\\?.*)?$)': proxyOptions,
  '^/apiSaV2(/|(\\?.*)?$)': proxyOptions,
  '^/authSa(/|(\\?.*)?$)': proxyOptions,
  '^/auth(/|(\\?.*)?$)': proxyOptions,
  '^/apiSa(/|(\\?.*)?$)': proxyOptions,
  '^/app(/|(\\?.*)?$)': proxyOptions,
  '^/shopifyFlow(/|(\\?.*)?$)': proxyOptions,
  '^/rest_api(/|(\\?.*)?$)': proxyOptions,
  '^/integrate(/|(\\?.*)?$)': proxyOptions,
  '^/manifest.json': proxyOptions,
  '^/scripttag(/|(\\?.*)?$)': proxyOptions,
  '^/tracking(/|(\\?.*)?$)': proxyOptions
};

/** @type {ServerOptions} */
const serverConfig = {
  host: isEmbed ? 'localhost' : localhost,
  port: fePort,
  hmr: hmrConfig,
  proxy: proxyConfig,
  cors: {
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'X-Requested-With']
  }
};

/** @type {HttpsServerOptions} */
const https = {
  key: sslKey,
  cert: sslCert
};

if (!isEmbed && isHttps) serverConfig.https = https;

// https://vitejs.dev/config/
// console.log('process.env', process.env);
export default defineConfig({
  define: {
    'process.env.IS_EMBEDDED_APP': process.env.IS_EMBEDDED_APP,
    'process.env.NODE_ENV': process.env.NODE_ENV
  },
  plugins: [
    nodePolyfills(),
    // eslint-disable-next-line new-cap
    EnvironmentPlugin(
      {
        IS_EMBEDDED_APP: true,
        SHOPIFY_API_KEY: null,
        HOST: host,
        FRONTEND_PORT: fePort,
        BACKEND_PORT: bePort,
        NODE_ENV: 'development'
      },
      {
        loadEnvFiles: true
      }
    ),
    {
      name: 'treat-js-files-as-jsx',
      async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null;

        // Use the exposed transform from vite, instead of directly
        // transforming with esbuild
        return transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic'
        });
      }
    },
    {
      name: 'index-html-build-replacement',
      async transformIndexHtml(html) {
        if (!isEmbed) {
          return html.replace('embed.js', 'standalone.js');
        }
        return html;
      }
    },
    react({jsxRuntime: 'classic'})
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx'
      },
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src'),
      '@functions': path.resolve(__dirname, '../functions/src')
    },
    dedupe: ['react', 'react-dom']
  },
  server: serverConfig,
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'mixed-decls']
      }
    }
  },
  build: {
    // Disables the preload.
    modulePreload: false,
    commonjsOptions: {
      transformMixedEsModules: true
    },
    outDir: '../../static',
    emptyOutDir: false,
    rollupOptions: {
      input: {
        app: './' + templateOutFile
      }
    }
  }
});