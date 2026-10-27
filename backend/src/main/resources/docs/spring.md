# Spring 框架

Spring 用来组织 Java 企业应用。它负责创建对象、把对象交给需要的类，并提供 Web、配置和测试的集成。Spring Boot 在 Spring 之上给出默认配置，一个 `main` 方法就能把 Web 服务跑起来。

## IoC 与依赖注入

IoC（控制反转）是指对象不由你自己 `new`，而由 Spring 容器创建和管理。依赖注入是容器把已经创建好的对象放进需要它的类。

```java
@Service
public class JavaTechCopilot {
    private final ChatModel chatModel;

    public JavaTechCopilot(ChatModel chatModel) {
        this.chatModel = chatModel;
    }
}
```

`ChatModel` 由容器提供。这个类只声明自己需要它。

## 常见注解

- `@Component`：把类交给 Spring 管理。
- `@Service`：业务类，作用和 `@Component` 相同，名字表示这是服务。
- `@Configuration`：配置类，里面用方法声明要创建的对象。
- `@Bean`：写在配置类的方法上，方法返回值会放进容器。

```java
@Configuration
public class AiConfig {
    @Bean
    public AiService aiService(ChatModel chatModel) {
        return AiServices.create(AiService.class, chatModel);
    }
}
```

## Spring Boot starter

starter 是一组打包好的依赖。`spring-boot-starter-web` 带上 Spring MVC 和内嵌 Tomcat。`langchain4j-community-dashscope-spring-boot-starter` 带上通义千问的接入，并按配置文件创建 `ChatModel`。

父项目 `spring-boot-starter-parent` 统一管理这些依赖的版本，所以很多依赖不用自己写 `<version>`。

## application.yml

配置写在 `src/main/resources/application.yml`。层级用空格缩进。

```yaml
spring:
  application:
    name: java-tech-copilot
langchain4j:
  community:
    dashscope:
      chat-model:
        model-name: qwen-max
```

同一目录下如果还有 `application.properties`，同名配置以 properties 为准。密钥放在 `application-local.yml`，并把它写进 `.gitignore`。

## 测试

`@SpringBootTest` 会按真实应用的方式启动 Spring 容器，然后用 `@Resource` 取出容器里的对象。

```java
@SpringBootTest
class AiServiceTest {
    @Resource
    private AiService aiService;

    @Test
    void chat() {
        String result = aiService.chat("什么是变量？");
        System.out.println(result);
    }
}
```

## Controller、Service、Repository

一个 Web 接口通常分成三层：

- Controller 接收 HTTP 请求，取出参数，把结果返回给调用方。
- Service 写业务规则，例如校验、计算、组合几次数据库操作。
- Repository 只负责存取数据。

Controller 不直接写 SQL。它调用 Service，Service 再调用 Repository。

## @RestController

`@RestController` 表示这个类是 Web 接口，方法的返回值会直接变成响应体，通常是 JSON。

```java
@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "你好";
    }
}
```

`@GetMapping` 对应浏览器或客户端的 GET 请求。路径是 `/hello`。

## @Transactional

`@Transactional` 写在 Service 方法上，表示这个方法里的数据库操作要一起成功或一起失败。中途抛出运行时异常时，前面的写入会回滚。

```java
@Service
public class OrderService {
    @Transactional
    public void create(Order order) {
        orderRepository.save(order);
        stockRepository.decrease(order.productId());
    }
}
```

两步都成功才提交。减库存失败时，订单也不会留下。
