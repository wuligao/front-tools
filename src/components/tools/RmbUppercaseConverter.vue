<template>
  <div class="page-shell">
    <ToolPageHero
      title="人民币大写金额转换"
      description="报销、合同、发票场景常用的人民币大写转换工具，输入数字金额即可得到规范中文大写结果。"
      :chips="['财务高频', '即时转换', '本地处理']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="tool-field">
          <label class="tool-field__label">金额输入</label>
          <el-input v-model="amountInput" placeholder="例如 123456.78" />
        </div>

        <div class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">格式化金额</span>
            <strong class="metric-card__value small-value">{{ formattedAmount }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">金额状态</span>
            <strong class="metric-card__value small-value">{{ validationMessage }}</strong>
          </div>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="tool-output">
          <pre>{{ uppercaseAmount || '请输入合法金额，结果会显示在这里。' }}</pre>
        </div>

        <div class="tool-inline">
          <el-button :disabled="!uppercaseAmount" type="primary" @click="copyText(uppercaseAmount)">复制大写</el-button>
          <el-button :disabled="!uppercaseAmount" @click="downloadTextFile(uppercaseAmount, 'rmb-uppercase.txt')">
            下载结果
          </el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const amountInput = ref('');

const parsedAmount = computed(() => {
  const value = Number(amountInput.value);
  return Number.isFinite(value) ? value : NaN;
});

const formattedAmount = computed(() => (
  Number.isFinite(parsedAmount.value)
    ? new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(parsedAmount.value)
    : '-'
));

const validationMessage = computed(() => (
  Number.isFinite(parsedAmount.value) ? '可转换' : '请输入数字'
));

const uppercaseAmount = computed(() => (
  Number.isFinite(parsedAmount.value) ? numberToChineseCurrency(parsedAmount.value) : ''
));

function numberToChineseCurrency(value) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿', '兆'], ['', '拾', '佰', '仟']];
  let amount = Math.abs(value);
  let result = '';

  fraction.forEach((item, index) => {
    result += (digit[Math.floor(amount * 10 * 10 ** index) % 10] + item).replace(/零./, '');
  });

  result = result || '整';
  amount = Math.floor(amount);

  for (let unitIndex = 0; unitIndex < unit[0].length && amount > 0; unitIndex += 1) {
    let section = '';

    for (let innerIndex = 0; innerIndex < unit[1].length && amount > 0; innerIndex += 1) {
      section = digit[amount % 10] + unit[1][innerIndex] + section;
      amount = Math.floor(amount / 10);
    }

    result = section.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][unitIndex] + result;
  }

  result = result
    .replace(/(零.)*零元/, '零元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');

  return value < 0 ? `负${result}` : result;
}
</script>

<style scoped>
.small-value {
  font-size: 16px;
  line-height: 24px;
}
</style>
