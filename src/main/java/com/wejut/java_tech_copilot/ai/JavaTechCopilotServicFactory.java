package com.wejut.java_tech_copilot.ai;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.StreamingChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.wejut.java_tech_copilot.ai.tools.InterviewQuestionTool;
import dev.langchain4j.rag.content.retriever.ContentRetriever;
import dev.langchain4j.mcp.McpToolProvider;

@Configuration
public class JavaTechCopilotServicFactory {
    @Resource
    private StreamingChatModel  qwenStreamingChatModel;
    @Resource
    private ContentRetriever contentRetriever;
    @Resource
    private McpToolProvider mcpToolProvider;

    @Bean
    public AiService aiService(){
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        AiService aiService = AiServices.builder(AiService.class)
        .streamingChatModel(qwenStreamingChatModel)
        .chatMemory(chatMemory)//会话记录
        .chatMemoryProvider(memoryId ->
            MessageWindowChatMemory.withMaxMessages(10)) // 每个会话独立存储.contentRetriever(contentRetriever)//内容检索
        .tools(new InterviewQuestionTool())//工具调用
        .toolProvider(mcpToolProvider)//MCP工具调用
        .build();
        return aiService;
    }

}
