# Joe Cheung 个人网站美化与升级完整开发计划
（Grok Build · 2026-08）

**目标站点**：https://joe-cheung-cae.github.io/  
**仓库**：https://github.com/joe-cheung-cae/joe-cheung-cae.github.io  
**技术栈**：Astro + Tailwind CSS + MDX + Preact + MiniSearch  
**核心原则**：保持科研 / 计算力学工程师气质，双语（EN/ZH），暗色优先，性能与可访问性优先，克制优雅地增加现代感与主题性粒子效果。

## 一、调研结论摘要

### 当前问题
- 视觉层次偏弱，卡片与间距较平，Hero 偏文字主导，整体略显“土”。
- 已有良好基础：Notion 风格暖色 + IBM Plex、hero-grid 点阵、卡片布局、双语、⌘K 搜索、暗色切换。

### 动画优化方向
- 优先纯 CSS + Tailwind transitions（hover lift、fade、scale、soft shadow）。
- 启用 Astro View Transitions 实现页面平滑切换。
- Intersection Observer 实现 section / 卡片 staggered 入场。
- 强制支持 `prefers-reduced-motion`（自动降级/关闭）。

### 粒子特效方向（贴合 SPH / DEM）
**推荐优先级**：
1. 纯 CSS 升级现有 hero-grid（多图层点阵 + 缓慢漂移/twinkle）——零 JS，最佳性能。
2. 极轻量自定义 Canvas（40–80 粒子，低速、低透明度、仅 Hero、离屏暂停）。
3. tsParticles slim（官方 Astro 集成，严格低密度配置）。

原则：仅 Hero 区域 ambient 装饰，不干扰阅读；移动端降密度；reduced-motion 完全禁用；颜色匹配新 accent（建议 cyan/teal 科技感）。

### GitLab CI 说明
Free 套餐：每月 400 compute minutes（shared runners），public 与 private 一视同仁，不额外收费。Self-hosted runners 无限免费。建议继续使用 GitHub Pages。

## 二、完整分阶段开发计划

### 阶段 0：准备与审计（0.5–1 天）
- 创建 `design-upgrade` 分支并完整备份当前代码。
- 审查源码：Hero、Card、颜色 token、布局、双语与搜索逻辑。
- 建立 moodboard（学术/工程师站点 + 轻量粒子参考）。
- 明确成功标准：科研气质不变、Lighthouse ≥ 当前水平、全面支持 prefers-reduced-motion、移动端友好。

### 阶段 1：设计系统与动画基础（1–1.5 天）
- 更新 `tailwind.config` 与 CSS 变量：颜色（accent 向 cyan/teal 或暖调增强对比）、间距、圆角、阴影、字体规模。
- 定义动画 token：duration、easing、常用 keyframes（fade-in、slide-up、lift、soft-glow）。
- 建立全局 `prefers-reduced-motion` 降级规则。
- 输出简短设计与动画规范文档。

### 阶段 2：核心视觉组件升级（1.5–2 天）
- Hero：排版强化、背景准备、CTA 优化（加图标）。
- Focus 三卡片：左侧 accent 条 / 主题图标、更清晰层级。
- 项目卡片：hover 抬升 + 阴影、标签精致化、可选技术图标。
- 笔记卡片、导航、页脚同步升级。
- 所有交互元素加入 CSS 微交互。

### 阶段 3：全站动画系统（1–1.5 天）
- 配置 Astro View Transitions（默认 fade / 自定义 slide，关键元素使用 transition:name）。
- 实现 section 与卡片 staggered 入场（Intersection Observer + CSS）。
- 页面切换与滚动平滑过渡。
- 全面测试 prefers-reduced-motion 行为。

### 阶段 4：粒子特效实验与集成（1.5–2 天）
- 优先实现纯 CSS 增强版 hero 网格 / 浮动粒子。
- 效果不足时评估轻量自定义 Canvas 方案（低密度、慢速、主题色、暂停逻辑）。
- 严格限制：仅 Hero、低存在感、移动端降级、reduced-motion 禁用。
- 性能基准测试（帧率、CPU、Lighthouse、移动端）。
- 可选：用户可关闭开关。

### 阶段 5：其他页面一致性与响应式打磨（1 天）
- About / Projects / Notes 等页面同步视觉与动画语言。
- 全面响应式检查与可访问性审计。
- 双语与搜索功能回归测试。

### 阶段 6：测试、性能、部署与文档（0.5–1 天）
- 本地 `npm run build` + 现有 Playwright e2e。
- Lighthouse、Core Web Vitals、reduced-motion、粒子性能专项测试。
- 合并到 main 并执行现有 GitHub Pages 部署流程。
- 更新 README、CHANGELOG、DEPLOYMENT.md，记录动画与粒子配置说明。

### 阶段 7：可选扩展与复盘（按需）
- 微调粒子参数或增加极轻微 hover 反馈。
- 评估独立动画开关。
- 收集反馈后小迭代。

## 三、执行原则
- 每阶段结束后预览并确认方向（尤其粒子密度与动画强度）。
- 动画与粒子始终服务于内容与科研气质，宁少勿滥。
- 优先 CSS 与原生能力，严格控制额外 JS 体积。
- 性能与可访问性为硬性门槛，不达标立即回退更轻方案。
- 全程保持现有内容结构与双语完整。

## 四、下一步建议
1. 确认 accent 色方向（cyan/teal 科技感 vs 保留暖棕增强对比）。
2. 优先启动阶段 0–1（设计系统），或直接进入 Hero 粒子 CSS 原型。
3. 需要示例代码时，可随时索取具体 CSS / Canvas / tsParticles 配置片段。

---

*本计划由 Grok 团队生成并写入仓库，用于指导后续美化升级工作。*
