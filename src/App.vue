<template>
  <div class="app-shell">
    <header class="site-header">
      <div class="site-header__left">
        <el-button
          class="nav-trigger"
          text
          aria-label="打开工具菜单"
          @click="mobileSidebarVisible = true"
        >
          <el-icon><Menu /></el-icon>
        </el-button>

        <router-link class="brand-link" to="/json-formatter" aria-label="返回极简工具站首页">
          <span class="brand-link__icon" aria-hidden="true">
            <el-icon><Tools /></el-icon>
          </span>
          <span class="brand-link__content">
            <strong>极简工具站</strong>
            <span>纯前端在线工具 | 数据不上传，安全无广告</span>
          </span>
        </router-link>
      </div>

      <nav class="top-nav" aria-label="顶部主导航">
        <router-link
          v-for="group in directTopNavGroups"
          :key="group.title"
          :to="getGroupRoute(group)"
          class="top-nav__item"
          :class="{ 'is-active': activeGroupTitle === group.title }"
          :aria-label="`进入${group.title}`"
        >
          {{ shortGroupLabel(group.title) }}
        </router-link>

        <el-dropdown
          v-if="overflowTopNavGroups.length"
          trigger="hover"
          popper-class="top-nav-dropdown"
        >
          <button type="button" class="top-nav__item top-nav__item--button" aria-label="更多分类">
            更多
            <el-icon><ArrowDown /></el-icon>
          </button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="group in overflowTopNavGroups"
                :key="`${group.title}-overflow`"
                @click="navigateTo(getGroupRoute(group))"
              >
                {{ group.title }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </nav>

      <div class="site-header__right">
        <el-input
          ref="searchInputRef"
          v-model="searchKeyword"
          class="search-box"
          placeholder="搜索工具、场景或关键词..."
          clearable
          aria-label="搜索工具"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
          <template #suffix>
            <span class="search-shortcut" aria-hidden="true">Ctrl K</span>
          </template>
        </el-input>

        <div class="theme-switcher" :aria-label="`当前为${themeLabel}`">
          <el-icon aria-hidden="true">
            <Sunny v-if="!isDark" />
            <Moon v-else />
          </el-icon>
          <el-switch
            :model-value="isDark"
            aria-label="切换明暗主题"
            @change="toggleTheme"
          />
        </div>

        <el-tooltip content="GitHub 仓库">
          <el-button
            text
            circle
            aria-label="打开 GitHub 仓库"
            @click="openExternalLink(externalLinks.github)"
          >
            <el-icon><Link /></el-icon>
          </el-button>
        </el-tooltip>

        <el-tooltip content="Gitee 仓库">
          <el-button
            text
            circle
            aria-label="打开 Gitee 仓库"
            @click="openExternalLink(externalLinks.gitee)"
          >
            <el-icon><Share /></el-icon>
          </el-button>
        </el-tooltip>

        <el-button
          text
          aria-label="发送反馈"
          @click="openExternalLink(externalLinks.feedback)"
        >
          反馈
        </el-button>
      </div>
    </header>

    <aside class="site-aside" aria-label="工具导航">
      <nav class="site-nav">
        <div class="nav-toolbar">
          <el-button text @click="collapseToActiveGroup">当前分类</el-button>
          <el-button text :disabled="isSearching" @click="toggleAllGroups">
            {{ allVisibleGroupsExpanded ? '收起全部' : '展开全部' }}
          </el-button>
        </div>

        <section
          v-for="group in filteredToolGroups"
          :key="group.title"
          class="nav-group"
          :class="{ 'is-expanded': isGroupExpanded(group.title) }"
        >
          <button
            type="button"
            class="nav-group__header nav-group__toggle"
            :aria-expanded="isGroupExpanded(group.title)"
            @click="toggleGroup(group.title)"
          >
            <div class="nav-group__header-main">
              <el-icon class="nav-group__arrow" aria-hidden="true">
                <ArrowDown v-if="isGroupExpanded(group.title)" />
                <ArrowRight v-else />
              </el-icon>
              <h2 class="nav-group__title">{{ group.title }}</h2>
            </div>
            <span class="nav-group__count">{{ group.items.length }}</span>
          </button>

          <div v-if="group.items.length && isGroupExpanded(group.title)" class="nav-group__items">
            <router-link
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'is-active': route.path === item.path }"
            >
              <span class="nav-item__indicator" aria-hidden="true"></span>
              <el-icon class="nav-item__icon" aria-hidden="true">
                <component :is="iconMap[item.icon]" />
              </el-icon>
              <span>{{ item.label }}</span>
            </router-link>
          </div>
        </section>

        <p v-if="!filteredToolGroups.length" class="nav-empty">
          没找到匹配工具，试试搜索“JSON”“二维码”“单位换算”等关键词。
        </p>
      </nav>

      <section class="aside-note surface-card" aria-label="站点特性">
        <p class="aside-note__title">本地优先</p>
        <p class="aside-note__text">
          已收录 {{ totalToolCount }} 个工具，全部在浏览器内完成处理，更适合开发调试和职场高频小任务。
        </p>
      </section>
    </aside>

    <el-drawer
      v-model="mobileSidebarVisible"
      direction="rtl"
      size="280px"
      :with-header="true"
      class="mobile-drawer"
      title="工具导航"
    >
      <nav class="site-nav site-nav--drawer" aria-label="移动端工具导航">
        <div class="nav-toolbar">
          <el-button text @click="collapseToActiveGroup">当前分类</el-button>
          <el-button text :disabled="isSearching" @click="toggleAllGroups">
            {{ allVisibleGroupsExpanded ? '收起全部' : '展开全部' }}
          </el-button>
        </div>

        <section
          v-for="group in filteredToolGroups"
          :key="`${group.title}-mobile`"
          class="nav-group"
          :class="{ 'is-expanded': isGroupExpanded(group.title) }"
        >
          <button
            type="button"
            class="nav-group__header nav-group__toggle"
            :aria-expanded="isGroupExpanded(group.title)"
            @click="toggleGroup(group.title)"
          >
            <div class="nav-group__header-main">
              <el-icon class="nav-group__arrow" aria-hidden="true">
                <ArrowDown v-if="isGroupExpanded(group.title)" />
                <ArrowRight v-else />
              </el-icon>
              <h2 class="nav-group__title">{{ group.title }}</h2>
            </div>
            <span class="nav-group__count">{{ group.items.length }}</span>
          </button>

          <div v-if="group.items.length && isGroupExpanded(group.title)" class="nav-group__items">
            <router-link
              v-for="item in group.items"
              :key="item.path"
              :to="item.path"
              class="nav-item"
              :class="{ 'is-active': route.path === item.path }"
              @click="mobileSidebarVisible = false"
            >
              <span class="nav-item__indicator" aria-hidden="true"></span>
              <el-icon class="nav-item__icon" aria-hidden="true">
                <component :is="iconMap[item.icon]" />
              </el-icon>
              <span>{{ item.label }}</span>
            </router-link>
          </div>
        </section>

        <p v-if="!filteredToolGroups.length" class="nav-empty">
          没找到匹配工具，换个关键词试试看。
        </p>
      </nav>
    </el-drawer>

    <main class="site-main">
      <router-view v-slot="{ Component }">
        <transition name="route-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>

      <footer class="site-footer" aria-label="站点版权信息">
        <p>Copyright © 2026 浮尘. All rights reserved.</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowDown,
  ArrowRight,
  Calendar,
  CollectionTag,
  Clock,
  Coin,
  DataAnalysis,
  Document,
  DocumentCopy,
  EditPen,
  Files,
  Key,
  Link,
  MagicStick,
  Management,
  Menu,
  Memo,
  Moon,
  Operation,
  Picture,
  PictureFilled,
  Postcard,
  Search,
  Share,
  Sunny,
  Tickets,
  Timer,
  Tools,
} from '@element-plus/icons-vue';
import { toolGroups } from './config/tools';
import { useTheme } from './composables/useTheme';

