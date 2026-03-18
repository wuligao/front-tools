<template>
  <div class="page-shell">
    <ToolPageHero
      title="哈希计算"
      description="支持 MD5、SHA1、SHA256、SHA512 文本与文件哈希值计算，适合校验文件完整性、接口签名和开发联调。"
      :chips="['文本 / 文件', 'MD5 / SHA', '本地校验']"
    />

    <section class="page-grid page-grid--2">
      <article class="surface-card tool-card">
        <div class="tool-inline">
          <div class="tool-field hash-field">
            <label class="tool-field__label">算法</label>
            <el-select v-model="algorithm">
              <el-option label="MD5" value="MD5" />
              <el-option label="SHA1" value="SHA1" />
              <el-option label="SHA256" value="SHA256" />
              <el-option label="SHA512" value="SHA512" />
            </el-select>
          </div>
        </div>

        <el-input
          v-model="textInput"
          type="textarea"
          :rows="10"
          placeholder="请输入要计算哈希的文本..."
        />

        <div class="tool-inline">
          <el-button type="primary" @click="hashText">计算文本哈希</el-button>
          <el-button :disabled="!textHash" @click="copyText(textHash)">复制结果</el-button>
        </div>

        <div class="tool-output">
          <pre>{{ textHash || '文本哈希结果会显示在这里。' }}</pre>
        </div>
      </article>

      <article class="surface-card tool-card">
        <input class="native-file-input" type="file" @change="hashFile" />

        <div v-if="fileName" class="metric-grid">
          <div class="metric-card">
            <span class="metric-card__label">文件名</span>
            <strong class="metric-card__value file-value">{{ fileName }}</strong>
          </div>
          <div class="metric-card">
            <span class="metric-card__label">算法</span>
            <strong class="metric-card__value">{{ algorithm }}</strong>
          </div>
        </div>

        <div class="tool-output">
          <pre>{{ fileHash || '选择文件后，会在这里显示文件哈希。' }}</pre>
        </div>

        <div class="tool-inline">
          <el-button :disabled="!fileHash" type="primary" @click="copyText(fileHash)">复制文件哈希</el-button>
          <el-button :disabled="!fileHash" @click="downloadTextFile(fileHash, 'file-hash.txt')">下载结果</el-button>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const algorithm = ref('SHA256');
const textInput = ref('');
const textHash = ref('');
const fileHash = ref('');
const fileName = ref('');

const hashers = {
  MD5: CryptoJS.MD5,
  SHA1: CryptoJS.SHA1,
  SHA256: CryptoJS.SHA256,
  SHA512: CryptoJS.SHA512,
};

function hashText() {
  textHash.value = textInput.value
    ? hashers[algorithm.value](textInput.value).toString()
    : '';
}

async function hashFile(event) {
  const [file] = event.target.files || [];

  if (!file) {
    return;
  }

  const buffer = await file.arrayBuffer();
  const wordArray = CryptoJS.lib.WordArray.create(buffer);
  fileHash.value = hashers[algorithm.value](wordArray).toString();
  fileName.value = file.name;
}
</script>

<style scoped>
.native-file-input {
  width: 100%;
  padding: 12px;
  border: 1px dashed var(--button-border-soft);
  border-radius: var(--radius-lg);
  background: var(--bg-muted);
  color: var(--text-secondary);
}

.hash-field {
  min-width: 200px;
}

.file-value {
  font-size: 15px;
  line-height: 22px;
}
</style>
