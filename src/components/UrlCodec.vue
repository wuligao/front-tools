<!-- URL 编解码工具，支持手动与自动转换、状态提示和结果复制。 -->
<template>
  <div class="page-shell">
    <ToolPageHero
      title="URL编解码工具"
      description="在线 URL 编码与解码工具，支持特殊字符处理与自动转换，纯前端本地运行，输入内容不会上传服务器。"
      :chips="['编码 / 解码', '自动转换', '结果只读复制']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card codec-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">输入内容</h2>
            <p class="section-subtitle">自动转换开启后，会按当前模式实时处理输入内容。</p>
          </div>

          <div class="card-head__actions">
            <el-button text aria-label="清空输入和结果" @click="clearAll">清空</el-button>
          </div>
        </div>

        <el-input
          v-model="inputValue"
          type="textarea"
          :rows="12"
          resize="vertical"
          placeholder="请输入需要编码或解码的内容"
          aria-label="URL 输入文本框"
          @input="handleInputChange"
        />

        <div class="codec-card__footer">
          <div class="codec-card__actions">
            <el-button type="primary" aria-label="执行 URL 编码" @click="encodeText">编码</el-button>
            <el-button aria-label="执行 URL 解码" @click="decodeText">解码</el-button>
          </div>

          <div class="codec-switch">
            <span>自动转换</span>
            <el-switch
              v-model="autoTransform"
              aria-label="开启自动转换"
              @change="handleAutoTransformChange"
            />
            <span class="section-subtitle">当前模式：{{ transformModeLabel }}</span>
          </div>
        </div>

        <div
          v-if="errorMessage"
          class="status-banner is-error"
          role="alert"
        >
          <el-icon><WarningFilled /></el-icon>
          <span>{{ errorMessage }}</span>
        </div>
        <div v-else class="status-banner is-warning">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ statusMessage }}</span>
        </div>
      </article>

      <article class="surface-card codec-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">转换结果</h2>
            <p class="section-subtitle">结果区为只读，避免误修改，适合快速复制粘贴。</p>
          </div>

          <div class="card-head__actions">
            <el-button
              text
              :disabled="!resultValue"
              aria-label="复制转换结果"
              @click="copyResult"
            >
              复制结果
            </el-button>
          </div>
        </div>

        <el-input
          v-model="resultValue"
          type="textarea"
          :rows="12"
          resize="none"
          readonly
          placeholder="转换结果会显示在这里"
          aria-label="URL 转换结果文本框"
        />

        <div
          v-if="resultValue"
          class="status-banner is-success"
        >
          <el-icon><SuccessFilled /></el-icon>
          <span>转换完成，可直接复制结果继续使用。</span>
        </div>
        <div v-else class="status-banner is-warning">
          <el-icon><InfoFilled /></el-icon>
          <span>支持编码特殊字符、解码已有参数串，适合联调和埋点排查。</span>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { InfoFilled, SuccessFilled, WarningFilled } from '@element-plus/icons-vue';
import ToolPageHero from './ToolPageHero.vue';
import { copyText } from '../utils/clipboard';

const inputValue = ref('');
const resultValue = ref('');
const autoTransform = ref(false);
const transformMode = ref('encode');
const errorMessage = ref('');
const statusMessage = ref('可选择手动编码或解码，自动转换默认跟随当前模式。');

const transformModeLabel = computed(() => (transformMode.value === 'encode' ? '编码' : '解码'));

function applyTransform(mode, silent = false) {
  transformMode.value = mode;
  errorMessage.value = '';

  if (!inputValue.value) {
    resultValue.value = '';
    statusMessage.value = '请输入需要处理的 URL 内容。';
    return;
  }

  try {
    resultValue.value = mode === 'encode'
      ? encodeURIComponent(inputValue.value)
      : decodeURIComponent(inputValue.value);
    statusMessage.value = mode === 'encode'
      ? '已按当前内容完成 URL 编码。'
      : '已按当前内容完成 URL 解码。';
  } catch (error) {
    resultValue.value = '';
    errorMessage.value = 'URL 解码失败，请检查输入内容是否为有效的编码字符串';
    if (!silent) {
      statusMessage.value = '请修正输入内容后重新解码。';
    }
  }
}

function handleInputChange() {
  if (autoTransform.value) {
    applyTransform(transformMode.value, true);
  }
}

function handleAutoTransformChange(value) {
  if (value) {
    applyTransform(transformMode.value, true);
  }
}

function encodeText() {
  applyTransform('encode');
}

function decodeText() {
  applyTransform('decode');
}

function clearAll() {
  inputValue.value = '';
  resultValue.value = '';
  errorMessage.value = '';
  statusMessage.value = '输入和结果已清空，可重新开始转换。';
}

async function copyResult() {
  if (!resultValue.value) {
    return;
  }

  await copyText(resultValue.value);
}
</script>

<style scoped>
.codec-card {
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  padding: var(--panel-padding);
  min-height: 100%;
}

.codec-card__footer {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.codec-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.codec-switch {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .codec-card__footer,
  .codec-switch {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
