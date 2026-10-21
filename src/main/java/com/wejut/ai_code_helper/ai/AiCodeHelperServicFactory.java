package com.wejut.ai_code_helper.ai;

import dev.langchain4j.memory.ChatMemory;
import dev.langchain4j.memory.chat.MessageWindowChatMemory;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.service.AiServices;
import jakarta.annotation.Resource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AiCodeHelperServicFactory {
    @Resource
    private ChatModel qwenchatmodel;
    @Bean
    public AiService aiService(){
        ChatMemory chatMemory = MessageWindowChatMemory.withMaxMessages(10);
        AiService aiService = AiServices.builder(AiService.class)
        .chatModel(qwenchatmodel)
        .chatMemory(chatMemory)//会话记录
        .build();
        return aiService;
    }

}
