import jsonlintSource from 'jsonlint/web/jsonlint.js?raw';

// 使用 jsonlint 的浏览器 bundle，避免引入 Node 侧 fs/path 依赖。
const jsonlint = new Function(`${jsonlintSource}; return jsonlint;`)();

export default jsonlint;
