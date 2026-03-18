# UI 设计规范文档

## 设计语言：Fresh Flat Design System（清新扁平化设计系统）

本项目采用 **Fresh Flat Design System** 设计语言，融合了柔和的色彩、简洁的扁平化风格与现代化的交互体验。

---

## 1. 颜色系统

### 1.1 主色调
```css
--color-primary: #5B8DEF;        /* 主色调 - 柔和蓝 */
--color-primary-light: #7BA3F3;  /* 主色调浅色 */
--color-primary-dark: #4A7DE0;   /* 主色调深色 */
--color-primary-50: rgba(91, 141, 239, 0.1);   /* 主色调10%透明度 */
--color-primary-100: rgba(91, 141, 239, 0.2);  /* 主色调20%透明度 */
```

### 1.2 背景色（杜绝纯白）
```css
--color-bg-base: #F8FAFC;    /* 主背景色 - 柔和灰白 */
--color-bg-card: #FFFFFF;    /* 卡片背景色 - 纯白 */
--color-bg-hover: #F1F5F9;   /* 悬浮背景色 */
--color-bg-active: #E2E8F0;  /* 激活背景色 */

/* 兼容旧变量名 */
--color-ios-gray: #F8FAFC;
--color-cold-gray: #F1F5F9;
```

### 1.3 文字色
```css
--color-text-primary: #1E293B;    /* 主文字色 */
--color-text-secondary: #64748B;  /* 次级文字色 */
--color-text-muted: #94A3B8;      /* 弱化文字色 */
--color-text-disabled: #CBD5E1;   /* 禁用文字色 */

/* 兼容旧变量名 */
--color-space-black: #1E293B;
--color-graphite: #334155;
```

### 1.4 边框色
```css
--color-border: #E2E8F0;        /* 默认边框色 */
--color-border-light: #F1F5F9;  /* 浅边框色 */
--color-border-dark: #CBD5E1;   /* 深边框色 */
```

### 1.5 语义色
```css
/* 成功/盈利 */
--color-success: #22C55E;
--color-success-light: #DCFCE7;

/* 警告 */
--color-warning: #F59E0B;
--color-warning-light: #FEF3C7;

/* 错误/亏损 */
--color-error: #EF4444;
--color-error-light: #FEE2E2;

/* 信息/链接 */
--color-info: #3B82F6;
--color-info-light: #DBEAFE;
```

### 1.6 股票涨跌色（中国市场惯例：红涨绿跌）
```css
--color-stock-up: #EF4444;    /* 上涨 - 红色 */
--color-stock-down: #22C55E;  /* 下跌 - 绿色 */
--color-stock-flat: #64748B;  /* 平盘 - 灰色 */
```

### 1.7 玻璃材质（简化的半透明效果）
```css
--color-glass-white-40: rgba(255, 255, 255, 0.4);
--color-glass-white-50: rgba(255, 255, 255, 0.5);
--color-glass-white-60: rgba(255, 255, 255, 0.6);
--color-glass-white-80: rgba(255, 255, 255, 0.8);
```

### 1.8 暗色模式
```css
.dark {
  /* 背景色 */
  --color-bg-base: #0F172A;
  --color-bg-card: #1E293B;
  --color-bg-hover: #334155;
  --color-bg-active: #475569;
  
  /* 文字色 */
  --color-text-primary: #F1F5F9;
  --color-text-secondary: #94A3B8;
  --color-text-muted: #64748B;
  --color-text-disabled: #475569;
  
  /* 边框色 */
  --color-border: #334155;
  --color-border-light: #1E293B;
  --color-border-dark: #475569;
  
  /* 玻璃效果 */
  --color-glass-white-40: rgba(255, 255, 255, 0.08);
  --color-glass-white-50: rgba(255, 255, 255, 0.12);
  --color-glass-white-60: rgba(255, 255, 255, 0.16);
  --color-glass-white-80: rgba(255, 255, 255, 0.24);
}
```

---

## 2. 圆角系统

