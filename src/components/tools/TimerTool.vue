<template>
  <div class="page-shell">
    <ToolPageHero
      title="在线倒计时与秒表"
      description="支持浏览器端倒计时和秒表计时，适合会议控制、演讲排练、番茄钟和日常专注任务。"
      :chips="['倒计时', '秒表', '无需登录']"
    />

    <section class="surface-card tool-card">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="倒计时" name="countdown">
          <div class="tool-inline">
            <div class="tool-field timer-field">
              <label class="tool-field__label">分钟</label>
              <el-input-number v-model="countdownMinutes" :min="0" :max="180" />
            </div>
            <div class="tool-field timer-field">
              <label class="tool-field__label">秒</label>
              <el-input-number v-model="countdownSeconds" :min="0" :max="59" />
            </div>
          </div>

          <div class="timer-display">{{ countdownDisplay }}</div>

          <div class="tool-inline">
            <el-button type="primary" @click="startCountdown">开始</el-button>
            <el-button @click="pauseCountdown">暂停</el-button>
            <el-button @click="resetCountdown">重置</el-button>
          </div>
        </el-tab-pane>

        <el-tab-pane label="秒表" name="stopwatch">
          <div class="timer-display">{{ stopwatchDisplay }}</div>

          <div class="tool-inline">
            <el-button type="primary" @click="startStopwatch">开始</el-button>
            <el-button @click="pauseStopwatch">暂停</el-button>
            <el-button @click="resetStopwatch">重置</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import ToolPageHero from '../ToolPageHero.vue';

const activeTab = ref('countdown');
const countdownMinutes = ref(5);
const countdownSeconds = ref(0);
const countdownRemaining = ref(300);
const stopwatchElapsed = ref(0);

let countdownTimerId = null;
let stopwatchTimerId = null;
let countdownTarget = 0;
let stopwatchStart = 0;
let stopwatchBase = 0;

const countdownDisplay = computed(() => formatDuration(countdownRemaining.value * 1000));
const stopwatchDisplay = computed(() => formatDuration(stopwatchElapsed.value));

function formatDuration(milliseconds) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  const fraction = String(Math.floor((milliseconds % 1000) / 10)).padStart(2, '0');
  return `${minutes}:${seconds}.${fraction}`;
}

function beep() {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.frequency.value = 880;
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.3);
  oscillator.stop(context.currentTime + 0.3);
}

function startCountdown() {
  pauseCountdown();
  countdownRemaining.value = countdownRemaining.value || countdownMinutes.value * 60 + countdownSeconds.value;

  if (!countdownRemaining.value) {
    countdownRemaining.value = countdownMinutes.value * 60 + countdownSeconds.value;
  }

  countdownTarget = Date.now() + countdownRemaining.value * 1000;
  countdownTimerId = window.setInterval(() => {
    countdownRemaining.value = Math.max(0, Math.ceil((countdownTarget - Date.now()) / 1000));

    if (countdownRemaining.value === 0) {
      pauseCountdown();
      beep();
    }
  }, 200);
}

function pauseCountdown() {
  if (countdownTimerId) {
    window.clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
}

function resetCountdown() {
  pauseCountdown();
  countdownRemaining.value = countdownMinutes.value * 60 + countdownSeconds.value;
}

function startStopwatch() {
  pauseStopwatch();
  stopwatchStart = Date.now();
  stopwatchTimerId = window.setInterval(() => {
    stopwatchElapsed.value = stopwatchBase + Date.now() - stopwatchStart;
  }, 30);
}

function pauseStopwatch() {
  if (stopwatchTimerId) {
    window.clearInterval(stopwatchTimerId);
    stopwatchTimerId = null;
    stopwatchBase = stopwatchElapsed.value;
  }
}

function resetStopwatch() {
  pauseStopwatch();
  stopwatchBase = 0;
  stopwatchElapsed.value = 0;
}

resetCountdown();

onBeforeUnmount(() => {
  pauseCountdown();
  pauseStopwatch();
});
</script>

<style scoped>
.timer-field {
  min-width: 140px;
}

.timer-display {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 140px;
  border-radius: var(--radius-xl);
  background: var(--bg-muted);
  border: 1px solid var(--border-soft);
  font-size: clamp(36px, 6vw, 64px);
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.06em;
  font-family: var(--font-mono);
}
</style>
