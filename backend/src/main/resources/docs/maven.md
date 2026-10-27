# Maven

Maven 是 Java 项目的构建工具。它根据 `pom.xml` 下载依赖、编译代码、运行测试、打包。

## 坐标

每个项目和每个依赖都用三个值定位：

- `groupId`：组织名，例如 `com.wejut`
- `artifactId`：项目名，例如 `java-tech-copilot`
- `version`：版本，例如 `0.0.1-SNAPSHOT`

`artifactId` 会成为目录名，也会出现在打出来的 jar 名里。

## 依赖

依赖写在 `pom.xml` 的 `<dependencies>` 里。有父项目代管版本时，可以不写 `<version>`。

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

`scope` 表示这个依赖在什么时候使用：

- 不写 scope：编译和运行都要。
- `test`：只在测试代码里用，例如 `spring-boot-starter-test`。
- `optional`：本项目用，但不会强制传递给依赖本项目的人。Lombok 常标成 `optional`。

改完 `pom.xml` 要保存，并让 IDE 重新加载 Maven，新依赖才会进工程。

## 生命周期

常用命令：

- `mvnw compile`：编译 `src/main/java`
- `mvnw test`：编译并运行 `src/test/java` 里的测试
- `mvnw package`：测试通过后打成 jar

`mvnw` 是项目自带的 Maven Wrapper。Windows 上用 `mvnw.cmd`。它会使用项目指定的 Maven 版本，不要求电脑事先全局安装 Maven。

## spring-boot-starter-parent

`pom.xml` 里的 `<parent>` 指向 `spring-boot-starter-parent`。它规定 Java 版本、依赖版本和打包插件。Spring Boot 相关依赖因此不用逐个写版本号。

第三方库不在这个父项目里，例如 LangChain4j，需要自己写 `<version>`，并让相关依赖的版本彼此一致。

## 和 IDE 的关系

Maven 负责下载 jar 和编译。Cursor 或 IDEA 负责编辑和运行。依赖报红时，先确认 `pom.xml` 已保存，再执行一次 Maven 重新加载。

## 仓库

仓库是存放 jar 的地方。Maven 中央仓库是默认来源。公司内部库可以写在 `pom.xml` 或 `settings.xml` 的 `<repositories>` 里。

依赖找不到时，先看坐标和版本是否写对，再确认当前网络能访问仓库。

## 插件

插件负责编译、测试、打包这些具体动作。Spring Boot 项目用 `spring-boot-maven-plugin` 把依赖打进一个可执行 jar。

```xml
<plugin>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-maven-plugin</artifactId>
</plugin>
```

父项目已经配好这个插件时，子项目只要声明它，不用再写版本。

## dependencyManagement

`<dependencyManagement>` 只声明依赖的版本，不会真的把 jar 引进来。子模块在 `<dependencies>` 里引用同一依赖时，可以省略 `<version>`，版本以这里为准。

`spring-boot-starter-parent` 就是用这种方式统一 Spring 相关依赖的版本。自己管理一组模块时，把公共版本写在父项目的 `dependencyManagement` 里。
