<template>
  <div class="page-shell">
    <ToolPageHero
      title="二维码生成器"
      description="输入链接、文本、联系方式或备注信息即可生成二维码，适合分享资料、收集信息和线下展示。"
      :chips="['本地生成', '可调尺寸', '支持下载']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <el-input
          v-model="content"
          type="textarea"
          :rows="10"
          placeholder="请输入链接、文本、联系方式或任意内容..."
        />

        <div class="tool-inline">
          <div class="tool-field qr-field">
            <label class="tool-field__label">尺寸</label>
            <el-slider v-model="size" :min="160" :max="480" :step="20" />
          </div>
          <div class="tool-field qr-field">
            <label class="tool-field__label">纠错级别</label>
            <el-select v-model="errorCorrectionLevel">
              <el-option label="L" value="L" />
              <el-option label="M" value="M" />
              <el-option label="Q" value="Q" />
              <el-option label="H" value="H" />
            </el-select>
          </div>
        </div>

        <div class="tool-inline">
          <el-button type="primary" @click="generateCode">生成二维码</el-button>
          <el-button :disabled="!qrCodeUrl" @click="downloadCode">下载图片</el-button>
        </div>
      </article>

      <article class="surface-card tool-card">
        <div class="preview-box">
          <img v-if="qrCodeUrl" :src="qrCodeUrl" alt="二维码预览" />
          <p v-else>输入内容后点击生成二维码。</p>
        </div>

        <div v-if="statusMessage" class="status-banner is-success">
          <span>{{ statusMessage }}</span>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';
import ToolPageHero from '../ToolPageHero.vue';

const content = ref('https://example.com');
const size = ref(240);
const errorCorrectionLevel = ref('M');
const qrCodeUrl = ref('');
const statusMessage = ref('');

async function generateCode() {
  if (!content.value.trim()) {
    qrCodeUrl.value = '';
    statusMessage.value = '';
    return;
  }

  qrCodeUrl.value = await QRCode.toDataURL(content.value, {
    errorCorrectionLevel: errorCorrectionLevel.value,
    width: size.value,
    margin: 1,
  });
  statusMessage.value = '二维码已生成，可直接保存为 PNG 图片。';
}

function downloadCode() {
  if (!qrCodeUrl.value) {
    return;
  }

  const anchor = document.createElement('a');
  anchor.href = qrCodeUrl.value;
  anchor.download = 'qrcode.png';
  anchor.click();
}

generateCode();
</script>

<style scoped>
.qr-field {
  flex: 1 1 220px;
}
</style>
