import type {
  WorkspaceTabInfo,
  Shot,
  Asset,
  TimelineTrack,
  VoiceOption,
  MusicTrack,
  SoundEffect,
  ConsistencyReport,
} from "../types";

// === Workspace Tabs (replaces WORKFLOW_STEPS) ===

export const WORKSPACE_TABS: WorkspaceTabInfo[] = [
  {
    id: "script",
    label: "脚本工作台",
    shortLabel: "脚本",
    description: "AI 驱动的脚本生成与分镜创建",
  },
  {
    id: "visual",
    label: "视觉工作台",
    shortLabel: "视觉",
    description: "语义视觉匹配与镜头建议",
  },
  {
    id: "arrange",
    label: "编排工作台",
    shortLabel: "编排",
    description: "时间线编排与多模态音频配置",
  },
];

// === Assets (replaces MOCK_ANCHORS) ===

export const MOCK_ASSETS: Asset[] = [
  {
    id: "asset-1",
    type: "location",
    name: "中世纪欧洲城镇",
    description:
      "昏暗狭窄的石板街道，木结构建筑，教堂尖塔。统一的暖黄色调与阴影对比。",
    color: "#8a7a5a",
    tags: ["中世纪", "欧洲", "街道", "教堂"],
    referenceImages: [],
    consistencyScore: 94,
    createdAt: Date.now(),
    atmosphere: "阴郁压抑，瘟疫笼罩下的肃穆感",
    lighting: "暖黄色烛光与阴暗阴影交织",
  },
  {
    id: "asset-2",
    type: "prop",
    name: "鼠疫杆菌微观",
    description:
      "杆状细菌的电子显微镜风格渲染，蓝紫色调，带有生物发光效果。",
    color: "#6644aa",
    tags: ["微观", "细菌", "科学", "电子显微镜"],
    referenceImages: [],
    consistencyScore: 87,
    createdAt: Date.now(),
    visualTraits: "杆状形态，蓝紫色生物发光",
    scale: "微观 — 电子显微镜级别",
  },
  {
    id: "asset-3",
    type: "character",
    name: "鸟嘴医生",
    description:
      "标志性的鸟嘴面具、黑色长袍、手持香料棒。作为贯穿全片的视觉符号。",
    color: "#3a3a3a",
    tags: ["医生", "面具", "鸟嘴", "中世纪"],
    referenceImages: [],
    consistencyScore: 91,
    createdAt: Date.now(),
    appearance: "鸟嘴面具，黑色长袍，瘦高身形",
    costume: "黑色防疫长袍，皮手套，手持香料棒",
  },
  {
    id: "asset-4",
    type: "prop",
    name: "数据可视化叠层",
    description:
      "死亡人数统计图、传播路线地图。简洁线条风格，琥珀色高亮标注。",
    color: "#e8b468",
    tags: ["数据", "图表", "可视化", "地图"],
    referenceImages: [],
    consistencyScore: 76,
    createdAt: Date.now(),
    visualTraits: "简洁线条，琥珀色高亮",
    scale: "全屏叠层",
  },
  {
    id: "asset-5",
    type: "location",
    name: "贸易路线地图",
    description:
      "中世纪风格的欧洲-亚洲地图，标注瘟疫传播方向的动态箭头，羊皮纸质感。",
    color: "#cc8844",
    tags: ["地图", "贸易", "丝绸之路", "中世纪"],
    referenceImages: [],
    consistencyScore: 82,
    createdAt: Date.now(),
    atmosphere: "古朴学术感，羊皮纸上的墨迹",
    lighting: "自然日光下的手稿质感",
  },
  {
    id: "asset-6",
    type: "location",
    name: "隔离岛图示",
    description:
      "威尼斯拉扎雷托岛的鸟瞰重建图，展示世界最早的隔离检疫设施。",
    color: "#44aa88",
    tags: ["威尼斯", "隔离", "岛屿", "检疫"],
    referenceImages: [],
    consistencyScore: 96,
    createdAt: Date.now(),
    atmosphere: "宁静而庄重的海上建筑",
    lighting: "柔和地中海日光",
  },
];

// === Shots (replaces MOCK_SCENES) ===

