package com.wejut.ai_code_helper.ai;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import dev.langchain4j.data.message.UserMessage;
import dev.langchain4j.data.message.TextContent;
import dev.langchain4j.data.message.ImageContent;

@Slf4j
@SpringBootTest
class AiCodeHelperTest {

	@Resource
	private AiCodeHelper aiCodeHelper;

	@Test
	void chat() {
		String result = aiCodeHelper.chat("Java 里 int 和 Integer 有什么区别？");
	}

	@Test
	void testChat1() {
		UserMessage userMessage = UserMessage.from(
			TextContent.from("用一句话说明什么是方法。"),
			ImageContent.from("https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png")
		);
			aiCodeHelper.chatWithUserMessage(userMessage);
		
	}
}
