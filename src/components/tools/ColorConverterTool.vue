<template>
  <div class="page-shell">
    <ToolPageHero
      title="颜色值转换"
      description="支持 HEX、RGB、RGBA 和 HSL 互转，适合前端开发、UI 联调、设计走查和样式取值。"
      :chips="['HEX / RGB / HSL', '可视化预览', '一键复制']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">输入颜色</h2>
            <p class="section-subtitle">支持 `#RGB`、`#RRGGBB`、`#RRGGBBAA`，也可以直接拖动拾色器。</p>
          </div>
        </div>

        <div class="tool-inline">
          <input v-model="pickerHex" class="color-input" type="color" @input="applyPickerColor" />
          <el-input v-model="hexInput" placeholder="例如 #2563eb 或 #2563ebcc" @change="applyHex" />
        </div>

        <div class="page-grid page-grid--2">
          <div class="tool-field">
            <label class="tool-field__label">R</label>
            <el-slider v-model="red" :max="255" @change="syncFromRgb" />
          </div>
          <div class="tool-field">
            <label class="tool-field__label">G</label>
            <el-slider v-model="green" :max="255" @change="syncFromRgb" />
          </div>
          <div class="tool-field">
            <label class="tool-field__label">B</label>
            <el-slider v-model="blue" :max="255" @change="syncFromRgb" />
          </div>
          <div class="tool-field">
            <label class="tool-field__label">Alpha</label>
            <el-slider v-model="alpha" :max="1" :step="0.01" @change="syncFromRgb" />
          </div>
        </div>

        <div class="preview-box preview-box--color" :style="{ backgroundColor: rgbaValue }">
          <strong>{{ rgbaValue }}</strong>
        </div>

        <div v-if="errorMessage" class="status-banner is-error">
          <el-icon><WarningFilled /></el-icon>
          <span>{{ errorMessage }}</span>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">HEX</span>
            <strong class="metric-card__value small-value">{{ hexValue }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">RGB</span>
            <strong class="metric-card__value small-value">{{ rgbValue }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">RGBA</span>
            <strong class="metric-card__value small-value">{{ rgbaValue }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">HSL</span>
            <strong class="metric-card__value small-value">{{ hslValue }}</strong>
          </div>
        </div>

        <ul class="result-list">
          <li v-for="item in colorOutputs" :key="item.label" class="result-list__item">
            <div class="result-list__content">
              <span class="result-list__label">{{ item.label }}</span>
              <strong class="result-list__value mono-value">{{ item.value }}</strong>
            </div>
            <el-button text @click="copyText(item.value)">复制</el-button>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';

const red = ref(37);
const green = ref(99);
const blue = ref(235);
const alpha = ref(1);
const hexInput = ref('#2563eb');
const pickerHex = ref('#2563eb');
const errorMessage = ref('');

const hexValue = computed(() => {
  const alphaHex = Math.round(alpha.value * 255).toString(16).padStart(2, '0');
  const colorHex = `#${[red.value, green.value, blue.value]
    .map((value) => Math.round(value).toString(16).padStart(2, '0'))
    .join('')}`;

  return alpha.value >= 1 ? colorHex : `${colorHex}${alphaHex}`;
});

const rgbValue = computed(() => `rgb(${red.value}, ${green.value}, ${blue.value})`);
const rgbaValue = computed(() => `rgba(${red.value}, ${green.value}, ${blue.value}, ${alpha.value.toFixed(2)})`);
const hslValue = computed(() => {
  const [hue, saturation, lightness] = rgbToHsl(red.value, green.value, blue.value);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
});

const colorOutputs = computed(() => ([
  { label: 'HEX', value: hexValue.value },
  { label: 'RGB', value: rgbValue.value },
  { label: 'RGBA', value: rgbaValue.value },
  { label: 'HSL', value: hslValue.value },
]));

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHsl(r, g, b) {
  const redRatio = r / 255;
  const greenRatio = g / 255;
  const blueRatio = b / 255;
  const max = Math.max(redRatio, greenRatio, blueRatio);
  const min = Math.min(redRatio, greenRatio, blueRatio);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5
      ? delta / (2 - max - min)
      : delta / (max + min);

    switch (max) {
      case redRatio:
        hue = (greenRatio - blueRatio) / delta + (greenRatio < blueRatio ? 6 : 0);
        break;
      case greenRatio:
        hue = (blueRatio - redRatio) / delta + 2;
        break;
      default:
        hue = (redRatio - greenRatio) / delta + 4;
        break;
    }

    hue /= 6;
  }

  return [
    Math.round(hue * 360),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ];
}

function syncFromRgb() {
  errorMessage.value = '';
  red.value = clampChannel(red.value);
  green.value = clampChannel(green.value);
  blue.value = clampChannel(blue.value);
  pickerHex.value = `#${[red.value, green.value, blue.value]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`;
  hexInput.value = hexValue.value;
}

function applyPickerColor() {
  hexInput.value = pickerHex.value;
  applyHex();
}

function applyHex() {
  const normalized = hexInput.value.trim().replace('#', '');
  const isShort = normalized.length === 3 || normalized.length === 4;
  const isLong = normalized.length === 6 || normalized.length === 8;

  if (!/^[0-9a-fA-F]+$/.test(normalized) || (!isShort && !isLong)) {
    errorMessage.value = '请输入有效的 HEX 颜色，例如 #2563eb 或 #2563ebcc。';
    return;
  }

  const fullValue = isShort
    ? normalized.split('').map((char) => `${char}${char}`).join('')
    : normalized;

  red.value = parseInt(fullValue.slice(0, 2), 16);
  green.value = parseInt(fullValue.slice(2, 4), 16);
  blue.value = parseInt(fullValue.slice(4, 6), 16);
  alpha.value = fullValue.length === 8
    ? Number((parseInt(fullValue.slice(6, 8), 16) / 255).toFixed(2))
    : 1;
  pickerHex.value = `#${fullValue.slice(0, 6)}`;
  errorMessage.value = '';
  hexInput.value = `#${fullValue}`;
}
</script>

<style scoped>
.color-input {
  width: 72px;
  height: 44px;
  padding: 4px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-md);
  background: var(--bg-surface);
}

.preview-box--color strong {
  padding: 10px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  color: #111827;
}

.small-value {
  font-size: 15px;
  line-height: 22px;
}
</style>