const route = useRoute();
const router = useRouter();
const mobileSidebarVisible = ref(false);
const searchKeyword = ref('');
const expandedGroups = ref([]);
const searchInputRef = ref(null);
const viewportWidth = ref(typeof window === 'undefined' ? 1440 : window.innerWidth);
const { isDark, themeLabel, toggleTheme } = useTheme();
const isSearching = computed(() => Boolean(searchKeyword.value.trim()));
const isDesktop = computed(() => viewportWidth.value > 767);
const directTopNavGroups = computed(() => toolGroups.slice(0, 4));
const overflowTopNavGroups = computed(() => toolGroups.slice(4));

const topNavLabelMap = {
  '程序员核心开发工具': '开发',
  '通用文本处理工具': '文本',
  '图片/文件处理工具': '图片',
  '职场效率工具': '效率',
};

const activeGroupTitle = computed(() => (
  toolGroups.find((group) => group.items.some((item) => item.path === route.path))?.title || toolGroups[0]?.title || ''
));

const filteredToolGroups = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();

  if (!keyword) {
    return toolGroups;
  }

  return toolGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => {
        const searchSource = [
          item.label,
          item.title,
          item.description,
          item.keywords,
        ].join(' ').toLowerCase();

        return searchSource.includes(keyword);
      }),
    }))
    .filter((group) => group.items.length);
});

