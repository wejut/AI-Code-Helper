# Java 与开发技术智能知识库

> 基于 LangChain4j + 通义千问的 Java 后端知识问答与面试辅导

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-149ECA.svg)](https://react.dev/)
[![LangChain4j](https://img.shields.io/badge/LangChain4j-1.22.0-blue.svg)](https://github.com/langchain4j/langchain4j)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](https://www.oracle.com/java/)

面向 Java 后端初学者的对话式知识库。提问后，回答通过 SSE 按打字机方式流出，并按 Markdown 渲染代码和列表。知识库能覆盖的问题直接作答；知识库之外的编程问题，会调用菜鸟教程搜索，再根据标题、链接和摘要整理回答。

## 项目介绍

### 定位

- 编程答疑：用简体中文解释 Java、Spring 和 Maven 相关问题，并给出短示例
- 知识检索：围绕本地 Markdown 知识库回答，减少脱离资料的发挥
- 面试辅导：可以直接要一道并发等方向的面试题，并给出参考答案和易错点

知识库原文在 `backend/src/main/resources/docs`，目前覆盖：

- Java SE、Java EE
- Spring、Maven
- JDBC、MyBatis、Redis
- JVM、JUnit、并发

### 技术

#### AI 服务

- **LangChain4j**：对话服务、会话记忆、RAG、工具调用和护轨都在这一层组装
- **通义千问**：对话模型 `qwen-max`，向量模型 `text-embedding-v4`
- **流式响应**：`GET /api/ai/chat` 返回 `text/event-stream`，前端逐段追加

#### 安全机制

- **输入护轨**：发送前检查用户输入，命中敏感词时拒绝继续调用模型

#### 工具集成

- **RAG 检索增强**：启动时把文档切段写入内存向量库，检索最多 5 条、分数不低于 0.75 的片段
- **会话记忆**：每个 `memoryId` 单独保留最近 10 条消息，新建会话会换一个新的记忆
- **MCP 联网搜索**：通过智谱 MCP 的 Web Search 接口补充实时资料
- **菜鸟教程搜索**：知识库没有覆盖的编程主题，用 Jsoup 抓取 runoob 搜索结果

## 系统截图

首页给出 Java SE、Spring、Maven 和面试题四类建议，点卡片即可提问。

[![首页建议提问](./demo/01-home.png)](./demo/01-home.png)

并发问题会按知识库内容流式回答，并分阶段说明锁升级。

[![synchronized 锁升级问答](./demo/02-synchronized.png)](./demo/02-synchronized.png)

版本特性类问题会整理成条目，代码和术语用 Markdown 展示。

[![JDK 特性问答](./demo/03-jdk25.png)](./demo/03-jdk25.png)

## 快速开始

### 环境要求

- **Java**：JDK 21+
- **Node.js**：18+
- **Maven**：3.6+
- **通义千问 API**：对话、流式对话和向量模型各需要一把 Key
- **智谱 API**：MCP 联网搜索需要一把 Key

### 启动步骤

#### 1. 配置密钥

`backend/src/main/resources/application.yml` 已启用 `local` 配置。在同目录新建 `application-local.yml`（该文件已被 Git 忽略），填入自己的密钥：

```yaml
langchain4j:
  community:
    dashscope:
      chat-model:
        api-key: 你的通义千问 API Key
      embedding-model:
        api-key: 你的通义千问 API Key
      streaming-chat-model:
        api-key: 你的通义千问 API Key
bigmodel:
  api-key: 你的智谱 API Key
```

`RagConfig` 目前用本机绝对路径加载整个 `backend` 目录。换机器后，把 `FileSystemDocumentLoader.loadDocuments(...)` 的参数改成你自己的 `backend` 目录。

#### 2. 后端启动

```bash
cd backend
mvn spring-boot:run
```

服务监听 `http://localhost:8081`，上下文路径是 `/api`。

#### 3. 前端启动

```bash
cd web
npm install
npm run dev
```

#### 4. 访问应用

- 前端地址：<http://localhost:5173>
- 后端 API：<http://localhost:8081/api>

开发服务器把 `/api` 代理到 `http://localhost:8081`。页面上 `Enter` 发送，`Shift + Enter` 换行。

## 技术架构

```text
┌─────────────────┐    ┌─────────────────┐
│   React 前端     │────│  Spring Boot    │
│   - 聊天界面     │    │    后端服务      │
│   - 实时流式     │    │   - REST API    │
│   - Markdown    │    │   - SSE 推送     │
└─────────────────┘    └─────────────────┘
                              │
                    ┌─────────────────┐
                    │   LangChain4j   │
                    │   - AI 服务层   │
                    │   - 工具集成    │
                    │   - 安全防护    │
                    └─────────────────┘
                              │
                    ┌─────────────────┐
                    │   通义千问 API   │
                    │   - 对话模型    │
                    │   - 嵌入模型    │
                    │   - 流式输出    │
                    └─────────────────┘
```

## 核心模块

- `AiService`：对话、结构化输出、RAG 问答和流式会话的服务接口
- `JavaTechCopilotServicFactory`：组装流式模型、会话记忆、检索器、本地工具和 MCP
- `QwenChatModelConfig`：通义千问对话模型配置
- `RagConfig`：文档加载、切段、向量化和内容检索
- `McpConfig`：智谱 Web Search 的 MCP 客户端
- `InterviewQuestionTool`：菜鸟教程搜索
- `SafeInputGuardrail`：输入安全防护
- `ChatModelListenerConfig`：记录模型请求、响应和错误

## 目录结构

```text
java-tech-copilot/
├── README.md
├── pom.xml                 # 聚合 backend
├── demo/                   # 系统截图
├── backend/                # Spring Boot，端口 8081
│   └── src/main/resources/docs
└── web/                    # React + Vite，端口 5173
```

## 致谢

- [LangChain4j](https://github.com/langchain4j/langchain4j) - Java AI 应用开发框架
- [阿里云通义千问](https://dashscope.aliyun.com/) - 对话与向量模型
- [Spring Boot](https://spring.io/projects/spring-boot) - 应用框架
- [React](https://react.dev/) - 用户界面
