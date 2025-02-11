# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 安装构建依赖
RUN apk add --no-cache python3 make g++

# 优先安装依赖
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false

# 复制源码并构建
COPY . .
RUN yarn build

# 生产镜像
FROM node:18-alpine
WORKDIR /app

# 安装运行时依赖
RUN apk add --no-cache postgresql-client

# 复制必要文件
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .
COPY --from=builder /app/src/db/migrations ./migrations

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD node build/healthcheck.js

# 启动命令
CMD ["sh", "-c", "yarn run migrate && node build/index.js"]

# 暴露端口
EXPOSE 3000
