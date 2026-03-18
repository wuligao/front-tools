<template>
  <div class="page-shell">
    <ToolPageHero
      title="随机数与随机抽签"
      description="支持区间随机数生成和名单随机抽签，适合开会点名、活动摇号、随机分组和日常决策。"
      :chips="['随机数', '名单抽签', '不重复抽取']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">随机数生成</h2>
          </div>
        </div>

        <div class="tool-inline">
          <div class="tool-field number-field">
            <label class="tool-field__label">最小值</label>
            <el-input-number v-model="minNumber" />
          </div>
          <div class="tool-field number-field">
            <label class="tool-field__label">最大值</label>
            <el-input-number v-model="maxNumber" />
          </div>
          <div class="tool-field number-field">
            <label class="tool-field__label">数量</label>
            <el-input-number v-model="numberCount" :min="1" :max="20" />
          </div>
        </div>

        <el-checkbox v-model="numberUnique">结果不重复</el-checkbox>

        <div class="tool-inline">
          <el-button type="primary" @click="generateNumbers">生成随机数</el-button>
          <el-button :disabled="!numberResults.length" @click="copyText(numberResults.join(', '))">复制结果</el-button>
        </div>

        <div class="tool-output">
          <pre>{{ numberResults.join(', ') || '随机数结果会显示在这里。' }}</pre>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="card-head">
          <div class="card-head__meta">
            <h2 class="section-title">名单抽签</h2>
          </div>
        </div>

        <el-input
          v-model="pickerInput"
          type="textarea"
          :rows="10"
          placeholder="每行一个候选项，例如：张三、李四、王五"
        />

        <div class="tool-inline">
          <div class="tool-field number-field">
            <label class="tool-field__label">抽取数量</label>
            <el-input-number v-model="pickCount" :min="1" :max="20" />
          </div>
          <el-checkbox v-model="pickUnique">去重后抽取</el-checkbox>
        </div>

        <div class="tool-inline">
          <el-button type="primary" @click="pickItems">开始抽签</el-button>
          <el-button :disabled="!pickedItems.length" @click="copyText(pickedItems.join('\n'))">复制结果</el-button>
        </div>

        <div class="tool-output">
          <pre>{{ pickedItems.join('\n') || '抽签结果会显示在这里。' }}</pre>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';

const minNumber = ref(1);
const maxNumber = ref(100);
const numberCount = ref(5);
const numberUnique = ref(true);
const numberResults = ref([]);

const pickerInput = ref('');
const pickCount = ref(1);
const pickUnique = ref(true);
const pickedItems = ref([]);

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(list) {
  const cloned = [...list];

  for (let index = cloned.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [cloned[index], cloned[randomIndex]] = [cloned[randomIndex], cloned[index]];
  }

  return cloned;
}

function generateNumbers() {
  const start = Math.min(minNumber.value, maxNumber.value);
  const end = Math.max(minNumber.value, maxNumber.value);

  if (numberUnique.value) {
    const pool = Array.from({ length: end - start + 1 }, (_, index) => start + index);
    numberResults.value = shuffle(pool).slice(0, Math.min(numberCount.value, pool.length));
    return;
  }

  numberResults.value = Array.from({ length: numberCount.value }, () => randomInt(start, end));
}

function pickItems() {
  let items = pickerInput.value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (pickUnique.value) {
    items = [...new Set(items)];
  }

  pickedItems.value = shuffle(items).slice(0, Math.min(pickCount.value, items.length));
}
</script>

<style scoped>
.number-field {
  min-width: 140px;
}
</style>
