import { ElMessage } from 'element-plus';

export async function copyText(value, successMessage = '复制成功') {
  try {
    await navigator.clipboard.writeText(String(value));
    ElMessage.success(successMessage);
    return true;
  } catch (error) {
    ElMessage.error('复制失败，请手动复制');
    return false;
  }
}
