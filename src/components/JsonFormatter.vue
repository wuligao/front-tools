<!-- JSON 格式化与校验工具，提供本地格式化、压缩、下载、复制和快捷键支持。 -->
<template>
  <div class="page-shell">
    <ToolPageHero
      title="JSON格式化/校验"
      description="在线 JSON 格式化、校验、美化与压缩工具，纯前端本地处理，数据不上传服务器，适合开发调试与接口排查。"
      :chips="['JSON 校验', '本地美化', '下载结果']"
    />

    <section class="page-grid page-grid--2" aria-label="JSON 工具操作区">
      <article class="surface-card editor-card">
        <div class="editor-card__header">
          <div class="card-head__meta">
            <h2 class="section-title">输入内容</h2>
            <p class="section-subtitle">支持快捷键：Ctrl/Command + S 格式化，Ctrl/Command + D 清空</p>
          </div>

          <div class="card-head__actions">
            <el-button text aria-label="清空 JSON 输入内容" @click="clearAll">
              <el-icon><Delete /></el-icon>
              清空
            </el-button>
          </div>
        </div>

        <div class="code-editor" :class="{ 'is-error': Boolean(errorLine) }">
          <div ref="inputGutterRef" class="code-editor__gutter" aria-hidden="true">
            <span
              v-for="line in inputLineNumbers"
              :key="`input-${line}`"
              :class="{ 'is-active': line === errorLine }"
            >
              {{ line }}
            </span>
          </div>

          <textarea
            ref="inputTextareaRef"
            v-model="inputJson"
            class="code-editor__textarea code-font"
            data-code="true"
            spellcheck="false"
            placeholder="请输入要格式化的 JSON 字符串..."
            aria-label="JSON 输入编辑区"
            @scroll="syncInputScroll"
          ></textarea>
        </div>

        <div class="editor-card__footer">
          <div class="editor-card__actions">
            <el-button type="primary" aria-label="格式化 JSON" @click="formatJson">格式化</el-button>
            <el-button aria-label="压缩 JSON" @click="compressJson">压缩</el-button>
          </div>

          <div v-if="errorMessage" class="status-banner is-error" role="alert">
            <el-icon><WarningFilled /></el-icon>
            <span>{{ errorMessage }}</span>
          </div>
          <div v-else class="status-banner is-warning">
            <el-icon><InfoFilled /></el-icon>
            <span>所有内容仅在浏览器端处理，适合本地调试敏感 JSON 数据。</span>
          </div>
        </div>
      </article>

      <article class="surface-card editor-card">
        <div class="editor-card__header">
          <div class="card-head__meta">
            <h2 class="section-title">格式化结果</h2>
            <p class="section-subtitle">结果区支持复制、下载与全屏预览，方便继续调试或分享。</p>
          </div>

          <div class="card-head__actions">
            <el-button
              text
              :disabled="!resultText"
              aria-label="复制格式化结果"
              @click="copyResult"
            >
              <el-icon><CopyDocument /></el-icon>
              复制
            </el-button>
            <el-button
              text
              :disabled="!resultText"
              aria-label="下载格式化结果"
              @click="downloadResult"
            >
              <el-icon><Download /></el-icon>
              下载
            </el-button>
            <el-button
              text
              :disabled="!resultText"
              aria-label="全屏查看格式化结果"
              @click="isPreviewDialogVisible = true"
            >
              <el-icon><FullScreen /></el-icon>
              全屏
            </el-button>
            <el-button text disabled>转 YAML</el-button>
            <el-button text disabled>折叠/展开</el-button>
          </div>
        </div>

        <div
          ref="resultPanelRef"
          class="code-viewer result-panel"
          aria-live="polite"
          @scroll="syncResultScroll"
        >
          <div ref="resultGutterRef" class="code-viewer__gutter" aria-hidden="true">
            <span v-for="line in resultLineNumbers" :key="`result-${line}`">{{ line }}</span>
          </div>

          <div class="code-viewer__content">
            <p v-if="!resultText" class="code-viewer__placeholder">
              格式化结果会显示在这里，支持高亮查看与一键复制。
            </p>
            <pre
              v-else
              class="code-viewer__pre hljs"
              v-html="highlightedHtml"
            ></pre>
          </div>
        </div>

        <div class="editor-card__footer">
          <div
            v-if="resultText"
            class="status-banner is-success"
          >
            <el-icon><SuccessFilled /></el-icon>
            <span>{{ resultStatusMessage }}</span>
          </div>
          <div v-else class="status-banner is-warning">
            <el-icon><InfoFilled /></el-icon>
            <span>可继续扩展 JSON 转 YAML/XML、去除转义等辅助能力。</span>
          </div>
        </div>
      </article>
    </section>

    <el-dialog
      v-model="isPreviewDialogVisible"
      title="格式化结果预览"
      width="80%"
      destroy-on-close
    >
      <div class="dialog-preview result-panel">
        <div class="code-viewer__gutter" aria-hidden="true">
          <span v-for="line in resultLineNumbers" :key="`dialog-${line}`">{{ line }}</span>
        </div>
        <div class="code-viewer__content">
          <pre class="code-viewer__pre hljs" v-html="highlightedHtml"></pre>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import {
  CopyDocument,
  Delete,
  Download,
  FullScreen,
  InfoFilled,
  SuccessFilled,
  WarningFilled,
} from '@element-plus/icons-vue';
import hljs from 'highlight.js/lib/core';
import jsonLanguage from 'highlight.js/lib/languages/json';
import ToolPageHero from './ToolPageHero.vue';
import jsonlint from '../utils/jsonlintBrowser';
import { copyText } from '../utils/clipboard';
import { downloadTextFile } from '../utils/download';

