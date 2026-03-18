<template>
  <div class="page-shell">
    <ToolPageHero
      title="图片格式转换"
      description="支持 JPG、PNG、WebP 互转和质量调整，图片仅在本地浏览器中完成转换，更适合运营配图和素材整理。"
      :chips="['JPG / PNG / WebP', '本地转换', '质量调节']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">上传与设置</h2>
            <p class="section-subtitle">转换时会保留当前画布尺寸，适合快速导出目标格式。</p>
          </div>
        </div>

        <input class="native-file-input" type="file" accept="image/*" @change="handleFileChange" />

        <div class="tool-inline">
          <div class="tool-field converter-field">
            <label class="tool-field__label">目标格式</label>
            <el-select v-model="targetFormat">
              <el-option label="PNG" value="image/png" />
              <el-option label="JPEG" value="image/jpeg" />
              <el-option label="WebP" value="image/webp" />
            </el-select>
          </div>
          <div class="tool-field converter-field">
            <label class="tool-field__label">导出质量</label>
            <el-slider v-model="quality" :min="0.1" :max="1" :step="0.05" />
          </div>
        </div>

        <div v-if="sourceMeta.name" class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">原文件</span>
            <strong class="metric-card__value file-value">{{ sourceMeta.name }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">分辨率</span>
            <strong class="metric-card__value">{{ sourceMeta.dimension }}</strong>
          </div>
        </div>

        <div class="tool-inline">
          <el-button type="primary" :disabled="!imageSource" @click="convertImage">开始转换</el-button>
          <el-button :disabled="!convertedUrl" @click="downloadConvertedImage">下载图片</el-button>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="preview-box">
          <img v-if="previewUrl" :src="previewUrl" alt="图片转换预览" />
          <p v-else>上传图片后，这里会显示预览和转换结果。</p>
        </div>

        <div v-if="convertedMeta.size" class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">导出大小</span>
            <strong class="metric-card__value">{{ convertedMeta.size }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">导出格式</span>
            <strong class="metric-card__value">{{ convertedMeta.format }}</strong>
          </div>
        </div>

        <div v-if="statusMessage" class="status-banner is-success">
          <span>{{ statusMessage }}</span>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { downloadBlob } from '../../utils/download';

const targetFormat = ref('image/png');
const quality = ref(0.92);
const imageSource = ref(null);
const previewUrl = ref('');
const convertedUrl = ref('');
const statusMessage = ref('');
const sourceMeta = reactive({
  name: '',
  dimension: '',
});
const convertedMeta = reactive({
  size: '',
  format: '',
});

function handleFileChange(event) {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  imageSource.value = file;
  previewUrl.value = URL.createObjectURL(file);
  convertedUrl.value = '';
  statusMessage.value = '';
  convertedMeta.size = '';
  convertedMeta.format = '';

  const image = new Image();
  image.onload = () => {
    sourceMeta.name = file.name;
    sourceMeta.dimension = `${image.width} × ${image.height}`;
  };
  image.src = previewUrl.value;
}

function convertImage() {
  if (!imageSource.value) {
    return;
  }

  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      if (convertedUrl.value) {
        URL.revokeObjectURL(convertedUrl.value);
      }

      convertedUrl.value = URL.createObjectURL(blob);
      previewUrl.value = convertedUrl.value;
      convertedMeta.size = `${(blob.size / 1024).toFixed(1)} KB`;
      convertedMeta.format = targetFormat.value.replace('image/', '').toUpperCase();
      statusMessage.value = '转换完成，可以直接下载导出的图片。';
    }, targetFormat.value, quality.value);
  };

  image.src = URL.createObjectURL(imageSource.value);
}

function downloadConvertedImage() {
  if (!convertedUrl.value) {
    return;
  }

  fetch(convertedUrl.value)
    .then((response) => response.blob())
    .then((blob) => {
      const extension = targetFormat.value.replace('image/', '');
      downloadBlob(blob, `converted-image.${extension}`);
    });
}
</script>

<style scoped>
.native-file-input {
  width: 100%;
  padding: 12px;
  border: 1px dashed var(--button-border-soft);
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
  color: var(--text-secondary);
}

.converter-field {
  flex: 1 1 220px;
}

.file-value {
  font-size: 15px;
  line-height: 22px;
}
</style>