```css
--radius-sm: 4px;    /* 小圆角 */
--radius-md: 8px;    /* 中圆角 - 按钮、输入框 */
--radius-lg: 12px;   /* 大圆角 - 卡片 */
--radius-xl: 16px;   /* 超大圆角 - 容器 */
```

实际使用中的圆角值：
- 大容器/卡片：`rounded-xl` (12px)
- 按钮：`rounded-lg` (8px)
- 输入框：`rounded-lg` (8px)
- 小标签：`rounded` (4px) 或 `rounded-lg`

---

## 3. 阴影系统

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.04);    /* 小阴影 */
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.04);    /* 中阴影 */
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.04);  /* 大阴影 */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.05);  /* 超大阴影 */
```

使用场景：
- 卡片默认：`shadow-sm`
- 卡片悬浮：`shadow-md`
- 弹窗：`shadow-2xl`

---

## 4. 字体系统

```css
--font-sans: 'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif;
```

### 4.1 标签样式
```tsx
<label className="text-sm font-medium text-left block" style={{ color: '#374151' }}>
  标签文字
  {required && <span style={{ color: '#ef4444' }} className="ml-1">*</span>}
</label>
```

### 4.2 标题样式
```tsx
<h1 className="font-extrabold tracking-tight" style={{ color: '#000000' }}>
  标题文字
</h1>
```

---

## 5. 组件规范

### 5.1 卡片组件 (GlassCard)
```tsx
import { GlassCard } from '../components/ui/GlassCard';

// 基础用法
<GlassCard>内容</GlassCard>

// 可悬浮卡片
<GlassCard hoverable>内容</GlassCard>

// 自定义内边距
<GlassCard padding="sm">内容</GlassCard>  // p-4
<GlassCard padding="md">内容</GlassCard>  // p-6 (默认)
<GlassCard padding="lg">内容</GlassCard>  // p-8
<GlassCard padding="none">内容</GlassCard> // p-0
```

卡片样式：
```css
bg-white border border-gray-100 rounded-xl shadow-sm transition-all duration-200
/* 悬浮时 */
hover:shadow-md hover:border-gray-200
```

### 5.2 按钮组件

#### 主按钮 (PrimaryButton)
```tsx
import { PrimaryButton } from '../components/ui/Button';

<PrimaryButton size="sm">小按钮</PrimaryButton>  // px-3 py-1.5 text-sm
<PrimaryButton size="md">中按钮</PrimaryButton>  // px-4 py-2 text-sm (默认)
<PrimaryButton size="lg">大按钮</PrimaryButton>  // px-6 py-3 text-base
```

样式：
```css
bg-blue-500 hover:bg-blue-600 focus:ring-blue-500/50 active:bg-blue-700
color: #ffffff
```

#### 次级按钮 (SecondaryButton)
```tsx
import { SecondaryButton } from '../components/ui/Button';

<SecondaryButton>取消</SecondaryButton>
```

样式：
```css
bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300
color: #000000
```

#### 幽灵按钮 (GhostButton)
```tsx
import { GhostButton } from '../components/ui/Button';

<GhostButton>更多</GhostButton>
```

样式：
```css
bg-transparent hover:bg-gray-100 active:bg-gray-200
color: #000000
```

#### 图标按钮 (IconButton)
```tsx
import { IconButton } from '../components/ui/Button';

<IconButton tooltip="编辑" color="blue" onClick={handleEdit}>
  <svg className="w-4 h-4">...</svg>
</IconButton>

<IconButton tooltip="删除" color="red" onClick={handleDelete}>
  <svg className="w-4 h-4">...</svg>
</IconButton>

<IconButton tooltip="执行" color="green" disabled={isDisabled}>
  <svg className="w-4 h-4">...</svg>
