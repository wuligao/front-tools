<template>
  <div class="page-shell">
    <ToolPageHero
      title="HTML 实体编解码"
      description="支持特殊字符、富文本片段和 HTML 实体互转，适合内容转义、XSS 排查和开发调试。"
      :chips="['实体编码', '反向解码', '本地处理']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">输入内容</h2>
            <p class="section-subtitle">既可以输入普通文本，也可以输入已转义的 HTML 实体字符串。</p>
          </div>
        </div>

        <el-input
          v-model="inputText"
          type="textarea"
          :rows="12"
          placeholder="请输入要编码或解码的内容..."
        />

        <div class="tool-inline">
          <el-button type="primary" @click="encodeText">编码</el-button>
          <el-button @click="decodeText">解码</el-button>
          <el-button text @click="inputText = ''">清空</el-button>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">输入长度</span>
            <strong class="metric-card__value">{{ inputText.length }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">结果长度</span>
            <strong class="metric-card__value">{{ outputText.length }}</strong>
          </div>
        </div>

        <div class="tool-output">
          <pre>{{ outputText || '编码或解码结果会显示在这里。' }}</pre>
        </div>

        <div class="tool-inline">
          <el-button :disabled="!outputText" type="primary" @click="copyText(outputText)">复制结果</el-button>
          <el-button :disabled="!outputText" @click="downloadTextFile(outputText, 'html-entity-result.txt')">
            下载结果
          </el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const inputText = ref('');
const outputText = ref('');

function encodeText() {
  const element = document.createElement('div');
  element.textContent = inputText.value;
  outputText.value = element.innerHTML;
}

function decodeText() {
  const element = document.createElement('textarea');
  element.innerHTML = inputText.value;
  outputText.value = element.value;
}
</script>
