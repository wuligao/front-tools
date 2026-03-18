<!-- 密码生成器，支持长度与字符类型配置、强度评估、显示隐藏和实时生成。 -->
<template>
  <div class="page-shell">
    <ToolPageHero
      title="随机密码生成器"
      description="一键生成高安全随机密码，支持长度与字符类型配置，密码仅在浏览器本地生成，不会存储到本地或上传服务器。"
      :chips="['本地生成', '强度评估', '实时更新']"
    />

    <section class="surface-card password-result-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">生成结果</h2>
          <p class="section-subtitle">复制按钮放在最醒目的位置，便于快速粘贴到注册、登录或密钥配置场景。</p>
        </div>
      </div>

      <div class="password-result-card__main">
        <el-input
          :model-value="generatedPassword"
          :type="showPassword ? 'text' : 'password'"
          readonly
          class="password-field code-font"
          aria-label="生成的密码"
        >
          <template #suffix>
            <el-button
              text
              circle
              :aria-label="showPassword ? '隐藏密码' : '显示密码'"
              @click="showPassword = !showPassword"
            >
              <el-icon>
                <View v-if="!showPassword" />
                <Hide v-else />
              </el-icon>
            </el-button>
          </template>
        </el-input>

        <div class="password-result-card__actions">
          <el-button
            type="primary"
            size="large"
            :disabled="!generatedPassword"
            aria-label="复制生成的密码"
            @click="copyPassword"
          >
            复制
          </el-button>
          <el-button
            size="large"
            aria-label="重新生成密码"
            @click="generatePassword"
          >
            重新生成
          </el-button>
        </div>
      </div>

      <div class="strength-panel">
        <div class="strength-panel__header">
          <span class="section-subtitle">密码强度</span>
          <strong :class="['strength-panel__label', `is-${strengthInfo.tone}`]">
            {{ strengthInfo.label }}
          </strong>
        </div>

        <div class="strength-bar" aria-label="密码强度条">
          <span
            v-for="segment in 3"
            :key="segment"
            :class="[
              'strength-bar__segment',
              { 'is-active': segment <= strengthInfo.level },
              `is-${strengthInfo.tone}`,
            ]"
          ></span>
        </div>

        <p class="strength-panel__hint">{{ strengthInfo.description }}</p>
      </div>
    </section>

    <section class="surface-card password-config-card">
      <div class="card-head">
        <div class="card-head__meta">
          <h2 class="section-title">生成配置</h2>
          <p class="section-subtitle">修改任意配置后会实时重新生成密码，至少保持一种字符类型开启。</p>
        </div>
      </div>

      <div class="password-config-card__section">
        <div class="config-title-row">
          <span class="section-title section-title--small">密码长度（8-32位）</span>
          <span class="config-title-row__value">当前长度：{{ passwordLength }} 位</span>
        </div>
        <el-slider
          v-model="passwordLength"
          :min="8"
          :max="32"
          :step="1"
          show-input
          aria-label="密码长度滑块"
        />
      </div>

      <div class="password-config-card__section">
        <span class="section-title section-title--small">字符类型</span>
        <div class="password-options">
          <label v-for="option in optionList" :key="option.key" class="password-option">
            <el-checkbox
              :model-value="optionState[option.key]"
              :aria-label="option.label"
              @change="(value) => toggleOption(option.key, value)"
            >
              {{ option.label }}
            </el-checkbox>
          </label>
        </div>
        <p class="section-subtitle">至少选择一种字符类型，勾选的字符种类越丰富，通常密码安全性越高。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { Hide, View } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import ToolPageHero from './ToolPageHero.vue';
import { copyText } from '../utils/clipboard';

const passwordLength = ref(16);
const generatedPassword = ref('');
const showPassword = ref(true);
const optionState = reactive({
  upper: true,
  lower: true,
  number: true,
  symbol: false,
});

const optionList = [
  { key: 'upper', label: '大写字母（A-Z）' },
  { key: 'lower', label: '小写字母（a-z）' },
  { key: 'number', label: '数字（0-9）' },
  { key: 'symbol', label: '特殊符号（!@#$%^&*）' },
];

