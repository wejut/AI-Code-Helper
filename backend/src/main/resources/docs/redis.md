# Redis

Redis 是放在内存里的键值数据库。读写真的很快，适合缓存、计数和短时间保存的数据。Java 后端通常用它减轻 MySQL 的重复查询。

数据放在内存里，机器重启可能丢掉。重要数据仍要写进 MySQL，Redis 里放的是可以重新算出来的结果。

## 五种基本类型

- String：一个键对应一段文本或数字。缓存一段 JSON、做计数都用它。
- List：按顺序保存多个值，可以从两头推进或取出。
- Set：一组不重复的值，适合做标签、去重。
- Hash：一个键下面有多对字段和值，适合存一个对象的几个属性。
- ZSet：带分数的集合，按分数排序。排行榜用它。

```text
SET user:1 "小明"
GET user:1
```

键最好带上业务前缀，例如 `user:1`，避免不同功能和别的键撞名。

## 在 Java 里使用

Spring Boot 可以引入 `spring-boot-starter-data-redis`，用 `StringRedisTemplate` 读写字符串。

```java
stringRedisTemplate.opsForValue().set("user:1", "小明");
String name = stringRedisTemplate.opsForValue().get("user:1");
```

缓存要设过期时间。数据在数据库里改了，还要删掉或更新对应的缓存，否则会一直读到旧值。
