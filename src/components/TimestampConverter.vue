<!-- 时间戳转换工具，支持毫秒/秒与日期时间双向转换、快捷填充和常用格式复制。 -->
<template>
  <div class="page-shell">
    <ToolPageHero
      title="时间戳转换工具"
      description="时间戳与日期时间双向转换，支持毫秒和秒级单位，纯前端本地处理，适合日志排查、接口调试和跨时区沟通。"
      :chips="['秒 / 毫秒', '常用格式复制', '当前时间快捷填充']"
    />

    <section class="surface-card converter-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">1. 时间戳转日期时间</h2>
          <p class="section-subtitle">输入数字后可直接按回车转换，也可以一键获取当前时间戳。</p>
        </div>
      </div>

      <div class="converter-row">
        <el-input
          v-model="timestampInput"
          class="converter-row__input"
          placeholder="请输入时间戳"
          clearable
          aria-label="时间戳输入框"
          @keyup.enter="convertTimestampToDate"
        />
        <el-radio-group v-model="timestampUnit" aria-label="时间戳单位选择">
          <el-radio-button label="ms">毫秒</el-radio-button>
          <el-radio-button label="s">秒</el-radio-button>
        </el-radio-group>
        <el-button type="primary" aria-label="转换时间戳为日期时间" @click="convertTimestampToDate">
          转换
        </el-button>
        <el-button aria-label="获取当前时间戳" @click="fillCurrentTimestamp">
          获取当前时间戳
        </el-button>
      </div>

      <div v-if="timestampError" class="status-banner is-error" role="alert">
        <el-icon><WarningFilled /></el-icon>
        <span>{{ timestampError }}</span>
      </div>

      <div class="result-highlight">
        <div class="result-highlight__meta">
          <span class="section-subtitle">转换结果</span>
          <strong class="result-highlight__value mono-value">{{ timestampResult || '-' }}</strong>
        </div>
        <el-button
          :disabled="!timestampResult"
          aria-label="复制转换后的日期时间"
          @click="copyValue(timestampResult)"
        >
          复制
        </el-button>
      </div>

      <div class="helper-grid">
        <div
          v-for="item in helperFormats"
          :key="item.label"
          class="helper-item"
        >
          <div>
            <p class="helper-item__label">{{ item.label }}</p>
            <strong class="helper-item__value mono-value">{{ item.value || '-' }}</strong>
          </div>
          <el-button text :disabled="!item.value" @click="copyValue(item.value)">复制</el-button>
        </div>
      </div>
    </section>

    <section class="surface-card converter-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">2. 日期时间转时间戳</h2>
          <p class="section-subtitle">选择日期时间后，一次输出毫秒与秒级时间戳，适合前后端联调。</p>
        </div>
      </div>

      <div class="converter-row">
        <el-date-picker
          v-model="dateTimeValue"
          class="converter-row__input"
          type="datetime"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择日期时间"
          aria-label="日期时间选择器"
        />
        <el-button type="primary" aria-label="获取当前日期时间" @click="fillCurrentTime">
          获取当前时间
        </el-button>
        <el-button aria-label="转换日期时间为时间戳" @click="convertDateToTimestamp">
          转换
        </el-button>
      </div>

      <div v-if="dateError" class="status-banner is-error" role="alert">
        <el-icon><WarningFilled /></el-icon>
        <span>{{ dateError }}</span>
      </div>

      <div class="timestamp-grid">
        <article class="timestamp-box">
          <span class="timestamp-box__label">毫秒时间戳</span>
          <strong class="timestamp-box__value mono-value">{{ millisecondTimestamp || '-' }}</strong>
          <el-button
            :disabled="!millisecondTimestamp"
            aria-label="复制毫秒时间戳"
            @click="copyValue(millisecondTimestamp)"
          >
            复制
          </el-button>
        </article>

        <article class="timestamp-box">
          <span class="timestamp-box__label">秒级时间戳</span>
          <strong class="timestamp-box__value mono-value">{{ secondTimestamp || '-' }}</strong>
          <el-button
            :disabled="!secondTimestamp"
            aria-label="复制秒级时间戳"
            @click="copyValue(secondTimestamp)"
          >
            复制
          </el-button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { WarningFilled } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import ToolPageHero from './ToolPageHero.vue';
