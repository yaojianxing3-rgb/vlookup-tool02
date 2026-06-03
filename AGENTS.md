# AGENTS.md

## 项目概览

本项目是一个 **VLOOKUP 多文件批量匹配工具**，提供可视化界面，无需手动编辑 Excel 函数即可实现一份主表批量匹配 N 个辅表文件。核心功能包括：

- 主文件配置：选择基准 Excel、自定义表头行号、勾选保留列、设置匹配关键字
- 多匹配文件配置：批量导入辅表、排序、分组、独立规则配置
- 三级存储规则：全局→单文件→单列优先级配置
- 结果预览与多方案导出：完整导出、仅主列导出、仅匹配列导出
- 配置存档：保存/加载工程配置复用

### 界面特点

- **左右分栏布局**：左侧 60% 配置面板 + 右侧 40% 规则与预览面板，清晰分区
- **步骤指示器**：顶部显示操作流程（上传主文件 → 添加匹配文件 → 配置规则 → 执行匹配），引导用户操作
- **Tab式文件切换**：匹配文件列表使用 Tabs 组件，一键切换不同文件的列配置
- **简易/高级模式**：简易模式自动使用默认配置，高级模式可自定义存储规则
- **视觉优化**：统一的配色方案（slate-50背景、blue-500强调色）、精致的卡片设计、流畅的过渡动画

## 技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4
- **Excel 处理**: xlsx (SheetJS)

## 目录结构

```
├── src/
│   ├── app/                    # 页面路由
│   │   ├── api/               # API 路由
│   │   │   ├── parse/         # 文件解析 API
│   │   │   ├── match/         # 匹配执行 API
│   │   │   └── export/        # 导出 API
│   │   ├── page.tsx           # 主页面
│   │   ├── layout.tsx         # 布局
│   │   └── globals.css        # 全局样式
│   ├── components/
│   │   ├── ui/               # shadcn/ui 组件库
│   │   └── vlookup/          # VLOOKUP 工具专用组件
│   │       ├── main-file-config.tsx      # 主文件配置面板
│   │       ├── match-files-panel.tsx     # 多匹配文件配置面板
│   │       ├── rules-config-panel.tsx    # 规则配置面板
│   │       ├── preview-export-panel.tsx  # 预览导出面板
│   │       ├── step-indicator.tsx        # 步骤指示器
│   │       └── mode-toggle.tsx           # 简易/高级模式切换
│   ├── hooks/
│   │   ├── use-config-storage.ts         # 配置存档 Hook
│   │   └── use-mobile.ts                  # 移动端检测
│   └── lib/
│       ├── types.ts                       # 核心类型定义
│       ├── excel-utils.ts                 # Excel 处理工具
│       └── utils.ts                       # 通用工具函数
├── DESIGN.md                              # 设计规范文档
├── package.json                           # 项目依赖
└── tsconfig.json                          # TypeScript 配置
```

## 构建与测试命令

```bash
# 安装依赖
pnpm install

# 开发模式启动
pnpm dev

# TypeScript 类型检查
pnpm ts-check

# ESLint 检查
pnpm lint

# 构建生产版本
pnpm build

# 启动生产环境
pnpm start
```

## API 接口

### 1. 文件解析 `/api/parse`

- **方法**: POST
- **参数**: FormData
  - `file`: Excel 文件 (.xls/.xlsx)
  - `headerRow`: 表头行号 (可选，默认1)
- **返回**:
  ```json
  {
    "success": true,
    "fileInfo": { "id", "name", "rowCount", "columnCount", ... },
    "sheetData": { "headers", "rows", "columnInfo", ... }
  }
  ```

### 2. 匹配执行 `/api/match`

- **方法**: POST
- **参数**: FormData
  - `config`: JSON 字符串（包含完整配置）
  - `mainFile`: 主文件（可选，如已上传）
  - `matchFiles`: 匹配文件列表
- **返回**:
  ```json
  {
    "success": true,
    "result": { "previewRows", "matchedCount", "outputData", ... }
  }
  ```

### 3. 导出 `/api/export`

- **方法**: POST
- **参数**: JSON
  ```json
  {
    "matchResult": { ... },
    "exportConfig": { "mode", "includeMatchLog", ... },
    "mainFileConfig": { ... }
  }
  ```
- **返回**:
  ```json
  {
    "success": true,
    "files": { "mainFile": "base64", "logFile": "base64", ... }
  }
  ```

## 核心类型定义

详见 `src/lib/types.ts`，主要类型包括：

- `FileInfo`: Excel 文件信息
- `SheetData`: Excel 表格数据（含 headers, rows, columnInfo）
- `MainFileConfig`: 主文件配置
- `MatchFileConfig`: 单个匹配文件配置
- `StorageRule`: 存储规则（同名回填/新建列）
- `GlobalStorageConfig`: 全局存储配置
- `MatchResult`: 匹配结果

## 开发规范

### 编码规范

- 严格 TypeScript `strict` 模式
- 禁止隐式 `any` 和 `as any`
- 函数参数、返回值必须有明确类型
- React 17+ 不需要 `import React from 'react'`

### Hydration 问题防范

- 使用 `use client` + `useEffect` + `useState` 处理动态内容
- 禁止在 JSX 渲染逻辑中直接使用 `typeof window`, `Date.now()`, `Math.random()`

### 组件规范

- 使用 shadcn/ui 组件库
- 组件文件名使用小写连字符（kebab-case）
- 每个组件必须有 `'use client'` 指令（如涉及状态）

## 常见问题排查

### 1. 模块找不到错误

检查组件文件是否存在于 `src/components/vlookup/` 目录下，确保导出语句正确。

### 2. TypeScript 类型错误

运行 `pnpm ts-check` 查看详细错误，根据错误信息修复类型定义。

### 3. API 返回 400 错误

检查请求参数是否符合 API 要求：
- 文件必须是 .xls 或 .xlsx 格式
- 配置 JSON 必须包含必要的字段

## 性能优化

- 数据量 > 2万行 自动切换哈希字典匹配
- 增量匹配：仅对主表空白未填充行做匹配
- 前端使用虚拟滚动预览大数据

## 后续优化建议

1. 添加文件拖拽上传功能
2. 实现配置存档UI界面
3. 添加数据预处理功能（去空格、特殊字符）
4. 支持多工作表选择
5. 添加匹配进度实时显示