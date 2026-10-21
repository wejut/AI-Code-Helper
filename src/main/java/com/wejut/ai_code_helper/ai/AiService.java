package com.wejut.ai_code_helper.ai;
import dev.langchain4j.service.SystemMessage;
import java.util.List;

public interface AiService {

    @SystemMessage(fromResource = "static/systempromt.txt")
    String chat(String userMessage);

    @SystemMessage(fromResource = "static/systempromt.txt")
    Report chatForReport(String userMessage);

    record Report(String name, List<String> Suggestionlist){}
}