export const MOCK_SHOTS: Shot[] = [
  {
    id: "shot-1",
    order: 1,
    title: "黑死病降临",
    narration:
      "1347年，一支来自东方的热那亚商船队停靠在西西里岛的墨西拿港。船员们身上布满了黑色的脓疮，散发着恶臭——鼠疫，这场改变欧洲命运的瘟疫，就此登陆。",
    duration: 14,
    shotType: "wide",
    cameraMovement: "dolly-in",
    visualKeywords: ["商船", "墨西拿港", "鼠疫", "黑死病"],
    visualNotes: "从远处的海面缓慢推进到港口特写，展示商船轮廓",
    thumbnailColor: "#2a1f4e",
    assetRefs: [
      { assetId: "asset-1", assetType: "location", role: "主场景" },
      { assetId: "asset-3", assetType: "character", role: "远景人影" },
    ],
  },
  {
    id: "shot-2",
    order: 2,
    title: "死神的使者：鼠与蚤",
    narration:
      "鼠疫杆菌寄生在跳蚤体内，跳蚤又附着在黑鼠身上。当老鼠死去，跳蚤便跳向人类宿主。一次叮咬，就能将致命的病原体注入血液，引发淋巴结肿大与高烧。",
    duration: 12,
    shotType: "macro",
    cameraMovement: "dolly-in",
    visualKeywords: ["鼠疫杆菌", "跳蚤", "黑鼠", "淋巴结"],
    visualNotes: "微距镜头展示跳蚤与细菌，逐步放大至分子级别",
    thumbnailColor: "#4e2a1f",
    assetRefs: [
      { assetId: "asset-2", assetType: "prop", role: "核心视觉" },
    ],
  },
  {
    id: "shot-3",
    order: 3,
    title: "席卷欧洲",
    narration:
      "短短五年间，黑死病沿着贸易路线从意大利蔓延到法国、英格兰、德意志，直至斯堪的纳维亚。城市街道上堆满了无人掩埋的尸体，教堂的丧钟日夜不停地敲响。",
    duration: 13,
    shotType: "aerial",
    cameraMovement: "crane-up",
    visualKeywords: ["贸易路线", "欧洲地图", "蔓延", "死亡"],
    visualNotes: "俯视欧洲地图，瘟疫以动态箭头向四方扩散",
    thumbnailColor: "#1f3d4e",
    assetRefs: [
      { assetId: "asset-5", assetType: "location", role: "主场景" },
      { assetId: "asset-4", assetType: "prop", role: "数据叠层" },
      { assetId: "asset-1", assetType: "location", role: "街道场景" },
    ],
  },
  {
    id: "shot-4",
    order: 4,
    title: "社会崩塌与重建",
    narration:
      "欧洲失去了约三分之一的人口。劳动力极度短缺，农奴制度开始瓦解，幸存的工人获得了前所未有的议价权。黑死病意外地为文艺复兴和现代欧洲的诞生埋下了种子。",
    duration: 15,
    shotType: "tracking",
    cameraMovement: "pan-right",
    visualKeywords: ["人口锐减", "农奴制", "劳动力", "文艺复兴"],
    visualNotes: "横向跟踪镜头，从废墟走向新建筑，暗示重建",
    thumbnailColor: "#4e1f3d",
    assetRefs: [
      { assetId: "asset-1", assetType: "location", role: "城镇废墟" },
      { assetId: "asset-4", assetType: "prop", role: "数据叠层" },
    ],
  },
  {
    id: "shot-5",
    order: 5,
    title: "瘟疫的遗产",
    narration:
      "从中世纪的隔离制度到现代的公共卫生体系，鼠疫深刻地塑造了人类对抗传染病的方式。威尼斯首创的四十天隔离法，至今仍是'检疫'一词的词源。",
    duration: 11,
    shotType: "medium",
    cameraMovement: "static",
    visualKeywords: ["隔离制度", "公共卫生", "检疫", "威尼斯"],
    visualNotes: "中景展示威尼斯隔离岛全貌，配合现代公卫画面叠化",
    thumbnailColor: "#1f4e2a",
    assetRefs: [
      { assetId: "asset-6", assetType: "location", role: "主场景" },
      { assetId: "asset-3", assetType: "character", role: "历史回顾" },
    ],
  },
];

// === Consistency Report ===

export const MOCK_CONSISTENCY_REPORT: ConsistencyReport = {
  overallScore: 88,
  issues: [
    {
      id: "issue-1",
      severity: "warning",
      message: "「数据可视化叠层」一致性评分偏低 (76%)，建议统一标注风格",
      assetId: "asset-4",
    },
    {
      id: "issue-2",
      severity: "info",
      message: "「贸易路线地图」在场景3中的色调与整体风格略有偏差",
      assetId: "asset-5",
      shotId: "shot-3",
    },
    {
      id: "issue-3",
      severity: "warning",
      message: "场景4中「鸟嘴医生」未出现，但叙事暗示其存在",
      assetId: "asset-3",
      shotId: "shot-4",
    },
  ],
  checkedAt: Date.now(),
};

// === Timeline Tracks (kept) ===

