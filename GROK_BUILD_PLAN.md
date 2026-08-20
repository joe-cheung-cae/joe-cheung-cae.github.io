> **Historical.** Superseded particle-upgrade plan — not current tasking. The live site is Joe Cheung’s personal homepage (Astro, Tailwind, MDX, Preact, MiniSearch) at https://joe-cheung-cae.github.io/, deployed from the `gh-pages` branch. See README.md and LICENSE.

# Joe Cheung 个人网站美化升级完整开发计划
（Grok Build · 含动画与粒子特效）

**版本**：1.1  
**日期**：2026-08-18  
**目标站点**：https://joe-cheung-cae.github.io/  
**技术栈**：Astro + Tailwind CSS + MDX + Preact + MiniSearch  
**核心原则**：保持科研 / 计算力学工程师气质，双语（EN/ZH），暗色优先，性能与可访问性优先，克制优雅地增加现代感与主题性粒子效果。

---

## 一、项目概述

当前个人主页采用 Notion 风格暖色系与 IBM Plex 字体，内容结构清晰、双语支持完善，科研气质浓厚。但整体视觉层次较弱、卡片与间距偏平、缺乏现代微交互与主题性装饰，用户反馈偏“土”。

本次升级目标：在严格保持计算力学 / GPU 粒子方法专业气质的前提下，完成现代化美化，并加入克制的全站动画与 Hero 粒子特效。

---

## 二、调研结论摘要

### 2.1 主题与设计参考
优先保留现有 Astro + Tailwind 栈，避免大规模迁移。推荐参考 Academic Portfolio Astro、as-folio、Scholarly、My Scholar、Y Astro Scholar 等学术向主题，以及 al-folio（Jekyll 学术标杆）的干净布局思路。整体方向定位为“现代计算力学工程师主页”——精准、克制、有呼吸感。

### 2.2 GitLab CI 费用（Public 仓库）
- GitLab.com Free 套餐：每个 namespace 每月 **400 compute minutes**（共享 runners），public 与 private 适用同一规则，不因 public 额外收费。
- 超出后需购买额外分钟（约 $10 / 1,000 分钟）。
- **Self-hosted runners** 在任何套餐下均完全免费且无限。
- Public 开源项目可申请 GitLab for Open Source Program 获得 cost factor 折扣。
- **建议**：继续使用现有 GitHub Pages + Actions 部署（public 仓库通常更宽松），除非有明确 GitLab 迁移需求。

### 2.3 动画与粒子特效调研结论

**动画优化**：
- 优先纯 CSS + Tailwind 工具类（hover 抬升、淡入、轻微缩放、soft shadow）。
- 启用 Astro View Transitions 实现页面平滑切换（支持 transition:name 关键元素形态过渡）。
- 可选 Intersection Observer 实现 section / 卡片 staggered 入场。
- **必须**全面支持 `prefers-reduced-motion`（自动降级或关闭非必要动画）。

**粒子特效**（贴合 SPH / DEM 主题）：
推荐优先级：
1. **纯 CSS 增强现有 hero-grid**（多图层点阵 + 缓慢漂移 / twinkle）——零 JS，最佳性能。
2. **极轻量自定义 Canvas**（40–80 粒子，慢速漂移，低透明度，仅 Hero，离屏暂停）。
3. **tsParticles slim**（官方 Astro 集成，严格低密度配置）。

原则：仅 Hero 区域 ambient 装饰，不干扰阅读；移动端降密度；`prefers-reduced-motion` 完全禁用；颜色匹配新 accent（建议 cyan / teal 科技感）。禁止高密度全屏或炫技效果。

---

## 三、设计优化方向

- **色彩**：保留 IBM Plex 与暗色优先；Accent 可微调为 cyan / teal 科技感，或保留暖调并增强对比。
- **Hero**：强化排版与视觉焦点，升级点阵网格或加入轻量粒子背景，增加简洁 CTA。
- **卡片**：Focus 与项目卡片增加左侧 accent 条或图标、hover 抬升与阴影、更精致标签。
- **全局**：优化间距与最大宽度一致性，加入 CSS 微交互与 View Transitions，页脚与导航精致化。
- **原则**：动画与粒子始终服务于内容与科研气质，宁少勿滥；性能与可访问性作为硬性门槛。

---

## 四、完整分阶段 Grok Build 开发计划

以下计划以现有仓库为基础，在新分支上迭代完成。每阶段结束后可预览确认方向。