import { copyText } from '../utils/clipboard';

const timestampInput = ref('');
const timestampUnit = ref('ms');
const timestampResult = ref('');
const convertedTimestampMs = ref(null);
const timestampError = ref('');

const dateTimeValue = ref('');
const millisecondTimestamp = ref('');
const secondTimestamp = ref('');
const dateError = ref('');

const weekdayLabels = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

const helperFormats = computed(() => {
  if (convertedTimestampMs.value === null) {
    return [
      { label: '年月日', value: '' },
      { label: '时分秒', value: '' },
      { label: 'ISO 格式', value: '' },
      { label: '星期', value: '' },
    ];
  }

  const parsed = dayjs(convertedTimestampMs.value);
  return [
    { label: '年月日', value: parsed.format('YYYY-MM-DD') },
    { label: '时分秒', value: parsed.format('HH:mm:ss') },
    { label: 'ISO 格式', value: parsed.format('YYYY-MM-DDTHH:mm:ss') },
    { label: '星期', value: weekdayLabels[parsed.day()] },
  ];
});

function convertTimestampToDate() {
  const rawValue = timestampInput.value.trim();
  timestampError.value = '';

  if (!rawValue || Number.isNaN(Number(rawValue))) {
    timestampResult.value = '';
    convertedTimestampMs.value = null;
    timestampError.value = '请输入有效的数字时间戳';
    return;
  }

  const timestamp = timestampUnit.value === 's'
    ? Number(rawValue) * 1000
    : Number(rawValue);
  const parsedDate = dayjs(timestamp);

  if (!parsedDate.isValid()) {
    timestampResult.value = '';
    convertedTimestampMs.value = null;
    timestampError.value = '请输入有效的时间戳';
    return;
  }

  convertedTimestampMs.value = timestamp;
  timestampResult.value = parsedDate.format('YYYY-MM-DD HH:mm:ss');
}

function fillCurrentTimestamp() {
  const now = dayjs();
  timestampInput.value = timestampUnit.value === 's'
    ? String(now.unix())
    : String(now.valueOf());
  convertTimestampToDate();
}

function fillCurrentTime() {
  dateTimeValue.value = dayjs().format('YYYY-MM-DD HH:mm:ss');
  convertDateToTimestamp();
}

function convertDateToTimestamp() {
  dateError.value = '';

  if (!dateTimeValue.value) {
    millisecondTimestamp.value = '';
    secondTimestamp.value = '';
    dateError.value = '请选择日期时间';
    return;
  }

  const parsedDate = dayjs(dateTimeValue.value);

  if (!parsedDate.isValid()) {
    millisecondTimestamp.value = '';
    secondTimestamp.value = '';
    dateError.value = '请选择有效的日期时间';
    return;
  }

  millisecondTimestamp.value = String(parsedDate.valueOf());
  secondTimestamp.value = String(parsedDate.unix());
}

async function copyValue(value) {
  if (!value) {
    return;
  }

  await copyText(value);
}
</script>

<style scoped>
.converter-card {
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  padding: var(--panel-padding);
  min-height: 100%;
}

.converter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.converter-row__input {
  flex: 1 1 360px;
}

.result-highlight {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 88px;
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
}

.result-highlight__meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.result-highlight__value {
  font-size: 18px;
  line-height: 26px;
  color: var(--text-primary);
}

.helper-grid,
.timestamp-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.helper-item,
.timestamp-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 88px;
  padding: 16px;
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
}

.helper-item__label,
.timestamp-box__label {
  margin: 0 0 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--text-tertiary);
}

.helper-item__value,
.timestamp-box__value {
  color: var(--text-primary);
  font-size: 16px;
  line-height: 24px;
}

.timestamp-box {
  flex-direction: column;
  align-items: flex-start;
}

@media (max-width: 767px) {
  .result-highlight {
    flex-direction: column;
    align-items: flex-start;
  }

  .helper-grid,
  .timestamp-grid {
    grid-template-columns: 1fr;
  }
}
</style>
