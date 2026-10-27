# Java SE 与 Java EE

Java SE 是 Java 标准版，提供语言、核心类库和虚拟机。Java EE（现在常称为 Jakarta EE）是在 SE 之上做企业应用的规范，例如 Web 请求和事务。现在写企业项目，常见做法是用 Spring Boot，而不是手写一整套 Java EE。

## JVM、JRE、JDK

- JVM 运行编译后的 `.class` 字节码。
- JRE 是运行环境，包含 JVM 和运行所需的库。
- JDK 是开发工具包，包含 JRE、编译器 `javac` 和调试工具。写代码要装 JDK。

查看版本：

```text
java -version
javac -version
```

## 基本类型与包装类

基本类型直接存值，包装类是对象，可以放进集合，也可以表示“没有值”（`null`）。

| 基本类型 | 包装类 |
| --- | --- |
| `int` | `Integer` |
| `long` | `Long` |
| `boolean` | `Boolean` |
| `double` | `Double` |

```java
int count = 1;
Integer boxed = count;      // 自动装箱
int again = boxed;          // 自动拆箱
```

`int` 不能是 `null`。方法参数或返回值可能缺失时，用 `Integer`。

## 类与接口

类用来描述一类对象。接口只规定方法，不写具体实现，实现类用 `implements`。

```java
interface Greetable {
    String greet();
}

class Hello implements Greetable {
    public String greet() {
        return "你好";
    }
}
```

## record

`record` 是只装数据的类型。字段、构造方法和取值方法由编译器生成。

```java
record User(String name, int age) {}

User user = new User("小明", 18);
user.name();   // "小明"
user.age();    // 18
```

末尾的 `{}` 是类体。没有额外方法时留空。

## 集合

一组数据用集合。最常用的是 `List`，有顺序，可重复。

```java
List<String> names = new ArrayList<>();
names.add("小明");
names.add("小红");
```

`List` 是接口，`ArrayList` 是一种实现。变量声明用接口，创建对象用实现类。

## 异常

出错时 Java 抛出异常。可恢复的问题用 `try/catch` 接住。

```java
try {
    int value = Integer.parseInt("abc");
} catch (NumberFormatException ex) {
    System.out.println("这不是数字");
}
```

`parseInt` 要求字符串是整数。`"abc"` 无法转换，所以进入 `catch`。

## Java EE

Java EE 规定企业应用怎么接收 HTTP 请求、怎么管理事务和安全。Servlet 是处理一次 Web 请求的组件，跑在 Tomcat 这类 Servlet 容器里。

现在新项目通常不直接写 Servlet，而是用 Spring Boot：它仍然跑在 Servlet 容器上，但用 `@RestController` 写接口，容器和配置由 starter 带好。

## String

`String` 表示一段文本。Java 里字符串创建后不能改，拼接会得到新的字符串。

```java
String name = "小明";
String hello = "你好，" + name;
```

比较两段文本的内容用 `equals`，不要用 `==`。`==` 比的是不是同一个对象。

```java
String a = new String("java");
String b = new String("java");
a.equals(b);   // true，内容相同
a == b;        // false，不是同一个对象
```

## Map

`Map` 按键取值。键不重复，值可以重复。最常用的实现是 `HashMap`。

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("小明", 90);
scores.get("小明");   // 90
```

变量声明用 `Map`，创建对象用 `HashMap`。

## equals 与 hashCode

`equals` 判断两个对象内容是否相同。把对象放进 `HashMap` 或 `HashSet` 时，还要同时写 `hashCode`。内容相同的对象，`hashCode` 必须相同。

```java
class User {
    private final String name;

    User(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object other) {
        if (!(other instanceof User user)) {
            return false;
        }
        return name.equals(user.name);
    }

    @Override
    public int hashCode() {
        return name.hashCode();
    }
}
```

## 泛型

泛型给集合或类标上元素类型，编译器就能在写错类型时提醒你。

```java
List<String> names = new ArrayList<>();
names.add("小明");
String first = names.get(0);
```

尖括号里的 `String` 就是元素类型。没有泛型时，取出来的是 `Object`，还要自己转型。
