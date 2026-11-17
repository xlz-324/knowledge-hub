# KnowledgeHub 项目规范

## 项目用途与当前范围

KnowledgeHub 是一个自部署的个人知识库，一期提供网页剪藏、Markdown 笔记、目录与标签搜索、用户级 AI 配置和带引用的 RAG 问答。

当前处于 W1：建立可运行的前后端骨架和真实健康检查。尚未接入数据库、登录、AI、部署或 CI/CD。不提前实现二期学习、简历和面试功能，也不创建对应空模块。

## 技术栈与初始化来源

- 包管理与工作区：pnpm workspace。
- 前端：React、Vite、TypeScript、ESLint。
- 后端：NestJS、TypeScript、ESM、Vitest、Oxlint。
- 格式化：Prettier。
- 后续按路线接入 PostgreSQL、pgvector、Drizzle，不提前安装或启动数据库。

应用通过官方脚手架初始化：

- 前端：[Vite 官方指南](https://cn.vitejs.dev/guide/)，使用 `create-vite` 的 `react-ts` 模板。
- 后端：[NestJS First Steps](https://docs.nestjs.com/first-steps) 与 [Nest CLI](https://docs.nestjs.com/cli/usages)，使用 `@nestjs/cli new`。
- 工作区：[pnpm Workspaces](https://pnpm.io/workspaces)。

本次使用的实际初始化命令（在仓库根目录执行）：

```bash
pnpm create vite apps/web --template react-ts --eslint --no-immediate --no-interactive
pnpm dlx @nestjs/cli@latest new api --directory apps/api --package-manager pnpm --language TypeScript --skip-git --skip-install --no-observe
pnpm install
```

脚手架只用于初始化；后续变更遵循现有项目结构，不重复在应用目录叠加脚手架。

## 目录职责

```text
apps/
├── web/                 # 独立 React 应用，只通过 HTTP 调用 API
│   ├── src/api/         # HTTP 请求与响应边界
│   ├── src/App.tsx      # 当前健康状态页面
│   └── vite.config.ts   # Vite 与本地 API 代理
└── api/                 # 独立 NestJS 应用
    ├── src/config/      # 启动配置与运行时校验
    ├── src/common/      # request ID、异常响应等基础设施
    ├── src/modules/     # 按业务边界组织功能模块
    └── test/            # HTTP 端到端测试
docs/
├── adr/                 # 架构决策、备选方案与重审条件
├── experiments/         # 可复现的实验记录
└── runbook/             # 已实现且验证过的操作手册
```

`pnpm-workspace.yaml` 声明工作区，`pnpm-lock.yaml` 统一锁定依赖。每个应用保留自己的 `package.json`、脚本、依赖和构建配置。

只有确有共享代码时才创建 `packages/`；当前不需要 Turborepo/Nx。前端不得导入后端 Service、数据库 Schema 或 Secret。

## 开发、检查与构建

要求 Node.js 24 LTS 和 pnpm 11；版本分别见 `.nvmrc` 与根 `package.json`。

在仓库根目录运行：

```bash
pnpm install       # 安装整个 workspace 的依赖
pnpm dev           # 并行启动 Web 和 API
pnpm dev:web       # 只启动 Web
pnpm dev:api       # 只启动 API
pnpm lint          # 前后端 lint
pnpm test          # 单元测试
pnpm test:e2e      # API HTTP 端到端测试
pnpm build         # TypeScript 检查与前后端生产构建
pnpm format        # 统一格式化
pnpm format:check  # 只检查格式
```

Web 默认地址为 `http://localhost:5173`，API 默认端口为 `3000`。真实健康检查为 `GET /api/v1/health/ready`；后端不可用时，前端不得显示正常。

启动前检查现有实例和端口，避免重复启动。API 暂时停止用于失败状态测试后，应恢复服务；交付时说明实际验证和未验证项。

## 配置与安全

- `.env.example` 仅保留非敏感的本地开发示例；真实 `.env`、密钥、令牌和私有资料不得提交。
- 当前 API 直接读取进程环境中的 `NODE_ENV`、`API_PORT` 并校验，**尚未加载 `.env` 文件**。只有实现相应配置加载后，才能把复制 `.env` 写成有效启动步骤。
- 生产配置、Docker、数据库和 CI/CD 在实际任务到达时添加，不在 W1 预建。
- 外部 API 响应和用户输入是不可信数据，在边界校验，不能用类型断言代替真实校验。
- 后端配置校验、错误响应和健康状态必须有相关测试；不得为通过检查而删除断言或掩盖错误。

## 规范继承与记录

适用全局规范：

- `~/.agents/GLOBAL.md`
- `~/.agents/policies/software-engineering.md`：开发任务。
- `~/.agents/policies/project-initialization.md`：项目初始化、搭建和 monorepo 结构调整。
- `~/.agents/policies/frontend-engineering.md`：前端页面、组件、样式、状态、浏览器行为和测试。

全局规范及目录级规则共同生效；仅覆盖冲突的局部规则。`apps/api/AGENTS.md` 由 Nest 脚手架生成，只作用于该应用。新增前端目录不创建没有独立约定的 `AGENTS.md`。

重要技术取舍记录在 `docs/adr/`。README 描述已实现且可运行的能力，不把规划当作已完成事实。
