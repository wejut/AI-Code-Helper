package com.wejut.java_tech_copilot.ai;

import com.wejut.java_tech_copilot.ai.guardrail.SafeInputGuardrail;
import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.Result;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.guardrail.InputGuardrails;
import reactor.core.publisher.Flux;

import java.util.List;

@InputGuardrails({SafeInputGuardrail.class})
public interface AiService {

    @SystemMessage(fromResource = "static/systempromt.txt")
    String chat(String userMessage);

    @SystemMessage(fromResource = "static/systempromt.txt")
    Report chatForReport(String userMessage);

    record Report(String name, List<String> Suggestionlist){}

    @SystemMessage(fromResource = "static/systempromt.txt")
    Result<String> chatWithRag(String userMessage);

    // 流式对话
    @SystemMessage(fromResource = "static/systempromt.txt")
    Flux<String> chatStream(@MemoryId int memoryId, @UserMessage String userMessage);

}