<template>
  <div class="page-shell">
    <ToolPageHero
      title="常用单位换算"
      description="覆盖长度、重量、温度、面积、时间、速度和存储单位，一处输入即可看到所有常用换算结果。"
      :chips="['多类别换算', '实时结果', '复制即用']"
    />

    <section class="surface-card tool-card">
      <div class="tool-inline">
        <div class="tool-field unit-field">
          <label class="tool-field__label">分类</label>
          <el-select v-model="categoryKey">
            <el-option
              v-for="item in categoryEntries"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </div>
        <div class="tool-field unit-field">
          <label class="tool-field__label">输入单位</label>
          <el-select v-model="fromUnit">
            <el-option
              v-for="item in currentCategory.units"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="tool-field unit-field">
          <label class="tool-field__label">数值</label>
          <el-input v-model="inputValue" placeholder="请输入数字" />
        </div>
      </div>

      <div class="metric-grid">
        <div v-for="item in results" :key="item.label" class="metric-card">
          <span class="metric-card__label">{{ item.label }}</span>
          <strong class="metric-card__value unit-value">{{ item.value }}</strong>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';

const categories = {
  length: {
    label: '长度',
    units: [
      { value: 'm', label: '米', toBase: (v) => v, fromBase: (v) => v },
      { value: 'km', label: '千米', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { value: 'cm', label: '厘米', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { value: 'mm', label: '毫米', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    ],
  },
  weight: {
    label: '重量',
    units: [
      { value: 'kg', label: '千克', toBase: (v) => v, fromBase: (v) => v },
      { value: 'g', label: '克', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { value: 'jin', label: '斤', toBase: (v) => v / 2, fromBase: (v) => v * 2 },
      { value: 'lb', label: '磅', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    ],
  },
  temperature: {
    label: '温度',
    units: [
      { value: 'c', label: '摄氏度', toBase: (v) => v, fromBase: (v) => v },
      { value: 'f', label: '华氏度', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { value: 'k', label: '开尔文', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  storage: {
    label: '存储',
    units: [
      { value: 'b', label: 'B', toBase: (v) => v, fromBase: (v) => v },
      { value: 'kb', label: 'KB', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { value: 'mb', label: 'MB', toBase: (v) => v * 1024 * 1024, fromBase: (v) => v / (1024 * 1024) },
      { value: 'gb', label: 'GB', toBase: (v) => v * 1024 * 1024 * 1024, fromBase: (v) => v / (1024 * 1024 * 1024) },
    ],
  },
  speed: {
    label: '速度',
    units: [
      { value: 'mps', label: '米/秒', toBase: (v) => v, fromBase: (v) => v },
      { value: 'kmh', label: '千米/时', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
      { value: 'mph', label: '英里/时', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    ],
  },
  area: {
    label: '面积',
    units: [
      { value: 'sqm', label: '平方米', toBase: (v) => v, fromBase: (v) => v },
      { value: 'sqkm', label: '平方千米', toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
      { value: 'mu', label: '亩', toBase: (v) => v * 666.6667, fromBase: (v) => v / 666.6667 },
    ],
  },
  time: {
    label: '时间',
    units: [
      { value: 's', label: '秒', toBase: (v) => v, fromBase: (v) => v },
      { value: 'min', label: '分钟', toBase: (v) => v * 60, fromBase: (v) => v / 60 },
      { value: 'h', label: '小时', toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
      { value: 'day', label: '天', toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    ],
  },
};

const categoryKey = ref('length');
const fromUnit = ref('m');
const inputValue = ref('1');

const categoryEntries = computed(() => Object.entries(categories).map(([key, value]) => ({
  key,
  label: value.label,
})));
const currentCategory = computed(() => categories[categoryKey.value]);

const results = computed(() => {
  const numericValue = Number(inputValue.value);

  if (!Number.isFinite(numericValue)) {
    return currentCategory.value.units.map((item) => ({
      label: item.label,
      value: '-',
    }));
  }

  const selectedUnit = currentCategory.value.units.find((item) => item.value === fromUnit.value);
  const baseValue = selectedUnit.toBase(numericValue);

  return currentCategory.value.units.map((item) => ({
    label: item.label,
    value: formatNumber(item.fromBase(baseValue)),
  }));
});

watch(categoryKey, () => {
  fromUnit.value = currentCategory.value.units[0].value;
  inputValue.value = '1';
});

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return '-';
  }

  return Math.abs(value) >= 1000 || Math.abs(value) < 0.01
    ? value.toExponential(4)
    : Number(value.toFixed(6)).toString();
}
</script>

<style scoped>
.unit-field {
  flex: 1 1 220px;
}

.unit-value {
  font-size: 16px;
  line-height: 24px;
}
</style>
