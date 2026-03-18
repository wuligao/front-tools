<template>
  <div class="page-shell">
    <ToolPageHero
      title="编码转换器"
      description="支持文本输入与文件上传，提供 UTF-8、GBK、GB2312、Latin-1、UTF-16、Big5 等编码之间的本地转换，文件不会上传服务器。"
      :chips="['自动检测', '文件 / 文本', '复制与下载']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">输入与编码设置</h2>
            <p class="section-subtitle">可直接输入文本，或上传常见文本文件进行自动检测与转换。</p>
          </div>
        </div>

        <el-radio-group v-model="inputMode" class="mode-switch" aria-label="输入模式">
          <el-radio-button label="text">文本输入</el-radio-button>
          <el-radio-button label="file">文件上传</el-radio-button>
        </el-radio-group>

        <div
          class="upload-dropzone"
          :class="{ 'is-dragover': isDragOver, 'is-disabled': inputMode !== 'file' }"
          role="button"
          tabindex="0"
          aria-label="拖拽或选择文本文件"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @dragleave.prevent="handleDragLeave"
          @drop.prevent="handleDrop"
        >
          <el-icon class="upload-dropzone__icon"><UploadFilled /></el-icon>
          <div class="upload-dropzone__content">
            <strong>拖拽文件到这里，或点击选择文件</strong>
            <span>支持 TXT / HTML / JSON / CSV / SRT / MD 等常见文本格式，建议不超过 50MB。</span>
          </div>
        </div>

        <input
          ref="fileInputRef"
          class="hidden-file-input"
          type="file"
          :accept="acceptedFileTypes"
          @change="handleFileChange"
        />

        <div class="tool-inline">
          <div class="tool-field encoding-field">
            <label class="tool-field__label">源编码</label>
            <el-select v-model="sourceEncoding" @change="handleSourceEncodingChange">
              <el-option
                v-for="option in sourceEncodingOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>

          <div class="tool-field encoding-field">
            <label class="tool-field__label">目标编码</label>
            <el-select v-model="targetEncoding">
              <el-option
                v-for="option in targetEncodingOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </div>
        </div>

        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">当前模式</span>
            <strong class="metric-card__value metric-card__value--compact">
              {{ inputMode === 'text' ? '文本输入' : '文件上传' }}
            </strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">检测编码</span>
            <strong class="metric-card__value metric-card__value--compact">
              {{ detectedEncodingLabel || '等待检测' }}
            </strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">文件大小</span>
            <strong class="metric-card__value metric-card__value--compact">
              {{ uploadedFile.sizeLabel || '未上传文件' }}
            </strong>
          </div>
        </div>

        <div v-if="statusMessage" class="status-banner is-success">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ statusMessage }}</span>
        </div>
        <div v-else class="status-banner is-warning">
          <el-icon><InfoFilled /></el-icon>
          <span>文件模式下会先读取原始字节，再根据所选源编码或自动检测结果解析内容。</span>
        </div>

        <el-input
          v-model="inputText"
          type="textarea"
          :rows="14"
          resize="vertical"
          placeholder="请输入原始文本，或先上传文件自动填充内容..."
        />

        <div class="tool-inline">
          <el-button type="primary" @click="convertEncoding">开始转换</el-button>
          <el-button text @click="resetAll">清空 / 重置</el-button>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">输出结果</h2>
            <p class="section-subtitle">转换结果仅在当前浏览器中展示与下载，不会上传到任何服务器。</p>
          </div>
        </div>

        <el-input
          :model-value="outputText"
          type="textarea"
          :rows="14"
          resize="vertical"
          readonly
          placeholder="转换结果会显示在这里..."
        />

        <div v-if="warningMessages.length" class="tool-stack">
          <div
            v-for="warning in warningMessages"
            :key="warning"
            class="status-banner is-warning"
          >
            <el-icon><WarningFilled /></el-icon>
            <span>{{ warning }}</span>
          </div>
        </div>
        <div v-else-if="errorMessage" class="status-banner is-error">
          <el-icon><WarningFilled /></el-icon>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-else class="status-banner is-success">
          <el-icon><InfoFilled /></el-icon>
          <span>转换后可以复制结果，或按目标编码下载为文本文件。</span>
        </div>

        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">输出长度</span>
            <strong class="metric-card__value metric-card__value--compact">{{ outputText.length }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">下载编码</span>
            <strong class="metric-card__value metric-card__value--compact">{{ getEncodingLabel(targetEncoding) }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">原文件</span>
            <strong class="metric-card__value metric-card__value--compact">
              {{ uploadedFile.name || '文本输入' }}
            </strong>
          </div>
        </div>

        <div class="tool-inline">
          <el-button :disabled="!outputText" type="primary" @click="copyText(outputText)">复制结果</el-button>
          <el-button :disabled="!outputBytes" @click="downloadConvertedFile">下载文件</el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { Buffer } from 'buffer';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';
import { InfoFilled, UploadFilled, WarningFilled } from '@element-plus/icons-vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadBlob } from '../../utils/download';

if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

const acceptedFileTypes = '.txt,.html,.htm,.json,.csv,.srt,.md,.xml,.yaml,.yml,.log,.ini,.conf,.js,.ts,.vue,.css';
const MAX_DETECTION_BYTES = 128 * 1024;

const sourceEncodingOptions = [
  { label: '自动检测 (Auto Detect)', value: 'auto' },
  { label: 'UTF-8', value: 'utf8' },
  { label: 'GBK', value: 'gbk' },
  { label: 'GB2312', value: 'gb2312' },
  { label: 'ISO-8859-1 (Latin-1)', value: 'latin1' },
  { label: 'UTF-16LE', value: 'utf16le' },
  { label: 'UTF-16BE', value: 'utf16be' },
  { label: 'Big5', value: 'big5' },
];

const targetEncodingOptions = sourceEncodingOptions.filter((option) => option.value !== 'auto');
const encodingLabelMap = Object.fromEntries(sourceEncodingOptions.map((option) => [option.value, option.label]));

const fileInputRef = ref(null);
const inputMode = ref('text');
const sourceEncoding = ref('auto');
const targetEncoding = ref('utf8');
const inputText = ref('');
const outputText = ref('');
const outputBytes = ref(null);
const statusMessage = ref('');
const errorMessage = ref('');
const warningMessages = ref([]);
const isDragOver = ref(false);
const detectedEncoding = ref('');
const detectedConfidence = ref(0);
const uploadedBytes = ref(null);

const uploadedFile = reactive({
  name: '',
  sizeLabel: '',
});

const detectedEncodingLabel = computed(() => {
  if (!detectedEncoding.value) {
    return '';
  }

  const baseLabel = getEncodingLabel(detectedEncoding.value);

  if (!detectedConfidence.value) {
    return baseLabel;
  }

  return `${baseLabel} · ${(detectedConfidence.value * 100).toFixed(0)}%`;
});

function getEncodingLabel(value) {
  return encodingLabelMap[value] || value.toUpperCase();
}

function normalizeEncodingName(value) {
  if (!value) {
    return '';
  }

  const normalized = String(value).toLowerCase().replace(/[^a-z0-9]/g, '');

  const aliasMap = {
    utf8: 'utf8',
    utf: 'utf8',
    ascii: 'utf8',
    gbk: 'gbk',
    gb2312: 'gb2312',
    gb18030: 'gbk',
    cp936: 'gbk',
    ms936: 'gbk',
    big5: 'big5',
    big5hkscs: 'big5',
    latin1: 'latin1',
    iso88591: 'latin1',
    windows1252: 'latin1',
    cp1252: 'latin1',
    utf16: 'utf16le',
    utf16le: 'utf16le',
    utf16littleendian: 'utf16le',
    utf16be: 'utf16be',
    utf16bigendian: 'utf16be',
  };

  return aliasMap[normalized] || '';
}

function formatFileSize(bytes) {
  if (!bytes) {
    return '';
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function detectBomEncoding(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
    return { encoding: 'utf8', confidence: 1, fromBom: true };
  }

  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return { encoding: 'utf16le', confidence: 1, fromBom: true };
  }

  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return { encoding: 'utf16be', confidence: 1, fromBom: true };
  }

  return null;
}

function bytesToBinaryString(bytes) {
  let result = '';

  for (let index = 0; index < bytes.length; index += 0x8000) {
    result += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }

  return result;
}

function detectSourceEncoding(bytes) {
  const bomMatch = detectBomEncoding(bytes);

  if (bomMatch) {
    return bomMatch;
  }

  const sample = bytes.subarray(0, Math.min(bytes.length, MAX_DETECTION_BYTES));
  const detection = jschardet.detect(bytesToBinaryString(sample));
  const normalizedEncoding = normalizeEncodingName(detection.encoding);

  if (normalizedEncoding) {
    return {
      encoding: normalizedEncoding,
      confidence: Number(detection.confidence || 0),
      fromBom: false,
    };
  }

  return {
    encoding: 'utf8',
    confidence: Number(detection.confidence || 0),
    fromBom: false,
  };
}

function decodeBytes(bytes, encoding) {
  if (encoding === 'utf16le') {
    return new TextDecoder('utf-16le').decode(bytes);
  }

  if (encoding === 'utf16be') {
    return new TextDecoder('utf-16be').decode(bytes);
  }

  return iconv.decode(Buffer.from(bytes), encoding);
}

function encodeString(value, encoding) {
  if (encoding === 'utf16le') {
    const output = new Uint8Array(value.length * 2);

    for (let index = 0; index < value.length; index += 1) {
      const code = value.charCodeAt(index);
      output[index * 2] = code & 0xff;
      output[index * 2 + 1] = code >> 8;
    }

    return output;
  }

  if (encoding === 'utf16be') {
    const output = new Uint8Array(value.length * 2);

    for (let index = 0; index < value.length; index += 1) {
      const code = value.charCodeAt(index);
      output[index * 2] = code >> 8;
      output[index * 2 + 1] = code & 0xff;
    }

    return output;
  }

  return Uint8Array.from(iconv.encode(value, encoding));
}

function buildWarnings({ sourceText, convertedText, sourceWasAuto }) {
  const nextWarnings = [];

  if (sourceWasAuto && detectedConfidence.value > 0 && detectedConfidence.value < 0.8) {
    nextWarnings.push(`自动检测置信度较低（${(detectedConfidence.value * 100).toFixed(0)}%），如结果异常请手动切换源编码。`);
  }

  if (sourceText !== convertedText) {
    nextWarnings.push('目标编码无法完整表示全部字符，部分内容可能已被替换或降级。');
  }

  if (convertedText.includes('\ufffd')) {
    nextWarnings.push('结果中出现了替代字符（�），源编码可能不正确。');
  }

  warningMessages.value = nextWarnings;
}

function clearMessages() {
  statusMessage.value = '';
  errorMessage.value = '';
  warningMessages.value = [];
}

function openFilePicker() {
  if (inputMode.value !== 'file') {
    inputMode.value = 'file';
  }

  fileInputRef.value?.click?.();
}

function handleDragEnter() {
  inputMode.value = 'file';
  isDragOver.value = true;
}

function handleDragOver() {
  inputMode.value = 'file';
  isDragOver.value = true;
}

function handleDragLeave() {
  isDragOver.value = false;
}

function handleDrop(event) {
  isDragOver.value = false;
  inputMode.value = 'file';
  const [file] = event.dataTransfer?.files || [];

  if (file) {
    loadFile(file);
  }
}

function handleFileChange(event) {
  const [file] = event.target.files || [];

  if (file) {
    loadFile(file);
  }

  event.target.value = '';
}

function handleSourceEncodingChange() {
  if (inputMode.value === 'file' && uploadedBytes.value) {
    previewUploadedFile();
  }
}

function previewUploadedFile() {
  if (!uploadedBytes.value) {
    return;
  }

  clearMessages();

  try {
    const shouldAutoDetect = sourceEncoding.value === 'auto';
    const sourceInfo = shouldAutoDetect
      ? detectSourceEncoding(uploadedBytes.value)
      : { encoding: sourceEncoding.value, confidence: 1, fromBom: false };

    detectedEncoding.value = sourceInfo.encoding;
    detectedConfidence.value = sourceInfo.confidence;
    inputText.value = decodeBytes(uploadedBytes.value, sourceInfo.encoding);
    statusMessage.value = shouldAutoDetect
      ? `已读取文件，并按 ${getEncodingLabel(sourceInfo.encoding)} 自动解析内容。`
      : `已读取文件，并按 ${getEncodingLabel(sourceInfo.encoding)} 解析内容。`;

    if (inputText.value.includes('\ufffd')) {
      warningMessages.value = ['文件内容中出现了替代字符（�），建议尝试手动切换源编码。'];
    }
  } catch (error) {
    inputText.value = '';
    errorMessage.value = '文件读取成功，但按当前源编码解析失败，请切换其他编码重试。';
  }
}

function loadFile(file) {
  clearMessages();

  const reader = new FileReader();

  reader.onload = () => {
    const bytes = new Uint8Array(reader.result || new ArrayBuffer(0));
    uploadedBytes.value = bytes;
    uploadedFile.name = file.name;
    uploadedFile.sizeLabel = formatFileSize(file.size);
    previewUploadedFile();
  };

  reader.onerror = () => {
    errorMessage.value = '文件读取失败，请重新选择文件。';
  };

  reader.readAsArrayBuffer(file);
}

function convertEncoding() {
  clearMessages();

  let sourceText = inputText.value;
  let sourceWasAuto = false;

  if (inputMode.value === 'file') {
    if (!uploadedBytes.value) {
      errorMessage.value = '请先上传文本文件后再开始转换。';
      return;
    }

    const sourceInfo = sourceEncoding.value === 'auto'
      ? detectSourceEncoding(uploadedBytes.value)
      : { encoding: sourceEncoding.value, confidence: 1, fromBom: false };

    detectedEncoding.value = sourceInfo.encoding;
    detectedConfidence.value = sourceInfo.confidence;
    sourceWasAuto = sourceEncoding.value === 'auto';

    try {
      sourceText = decodeBytes(uploadedBytes.value, sourceInfo.encoding);
      inputText.value = sourceText;
    } catch (error) {
      errorMessage.value = '源文件按当前编码解析失败，请更换源编码后再试。';
      return;
    }
  } else if (!sourceText) {
    errorMessage.value = '请输入要转换的文本内容。';
    return;
  }

  try {
    const encodedBytes = encodeString(sourceText, targetEncoding.value);
    const convertedText = decodeBytes(encodedBytes, targetEncoding.value);

    outputBytes.value = encodedBytes;
    outputText.value = convertedText;
    statusMessage.value = `转换完成，当前结果已按 ${getEncodingLabel(targetEncoding.value)} 生成。`;
    buildWarnings({
      sourceText,
      convertedText,
      sourceWasAuto,
    });
  } catch (error) {
    outputText.value = '';
    outputBytes.value = null;
    errorMessage.value = '转换失败，当前内容可能不适合目标编码，请切换编码后重试。';
  }
}

function getDownloadFilename() {
  const suffix = targetEncoding.value.toLowerCase();

  if (!uploadedFile.name) {
    return `encoding-converted-${suffix}.txt`;
  }

  const dotIndex = uploadedFile.name.lastIndexOf('.');
  const basename = dotIndex > 0 ? uploadedFile.name.slice(0, dotIndex) : uploadedFile.name;
  return `${basename}_${suffix}.txt`;
}

function downloadConvertedFile() {
  if (!outputBytes.value) {
    return;
  }

  const blob = new Blob([outputBytes.value], { type: 'text/plain;charset=binary' });
  downloadBlob(blob, getDownloadFilename());
}

function resetAll() {
  inputMode.value = 'text';
  sourceEncoding.value = 'auto';
  targetEncoding.value = 'utf8';
  inputText.value = '';
  outputText.value = '';
  outputBytes.value = null;
  detectedEncoding.value = '';
  detectedConfidence.value = 0;
  uploadedBytes.value = null;
  uploadedFile.name = '';
  uploadedFile.sizeLabel = '';
  isDragOver.value = false;
  clearMessages();
}
</script>

<style scoped>
.mode-switch {
  width: fit-content;
}

.upload-dropzone {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px dashed rgba(37, 99, 235, 0.24);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(255, 255, 255, 0.82));
  cursor: pointer;
  transition:
    border-color var(--transition-base),
    background-color var(--transition-base),
    transform var(--transition-fast);
}

.upload-dropzone:hover,
.upload-dropzone.is-dragover {
  border-color: rgba(37, 99, 235, 0.5);
  background:
    linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(255, 255, 255, 0.92));
}

.upload-dropzone.is-disabled {
  opacity: 0.84;
}

.upload-dropzone__icon {
  flex: 0 0 auto;
  font-size: 26px;
  color: var(--brand-primary);
}

.upload-dropzone__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.upload-dropzone__content strong {
  font-size: 14px;
  line-height: 20px;
  color: var(--text-primary);
}

.upload-dropzone__content span {
  font-size: 12px;
  line-height: 18px;
  color: var(--text-tertiary);
}

.hidden-file-input {
  display: none;
}

.encoding-field {
  flex: 1 1 220px;
}

.metric-card__value--compact {
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
}

@media (max-width: 767px) {
  .upload-dropzone {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
