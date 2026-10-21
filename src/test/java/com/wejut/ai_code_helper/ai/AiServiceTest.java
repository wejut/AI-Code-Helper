package com.wejut.ai_code_helper.ai;

import jakarta.annotation.Resource;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;
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
}