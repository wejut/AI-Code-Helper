package com.wejut.java_tech_copilot.ai.tools;

import dev.langchain4j.agent.tool.P;
import dev.langchain4j.agent.tool.Tool;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public class InterviewQuestionTool {

    private static final int MAX_RESULTS = 8;

    /**
     * 从菜鸟教程搜索知识库之外的编程资料。
     *
     * @param keyword 搜索关键词（如 "Docker"、"Kafka"）
     * @return 标题、链接和摘要；失败或没有结果时返回说明
     */
    @Tool(name = "runoobSearch", value = """
            Searches tutorials on runoob.com and returns titles, links, and short summaries.
            The current knowledge base already covers Java SE, Java EE, Spring, Maven, JDBC,
            MyBatis, Redis, JVM, JUnit, and concurrency. Call this tool only when the user
            asks for programming knowledge outside those topics. The input must be one clear
            search term, such as a technology or concept name.
            """
    )
    public String searchInterviewQuestions(@P(value = "the search keyword, for example Docker or Kafka") String keyword) {
        String encodedKeyword = URLEncoder.encode(keyword, StandardCharsets.UTF_8);
        String url = "https://www.runoob.com/?s=" + encodedKeyword;
        Document doc;
        try {
            doc = Jsoup.connect(url)
                    .userAgent("Mozilla/5.0")
                    .timeout(5000)
                    .get();
        } catch (IOException e) {
            log.error("get web error", e);
            return e.getMessage();
        }

        Elements items = doc.select(".archive-list > .archive-list-item");
        List<String> results = new ArrayList<>();
        for (Element item : items) {
            if (results.size() >= MAX_RESULTS) {
                break;
            }
            Element link = item.selectFirst("h2 > a");
            if (link == null) {
                continue;
            }
            String title = link.text().trim();
            String href = link.absUrl("href");
            Element summary = item.selectFirst("p");
            String excerpt = summary == null ? "" : summary.text().trim();
            results.add(title + "\n" + href + "\n" + excerpt);
        }
        if (results.isEmpty()) {
            return "没有找到与「" + keyword + "」相关的菜鸟教程";
        }
        return String.join("\n\n", results);
    }
}
