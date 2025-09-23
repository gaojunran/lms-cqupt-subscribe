## LMS CQUPT 邮箱订阅

本项目用于订阅 [学在重邮](http://lms.tc.cqupt.edu.cn/)（重庆邮电大学在线教育平台）的动态通知，用户可通过邮件接受订阅信息。

> 此项目仅适用于此平台，如果需要改造以适应其它平台，可以参考本项目。

### 运行项目（使用 mise 和 bun）

克隆此仓库。

```bash
mise trust && mise install
# 手动修改 config.toml
mise run serve
```

### 运行项目（使用 bun）

克隆此仓库。

```bash
bun install
# 手动修改 config.toml
bun run src/index.ts
```

### 订阅邮箱

作为一个靠谱的开发者，你应该提供一个 API 接口来允许订阅者提供邮箱号。本项目不提供 API 接口，实现思路是将邮箱号写入 `receivers.json` 文件。

### TODO list

[] 支持订阅功能
[] 支持取消订阅功能
[] 支持消息去重
