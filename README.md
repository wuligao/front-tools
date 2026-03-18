# 极简工具站

一个基于 Vue 3 + Vite + Element Plus 的纯前端在线工具站，所有数据处理均在浏览器端完成，无需后端服务。

## 启动项目

```bash
npm install
npm run dev
```

默认开发地址为 [http://localhost:5173](http://localhost:5173)。

## 构建项目

```bash
npm run build
```

构建完成后会生成 `dist` 目录，可直接部署到 GitHub Pages、Vercel 或 Netlify。

## 本地预览构建产物

不要直接双击 `dist/index.html` 打开，推荐使用本地静态服务预览：

```bash
npm run preview
```

## GitHub Pages 自动部署

项目已经内置 GitHub Pages 自动部署流程，工作流文件位于：

`/.github/workflows/deploy-pages.yml`

### 首次启用

1. 将代码推送到 GitHub 仓库的 `main` 分支。
2. 打开仓库 `Settings`。
3. 进入 `Pages`。
4. 在 `Build and deployment` 中选择 `GitHub Actions`。

### 日常发布

之后每次推送到 `main`，GitHub Actions 都会自动完成安装依赖、执行构建并发布到 GitHub Pages：

```bash
git add .
git commit -m "chore: update site"
git push origin main
```

### 访问地址

当前仓库 `front-tools` 发布后的默认地址为：

[https://wuligao.github.io/front-tools/](https://wuligao.github.io/front-tools/)