const totalToolCount = computed(() => toolGroups.reduce((sum, group) => sum + group.items.length, 0));

function getVisibleGroupTitles() {
  return filteredToolGroups.value.map((group) => group.title);
}

function isGroupExpanded(title) {
  if (isSearching.value) {
    return true;
  }

  return expandedGroups.value.includes(title);
}

const allVisibleGroupsExpanded = computed(() => {
  const titles = getVisibleGroupTitles();

  if (!titles.length || isSearching.value) {
    return false;
  }

  return titles.every((title) => expandedGroups.value.includes(title));
});

function expandAllGroups() {
  expandedGroups.value = getVisibleGroupTitles();
}

function collapseAllGroups() {
  expandedGroups.value = [];
}

function toggleAllGroups() {
  if (allVisibleGroupsExpanded.value) {
    collapseAllGroups();
    return;
  }

  expandAllGroups();
}

function collapseToActiveGroup() {
  const titles = getVisibleGroupTitles();

  if (!titles.length) {
    expandedGroups.value = [];
    return;
  }

  expandedGroups.value = titles.includes(activeGroupTitle.value)
    ? [activeGroupTitle.value]
    : [titles[0]];
}

function getGroupRoute(group) {
  return group.items[0]?.path || '/';
}

function shortGroupLabel(title) {
  return topNavLabelMap[title] || title;
}

function toggleGroup(title) {
  if (isSearching.value) {
    return;
  }

  if (expandedGroups.value.includes(title)) {
    expandedGroups.value = expandedGroups.value.filter((item) => item !== title);
    return;
  }

  expandedGroups.value = [...expandedGroups.value, title];
}

const iconMap = {
  ArrowDown,
  ArrowRight,
  Calendar,
  CollectionTag,
  Clock,
  Coin,
  DataAnalysis,
  Document,
  DocumentCopy,
  EditPen,
  Files,
  Key,
  Link,
  MagicStick,
  Management,
  Memo,
  Operation,
  Picture,
  PictureFilled,
  Postcard,
  Tickets,
  Timer,
};

const externalLinks = {
  github: 'https://github.com/',
  gitee: 'https://gitee.com/',
  feedback: 'mailto:feedback@example.com',
};

function openExternalLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function navigateTo(path) {
  router.push(path);
}

function syncViewport() {
  viewportWidth.value = window.innerWidth;
}

function handleKeyboard(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();

    if (!isDesktop.value) {
      mobileSidebarVisible.value = true;
      return;
    }

    nextTick(() => {
      searchInputRef.value?.focus?.();
    });
  }
}

watch(() => route.path, () => {
  mobileSidebarVisible.value = false;
  if (!searchKeyword.value.trim()) {
    collapseToActiveGroup();
  }
});

watch(searchKeyword, (value) => {
  if (value.trim()) {
    expandAllGroups();
    return;
  }

  collapseToActiveGroup();
}, { immediate: true });

onMounted(() => {
  window.addEventListener('resize', syncViewport);
  window.addEventListener('keydown', handleKeyboard);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewport);
  window.removeEventListener('keydown', handleKeyboard);
});
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: var(--bg-page);
}

.site-header {
  position: fixed;
  inset: 0 0 auto;
  z-index: 999;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: var(--header-height);
  padding: 0 28px;
  background: var(--header-bg);
  border-bottom: 1px solid rgba(233, 236, 239, 0.9);
  box-shadow: var(--shadow-sm);
  backdrop-filter: blur(10px);
}

.site-header__left,
.site-header__right {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.site-header__right {
  justify-content: flex-end;
}

.nav-trigger {
  display: none;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.brand-link__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-gradient-end));
  color: #ffffff;
  font-size: 20px;
  box-shadow: 0 14px 30px rgba(37, 99, 235, 0.18);
}

.brand-link__content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.brand-link__content strong {
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.brand-link__content span {
  font-size: 12px;
  line-height: 18px;
  color: var(--text-tertiary);
  white-space: nowrap;
}

.top-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  padding: 6px;
  border: 1px solid rgba(233, 236, 239, 0.9);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
}

