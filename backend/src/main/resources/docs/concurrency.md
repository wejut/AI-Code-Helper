# 并发

并发是指一个程序里有多段代码在重叠的时间里往前走。Java 里一段这样的执行用线程表示。Web 服务器会用多个线程同时处理不同的请求。

多个线程改同一份数据时，结果可能互相覆盖。这种数据要加保护，或者干脆不共享。

## 线程

`Thread` 表示一条执行线。把要跑的代码交给它，再 `start`。

```java
Thread thread = new Thread(() -> System.out.println("在另一个线程"));
thread.start();
```

调用 `start` 才会新开线程。直接调用 `run` 只是在当前线程里执行，没有并发。

## synchronized

`synchronized` 让同一时刻只有一个线程能进入这段代码。它锁的是后面括号里的那个对象。

```java
private int count;

synchronized void add() {
    count++;
}
```

`count++` 看起来是一句，实际是读取、加一、写回三步。两个线程同时做，可能丢掉一次加一。加上 `synchronized` 后，这两次调用会排队执行。

锁要尽量小。把整段耗时操作都放进锁里，其他线程会一直等。

## 线程池

每次请求都 `new Thread` 会反复创建和销毁线程。线程池先准备好一组线程，任务来了就交给空闲线程，做完再接下一个。

```java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> System.out.println("任务"));
```

`4` 是池里的线程数。应用关闭时要 `shutdown`，否则这些线程会让进程退不掉。

在 Spring 里更常见的是注入容器管理的 `Executor`，而不是在业务代码里随手 `new` 一个池。池的大小和队列要按任务是算得重还是等 I/O 来定，不要无界地往里丢任务。
