<template>
  <div class="page-shell">
    <ToolPageHero
      title="文本字数统计"
      description="快速统计字数、字符数、词数、行数、段落数和阅读时长，适合文案、报告、论文和开发文本场景。"
      :chips="['字数统计', '词数统计', '阅读时长']"
    />

    <section class="surface-card tool-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">输入文本</h2>
          <p class="section-subtitle">支持中英文混排统计，结果会实时更新。</p>
        </div>
      </div>

      <el-input
        v-model="inputText"
        type="textarea"
        :rows="12"
        placeholder="把需要统计的文本粘贴到这里..."
      />

      <div class="metric-grid">
        <div v-for="item in metrics" :key="item.label" class="metric-card">
          <span class="metric-card__label">{{ item.label }}</span>
          <strong class="metric-card__value">{{ item.value }}</strong>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';

const inputText = ref('');

const metrics = computed(() => {
  const value = inputText.value;
  const trimmed = value.trim();
  const nonWhitespace = value.replace(/\s/g, '');
  const lines = value ? value.split(/\r?\n/).length : 0;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
  const words = (value.match(/[A-Za-z0-9_'-]+/g) || []).length;
  const chineseChars = (value.match(/[\u4e00-\u9fff]/g) || []).length;
  const readingMinutes = Math.max(1, Math.ceil((words + chineseChars) / 300));

  return [
    { label: '总字符数', value: value.length },
    { label: '不含空格字符', value: nonWhitespace.length },
    { label: '英文词数', value: words },
    { label: '中文字符数', value: chineseChars },
    { label: '行数', value: lines },
    { label: '段落数', value: paragraphs },
    { label: '预计阅读', value: `${readingMinutes} 分钟` },
  ];
});
</script>
