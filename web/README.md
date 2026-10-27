# Java and Development Technology Knowledge Base · Frontend

A single-page chat UI that calls the Spring Boot SSE endpoint `GET /api/ai/chat`.

## Requirements

- Node.js 18 or later
- The backend is running and listening on `http://localhost:8081` (context path `/api`)

## Start

From the `java-tech-copilot` project directory, open two terminals.

Backend:

```powershell
cd backend
mvn spring-boot:run
```

Frontend:

```powershell
cd web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a browser.

The dev server proxies `/api` to `http://localhost:8081`, so a streaming answer is not cut off early. A production build also uses the relative path `/api`. After `npm run build`, run `npm run preview` to preview it locally.

## Page behavior

- On load, or when you click "New chat", the page creates a local integer `memoryId` from `100000` to `999999`.
- Questions are sent as `GET /api/ai/chat?memoryId=...&message=...`.
- Answers are read from `text/event-stream` with `fetch` and appended to the left bubble, typewriter-style.
- `Enter` sends. `Shift + Enter` inserts a new line. The send button stays disabled while an answer is in progress.
- AI replies are rendered as Markdown. Code blocks are highlighted with highlight.js.

Streaming uses the `ReadableStream` from `fetch`, not `EventSource`. After the server closes the stream, `EventSource` reconnects automatically, which would send the same question again.
