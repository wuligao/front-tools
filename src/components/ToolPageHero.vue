<!-- 工具页面统一头部，提供标题、简介、核心卖点与 Fresh Flat 风格摘要信息。 -->
<template>
  <section class="page-hero surface-card is-minimal">
    <div class="page-hero__content">
      <p class="page-hero__eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p class="page-hero__description">{{ description }}</p>

      <ul class="page-hero__chips" aria-label="工具特性">
        <li v-for="chip in mergedChips" :key="chip">{{ chip }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eyebrow: {
    type: String,
    default: 'Fresh Flat · 纯前端本地处理',
  },
  chips: {
    type: Array,
    default: () => [],
  },
});

const mergedChips = computed(() => {
  const defaultChips = ['数据不上传', '打开即用', '无广告干扰'];
  return props.chips.length ? props.chips : defaultChips;
});
</script>