</IconButton>
```

颜色对照表：
| 颜色 | 用途 | 样式 |
|------|------|------|
| blue | 编辑 | `hover:bg-blue-50` color: #2563eb |
| red | 删除 | `hover:bg-red-50` color: #dc2626 |
| green | 执行/启用 | `hover:bg-green-50` color: #16a34a |
| yellow | 停用 | `hover:bg-yellow-50` color: #ca8a04 |
| purple | 查看历史/日志 | `hover:bg-purple-50` color: #9333ea |
| cyan | 测试/复制 | `hover:bg-cyan-50` color: #0891b2 |
| gray | 关闭/默认 | `hover:bg-gray-100` color: #6b7280 |

### 5.3 输入框组件 (Input)
```tsx
import { Input } from '../components/ui/Input';

<Input
  label="字段名称"
  placeholder="请输入..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={errors.fieldName}
  helperText="帮助提示文字"
  inputSize="md"  // sm | md | lg
/>
```

样式：
```css
w-full bg-white border border-gray-200 rounded-lg placeholder:text-gray-400
focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
disabled:bg-gray-50 disabled:cursor-not-allowed
/* 错误状态 */
border-red-500 focus:border-red-500 focus:ring-red-500/20
```

尺寸：
- sm: `px-3 py-1.5 text-sm`
- md: `px-4 py-2.5 text-sm` (默认)
- lg: `px-4 py-3 text-base`

### 5.4 状态标签 (StatusLabel)
```tsx
import { StatusLabel } from '../components/ui/Label';

<StatusLabel status="profit">已启用</StatusLabel>
<StatusLabel status="loss">已停用</StatusLabel>
<StatusLabel status="neutral">未知</StatusLabel>
<StatusLabel status="warning">警告</StatusLabel>
<StatusLabel status="info">信息</StatusLabel>
```

状态颜色：
| 状态 | 文字色 | 背景色 |
|------|--------|--------|
| profit | #16a34a | rgba(22, 163, 74, 0.1) |
| loss | #dc2626 | rgba(220, 38, 38, 0.1) |
| neutral | #6b7280 | #f3f4f6 |
| warning | #ea580c | rgba(234, 88, 12, 0.1) |
| info | #2563eb | rgba(37, 99, 235, 0.1) |

---

## 6. 布局规范

### 6.1 侧边栏
- 宽度：展开 `w-56` (224px)，收起 `w-16` (64px)
- 背景：`bg-white/80 backdrop-blur-xl border-r border-gray-200/60`
- 暗色模式：`bg-gray-800/90 border-gray-700/60`
- 导航项高度：`py-2 px-3`
- 导航项激活：`bg-space-black text-white shadow-md`

### 6.2 主内容区
- 背景：`bg-ios-gray` (#F8FAFC)
- 内边距：`p-4`
- 高度：`h-full flex flex-col`

### 6.3 网格布局
```tsx
// 响应式三列布局
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* 内容 */}
</div>

// 2:1 布局
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <div className="lg:col-span-2">{/* 主内容 */}</div>
  <div className="lg:col-span-1">{/* 侧边内容 */}</div>
</div>
```

---

## 7. 动画效果

### 7.1 过渡动画
```css
--transition-fast: 150ms ease;    /* 快速过渡 */
--transition-normal: 200ms ease;  /* 标准过渡 */
--transition-slow: 300ms ease;    /* 慢速过渡 */
```

使用：
```css
transition-all duration-200      /* 标准过渡 */
transition-colors               /* 颜色过渡 */
transition-transform duration-200 /* 变换过渡 */
```

### 7.2 抽屉动画
```css
@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
```

---

## 8. 图标规范

### 8.1 图标尺寸
- 导航图标：`w-5 h-5`
- 按钮内图标：`w-4 h-4`
- 状态图标：`w-3 h-3`

### 8.2 图标样式
```tsx
<svg 
  className="w-4 h-4"
  fill="none" 
  viewBox="0 0 24 24" 
  stroke="currentColor" 
  strokeWidth={2}
>
  <path strokeLinecap="round" strokeLinejoin="round" d="..." />
</svg>
```

### 8.3 图标按钮必须添加 tooltip
所有图标按钮必须使用 `IconButton` 组件并提供 `tooltip` 属性：
```tsx
<IconButton tooltip="编辑" color="blue" onClick={handleEdit}>
  <svg className="w-4 h-4">...</svg>
