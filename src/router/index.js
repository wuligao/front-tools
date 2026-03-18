import { createRouter, createWebHashHistory } from 'vue-router';
import { toolRoutes } from '../config/tools';

const routeComponentMap = {
  '/json-formatter': () => import('../components/JsonFormatter.vue'),
  '/timestamp-converter': () => import('../components/TimestampConverter.vue'),
  '/url-codec': () => import('../components/UrlCodec.vue'),
  '/password-generator': () => import('../components/PasswordGenerator.vue'),
  '/image-compressor': () => import('../components/ImageCompressor.vue'),
  '/base64-codec': () => import('../components/tools/Base64Codec.vue'),
  '/uuid-generator': () => import('../components/tools/UuidGeneratorTool.vue'),
  '/color-converter': () => import('../components/tools/ColorConverterTool.vue'),
  '/html-entity-codec': () => import('../components/tools/HtmlEntityTool.vue'),
  '/text-stats': () => import('../components/tools/TextStatsTool.vue'),
  '/text-case-converter': () => import('../components/tools/TextCaseTool.vue'),
  '/text-cleaner': () => import('../components/tools/TextCleanerTool.vue'),
  '/image-format-converter': () => import('../components/tools/ImageFormatConverter.vue'),
  '/rmb-uppercase': () => import('../components/tools/RmbUppercaseConverter.vue'),
  '/date-diff-calculator': () => import('../components/tools/DateDiffCalculator.vue'),
  '/unit-converter': () => import('../components/tools/UnitConverterTool.vue'),
  '/random-picker': () => import('../components/tools/RandomPickerTool.vue'),
  '/qrcode-generator': () => import('../components/tools/QrCodeGeneratorTool.vue'),
  '/hash-calculator': () => import('../components/tools/HashCalculatorTool.vue'),
  '/local-notes': () => import('../components/tools/LocalNotesTool.vue'),
  '/timer-tool': () => import('../components/tools/TimerTool.vue'),
};

const routes = [
  {
    path: '/',
    redirect: '/json-formatter',
  },
  ...toolRoutes.map((tool) => ({
    path: tool.path,
    name: tool.path.slice(1),
    component: routeComponentMap[tool.path],
    meta: {
      title: tool.title,
      description: tool.description,
      keywords: tool.keywords,
    },
  })),
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

function updateMetaTag(name, content) {
  let metaTag = document.querySelector(`meta[name="${name}"]`);

  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.setAttribute('name', name);
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute('content', content);
}

router.afterEach((to) => {
  const pageTitle = to.meta.title
    ? `${to.meta.title} - 极简工具站`
    : '极简工具站 - 纯前端在线工具合集';
  document.title = pageTitle;

  updateMetaTag(
    'description',
    to.meta.description || '程序员与职场人的纯前端在线工具合集，数据不上传、无广告、打开即用。'
  );
  updateMetaTag(
    'keywords',
    to.meta.keywords || '在线工具,程序员工具,职场工具,纯前端工具,无广告工具站'
  );
});

export default router;
