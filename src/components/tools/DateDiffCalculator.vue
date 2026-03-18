<template>
  <div class="page-shell">
    <ToolPageHero
      title="日期差与工作日计算"
      description="计算两个日期之间的间隔天数、含首尾天数、工作日和周数，适合项目排期、请假和倒计时场景。"
      :chips="['自然日', '工作日', '周数换算']"
    />

    <section class="surface-card tool-card">
      <div class="tool-inline">
        <div class="tool-field date-field">
          <label class="tool-field__label">开始日期</label>
          <el-date-picker v-model="startDate" type="date" value-format="YYYY-MM-DD" />
        </div>
        <div class="tool-field date-field">
          <label class="tool-field__label">结束日期</label>
          <el-date-picker v-model="endDate" type="date" value-format="YYYY-MM-DD" />
        </div>
        <el-button @click="swapDates">交换日期</el-button>
      </div>

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
import dayjs from 'dayjs';
import ToolPageHero from '../ToolPageHero.vue';

const today = dayjs();
const startDate = ref(today.format('YYYY-MM-DD'));
const endDate = ref(today.add(7, 'day').format('YYYY-MM-DD'));

const orderedDates = computed(() => {
  const start = dayjs(startDate.value);
  const end = dayjs(endDate.value);
  return start.isAfter(end) ? [end, start] : [start, end];
});

const metrics = computed(() => {
  const [start, end] = orderedDates.value;
  const diffDays = end.diff(start, 'day');
  const inclusiveDays = diffDays + 1;
  const workdays = countWorkdays(start, end);
  const weeks = (inclusiveDays / 7).toFixed(1);
  const months = end.diff(start, 'month', true).toFixed(1);

  return [
    { label: '间隔天数', value: `${diffDays} 天` },
    { label: '含首尾天数', value: `${inclusiveDays} 天` },
    { label: '工作日', value: `${workdays} 天` },
    { label: '折算周数', value: `${weeks} 周` },
    { label: '约合月数', value: `${months} 月` },
  ];
});

function countWorkdays(start, end) {
  let count = 0;
  let current = start.startOf('day');
  const last = end.startOf('day');

  while (current.isBefore(last) || current.isSame(last, 'day')) {
    const dayOfWeek = current.day();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count += 1;
    }

    current = current.add(1, 'day');
  }

  return count;
}

function swapDates() {
  const temp = startDate.value;
  startDate.value = endDate.value;
  endDate.value = temp;
}
</script>

<style scoped>
.date-field {
  min-width: 220px;
}
</style>