.top-nav__item {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 12px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  cursor: pointer;
  transition:
    color var(--transition-base),
    background-color var(--transition-base),
    transform 100ms ease;
}

.top-nav__item::after {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 5px;
  height: 2px;
  border-radius: 999px;
  background: var(--brand-primary);
  transform: scaleX(0);
  transform-origin: center;
  transition: transform var(--transition-base);
}

.top-nav__item:hover {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.top-nav__item.is-active {
  color: var(--brand-primary);
}

.top-nav__item.is-active::after,
.top-nav__item--button:hover::after {
  transform: scaleX(1);
}

.top-nav__item--button :deep(svg) {
  width: 1em;
  height: 1em;
}

.search-box {
  width: 220px;
}

.search-box :deep(.el-input__wrapper) {
  min-height: 44px;
  border-radius: 14px;
  border: 1px solid rgba(233, 236, 239, 0.92);
  box-shadow: none;
  background: rgba(255, 255, 255, 0.86);
  transition:
    border-color var(--transition-base),
    box-shadow var(--transition-base),
    background-color var(--transition-base);
}

.search-box :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(37, 99, 235, 0.24);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

html.dark .search-box :deep(.el-input__wrapper) {
  background: rgba(24, 28, 34, 0.88);
}

.search-shortcut {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  border-radius: 999px;
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
  font-size: 11px;
  font-weight: 600;
}

.theme-switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(233, 236, 239, 0.92);
  color: var(--text-secondary);
}

html.dark .theme-switcher {
  background: rgba(24, 28, 34, 0.88);
  border-color: rgba(71, 85, 105, 0.72);
}

.theme-switcher :deep(.el-switch) {
  --el-switch-on-color: var(--brand-primary);
  --el-switch-off-color: rgba(15, 23, 42, 0.14);
}

.site-header__right :deep(.el-button) {
  min-height: 40px;
  border-radius: 12px;
  color: var(--text-secondary);
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    transform 100ms ease;
}

.site-header__right :deep(.el-button:hover) {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.site-aside {
  position: fixed;
  top: var(--header-height);
  left: 0;
  z-index: 900;
  width: var(--sidebar-width);
  height: calc(100vh - var(--header-height));
  padding: 22px 18px 18px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--bg-sidebar);
  border-right: 1px solid rgba(233, 236, 239, 0.92);
  backdrop-filter: blur(10px);
  scrollbar-gutter: stable;
}

html.dark .site-aside {
  border-right-color: rgba(71, 85, 105, 0.56);
}

.site-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
}

.nav-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 2px 8px;
}

.nav-toolbar :deep(.el-button) {
  min-height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  color: var(--text-secondary);
}

.nav-toolbar :deep(.el-button:hover) {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 0 0;
  border-top: 1px solid rgba(233, 236, 239, 0.82);
  background: transparent;
  border-radius: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 0;
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base);
}

html.dark .nav-group {
  border-top-color: rgba(71, 85, 105, 0.46);
}

.nav-group.is-expanded {
  border-top-color: rgba(37, 99, 235, 0.18);
}

.nav-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 4px;
}

.nav-group__toggle {
  width: 100%;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 12px;
  transition:
    background-color var(--transition-base),
    color var(--transition-base),
    transform 100ms ease;
}

.nav-group__toggle:hover {
  background: rgba(255, 255, 255, 0.46);
}

html.dark .nav-group__toggle:hover {
  background: rgba(255, 255, 255, 0.04);
}

.nav-group__header-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.nav-group__arrow {
  color: var(--text-tertiary);
  font-size: 14px;
  flex: 0 0 auto;
  transition: transform var(--transition-base), color var(--transition-base);
}

.nav-group.is-expanded .nav-group__arrow {
  color: var(--brand-primary);
  transform: rotate(90deg);
}

.nav-group__title {
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  letter-spacing: 0;
  text-transform: none;
  color: var(--text-secondary);
  text-align: left;
}

.nav-group__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.08);
  color: var(--brand-primary);
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
}

.nav-group__items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 4px;
  padding-left: 10px;
}

