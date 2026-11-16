# KnowledgeHub

一个支持网页剪藏、Markdown 笔记、自定义目录、搜索与带引用 AI 问答的自部署知识库。

## 当前状态

W1 前后端骨架：React 页面通过 HTTP 请求 NestJS 健康检查，展示真实连接状态。尚未接入数据库、登录或 AI 功能。

一期不包含学习工作台、简历或面试功能。

## 技术基线

- React + Vite + TypeScript
- NestJS（ESM）+ Vitest
- pnpm workspace monorepo
- PostgreSQL + pgvector + Drizzle（从 W2 开始接入）

## 环境要求

- Node.js 24 LTS（见 `.nvmrc`）
- pnpm 11（见 `package.json` 的 `packageManager`）
- Docker Desktop（从 W2 数据库任务开始使用）

使用 nvm 时，在仓库根目录运行 `nvm use`。当前健康检查只需要 Node.js 和 pnpm。

## 安装与启动

```bash
pnpm install
pnpm dev
```

打开终端提示的 Web 地址，默认是 `http://localhost:5173`。

- Web 默认端口：`5173`
- API 默认端口：`3000`
- 健康检查：`GET http://localhost:3000/api/v1/health/ready`

开发时，Vite 将 `/api` 请求代理到本地 API；前端不包含数据库凭据或模型密钥。停止 API 后点击页面的“重新检查”，应显示连接失败。

分别启动或检查单个应用：

```bash
pnpm dev:web
pnpm dev:api
curl -i http://localhost:3000/api/v1/health/ready
```

## 常用命令

在仓库根目录运行：

```bash
pnpm lint         # 前后端 lint
pnpm test         # 单元测试
pnpm test:e2e     # API HTTP 端到端测试
pnpm build        # TypeScript 检查与生产构建
pnpm format       # 统一格式化
pnpm format:check # 检查格式，不修改文件
```

## 配置

本地需要自定义配置时：

```bash
cp .env.example .env
```

`.env` 被 Git 忽略，不提交真实密钥。当前 API 从进程环境读取 `NODE_ENV` 和 `API_PORT` 并在启动时校验；本地默认值分别为 `development` 和 `3000`。

```bash
API_PORT=3100 pnpm dev:api
```

修改 API 端口时，也要同步调整 `apps/web/vite.config.ts` 的开发代理目标；W2 再完善配置共享方式。

## 目录

```text
apps/
├── web/             # Vite 生成的 React 应用
│   └── src/api/     # 前端 HTTP 请求
└── api/             # Nest CLI 生成的 NestJS 应用
    ├── src/config/  # 启动配置校验
    ├── src/common/  # request ID 与错误响应
    └── src/modules/ # 按业务边界组织模块
docs/
├── adr/             # 重要技术决策及取舍
├── experiments/     # 可复现的实验记录
└── runbook/         # 部署、故障处理和恢复手册
```

根目录 `pnpm-workspace.yaml` 声明 workspace；`pnpm-lock.yaml` 统一锁定依赖。暂不引入 Turborepo/Nx，也暂不创建没有实际共享内容的 `packages/`。

## 开发进度

- [ ] W1：完成可运行骨架、真实健康检查、ADR 与干净克隆验收。
- [ ] W2：PostgreSQL 数据模型与服务器安全。

后续按项目学习路线逐周执行，不提前创建二期模块。
