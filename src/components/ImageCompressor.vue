<!-- 图片压缩工具，支持拖拽上传、纯前端压缩、对比预览与下载。 -->
<template>
  <div class="page-shell">
    <ToolPageHero
      title="图片压缩工具"
      description="纯前端在线图片压缩工具，支持 JPG/PNG，本地完成压缩与预览，不上传原图，适合开发文档、运营素材和日常办公场景。"
      :chips="['拖拽上传', '前后对比', '本地下载']"
    />

    <section class="surface-card image-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">选择图片</h2>
          <p class="section-subtitle">点击或拖拽图片到上传区域，支持 JPG/PNG，单张图片大小不超过 10MB。</p>
        </div>
      </div>

      <el-upload
        ref="uploadRef"
        drag
        action="#"
        :auto-upload="false"
        :show-file-list="false"
        accept="image/jpeg,image/png"
        :on-change="handleFileChange"
        class="upload-panel"
      >
        <div class="upload-panel__inner">
          <el-icon class="upload-panel__icon"><PictureFilled /></el-icon>
          <p class="upload-panel__title">点击或拖拽图片到此区域上传</p>
          <p class="upload-panel__hint">仅支持 JPG/PNG 格式，单张图片大小 ≤ 10MB</p>
        </div>
      </el-upload>

      <div v-if="statusMessage" :class="['status-banner', statusToneClass]" role="status">
        <el-icon>
          <SuccessFilled v-if="statusToneClass === 'is-success'" />
          <WarningFilled v-else />
        </el-icon>
        <span>{{ statusMessage }}</span>
      </div>
    </section>

    <section v-if="originalFile" class="surface-card image-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">压缩设置</h2>
          <p class="section-subtitle">数值越高，画质越好，压缩率越低；日常网页场景建议 0.6 - 0.8。</p>
        </div>
      </div>

      <div class="quality-panel">
        <div class="config-title-row">
          <span class="section-title section-title--small">压缩质量</span>
          <span class="config-title-row__value">当前：{{ quality.toFixed(2) }}</span>
        </div>

        <el-slider
          v-model="quality"
          :min="0.1"
          :max="1"
          :step="0.05"
          show-input
          aria-label="图片压缩质量滑块"
        />

        <div class="quality-panel__footer">
          <p class="section-subtitle">调整数值后点击重新压缩即可查看最新效果。</p>
          <el-button
            :loading="isCompressing"
            :disabled="!hasPendingQualityChange"
            aria-label="使用当前质量重新压缩图片"
            @click="compressSelectedFile"
          >
            重新压缩
          </el-button>
        </div>
      </div>
    </section>

    <section v-if="originalInfo && compressedInfo" class="surface-card image-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">压缩结果</h2>
          <p class="section-subtitle">左右对比原图与压缩后图片，压缩收益会高亮显示，便于快速判断是否可用。</p>
        </div>
      </div>

      <div class="image-compare-grid">
        <article class="image-info-card">
          <img
            v-if="originalPreviewUrl"
            :src="originalPreviewUrl"
            alt="原图预览"
            class="image-preview"
          />
          <div class="image-info-card__meta">
            <h3>原图信息</h3>
            <p>尺寸：{{ originalInfo.width }} × {{ originalInfo.height }}</p>
            <p>大小：{{ formatFileSize(originalInfo.size) }}</p>
            <p>文件名：{{ originalFile.name }}</p>
          </div>
        </article>

        <article class="image-info-card">
          <img
            v-if="compressedPreviewUrl"
            :src="compressedPreviewUrl"
            alt="压缩后图片预览"
            class="image-preview"
          />
          <div class="image-info-card__meta">
            <h3>压缩后信息</h3>
            <p>尺寸：{{ compressedInfo.width }} × {{ compressedInfo.height }}</p>
            <p>大小：{{ formatFileSize(compressedInfo.size) }}</p>
            <p class="image-info-card__saving">压缩率：{{ compressionRatio }}%</p>
          </div>
        </article>
      </div>

      <div class="download-row">
        <div class="download-row__meta">
          <span class="section-subtitle">体积变化</span>
          <strong class="mono-value">{{ formatFileSize(savedSize) }} 已节省</strong>
        </div>
        <el-button
          type="primary"
          size="large"
          :loading="isCompressing"
          :disabled="!compressedBlob"
          aria-label="下载压缩后的图片"
          @click="downloadCompressedImage"
        >
          下载压缩图片
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { PictureFilled, SuccessFilled, WarningFilled } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import Compressor from 'compressorjs';
import ToolPageHero from './ToolPageHero.vue';
import { downloadBlob } from '../utils/download';

const uploadRef = ref(null);
const quality = ref(0.8);
const appliedQuality = ref(0.8);
const isCompressing = ref(false);
const originalFile = ref(null);
const originalInfo = ref(null);
const compressedInfo = ref(null);
const compressedBlob = ref(null);
const originalPreviewUrl = ref('');
const compressedPreviewUrl = ref('');
const statusMessage = ref('');
const statusToneClass = ref('is-warning');

const hasPendingQualityChange = computed(() => (
  Boolean(originalFile.value) && Number(quality.value.toFixed(2)) !== Number(appliedQuality.value.toFixed(2))
));

const compressionRatio = computed(() => {
  if (!originalInfo.value || !compressedInfo.value || !originalInfo.value.size) {
    return '0.0';
  }

  const savedRatio = (1 - compressedInfo.value.size / originalInfo.value.size) * 100;
  return Math.max(0, savedRatio).toFixed(1);
});

const savedSize = computed(() => {
  if (!originalInfo.value || !compressedInfo.value) {
    return 0;
  }

  return Math.max(0, originalInfo.value.size - compressedInfo.value.size);
});

