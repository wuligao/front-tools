<template>
  <div class="page-shell">
    <ToolPageHero
      title="在线便签记事本"
      description="浏览器本地自动保存的轻量便签，不依赖账号和后端，适合临时记录会议要点、待办和代码片段。"
      :chips="['localStorage', '自动保存', '复制导出']"
    />

    <section class="surface-card tool-card">
      <div class="tool-field">
        <label class="tool-field__label">便签标题</label>
        <el-input v-model="noteTitle" placeholder="例如：今天的待办 / 会议纪要" />
      </div>

      <div class="tool-field">
        <label class="tool-field__label">便签内容</label>
        <el-input
          v-model="noteContent"
          type="textarea"
          :rows="16"
          placeholder="内容会自动保存在当前浏览器中..."
        />
      </div>

      <div class="tool-inline">
        <el-button :disabled="!fullNote" type="primary" @click="copyText(fullNote)">复制便签</el-button>
        <el-button :disabled="!fullNote" @click="downloadTextFile(fullNote, 'local-note.txt')">导出文本</el-button>
        <el-button text @click="clearNote">清空便签</el-button>
      </div>

      <div class="status-banner is-success">
        <span>已自动保存到浏览器本地{{ savedAt ? `，最近保存于 ${savedAt}` : '' }}。</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import dayjs from 'dayjs';
import ToolPageHero from '../ToolPageHero.vue';
import { copyText } from '../../utils/clipboard';
import { downloadTextFile } from '../../utils/download';

const storageKey = 'minimal-tools-local-note';
const noteTitle = ref('');
const noteContent = ref('');
const savedAt = ref('');

const fullNote = computed(() => [noteTitle.value, noteContent.value].filter(Boolean).join('\n\n'));

function persistNote() {
  const payload = {
    title: noteTitle.value,
    content: noteContent.value,
    savedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };

  localStorage.setItem(storageKey, JSON.stringify(payload));
  savedAt.value = payload.savedAt;
}

function clearNote() {
  noteTitle.value = '';
  noteContent.value = '';
  persistNote();
}

watch([noteTitle, noteContent], persistNote);

onMounted(() => {
  const rawValue = localStorage.getItem(storageKey);

  if (!rawValue) {
    return;
  }

  try {
    const parsed = JSON.parse(rawValue);
    noteTitle.value = parsed.title || '';
    noteContent.value = parsed.content || '';
    savedAt.value = parsed.savedAt || '';
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
});
</script>