</IconButton>
```

常用 tooltip 值：
- 编辑按钮: `tooltip="编辑"`
- 删除按钮: `tooltip="删除"`
- 关闭按钮: `tooltip="关闭"`
- 执行按钮: `tooltip="执行"`
- 查看按钮: `tooltip="查看"`
- 执行历史: `tooltip="执行历史"`
- 复制按钮: `tooltip="复制"`
- 启用/停用: `tooltip="启用"` 或 `tooltip="停用"`

---

## 9. 响应式断点

```css
/* Tailwind 默认断点 */
sm: 640px   /* 小屏手机 */
md: 768px   /* 平板 */
lg: 1024px  /* 小屏笔记本 */
xl: 1280px  /* 桌面 */
2xl: 1536px /* 大屏桌面 */
```

---

## 10. 列表页面规范

### 10.1 页面布局结构
```tsx
<div className="p-4 h-full flex flex-col">
  <GlassCard className="flex-1 flex flex-col min-h-0">
    {/* 页面头部 - 固定高度 */}
    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 flex-shrink-0">
      <div>
        <h1 className="text-lg font-bold text-space-black text-left">页面标题</h1>
        <p className="text-xs text-gray-500 mt-0.5">页面描述</p>
      </div>
      <PrimaryButton className="!px-4 !py-2 text-sm">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4">...</svg>
          新增
        </span>
      </PrimaryButton>
    </div>
    
    {/* 表格区域 - 自适应填充 */}
    <div className="flex-1 flex flex-col min-h-0">
      <div className="overflow-x-auto flex-1 min-h-0 overflow-y-auto">
        <table className="w-full">...</table>
      </div>
      
      {/* 分页 - 固定底部 */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3 flex-shrink-0">
        ...
      </div>
    </div>
  </GlassCard>
</div>
```

### 10.2 表格样式
```tsx
<table className="w-full">
  <thead>
    <tr className="border-b border-gray-100">
      <th className="text-left py-2 px-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
        列标题
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-gray-50">
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="py-2.5 px-3 text-left">
        <div className="text-sm text-space-black">内容</div>
      </td>
    </tr>
  </tbody>
</table>
```

### 10.3 分页样式
```tsx
<div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3 flex-shrink-0">
  <div className="text-xs text-gray-500">
    共 {total} 条，第 {currentPage}/{totalPages} 页
  </div>
  <div className="flex items-center gap-1">
    <button
      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
      disabled={currentPage === 1}
      className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      上一页
    </button>
    <button
      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
      disabled={currentPage >= totalPages}
      className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      下一页
    </button>
  </div>
</div>
```

### 10.4 空状态
```tsx
<div className="text-center py-12">
  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
    <svg className="w-8 h-8 text-gray-400">...</svg>
  </div>
  <p className="text-gray-500 mb-4">暂无数据</p>
  <SecondaryButton onClick={handleAdd}>添加第一条数据</SecondaryButton>
</div>
```

---

## 11. 弹窗规范

### 11.1 弹窗容器结构
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center">
  {/* 遮罩层 */}
  <div className="absolute inset-0 bg-black/50" onClick={onClose} />
  {/* 弹窗内容 */}
  <div className="relative z-10 w-full max-w-2xl mx-4">
    <div className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto p-6">
      {children}
    </div>
  </div>
</div>
```

### 11.2 弹窗宽度规范
| 弹窗类型 | 最大宽度 |
|---------|---------|
| 小型确认框 | `max-w-sm` (384px) |
| 标准表单 | `max-w-lg` (512px) |
| 中型表单 | `max-w-2xl` (672px) |
| 大型表单 | `max-w-3xl` (768px) |
| 日志/详情 | `max-w-4xl` (896px) |

### 11.3 确认弹窗样式
```tsx
<div className="bg-white rounded-xl shadow-2xl p-6">
  <div className="text-left">
    <div className="w-12 h-12 mb-4 rounded-full bg-red-100 flex items-center justify-center">
      <svg className="w-6 h-6 text-red-600">...</svg>
    </div>
    <h3 className="text-lg font-semibold text-space-black mb-2 text-left">确认删除</h3>
    <p className="text-gray-500 mb-6 text-left">删除后将无法恢复，确定要删除吗？</p>
    <div className="flex gap-3">
      <button className="flex-1 px-6 py-3 bg-white border border-gray-200/60 rounded-[7px] font-semibold hover:border-gray-300 transition-colors cursor-pointer">
        取消
      </button>
      <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-[7px] font-bold hover:bg-red-700 transition-colors cursor-pointer">
        确认删除
      </button>
    </div>
  </div>
</div>
```

---

## 12. 表单弹窗规范

### 12.1 统一文案
- 新增时标题：`新增XXX` 或 `新增`
- 编辑时标题：`编辑XXX` 或 `编辑`
- 保存按钮：`保存`（不区分新增/编辑）
- 取消按钮：`取消`
- 保存中状态：`保存中...`

### 12.2 表单固定布局结构
```tsx
<form className="flex flex-col h-full max-h-[80vh]">
  {/* 固定标题 */}
  <div className="flex-shrink-0 flex items-center justify-between pb-3 border-b border-gray-100">
    <h2 className="text-lg font-bold text-space-black text-left">
      {isEdit ? '编辑' : '新增'}
    </h2>
    <button
      type="button"
      onClick={onCancel}
      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      title="关闭"
    >
      <svg className="w-4 h-4 text-gray-500">...</svg>
    </button>
  </div>

  {/* 可滚动的表单区域 */}
  <div className="flex-1 overflow-y-auto py-4 space-y-4 scrollbar-hide">
    {/* 表单字段 */}
  </div>

  {/* 固定底部按钮 */}
  <div className="flex-shrink-0 flex gap-3 pt-3 border-t border-gray-100">
    <SecondaryButton type="button" onClick={onCancel} className="flex-1">
      取消
    </SecondaryButton>
    <PrimaryButton type="submit" disabled={submitting} className="flex-1">
      {submitting ? '保存中...' : '保存'}
    </PrimaryButton>
  </div>
</form>
```

### 12.3 表单字段样式
```tsx
{/* 输入框 */}
<div className="space-y-1.5">
  <Label required>字段名称</Label>
  <input
    type="text"
    placeholder="请输入..."
    className={`w-full bg-white border rounded-lg px-4 py-2.5 text-gray-900 
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
      transition-all duration-200 ${errors.field ? 'border-red-500' : 'border-gray-300'}`}
  />
  {errors.field && <p className="text-xs text-red-500 mt-1">{errors.field}</p>}
</div>

{/* 下拉选择框 */}
<div className="space-y-1.5">
  <Label required>选择项</Label>
  <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200">
    <option value="">请选择</option>
  </select>
</div>

{/* 文本域 */}
<div className="space-y-1.5">
  <Label>描述</Label>
  <textarea
    placeholder="请输入描述"
    rows={3}
    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 
      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none 
      transition-all duration-200 resize-none placeholder:text-gray-400"
  />
</div>
```

---

## 13. 可搜索下拉框规范

### 13.1 完整组件结构
```tsx
<div className="relative" ref={dropdownRef}>
  {/* 输入框 */}
  <div className="relative">
    <input
      type="text"
      value={searchText}
      onChange={handleSearchChange}
      onFocus={() => setShowDropdown(true)}
      placeholder="搜索或选择..."
      className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-gray-900 
        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
    />
    {/* 下拉箭头 */}
    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg className={`w-5 h-5 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}>
        ...
      </svg>
    </div>
  </div>
  
  {/* 下拉选项列表 */}
  {showDropdown && (
    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
      {filteredOptions.length === 0 ? (
        <div className="px-4 py-3 text-sm text-gray-500 text-left">未找到匹配项</div>
      ) : (
        filteredOptions.map(option => (
          <div
            key={option.id}
            onClick={() => handleSelect(option)}
            className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors text-left ${
              selectedValue === option.id ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
            }`}
          >
            <div className="font-medium text-sm text-left">{option.name}</div>
          </div>
        ))
      )}
    </div>
  )}
</div>
```

---

## 14. 列表选择组件规范

### 14.1 表格形式的多选列表
```tsx
<div className="border border-gray-200 rounded-lg overflow-hidden">
  {/* 表头 */}
  <div className="bg-gray-50 border-b border-gray-200">
    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-medium text-gray-500">
      <div className="col-span-1"></div>
      <div className="col-span-2 text-left">编号</div>
      <div className="col-span-3 text-left">名称</div>
      <div className="col-span-2 text-left">数量</div>
      <div className="col-span-2 text-left">状态</div>
      <div className="col-span-2 text-left">创建时间</div>
    </div>
  </div>
  
  {/* 列表内容 */}
  <div className="max-h-48 overflow-y-auto">
    {items.map(item => (
      <label key={item.id} className="grid grid-cols-12 gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 items-center">
        <div className="col-span-1">
          <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
        </div>
        <div className="col-span-2 text-xs text-gray-500 text-left truncate">{item.id}</div>
        <div className="col-span-3 text-sm font-medium text-space-black text-left truncate">{item.name}</div>
        <div className="col-span-2 text-xs text-gray-600 text-left">{item.count}</div>
        <div className="col-span-2 text-left">
          <span className="inline-flex px-1.5 py-0.5 text-xs rounded bg-green-100 text-green-700">启用</span>
        </div>
        <div className="col-span-2 text-xs text-gray-500 text-left">{item.createTime}</div>
      </label>
    ))}
  </div>
  
  {/* 分页 */}
  <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
    <div className="text-xs text-gray-500">共 {total} 条</div>
    <div className="flex items-center gap-1">
      <button type="button" className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-white disabled:opacity-50">上一页</button>
      <button type="button" className="px-2 py-1 text-xs rounded border border-gray-200 hover:bg-white disabled:opacity-50">下一页</button>
    </div>
  </div>
</div>
```

---

## 15. 按钮尺寸规范

### 15.1 按钮尺寸分类
| 尺寸类型 | 内边距 | 字号 | 高度约 | 使用场景 |
|---------|--------|------|--------|---------|
| 大号 (lg) | `px-6 py-3` | `text-base` | 48px | 弹窗底部主操作按钮 |
| 中号 (md) | `px-4 py-2` | `text-sm` | 36px | 页面头部操作按钮、表单按钮 |
| 小号 (sm) | `px-3 py-1.5` | `text-sm` | 28px | 分页按钮、表格内按钮 |
| 图标按钮 | `p-1.5` | - | 28px | 表格操作列图标按钮 |

### 15.2 弹窗底部按钮
```tsx
<div className="flex gap-3 pt-3 border-t border-gray-100">
  <SecondaryButton type="button" onClick={onCancel} className="flex-1">
    取消
  </SecondaryButton>
  <PrimaryButton type="submit" disabled={submitting} className="flex-1">
    {submitting ? '保存中...' : '保存'}
  </PrimaryButton>
</div>
```

### 15.3 确认弹窗按钮
```tsx
<div className="flex gap-3">
  <button className="flex-1 px-6 py-3 bg-white border border-gray-200/60 rounded-[7px] font-semibold hover:border-gray-300 transition-colors cursor-pointer">
    取消
  </button>
  <button className="flex-1 px-6 py-3 bg-red-600 text-white rounded-[7px] font-bold hover:bg-red-700 transition-colors cursor-pointer">
    确认删除
  </button>
</div>
```

---

## 16. 紧凑布局原则

### 16.1 间距规范
| 元素 | 值 |
|------|------|
| 页面内边距 | `p-4` |
| 卡片间距 | `space-y-4` |
| 表单间距 | `space-y-4` |
| 表格单元格 | `py-2.5 px-3` |
| 操作按钮 | `p-1.5` |
| 分页按钮 | `px-3 py-1.5` |

### 16.2 字号规范
| 元素 | 值 |
|------|------|
| 页面标题 | `text-lg` |
| 页面描述 | `text-xs` |
| 弹窗标题 | `text-lg` |
| 表格表头 | `text-xs` |
| 表格内容 | `text-sm` |
| 分页文字 | `text-xs` |

### 16.3 图标尺寸规范
| 元素 | 值 |
|------|------|
| 新增按钮图标 | `w-4 h-4` |
| 操作按钮图标 | `w-4 h-4` |
| 列表头像 | `w-8 h-8` |
| 关闭按钮图标 | `w-4 h-4` |
| 导航图标 | `w-5 h-5` |

---

## 17. 暗色模式适配

### 17.1 背景色覆盖
```css
.dark .bg-white\/60,
.dark .bg-white\/80 {
  background-color: rgba(30, 41, 59, 0.6) !important;
}

.dark .bg-white {
  background-color: #1E293B !important;
}
```

### 17.2 边框色覆盖
```css
.dark .border-gray-100\/60,
.dark .border-gray-200\/40,
.dark .border-gray-200\/60 {
  border-color: rgba(51, 65, 85, 0.6) !important;
}
```

### 17.3 文字色覆盖
```css
.dark .text-space-black {
  color: #F1F5F9 !important;
}

.dark .text-gray-500,
.dark .text-gray-600 {
  color: #94A3B8 !important;
}
```

---

## 18. 工具类

### 18.1 股票涨跌颜色
```css
.text-stock-up { color: var(--color-stock-up); }    /* 红色上涨 */
.text-stock-down { color: var(--color-stock-down); } /* 绿色下跌 */
.text-stock-flat { color: var(--color-stock-flat); } /* 灰色平盘 */
```

### 18.2 主色调工具类
```css
.text-primary { color: var(--color-primary); }
.bg-primary { background-color: var(--color-primary); }
.border-primary { border-color: var(--color-primary); }
```

### 18.3 圆角工具类
```css
.rounded-design-sm { border-radius: var(--radius-sm); }  /* 4px */
.rounded-design-md { border-radius: var(--radius-md); }  /* 8px */
.rounded-design-lg { border-radius: var(--radius-lg); }  /* 12px */
.rounded-design-xl { border-radius: var(--radius-xl); }  /* 16px */
```

### 18.4 阴影工具类
```css
.shadow-design-sm { box-shadow: var(--shadow-sm); }
.shadow-design-md { box-shadow: var(--shadow-md); }
.shadow-design-lg { box-shadow: var(--shadow-lg); }
.shadow-design-xl { box-shadow: var(--shadow-xl); }
```

### 18.5 卡片基础样式
```css
.card-base {
  background-color: var(--color-bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card-base:hover {
  box-shadow: var(--shadow-md);
}
```

### 18.6 隐藏滚动条
```css
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

---

## 19. 最佳实践

1. **避免纯白背景**：页面背景使用 `bg-ios-gray` (#F8FAFC)
2. **弹窗使用白色背景**：弹窗容器使用纯白色 `bg-white`
3. **保持一致的圆角**：遵循圆角系统规范
4. **平滑过渡**：所有交互添加 `transition-*` 效果
5. **暗色模式兼容**：确保所有组件支持暗色模式
6. **文字左对齐**：所有 label、标题和列表字段文字必须左对齐
7. **按钮高度一致**：同一区域内的按钮必须保持相同高度
8. **列表字段居左**：表格和列表中的所有字段内容必须左对齐显示
9. **图标按钮悬浮提示**：所有图标按钮必须使用 `IconButton` 组件并提供 `tooltip`
10. **使用封装组件**：优先使用 `ui/` 目录下的封装组件
11. **鼠标手势**：所有可点击元素必须添加 `cursor-pointer`
12. **禁用状态**：禁用按钮使用 `disabled:opacity-50 disabled:cursor-not-allowed`

---