function clearUploadQueue() {
  uploadRef.value?.clearFiles();
}

function revokeUrl(urlRef) {
  if (urlRef.value) {
    URL.revokeObjectURL(urlRef.value);
    urlRef.value = '';
  }
}

function resetResultState() {
  originalInfo.value = null;
  compressedInfo.value = null;
  compressedBlob.value = null;
  revokeUrl(compressedPreviewUrl);
}

function resetOriginalState() {
  originalFile.value = null;
  revokeUrl(originalPreviewUrl);
}

function formatFileSize(size) {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const tempUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
      URL.revokeObjectURL(tempUrl);
    };

    image.onerror = () => {
      reject(new Error('图片读取失败，请重新上传'));
      URL.revokeObjectURL(tempUrl);
    };

    image.src = tempUrl;
  });
}

function validateFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png'];
  const isValidType = allowedTypes.includes(file.type);
  const isValidSize = file.size <= 10 * 1024 * 1024;

  if (!isValidType || !isValidSize) {
    statusToneClass.value = 'is-warning';
    statusMessage.value = '请上传 JPG/PNG 格式且大小不超过 10MB 的图片。';
    ElMessage.error('请上传 JPG/PNG 格式，大小 < 10MB 的图片');
    return false;
  }

  return true;
}

async function compressSelectedFile() {
  if (!originalFile.value) {
    return;
  }

  isCompressing.value = true;
  statusToneClass.value = 'is-warning';
  statusMessage.value = '正在浏览器端压缩图片，请稍候...';

  try {
    const result = await new Promise((resolve, reject) => {
      new Compressor(originalFile.value, {
        quality: quality.value,
        mimeType: originalFile.value.type,
        success: resolve,
        error: reject,
      });
    });

    compressedBlob.value = result;
    appliedQuality.value = quality.value;

    revokeUrl(compressedPreviewUrl);
    compressedPreviewUrl.value = URL.createObjectURL(result);

    const [rawDimensions, compressedDimensions] = await Promise.all([
      getImageDimensions(originalFile.value),
      getImageDimensions(result),
    ]);

    originalInfo.value = {
      ...rawDimensions,
      size: originalFile.value.size,
    };
    compressedInfo.value = {
      ...compressedDimensions,
      size: result.size,
    };

    statusToneClass.value = 'is-success';
    statusMessage.value = `压缩完成，当前质量 ${quality.value.toFixed(2)}，已节省 ${compressionRatio.value}% 空间。`;
  } catch (error) {
    resetResultState();
    statusToneClass.value = 'is-warning';
    statusMessage.value = error?.message || '图片压缩失败，请重新上传后再试。';
    ElMessage.error(error?.message || '图片压缩失败，请重试');
  } finally {
    isCompressing.value = false;
    clearUploadQueue();
  }
}

async function processSelectedFile(file) {
  if (!validateFile(file)) {
    resetOriginalState();
    resetResultState();
    clearUploadQueue();
    return;
  }

  resetResultState();
  originalFile.value = file;
  revokeUrl(originalPreviewUrl);
  originalPreviewUrl.value = URL.createObjectURL(file);
  await compressSelectedFile();
}

async function handleFileChange(uploadFile) {
  const file = uploadFile?.raw;

  if (!file) {
    return;
  }

  await processSelectedFile(file);
  clearUploadQueue();
}

function getDownloadFileName() {
  if (!originalFile.value) {
    return 'compressed-image.jpg';
  }

  const extension = originalFile.value.type === 'image/png' ? 'png' : 'jpg';
  const baseName = originalFile.value.name.replace(/\.[^.]+$/, '');
  return `${baseName}-compressed.${extension}`;
}

function downloadCompressedImage() {
  if (!compressedBlob.value) {
    return;
  }

  downloadBlob(compressedBlob.value, getDownloadFileName());
}

onBeforeUnmount(() => {
  revokeUrl(originalPreviewUrl);
  revokeUrl(compressedPreviewUrl);
});
</script>

<style scoped>
.image-card {
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  padding: var(--panel-padding);
  min-height: 100%;
}

.upload-panel {
  width: 100%;
}

.upload-panel :deep(.el-upload-dragger) {
  width: 100%;
  min-height: 160px;
  border-radius: var(--radius-lg);
  border: 1px dashed var(--border-color);
  background: var(--bg-muted);
  transition:
    border-color var(--transition-base),
    background-color var(--transition-base),
    transform var(--transition-base);
}

.upload-panel :deep(.el-upload-dragger:hover) {
  border-color: var(--brand-primary);
  background: var(--brand-primary-faint);
  transform: translateY(-1px);
}

.upload-panel__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 160px;
}

.upload-panel__icon {
  font-size: 36px;
  color: var(--brand-primary);
}

.upload-panel__title,
.upload-panel__hint {
  margin: 0;
}

.upload-panel__title {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.upload-panel__hint {
  color: var(--text-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.quality-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quality-panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.quality-panel__footer p {
  margin: 0;
}

.image-compare-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.image-info-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100%;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
}

.image-preview {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: contain;
  border-radius: var(--radius-md);
  background: var(--preview-bg);
}

.image-info-card__meta h3,
.image-info-card__meta p {
  margin: 0;
}

.image-info-card__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--text-secondary);
}

.image-info-card__meta h3 {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 24px;
}

.image-info-card__saving {
  color: var(--brand-success);
  font-weight: 600;
}

.download-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 88px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
}

.download-row__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

@media (max-width: 767px) {
  .quality-panel__footer,
  .download-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .image-compare-grid {
    grid-template-columns: 1fr;
  }
}
</style>
