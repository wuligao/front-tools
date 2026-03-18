<template>
  <div class="page-shell">
    <ToolPageHero
      title="文本大小写转换"
      description="支持英文大写、小写、标题式、驼峰、蛇形和短横线命名转换，适合开发命名整理和文案加工。"
      :chips="['命名风格转换', '实时输出', '一键复制']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">原始文本</h2>
            <p class="section-subtitle">多个单词之间可用空格、下划线或短横线分隔。</p>
          </div>
        </div>

        <el-input
          v-model="inputText"
          type="textarea"
          :rows="10"
          placeholder="例如 hello world / hello_world / hello-world"
        />
      </article>

      <article class="surface-card tool-card">
        <ul class="result-list">
          <li v-for="item in outputs" :key="item.label" class="result-list__item">
            <div class="result-list__content">
              <span class="result-list__label">{{ item.label }}</span>
              <strong class="result-list__value">{{ item.value }}</strong>
            </div>
            <el-button text :disabled="!item.value" @click="copyText(item.value)">复制</el-button>
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';

const inputText = ref('');

function toWords(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim()
    .split(/[\s_-]+/)
    .filter(Boolean);
}

function capitalize(value) {
  return value ? `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}` : '';
}

const outputs = computed(() => {
  const words = toWords(inputText.value);
  const lowerWords = words.map((word) => word.toLowerCase());

  return [
    { label: '全部大写', value: inputText.value.toUpperCase() },
    { label: '全部小写', value: inputText.value.toLowerCase() },
    { label: '首字母大写', value: words.map(capitalize).join(' ') },
    {
      label: 'camelCase',
      value: lowerWords.length
        ? lowerWords[0] + lowerWords.slice(1).map(capitalize).join('')
        : '',
    },
    { label: 'PascalCase', value: lowerWords.map(capitalize).join('') },
    { label: 'snake_case', value: lowerWords.join('_') },
    { label: 'kebab-case', value: lowerWords.join('-') },
  ];
});
</script>
