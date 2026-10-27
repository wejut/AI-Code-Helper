package com.wejut.java_tech_copilot.ai;

import org.springframework.stereotype.Service;
import dev.langchain4j.data.message.AiMessage;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.SystemMessage;
import dev.langchain4j.model.chat.ChatModel;
import dev.langchain4j.model.chat.response.ChatResponse;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class JavaTechCopilot {

    private static final String SYSTEM_MESSAGE = """
            你是一个编程助手，用简体中文帮助初学者理解代码。
            规范：
            - 先用一两句话回答问题，再给一个很短的 Java 例子。
            - 句子短，少用术语堆砌。
            - 只讨论编程。问题与编程无关时，说明你只回答编程问题。
            """;
    @Resource
    private ChatModel qwenChatModel;
    //简单对话
    public String chat(String message) {
        UserMessage userMessage = UserMessage.from(message);
        SystemMessage systemMessage = SystemMessage.from(SYSTEM_MESSAGE);
        ChatResponse chatResponse = qwenChatModel.chat(systemMessage, userMessage);
        AiMessage aiMessage = chatResponse.aiMessage();
        log.info("AI 输出：" + aiMessage.toString());
        return aiMessage.text();
    }
    //简单对话-自定义用户消息
    public String chatWithUserMessage(UserMessage userMessage) {
        ChatResponse chatResponse = qwenChatModel.chat(userMessage);
        AiMessage aiMessage = chatResponse.aiMessage();
        log.info("AI 输出：" + aiMessage.toString());
        return aiMessage.text();
    }
}