hljs.registerLanguage('json', jsonLanguage);

const inputJson = ref('');
const resultText = ref('');
const highlightedHtml = ref('');
const errorMessage = ref('');
const errorLine = ref(0);
const resultStatusMessage = ref('等待输入 JSON 内容');
const inputTextareaRef = ref(null);
const inputGutterRef = ref(null);
const resultPanelRef = ref(null);
const resultGutterRef = ref(null);
const isPreviewDialogVisible = ref(false);

const inputLineNumbers = computed(() => {
  const lineCount = Math.max(15, inputJson.value.split('\n').length || 1);
  return Array.from({ length: lineCount }, (_, index) => index + 1);
});

const resultLineNumbers = computed(() => {
  const lineCount = Math.max(15, resultText.value ? resultText.value.split('\n').length : 1);
  return Array.from({ length: lineCount }, (_, index) => index + 1);
});

function parseErrorLine(message) {
  const matched = message.match(/line\s+(\d+)/i);
  return matched ? Number(matched[1]) : 0;
}

function getErrorMessage(error) {
  return (error?.message || String(error)).replace(/\s+/g, ' ').trim();
}

function renderResult(content, actionLabel) {
  resultText.value = content;
  highlightedHtml.value = hljs.highlight(content, {
    language: 'json',
  }).value;
  errorMessage.value = '';
  errorLine.value = 0;

  const lineCount = content.split('\n').length;
  resultStatusMessage.value = actionLabel === 'compress'
    ? '压缩完成，当前为单行 JSON 结果'
    : `格式化完成，共 ${lineCount} 行`;
}

function parseInput() {
  if (!inputJson.value.trim()) {
    throw new Error('请输入 JSON 内容后再执行格式化或压缩');
  }

  jsonlint.parse(inputJson.value);
  return JSON.parse(inputJson.value);
}

function handleParseError(error) {
  resultText.value = '';
  highlightedHtml.value = '';
  errorMessage.value = getErrorMessage(error);
  errorLine.value = parseErrorLine(errorMessage.value);
  resultStatusMessage.value = 'JSON 校验未通过';
}

function formatJson() {
  try {
    const parsed = parseInput();
    renderResult(JSON.stringify(parsed, null, 2), 'format');
  } catch (error) {
    handleParseError(error);
  }
}

function compressJson() {
  try {
    const parsed = parseInput();
    renderResult(JSON.stringify(parsed), 'compress');
  } catch (error) {
    handleParseError(error);
  }
}

function clearAll() {
  inputJson.value = '';
  resultText.value = '';
  highlightedHtml.value = '';
  errorMessage.value = '';
  errorLine.value = 0;
  resultStatusMessage.value = '等待输入 JSON 内容';
}

async function copyResult() {
  if (!resultText.value) {
    return;
  }

  await copyText(resultText.value);
}

function downloadResult() {
  if (!resultText.value) {
    return;
  }

  downloadTextFile(resultText.value, 'formatted-result.json', 'application/json;charset=utf-8');
}

function syncInputScroll(event) {
  if (inputGutterRef.value) {
    inputGutterRef.value.scrollTop = event.target.scrollTop;
  }
}

function syncResultScroll() {
  if (resultGutterRef.value && resultPanelRef.value) {
    resultGutterRef.value.scrollTop = resultPanelRef.value.scrollTop;
  }
}

function handleKeyboardShortcut(event) {
  const hasModifier = event.ctrlKey || event.metaKey;

  if (!hasModifier) {
    return;
  }

  if (event.key.toLowerCase() === 's') {
    event.preventDefault();
    formatJson();
  }

  if (event.key.toLowerCase() === 'd') {
    event.preventDefault();
    clearAll();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyboardShortcut);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyboardShortcut);
});
</script>

<style scoped>
.editor-card {
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  padding: var(--panel-padding);
  min-height: 0;
}

.editor-card__header,
.editor-card__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.editor-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.code-editor,
.code-viewer,
.dialog-preview {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  min-height: 420px;
  overflow: hidden;
}

.code-editor {
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
}

.code-editor.is-error {
  border-color: var(--code-error-border);
  box-shadow: inset 0 0 0 1px var(--code-error-shadow);
}

.code-editor__gutter,
.code-viewer__gutter {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0;
  padding: 12px 8px 12px 12px;
  overflow: hidden;
  border-right: 1px solid var(--border-soft);
  background: var(--code-gutter-bg);
  color: var(--text-tertiary);
  user-select: none;
}

.code-editor__gutter span,
.code-viewer__gutter span {
  display: block;
  min-height: 22px;
  font-size: 12px;
  line-height: 22px;
}

.code-editor__gutter span.is-active {
  color: var(--brand-danger);
  font-weight: 700;
}

.code-editor__textarea {
  width: 100%;
  min-height: 420px;
  padding: 12px 16px;
  border: 0;
  resize: none;
  outline: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 22px;
}

.code-viewer {
  overflow: auto;
}

.code-viewer__content {
  min-width: 0;
  padding: 12px 16px;
}

.code-viewer__pre {
  min-height: 100%;
  margin: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 22px;
  white-space: pre;
}

.code-viewer__placeholder {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 14px;
  line-height: 22px;
}

@media (max-width: 767px) {
  .code-editor,
  .code-viewer,
  .dialog-preview {
    min-height: 360px;
  }
}
</style>