const charSets = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const selectedTypes = computed(() => Object.keys(optionState).filter((key) => optionState[key]));

const strengthInfo = computed(() => {
  const typeCount = selectedTypes.value.length;
  let score = 0;

  if (passwordLength.value >= 12) score += 1;
  if (passwordLength.value >= 16) score += 1;
  if (typeCount >= 2) score += 1;
  if (typeCount >= 3) score += 1;
  if (typeCount >= 4) score += 1;

  if (score <= 2) {
    return {
      label: '弱',
      tone: 'danger',
      level: 1,
      description: '建议增加密码长度并至少启用三种字符类型。',
    };
  }

  if (score <= 4) {
    return {
      label: '中',
      tone: 'warning',
      level: 2,
      description: '当前密码适合多数常规场景，若用于关键账号可继续增强。',
    };
  }

  return {
    label: '强',
    tone: 'success',
    level: 3,
    description: '当前密码强度较高，适合用于重要账户或敏感系统。',
  };
});

function getRandomIndex(max) {
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  return randomArray[0] % max;
}

function shuffleCharacters(characters) {
  const list = [...characters];

  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = getRandomIndex(index + 1);
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }

  return list.join('');
}

function generatePassword() {
  const activeTypes = selectedTypes.value;

  if (!activeTypes.length) {
    generatedPassword.value = '';
    return;
  }

  const requiredCharacters = activeTypes.map((type) => {
    const pool = charSets[type];
    return pool[getRandomIndex(pool.length)];
  });

  const fullPool = activeTypes.map((type) => charSets[type]).join('');
  const passwordChars = [...requiredCharacters];

  while (passwordChars.length < passwordLength.value) {
    passwordChars.push(fullPool[getRandomIndex(fullPool.length)]);
  }

  generatedPassword.value = shuffleCharacters(passwordChars);
}

function toggleOption(optionKey, value) {
  const activeCount = selectedTypes.value.length;

  if (!value && activeCount === 1) {
    ElMessage.error('请至少选择一种字符类型');
    return;
  }

  optionState[optionKey] = value;
}

async function copyPassword() {
  await copyText(generatedPassword.value);
}

watch(passwordLength, () => {
  generatePassword();
});

watch(
  () => selectedTypes.value.join(','),
  () => {
    generatePassword();
  }
);

onMounted(() => {
  generatePassword();
});
</script>

<style scoped>
.password-result-card,
.password-config-card {
  display: flex;
  flex-direction: column;
  gap: var(--panel-gap);
  padding: var(--panel-padding);
  min-height: 100%;
}

.password-result-card__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
}

.password-result-card__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.password-field :deep(.el-input__wrapper) {
  min-height: 56px;
}

.password-field :deep(.el-input__inner) {
  font-size: 18px;
  line-height: 26px;
  color: var(--text-primary);
}

.strength-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.strength-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.strength-panel__label.is-danger {
  color: var(--brand-danger);
}

.strength-panel__label.is-warning {
  color: var(--brand-warning);
}

.strength-panel__label.is-success {
  color: var(--brand-success);
}

.strength-bar {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.strength-bar__segment {
  height: 8px;
  border-radius: 999px;
  background: var(--border-soft);
}

.strength-bar__segment.is-active.is-danger {
  background: var(--brand-danger);
}

.strength-bar__segment.is-active.is-warning {
  background: var(--brand-warning);
}

.strength-bar__segment.is-active.is-success {
  background: var(--brand-success);
}

.strength-panel__hint {
  margin: 0;
  color: var(--text-tertiary);
  font-size: 12px;
  line-height: 18px;
}

.password-config-card__section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.config-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.section-title--small {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
}

.config-title-row__value {
  color: var(--brand-primary);
  font-size: 14px;
  line-height: 22px;
  font-weight: 600;
}

.password-options {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.password-option {
  min-height: 56px;
  padding: 12px 16px;
  border: 1px solid var(--border-soft);
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
}

@media (max-width: 767px) {
  .password-result-card__main,
  .password-options {
    grid-template-columns: 1fr;
  }

  .config-title-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
