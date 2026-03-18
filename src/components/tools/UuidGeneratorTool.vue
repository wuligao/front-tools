<template>
  <div class="page-shell">
    <ToolPageHero
      title="UUID 生成器"
      description="批量生成标准 UUID/GUID，支持去连字符、大写和快速复制，适合建表、测试数据和唯一标识生成。"
      :chips="['批量生成', '浏览器本地', '复制下载']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">生成设置</h2>
            <p class="section-subtitle">默认生成标准 v4 UUID，可按需调整输出格式。</p>
          </div>
        </div>

        <div class="tool-inline">
          <div class="tool-field generator-field">
            <label class="tool-field__label" for="uuid-count">生成数量</label>
            <el-input-number
              id="uuid-count"
              v-model="batchCount"
              :min="1"
              :max="50"
            />
          </div>

          <el-checkbox v-model="removeHyphen">去掉连字符</el-checkbox>
          <el-checkbox v-model="uppercase">转成大写</el-checkbox>
        </div>

        <div class="tool-inline">
          <el-button type="primary" @click="generateBatch">重新生成</el-button>
          <el-button :disabled="!generatedValues.length" @click="copyText(generatedValues.join('\n'))">
            复制全部
          </el-button>
          <el-button :disabled="!generatedValues.length" @click="downloadTextFile(generatedValues.join('\n'), 'uuid-list.txt')">
            下载列表
          </el-button>
        </div>

        <ul class="result-list">
          <li
            v-for="(item, index) in generatedValues"
            :key="item"
            class="result-list__item"
          >
            <div class="result-list__content">
              <span class="result-list__label">第 {{ index + 1 }} 个 UUID</span>
              <strong class="result-list__value mono-value">{{ item }}</strong>
            </div>
            <el-button text @click="copyText(item)">复制</el-button>
          </li>
        </ul>
      </article>

      <article class="surface-card tool-card">
        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">当前批量数</span>
            <strong class="metric-card__value">{{ generatedValues.length }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">输出格式</span>
            <strong class="metric-card__value small-metric">
              {{ removeHyphen ? '紧凑型' : '标准型' }}
            </strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">字符样式</span>
            <strong class="metric-card__value small-metric">
              {{ uppercase ? '大写' : '小写' }}
            </strong>
          </div>
        </div>

        <div class="tool-output">
          <p>使用场景建议：</p>
          <p>1. 数据库主键和唯一标识</p>
          <p>2. 前端 mock 数据和测试账号</p>
          <p>3. 文件名、防重 token 和埋点事件 ID</p>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const batchCount = ref(8);
const removeHyphen = ref(false);
const uppercase = ref(false);
const generatedValues = ref([]);

function createUuid() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function formatUuid(uuid) {
  let result = uuid;

  if (removeHyphen.value) {
    result = result.replaceAll('-', '');
  }

  return uppercase.value ? result.toUpperCase() : result.toLowerCase();
}

function generateBatch() {
  generatedValues.value = Array.from(
    { length: batchCount.value },
    () => formatUuid(createUuid())
  );
}

onMounted(generateBatch);
</script>

<style scoped>
.generator-field {
  min-width: 140px;
}

.small-metric {
  font-size: 16px;
  line-height: 24px;
}
</style>
