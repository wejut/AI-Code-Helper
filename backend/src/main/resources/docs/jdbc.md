# JDBC

JDBC 是 Java 访问关系型数据库的标准接口。MySQL、PostgreSQL 各自提供驱动 jar，代码通过统一的 `Connection`、`PreparedStatement` 和 `ResultSet` 来查写数据。

## 连接

连接需要驱动、地址、用户名和密码。Spring Boot 项目把这些写在 `application.yml`，由数据源帮你创建连接。手写时可以这样打开一次连接：

```java
String url = "jdbc:mysql://localhost:3306/demo";
Connection connection = DriverManager.getConnection(url, "root", "password");
```

用完要关闭。连接是有限资源，不关会把数据库连接占满。

## PreparedStatement

查询条件用 `?` 占位，再按顺序设值。不要把用户输入直接拼进 SQL，否则可能被注入。

```java
String sql = "select id, name from user where name = ?";
PreparedStatement statement = connection.prepareStatement(sql);
statement.setString(1, "小明");
ResultSet resultSet = statement.executeQuery();
while (resultSet.next()) {
    String name = resultSet.getString("name");
}
```

`setString` 的 `1` 表示第一个问号。

## try-with-resources

`Connection`、`PreparedStatement`、`ResultSet` 都实现了 `AutoCloseable`。用 try-with-resources 写出的对象，离开代码块时会自动关闭，包括中途抛异常的情况。

```java
try (Connection connection = DriverManager.getConnection(url, user, password);
     PreparedStatement statement = connection.prepareStatement(sql)) {
    statement.setString(1, "小明");
    try (ResultSet resultSet = statement.executeQuery()) {
        while (resultSet.next()) {
            System.out.println(resultSet.getString("name"));
        }
    }
}
```

新代码优先用这种写法，而不是在 `finally` 里手动 `close`。