.nav-empty {
  margin: 0;
  padding: 12px 14px;
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--text-tertiary);
  font-size: 12px;
  line-height: 18px;
  border: 1px solid rgba(233, 236, 239, 0.92);
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 7px 12px 7px 16px;
  border-radius: 10px;
  color: var(--text-secondary);
  border: 1px solid transparent;
  font-size: 13px;
  line-height: 18px;
  font-weight: 400;
  transition:
    background-color var(--transition-base),
    border-color var(--transition-base),
    color var(--transition-base),
    transform 100ms ease,
    box-shadow var(--transition-base),
    padding-left var(--transition-base);
}

.nav-item:hover {
  background: rgba(37, 99, 235, 0.05);
  border-color: rgba(37, 99, 235, 0.08);
  color: var(--brand-primary);
  padding-left: 18px;
}

html.dark .nav-item:hover {
  background: rgba(79, 131, 241, 0.1);
  border-color: rgba(79, 131, 241, 0.14);
}

.nav-item.is-active {
  background: rgba(37, 99, 235, 0.08);
  color: var(--brand-primary);
  border-color: rgba(37, 99, 235, 0.1);
  box-shadow: none;
  font-weight: 500;
}

html.dark .nav-item.is-active {
  background: rgba(79, 131, 241, 0.14);
}

.nav-item__indicator {
  position: absolute;
  left: 4px;
  top: 50%;
  width: 3px;
  height: 14px;
  border-radius: 999px;
  background: transparent;
  transform: translateY(-50%);
}

.nav-item.is-active .nav-item__indicator {
  background: var(--brand-primary);
}

.nav-item__icon {
  font-size: 14px;
  color: currentColor;
  opacity: 0.9;
}

.nav-item__label {
  letter-spacing: 0;
}

.aside-note {
  padding: 16px;
  background: rgba(255, 255, 255, 0.86);
}

html.dark .aside-note {
  background: rgba(24, 28, 34, 0.88);
}

.aside-note__title,
.aside-note__text {
  margin: 0;
}

.aside-note__title {
  font-size: 13px;
  line-height: 20px;
  font-weight: 700;
  color: var(--text-primary);
}

.aside-note__text {
  margin-top: 6px;
  font-size: 12px;
  line-height: 19px;
  color: var(--text-tertiary);
}

.site-main {
  margin-left: var(--sidebar-width);
  margin-top: var(--header-height);
  min-height: calc(100vh - var(--header-height));
  padding: 20px 24px 24px;
}

.site-footer {
  display: flex;
  justify-content: center;
  padding: 12px 0 6px;
}

.site-footer p {
  margin: 0;
  font-size: 12px;
  line-height: 18px;
  color: var(--text-tertiary);
}

.mobile-drawer {
  display: none;
}

.site-aside::-webkit-scrollbar,
.site-nav--drawer::-webkit-scrollbar {
  width: 8px;
}

.site-aside::-webkit-scrollbar-track,
.site-nav--drawer::-webkit-scrollbar-track {
  background: transparent;
}

.site-aside::-webkit-scrollbar-thumb,
.site-nav--drawer::-webkit-scrollbar-thumb {
  background: rgba(143, 152, 170, 0.32);
  border-radius: 999px;
}

.site-aside::-webkit-scrollbar-thumb:hover,
.site-nav--drawer::-webkit-scrollbar-thumb:hover {
  background: rgba(143, 152, 170, 0.5);
}

.route-fade-enter-active,
.route-fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.route-fade-enter-from,
.route-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

:deep(.top-nav-dropdown.el-popper) {
  border: 1px solid rgba(233, 236, 239, 0.92);
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.top-nav-dropdown .el-dropdown-menu__item:hover) {
  background: var(--brand-primary-soft);
  color: var(--brand-primary);
}

@media (max-width: 1024px) {
  .site-header {
    grid-template-columns: auto 1fr auto;
    gap: 16px;
    padding: 0 20px;
  }

  .brand-link__content span {
    display: none;
  }

  .top-nav {
    gap: 4px;
    padding: 4px;
  }

  .top-nav__item {
    min-height: 36px;
    padding: 0 12px;
    font-size: 13px;
  }

  .search-box {
    width: 180px;
  }
}

@media (max-width: 767px) {
  .site-header {
    grid-template-columns: 1fr auto;
    padding: 0 16px;
  }

  .site-aside {
    display: none;
  }

  .mobile-drawer,
  .nav-trigger {
    display: inline-flex;
  }

  .top-nav {
    display: none;
  }

  .site-main {
    margin-left: 0;
    padding: 16px;
  }

  .site-header__right {
    gap: 8px;
  }

  .search-box {
    display: none;
  }

  .theme-switcher {
    display: none;
  }
  .nav-toolbar {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
