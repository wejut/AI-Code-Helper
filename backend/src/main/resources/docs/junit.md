# JUnit

JUnit 用来写自动化测试。一个测试方法调用你的代码，再用断言检查结果是不是预期的那样。`mvnw test` 会运行 `src/test/java` 里的这些方法。

Spring Boot 的 `spring-boot-starter-test` 已经带上 JUnit，测试类放在 `src/test/java`，包名和正式代码对应。

## @Test

`@Test` 标在方法上，表示这是一个测试。方法一般是 `void`，不写参数。

```java
class MathTest {
    @Test
    void add() {
        int sum = 1 + 2;
        assertEquals(3, sum);
    }
}
```

方法名写清在检查什么。一个方法只检查一件事，失败时更容易看出哪里不对。

## 断言

断言用来比较实际值和期望值。不相等时测试失败，并打印两边的值。

```java
assertEquals(3, sum);
assertTrue(names.contains("小明"));
assertNull(missing);
```

`assertEquals` 的第一个参数是期望值，第二个是实际值。不要写反，失败信息会更好读。

测会抛异常的代码时，用 `assertThrows`：

```java
assertThrows(NumberFormatException.class, () -> Integer.parseInt("abc"));
```

`"abc"` 不能转成整数，所以这里期望抛出 `NumberFormatException`。
