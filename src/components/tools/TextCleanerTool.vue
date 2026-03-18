<template>
  <div class="page-shell">
    <ToolPageHero
      title="文本清洗"
      description="一键去掉重复行、空行、多余空格，并支持换行转分隔符，适合名单整理、数据清洗和批量文本处理。"
      :chips="['去重', '去空行', '分隔符替换']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">原始文本</h2>
            <p class="section-subtitle">支持多行输入，可组合多个规则一起处理。</p>
          </div>
        </div>

        <el-input
          v-model="inputText"
          type="textarea"
          :rows="12"
          placeholder="请粘贴待清洗的文本..."
        />

        <div class="tool-stack">
          <el-checkbox v-model="options.trimLines">移除每行首尾空格</el-checkbox>
          <el-checkbox v-model="options.removeBlankLines">删除空白行</el-checkbox>
          <el-checkbox v-model="options.uniqueLines">按行去重并保留顺序</el-checkbox>
          <el-checkbox v-model="options.collapseSpaces">合并连续空格为一个空格</el-checkbox>
        </div>

        <div class="tool-inline">
          <el-button type="primary" @click="lineSeparator = '\n'">保留换行</el-button>
          <el-button @click="lineSeparator = ', '">换行转逗号</el-button>
          <el-button @click="lineSeparator = ' | '">换行转竖线</el-button>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">原始行数</span>
            <strong class="metric-card__value">{{ originalLineCount }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">结果行数</span>
            <strong class="metric-card__value">{{ cleanedLineCount }}</strong>
          </div>
        </div>

        <div class="tool-output">
          <pre>{{ cleanedText || '清洗结果会显示在这里。' }}</pre>
        </div>

        <div class="tool-inline">
          <el-button :disabled="!cleanedText" type="primary" @click="copyText(cleanedText)">复制结果</el-button>
          <el-button :disabled="!cleanedText" @click="downloadTextFile(cleanedText, 'cleaned-text.txt')">
            下载结果
          </el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const inputText = ref('');
const lineSeparator = ref('\n');
const options = reactive({
  trimLines: true,
  removeBlankLines: false,
  uniqueLines: false,
  collapseSpaces: false,
});

const cleanedLines = computed(() => {
  let lines = inputText.value.split(/\r?\n/);

  if (options.trimLines) {
    lines = lines.map((line) => line.trim());
  }

  if (options.collapseSpaces) {
    lines = lines.map((line) => line.replace(/\s+/g, ' ').trim());
  }

  if (options.removeBlankLines) {
    lines = lines.filter((line) => line.trim());
  }

  if (options.uniqueLines) {
    const seen = new Set();
    lines = lines.filter((line) => {
      if (seen.has(line)) {
        return false;
      }

      seen.add(line);
      return true;
    });
  }

  return lines;
});

const cleanedText = computed(() => cleanedLines.value.join(lineSeparator.value));
const originalLineCount = computed(() => (inputText.value ? inputText.value.split(/\r?\n/).length : 0));
const cleanedLineCount = computed(() => (cleanedText.value ? cleanedLines.value.length : 0));
</script>
