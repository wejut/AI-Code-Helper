# MyBatis

MyBatis 把 SQL 和 Java 方法对应起来。你写 SQL，它负责设参数、执行，并把查询结果装进对象。它比手写 JDBC 少了很多开关连接和读列的代码。

## Mapper

Mapper 是一个接口。方法上用注解写 SQL，或者在 XML 里写同名语句。Spring 会生成这个接口的实现，Service 直接注入来用。

```java
@Mapper
public interface UserMapper {
    @Select("select id, name from user where id = #{id}")
    User findById(long id);
}
```

调用 `userMapper.findById(1)` 时，MyBatis 执行这条 SQL，并把 `id`、`name` 两列填进 `User`。

## #{} 与 ${}

`#{}` 是预编译参数，等价于 JDBC 的 `?`。用户输入走这里。

`${}` 是字符串替换，会直接拼进 SQL。它不防注入，只适合表名、排序字段这种不能用占位符的位置，而且值必须来自你自己的代码，不能来自请求参数。

```java
@Select("select id, name from user where name = #{name}")
User findByName(String name);
```

这里的 `name` 用 `#{}`。如果写成 `${name}`，对方传入的内容会被当成 SQL 的一部分。
