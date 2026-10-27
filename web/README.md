# Java 与开发技术智能知识库 · 前端

单页聊天界面，对接 Spring Boot 的 SSE 接口 `GET /api/ai/chat`。

## 环境

- Node.js 18 或更高版本
- 后端已启动，并监听 `http://localhost:8081`（上下文路径 `/api`）

## 启动

在项目目录 `java-tech-copilot` 下分别开两个终端。

后端：

```powershell
cd backend
mvn spring-boot:run
```

前端：

```powershell
cd web
npm install
npm run dev
```

浏览器打开 [http://localhost:5173](http://localhost:5173)。

开发服务器会把 `/api` 代理到 `http://localhost:8081`，流式回答不会被开发服务器提前断开。生产构建同样走相对路径 `/api`，执行 `npm run build` 后用 `npm run preview` 即可在本地预览。

## 页面行为

- 进入页面或点击「新建会话」时，本地生成 `100000` 到 `999999` 的整数 `memoryId`。
- 提问通过 `GET /api/ai/chat?memoryId=...&message=...` 发送。
- 回答使用 `fetch` 读取 `text/event-stream`，按打字机方式追加到左侧气泡。
- `Enter` 发送，`Shift + Enter` 换行。回答过程中发送按钮不可用。
- AI 回复按 Markdown 渲染，代码块使用 highlight.js 高亮。

这里用 `fetch` 的 `ReadableStream`，而不是 `EventSource`。`EventSource` 在服务端关闭流之后会自动重连，等于把同一个问题再请求一次。
