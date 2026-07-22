# CLAUDE.md — 天堂次元港 项目指引

## 项目简介

「天堂次元港」是一个面向二次元爱好者的图片分享社区网站。用户可以注册登录、发帖上传二次元角色图片（原画/二创）、点赞收藏评论、关注其他用户。

## 标准文件路径

本项目所有开发规范文档存放在 `docs/` 文件夹中，开发前请先查阅：

| 文件 | 路径 | 说明 |
|------|------|------|
| 需求文档 | [docs/requirements.md](docs/requirements.md) | 完整功能需求清单，所有功能编号和说明 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 技术选型、项目结构、数据库设计、API 路由 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 配色、布局、组件规范、字体图标 |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) | 分步执行步骤和验收标准 |

## 开发日志

每日开发日志存放在 `devlogs/` 文件夹中，按日期命名：`YYYY-MM-DD.md`

每天开始开发前：
1. 查看前一天的日志，了解进度
2. 继续未完成的待办事项

每天开发结束后：
1. 创建或更新当日日志
2. 记录已完成事项和待办事项

## 工作原则

1. **逐步推进**：严格按 `docs/execution-plan.md` 的顺序执行，每次只做一步
2. **完成一步 → 暂停 → 等用户确认 → 再继续下一步**
3. **写代码前先查标准文档**：技术规范、设计规范中已有明确规定的，严格遵守
4. **保持一致性**：命名、文件组织、代码风格与已有代码保持一致
5. **每步验证**：`npm run dev` 启动后浏览器测试，确保功能正常

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (http://localhost:3000)
npx prisma studio    # 查看/编辑数据库

# 数据库
npx prisma db push   # 推送 Schema 变更到数据库
npx prisma generate  # 重新生成 Prisma 客户端

# 构建
npm run build        # 生产构建
npm start            # 启动生产服务器
```

## 技术栈速查

- Next.js 15 (App Router) + TypeScript + TailwindCSS
- Prisma ORM + SQLite
- NextAuth.js v5 (Auth.js)
- lucide-react 图标
- bcryptjs 密码加密