export const MOCK_TIMELINE_TRACKS: TimelineTrack[] = [
  {
    id: "track-video",
    type: "video",
    label: "画面",
    clips: [
      {
        id: "v1",
        label: "黑死病降临",
        startTime: 0,
        duration: 14,
        color: "#2a1f4e",
      },
      {
        id: "v2",
        label: "鼠与蚤",
        startTime: 14,
        duration: 12,
        color: "#4e2a1f",
      },
      {
        id: "v3",
        label: "席卷欧洲",
        startTime: 26,
        duration: 13,
        color: "#1f3d4e",
      },
      {
        id: "v4",
        label: "社会重建",
        startTime: 39,
        duration: 15,
        color: "#4e1f3d",
      },
      {
        id: "v5",
        label: "瘟疫遗产",
        startTime: 54,
        duration: 11,
        color: "#1f4e2a",
      },
    ],
  },
  {
    id: "track-vo",
    type: "voiceover",
    label: "配音",
    clips: [
      {
        id: "vo1",
        label: "旁白 1",
        startTime: 1,
        duration: 12,
        color: "#5a4a2e",
      },
      {
        id: "vo2",
        label: "旁白 2",
        startTime: 15,
        duration: 10,
        color: "#5a4a2e",
      },
      {
        id: "vo3",
        label: "旁白 3",
        startTime: 27,
        duration: 11,
        color: "#5a4a2e",
      },
      {
        id: "vo4",
        label: "旁白 4",
        startTime: 40,
        duration: 13,
        color: "#5a4a2e",
      },
      {
        id: "vo5",
        label: "旁白 5",
        startTime: 55,
        duration: 9,
        color: "#5a4a2e",
      },
    ],
  },
  {
    id: "track-music",
    type: "music",
    label: "音乐",
    clips: [
      {
        id: "m1",
        label: "暗黑序章",
        startTime: 0,
        duration: 26,
        color: "#2e3a5a",
      },
      {
        id: "m2",
        label: "紧张推进",
        startTime: 26,
        duration: 28,
        color: "#3a2e5a",
      },
      {
        id: "m3",
        label: "沉思尾声",
        startTime: 54,
        duration: 11,
        color: "#2e5a3a",
      },
    ],
  },
  {
    id: "track-sub",
    type: "subtitle",
    label: "字幕",
    clips: [
      {
        id: "s1",
        label: "中文字幕",
        startTime: 1,
        duration: 63,
        color: "#3a3a3a",
      },
    ],
  },
];

// === Audio (kept) ===

export const MOCK_VOICES: VoiceOption[] = [
  { id: "v1", name: "沉稳", style: "纪录片旁白", language: "中文" },
  { id: "v2", name: "温和", style: "娓娓道来", language: "中文" },
  { id: "v3", name: "学者", style: "学术讲解", language: "中文" },
  { id: "v4", name: "少年", style: "青春科普", language: "中文" },
];

export const MOCK_MUSIC: MusicTrack[] = [
  {
    id: "mus1",
    name: "暗夜挽歌",
    genre: "管弦乐",
    bpm: 68,
    duration: 180,
    mood: "阴郁",
  },
  {
    id: "mus2",
    name: "死亡之舞",
    genre: "电影配乐",
    bpm: 104,
    duration: 240,
    mood: "紧张",
  },
  {
    id: "mus3",
    name: "中世纪回响",
    genre: "古乐",
    bpm: 76,
    duration: 200,
    mood: "古朴",
  },
  {
    id: "mus4",
    name: "曙光微现",
    genre: "管弦乐",
    bpm: 92,
    duration: 220,
    mood: "希望",
  },
  {
    id: "mus5",
    name: "瘟疫阴影",
    genre: "氛围音乐",
    bpm: 56,
    duration: 300,
    mood: "压迫",
  },
  {
    id: "mus6",
    name: "新世界序曲",
    genre: "电影配乐",
    bpm: 100,
    duration: 195,
    mood: "宏大",
  },
];

export const MOCK_SFX: SoundEffect[] = [
  { id: "sfx1", name: "教堂丧钟", category: "氛围", duration: 4 },
  { id: "sfx2", name: "老鼠窸窣", category: "环境", duration: 3 },
  { id: "sfx3", name: "风声呼啸", category: "氛围", duration: 5 },
  { id: "sfx4", name: "翻书页", category: "拟音", duration: 0.5 },
  { id: "sfx5", name: "火焰燃烧", category: "环境", duration: 6 },
  { id: "sfx6", name: "人群哀嚎", category: "氛围", duration: 4 },
  { id: "sfx7", name: "场景转换", category: "过渡", duration: 1.5 },
  { id: "sfx8", name: "心跳声", category: "拟音", duration: 2 },
];
