// https://umijs.org/config/
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';
import slash from 'slash2';

const { pwa, primaryColor } = defaultSettings;
const { TEST } = process.env;

const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: true, // default false
        default: 'zh-CN', // default zh-CN
        baseNavigator: true, // default true, when it is true, will use `navigator.language` overwrite default
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false,
      ...(!TEST && os.platform() === 'darwin'
        ? {
            dll: {
              include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
              exclude: ['@babel/runtime', 'netlify-lambda'],
            },
            hardSource: false,
          }
        : {}),
    },
  ],
];



export default {
  
  plugins,
  
  treeShaking: true,
  targets: {
    ie: 11,
  },
  devtool:  'source-map' ,
  // 路由配置
  routes: pageRoutes,
  
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    
    '/snackstest': {
      // target: 'http://193.112.43.114:8080/',
      target: 'https://www.eyuwu.cn/',
      changeOrigin: true,
    },
    '/zhuhaiweb': {
      target: 'https://www.eyuwu.cn/',
      changeOrigin: true,
    }
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }
      return localName;
    },
  },
  manifest: {
    basePath: '/static/dist/',
  },

  chainWebpack: webpackPlugin,
};
