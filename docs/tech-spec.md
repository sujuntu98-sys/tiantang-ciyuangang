# 技术规范 — 天堂次元港

## 技术栈

| 层面 | 选型 | 版本 |
|------|------|------|
| 框架 | Next.js (App Router) | 15.x |
| 语言 | TypeScript | 5.x |
| 样式 | TailwindCSS | 4.x |
| 数据库 | SQLite | 3.x |
| ORM | Prisma | 6.x |
| 认证 | NextAuth.js | v5 (Auth.js) |
| 图标 | lucide-react | latest |
| 包管理 | npm | latest |

## 项目结构

```
d:/one step/
├── prisma/
│   └── schema.prisma          # 数据库模型定义
├── public/
│   └── uploads/               # 用户上传的图片
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 根布局
│   │   ├── page.tsx           # 首页
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── post/
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── user/
│   │   │   └── [username]/page.tsx
│   │   ├── search/page.tsx
│   │   └── settings/page.tsx
│   ├── components/            # 可复用组件
│   ├── lib/                   # 工具函数、Prisma 客户端
│   └── middleware.ts          # 路由鉴权中间件
├── docs/                      # 开发文档
├── devlogs/                   # 每日开发日志
└── CLAUDE.md                  # 项目指引
```

## 数据库设计

使用 SQLite，通过 Prisma ORM 管理。

### User 表
- `id`: Integer, PK, AutoIncrement
- `username`: String, Unique
- `email`: String, Unique
- `passwordHash`: String
- `avatar`: String? (头像 URL)
- `bio`: String? (个人简介)
- `createdAt`: DateTime

### Post 表
- `id`: Integer, PK, AutoIncrement
- `title`: String
- `description`: String?
- `imageUrl`: String
- `type`: String ("official" | "fanart")
- `userId`: Integer → User.id
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Tag 表
- `id`: Integer, PK, AutoIncrement
- `name`: String, Unique

### PostTag 表（多对多关联）
- `postId`: Integer → Post.id
- `tagId`: Integer → Tag.id
- 联合主键 (postId, tagId)

### Like 表
- `id`: Integer, PK, AutoIncrement
- `userId`: Integer → User.id
- `postId`: Integer → Post.id
- `createdAt`: DateTime
- 唯一约束 (userId, postId)

### Favorite 表
- `id`: Integer, PK, AutoIncrement
- `userId`: Integer → User.id
- `postId`: Integer → Post.id
- `createdAt`: DateTime
- 唯一约束 (userId, postId)

### Comment 表
- `id`: Integer, PK, AutoIncrement
- `content`: String
- `userId`: Integer → User.id
- `postId`: Integer → Post.id
- `createdAt`: DateTime

### Follow 表
- `id`: Integer, PK, AutoIncrement
- `followerId`: Integer → User.id
- `followingId`: Integer → User.id
- `createdAt`: DateTime
- 唯一约束 (followerId, followingId)

## API 路由设计

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 用户登录 | 否 |
| GET | /api/posts | 获取帖子列表（支持分页、排序） | 否 |
| POST | /api/posts | 创建帖子 | 是 |
| GET | /api/posts/[id] | 获取帖子详情 | 否 |
| DELETE | /api/posts/[id] | 删除帖子 | 是（仅作者） |
| POST | /api/posts/[id]/like | 点赞/取消 | 是 |
| POST | /api/posts/[id]/favorite | 收藏/取消 | 是 |
| GET | /api/posts/[id]/comments | 获取评论 | 否 |
| POST | /api/posts/[id]/comments | 发表评论 | 是 |
| POST | /api/upload | 上传图片 | 是 |
| GET | /api/users/[username] | 获取用户信息 | 否 |
| POST | /api/users/[username]/follow | 关注/取关 | 是 |
| GET | /api/search | 搜索帖子 | 否 |

## 图片安全规范
- 允许格式：image/jpeg, image/png, image/webp
- 最大大小：10MB
- 文件名：UUID 重命名，保留原始扩展名
- 存储路径：`public/uploads/`
