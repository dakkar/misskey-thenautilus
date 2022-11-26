// Original: mix of
// https://github.com/code-farmer-i/vite-plugin-prismjs/blob/master/src/index.ts
// and the `index.js` you get from `npm install vite-plugin-prismjs`
// (which is version 0.0.8, and I can't find the repository for it)
import { transformSync } from '@babel/core';
import { createFilter } from '@rollup/pluginutils';
import babelPluginPrismjs from 'babel-plugin-prismjs';
import { Plugin } from 'vite'
interface BabelPluginPrismjsOptions {
  languages?: string[] | 'all';
  plugins?: string[];
  theme?: string;
  css?: boolean;
}

function prismjsPlugin(options: BabelPluginPrismjsOptions = {}): Plugin {
  let needSourceMap = true;

  function transform(id: string, code: string) {
    return transformSync(code, {
      babelrc: false,
      ast: true,
      plugins: [[babelPluginPrismjs, options]],
      sourceMaps: needSourceMap,
      sourceFileName: id,
      configFile: false,
    });
  }

  return {
    name: 'prismjs',
    enforce: 'post',

    configResolved(config) {
      needSourceMap = config.command === 'serve' || !!config.build.sourcemap;
    },

    transform(code, id) {
      if (/\.(?:[jt]sx?|vue)$/.test(id) && !/node_modules/.test(id)) {
        const result = transform(id, code);

        if (result) {
          return {
            code: result.code as string,
            map: result.map,
          };
        }
      }
    },
  };
}

export {
  prismjsPlugin
}

export default prismjsPlugin
