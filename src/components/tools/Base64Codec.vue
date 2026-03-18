<template>
  <div class="page-shell">
    <ToolPageHero
      title="Base64 编解码"
      description="支持文本 Base64 编码解码，以及图片文件转 Base64 Data URL，全部在浏览器本地完成，适合接口调试、前端开发和文档排版。"
      :chips="['文本 / 图片', '本地转换', '复制与下载']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">文本编解码</h2>
            <p class="section-subtitle">支持 UTF-8 文本，适合中文、Emoji 和接口字段调试。</p>
          </div>
        </div>

        <el-input
          v-model="textInput"
          type="textarea"
          :rows="10"
          placeholder="请输入原始文本或 Base64 字符串..."
        />

        <div class="tool-inline">
          <el-button type="primary" @click="encodeText">编码为 Base64</el-button>
          <el-button @click="decodeText">解码为文本</el-button>
          <el-button :disabled="!textOutput" @click="copyText(textOutput)">复制结果</el-button>
          <el-button :disabled="!textOutput" @click="downloadTextFile(textOutput, 'base64-result.txt')">
            下载结果
          </el-button>
          <el-button text @click="clearText">清空</el-button>
        </div>

        <div v-if="textError" class="status-banner is-error">
          <el-icon><WarningFilled /></el-icon>
          <span>{{ textError }}</span>
        </div>
        <div v-else class="status-banner is-warning">
          <el-icon><InfoFilled /></el-icon>
          <span>解码时会自动去除空格和换行，便于处理多行 Base64 内容。</span>
        </div>

        <div class="tool-output">
          <pre>{{ textOutput || '结果会显示在这里。' }}</pre>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">图片转 Base64</h2>
            <p class="section-subtitle">上传本地图片后直接生成 Data URL，可复制或下载文本。</p>
          </div>
        </div>

        <input
          class="native-file-input"
          type="file"
          accept="image/*"
          @change="handleImageUpload"
        />

        <div v-if="fileMeta.name" class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">文件名</span>
            <strong class="metric-card__value file-value">{{ fileMeta.name }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">文件大小</span>
            <strong class="metric-card__value">{{ fileMeta.size }}</strong>
          </div>
        </div>

        <div v-if="imageDataUrl" class="preview-box">
          <img :src="imageDataUrl" alt="Base64 预览图" />
        </div>
        <div v-else class="tool-output">
          <p>选择图片后可在这里预览，并生成可复制的 Base64 Data URL。</p>
        </div>

        <div class="tool-inline">
          <el-button :disabled="!imageDataUrl" type="primary" @click="copyText(imageDataUrl)">
            复制 Base64
          </el-button>
          <el-button :disabled="!imageDataUrl" @click="downloadTextFile(imageDataUrl, 'image-base64.txt')">
            下载文本
          </el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { InfoFilled, WarningFilled } from '@element-plus/icons-vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const textInput = ref('');
const textOutput = ref('');
const textError = ref('');
const imageDataUrl = ref('');
const fileMeta = reactive({
  name: '',
  size: '',
});

function encodeUtf8ToBase64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = '';

  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return btoa(binary);
}

function decodeBase64ToUtf8(value) {
  const normalized = value.replace(/\s+/g, '');
  const binary = atob(normalized);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeText() {
  textError.value = '';

  if (!textInput.value) {
    textOutput.value = '';
    return;
  }

  textOutput.value = encodeUtf8ToBase64(textInput.value);
}

function decodeText() {
  textError.value = '';

  if (!textInput.value.trim()) {
    textOutput.value = '';
    return;
  }

  try {
    textOutput.value = decodeBase64ToUtf8(textInput.value);
  } catch (error) {
    textOutput.value = '';
    textError.value = 'Base64 内容无效，请检查输入是否完整。';
  }
}

function clearText() {
  textInput.value = '';
  textOutput.value = '';
  textError.value = '';
}

function handleImageUpload(event) {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    imageDataUrl.value = String(reader.result || '');
    fileMeta.name = file.name;
    fileMeta.size = `${(file.size / 1024).toFixed(1)} KB`;
  };

  reader.readAsDataURL(file);
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

.file-value {
  font-size: 15px;
  line-height: 22px;
}
</style>
