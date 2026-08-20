export type UiLang = 'en' | 'zh';

export const LANG_CHANGE_EVENT = 'lang-change';

export const ui = {
  en: {
    openSearch: 'Open search',
    search: 'Search',
    searchPlaceholder: 'Search posts, tags, or languages...',
    toNavigate: 'to navigate',
    toSelect: 'to select',
    toggleMenu: 'Toggle menu',
    switchToDark: 'Switch to dark mode',
    switchToLight: 'Switch to light mode',
    switchToChinese: 'Switch to Chinese',
    switchToEnglish: 'Switch to English',
    siteNav: 'Site',
    email: 'Email',
    github: 'GitHub',
    x: 'X',
    primaryNav: 'Primary',
    tocNav: 'Table of contents',
    onThisPage: 'On this page',
    quickPreview: 'Quick Preview',
    featured: 'Featured',
    readNote: 'Read note',
    readMore: 'Read more',
    startHere: 'Start Here',
    featuredNotes: 'Featured notes',
    latestNotes: 'Latest notes',
    viewAll: 'View all',
    viewAllNotes: 'View all',
    selectedWork: 'Selected work',
    allProjects: 'All projects',
    pageNotFound: 'Page Not Found',
    pageNotFoundBody: "The page you're looking for doesn't exist or has been moved.",
    popularDestinations: 'Popular Destinations',
    goHome: 'Go Home',
    browseNotes: 'Browse Notes',
    about: 'About',
    noLanguages: 'No languages found.',
    copyCode: 'Copy code',
    copy: 'Copy',
    copied: 'Copied!',
    relatedNotes: 'Related notes',
    relatedTags: 'Related Tags',
    topicsHeading: 'Topics',
    noPostsTag: 'No posts found with this tag.',
    noPostsLang: 'No posts found for this language.',
    browseAllTags: 'Browse all tags',
    browseAllLanguages: 'Browse all languages',
    previous: 'Previous',
    next: 'Next',
    updated: 'Updated',
    home: 'Home',
    notes: 'Notes',
    tags: 'Tags',
    languages: 'Languages',
    gallery: 'Gallery',
    projects: 'Projects',
    site: 'Site',
    connect: 'Connect',
    githubProfile: 'GitHub profile',
    notesStat: 'notes',
    tagsStat: 'tags',
    albumStat: 'album',
    calloutNote: 'Note',
    calloutTip: 'Tip',
    calloutWarning: 'Warning',
    calloutDanger: 'Danger',
  },
  zh: {
    openSearch: '打开搜索',
    search: '搜索',
    searchPlaceholder: '搜索笔记、标签或语言…',
    toNavigate: '导航',
    toSelect: '选择',
    toggleMenu: '切换菜单',
    switchToDark: '切换到深色模式',
    switchToLight: '切换到浅色模式',
    switchToChinese: '切换到中文',
    switchToEnglish: '切换到英文',
    siteNav: '本站',
    email: '邮箱',
    github: 'GitHub',
    x: 'X',
    primaryNav: '主要',
    tocNav: '目录',
    onThisPage: '本页目录',
    quickPreview: '快速预览',
    featured: '精选',
    readNote: '阅读笔记',
    readMore: '阅读全文',
    startHere: '从这里开始',
    featuredNotes: '精选笔记',
    latestNotes: '最近笔记',
    viewAll: '查看全部',
    viewAllNotes: '全部笔记',
    selectedWork: '精选项目',
    allProjects: '全部项目',
    pageNotFound: '页面未找到',
    pageNotFoundBody: '你访问的页面不存在或已移动。',
    popularDestinations: '常用入口',
    goHome: '回到主页',
    browseNotes: '浏览笔记',
    about: '关于',
    noLanguages: '暂无语言。',
    copyCode: '复制代码',
    copy: '复制',
    copied: '已复制',
    relatedNotes: '相关笔记',
    relatedTags: '相关标签',
    topicsHeading: '主题',
    noPostsTag: '这个标签下还没有笔记。',
    noPostsLang: '这个语言下还没有笔记。',
    browseAllTags: '浏览全部标签',
    browseAllLanguages: '浏览全部语言',
    previous: '上一篇',
    next: '下一篇',
    updated: '更新',
    home: '主页',
    notes: '笔记',
    tags: '标签',
    languages: '语言',
    gallery: '相册',
    projects: '项目',
    site: '本站',
    connect: '联系',
    githubProfile: 'GitHub 主页',
    notesStat: '笔记',
    tagsStat: '标签',
    albumStat: '相册',
    calloutNote: '注',
    calloutTip: '提示',
    calloutWarning: '警告',
    calloutDanger: '危险',
  },
} as const;

export type UiKey = keyof typeof ui.en;

export const IDENTICAL_UI_KEYS = ['github', 'x'] as const satisfies readonly UiKey[];

export function t(lang: UiLang, key: UiKey): string {
  return ui[lang][key];
}

export function isUiLang(value: unknown): value is UiLang {
  return value === 'en' || value === 'zh';
}

export function readDocumentLang(el: { getAttribute(name: string): string | null }): UiLang {
  return el.getAttribute('data-lang') === 'zh' ? 'zh' : 'en';
}

export function applyDocumentLang(
  el: { setAttribute(name: string, value: string): void },
  lang: UiLang
): void {
  el.setAttribute('data-lang', lang);
  el.setAttribute('lang', lang === 'zh' ? 'zh-Hans' : 'en');
}

export function formatTopics(lang: UiLang, n: number): string {
  if (lang === 'zh') {
    return `${n} 个主题`;
  }
  return n === 1 ? '1 topic' : `${n} topics`;
}

export function formatMoreTags(lang: UiLang, n: number): string {
  return lang === 'zh' ? `+${n} 更多` : `+${n} more`;
}

export function formatResults(lang: UiLang, n: number): string {
  if (lang === 'zh') {
    return `${n} 条结果`;
  }
  return n === 1 ? '1 result' : `${n} results`;
}

export function formatNoResults(lang: UiLang, query: string): string {
  return lang === 'zh' ? `未找到 “${query}” 的结果` : `No results found for "${query}"`;
}

export function formatWords(lang: UiLang, n: number): string {
  const formatted = n.toLocaleString(lang === 'zh' ? 'zh-Hans' : 'en-US');
  return lang === 'zh' ? `${formatted} 词` : `${formatted} words`;
}

export function formatPostsCount(lang: UiLang, n: number): string {
  if (lang === 'zh') {
    return `${n} 篇笔记`;
  }
  return n === 1 ? '1 post' : `${n} posts`;
}

export function formatNotesCount(lang: UiLang, n: number): string {
  if (lang === 'zh') {
    return `${n} 篇笔记`;
  }
  return n === 1 ? '1 note' : `${n} notes`;
}
