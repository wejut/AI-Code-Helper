package com.wejut.java_tech_copilot.ai;

import dev.langchain4j.service.Result;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class AiServiceTest {
    @Resource
    private AiService aiService;
    @Test
    void chat() {
        String result = aiService.chat("你好我是wejut，未来的ai工程师,我想理解未来的ai走向");
        System.out.println(result);
        String result2 = aiService.chat("请简洁描述一下我刚刚说了什么");
        System.out.println(result2);
    }
    @Test
    void chatForReport() {
        AiService.Report report = aiService.chatForReport("你好我是wejut，未来的ai工程师,我想理解int和Integer的区别");
        System.out.println(report);
    }

    @Test
    void chatWithRag() {
        Result<String> result = aiService.chatWithRag("maven的mvnw package命令是干什么的");
        System.out.println(result.sources());
        System.out.println(result.content());
    }

    @Test
    void chatWithTools() {
        String result = aiService.chat("Docker 怎么运行一个 Spring Boot 应用？");
        System.out.println(result);
    }

    @Test
    void chatWithMcp() {
        String result = aiService.chat("孙宇晨是谁？");
        System.out.println(result);
    }

    @Test
    void chatWithSafeInputGuardrail() {
        String result = aiService.chat("kill the game");
        System.out.println(result);
    }
}