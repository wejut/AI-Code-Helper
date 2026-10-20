package com.wejut.ai_code_helper.ai;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@Slf4j
@SpringBootTest
class AiCodeHelperTest {

	@Resource
	private AiCodeHelper aiCodeHelper;

	@Test
	void chat() {
		String result = aiCodeHelper.chat("你好，我是未来的ai工程师");

	}

}
