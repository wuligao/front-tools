import { computed, onMounted, onBeforeUnmount, ref, watch } from 'vue';

const THEME_STORAGE_KEY = 'tool-site-theme';

function applyTheme(isDark) {
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function useTheme() {
  const isDark = ref(false);
  const hasManualPreference = ref(false);
  let mediaQuery;

  const themeLabel = computed(() => (isDark.value ? '暗黑模式' : '浅色模式'));

  function setTheme(nextValue, persist = true) {
    isDark.value = nextValue;
    applyTheme(nextValue);

    if (persist) {
      hasManualPreference.value = true;
      localStorage.setItem(THEME_STORAGE_KEY, nextValue ? 'dark' : 'light');
    }
  }

  function toggleTheme(nextValue) {
    setTheme(nextValue, true);
  }

  function handleSystemThemeChange(event) {
    if (!hasManualPreference.value) {
      setTheme(event.matches, false);
    }
  }

  onMounted(() => {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme === 'dark' || storedTheme === 'light') {
      hasManualPreference.value = true;
      setTheme(storedTheme === 'dark', false);
    } else {
      setTheme(mediaQuery.matches, false);
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange);
  });

  onBeforeUnmount(() => {
    mediaQuery?.removeEventListener('change', handleSystemThemeChange);
  });

  watch(isDark, (value) => {
    applyTheme(value);
  });

  return {
    isDark,
    themeLabel,
    toggleTheme,
  };
}