### 阶段 0：准备与审计（0.5–1 天）
- 创建 `design-upgrade` 分支并完整备份。
- 审查当前源码（Hero 网格、Card 组件、颜色 token、布局、暗色 / 双语逻辑）。
- 建立 moodboard（学术 / 工程师站点 + 轻量粒子 / 网格参考）。
- 明确成功标准：科研气质不变、Lighthouse 性能不降、全面支持 prefers-reduced-motion、移动端友好、粒子仅作装饰。

### 阶段 1：设计系统与动画基础定义（1–1.5 天）
- 更新 Tailwind 配置与设计 token：颜色（accent 向 cyan/teal 或保留暖调增强对比）、间距、圆角、阴影、字体规模。
- 定义动画 token：duration、easing、常用 keyframes（fade-in、slide-up、lift、soft-glow 等）。
- 建立 prefers-reduced-motion 全局降级规则。
- 输出简短设计与动画规范文档。

### 阶段 2：核心视觉组件升级（含微交互）（1.5–2 天）
- Hero 区域：排版强化、背景升级准备、CTA 优化。
- Focus 与项目卡片：左侧 accent 条 / 图标、hover 抬升 + 阴影、标签精致化。
- 笔记卡片与全局间距、导航、页脚同步升级。
- 所有卡片与按钮加入 CSS 微交互（hover / focus）。

### 阶段 3：全站动画系统实现（1–1.5 天）
- 启用并配置 Astro View Transitions（默认 fade 或自定义 slide，关键元素使用 transition:name）。
- 实现 section / 卡片 staggered 入场（Intersection Observer + CSS）。
- 页面切换与滚动过程中的平滑过渡。
- 全面测试 prefers-reduced-motion 行为。

### 阶段 4：粒子特效实验与集成（1.5–2 天）
- 先实现纯 CSS 增强版 hero 网格 / 浮动粒子（零依赖）。
- 若效果不足，再评估轻量自定义 Canvas 方案（低密度、慢速、主题色、暂停逻辑）。
- 严格限制：仅 Hero、低存在感、移动端降级、reduced-motion 禁用。
- 性能基准测试（帧率、CPU、Lighthouse、移动端）。
- 可选：增加用户可关闭开关。

### 阶段 5：其他页面一致性、响应式与细节打磨（1 天）
- About / Projects / Notes 等页面同步视觉与动画语言。
- 全面响应式检查与可访问性审计。
- 双语与搜索功能回归。

### 阶段 6：测试、性能、部署与文档（0.5–1 天）
- 本地构建 + 现有 Playwright e2e。
- Lighthouse、Core Web Vitals、reduced-motion、粒子性能专项测试。
- 合并并执行现有 GitHub Pages 部署流程（`npm run deploy:github`）。
- 更新 README、CHANGELOG、DEPLOYMENT.md，记录动画与粒子配置说明。

### 阶段 7：可选扩展与复盘（按需）
- 进一步微调粒子参数或增加极轻微的项目卡片 hover 反馈。
- 评估是否需要独立动画开关。
- 收集反馈后小迭代。

---

## 五、执行原则与成功标准

**执行原则**：
- 每阶段结束后可预览并确认方向（尤其是粒子密度与动画强度）。
- 动画与粒子始终服务于内容与科研气质，宁少勿滥。
- 优先 CSS 与原生能力，严格控制额外 JS 体积。
- 性能与可访问性作为硬性门槛，不达标则回退到更轻方案。
- 保持现有内容与 i18n 结构，最大限度复用 MDX 与组件。

**成功标准**：
视觉显著更现代、科研气质完整保留、Lighthouse 性能不下降、prefers-reduced-motion 全面支持、移动端体验良好、粒子仅作优雅装饰而不干扰阅读。

---

## 六、下一步行动建议

1. 确认本计划（可直接基于本文件启动）。
2. 优先确定 accent 色彩方向（cyan/teal 科技感 或 保留暖调增强对比）。
3. 创建 `design-upgrade` 分支，开始阶段 0 与阶段 1。
4. 如需，可先输出具体设计 token 提案、Hero 粒子 CSS/Canvas 示例代码，或某一阶段的详细实施步骤。

---

**预计总工作量**：约 7–11 天（单人全职或分阶段协作）

**文档生成**：2026-08-18 · 由 Grok 团队制定 · 适用于 joe-cheung-cae.github.io
