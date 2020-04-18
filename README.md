# Telegram tumblr Bot

一个 telegram bot 和 tumblr 交互的 bot。同时也可以实现其它交互的比如 rss 订阅推送、汇率监听的脚手架。

## Start

先在本地新建一个 `.env.json` 文件，加上 `TELEGRAM_BOT_TOKEN` (从 BotFather 中获取）,并且配置好 `TUSHARE_TOKEN` (从 tushare.pro 中获取）。

```
npm i
npm run build
npm run serve
```

这样就可以在 Bot 和 Channel 中输入对应的命令发送数据了

## 目前实现的命令是

在 Channel 中，

-   `/tumblr.register` 发送获取 tumblr 的 api token，以便持久化存在数据库中
-   `/tumblr.delete tumblrPostId` 删除指定的 tumblr post
-   `/tumblr.close` 注销当前 tumblr 获取的 token
-   发送文本或者图片就可以发送到 tumblr blog 中了

同时在 Bot 中，

-   `/listen.currency CNY threshold` 监听当前汇率，每隔一小时，如果超过了阈值，就发送到用户的 Bot 中。

## 架构

简单来说就是把所有的输入内容都分流到各自的行为中，比如 Channel 的图片就转向到 `msgPhoto` 方法中，专门处理。

## 出现 meta can not find 的问题

需要把 `ormconfig.json` 中的 `"entities":` 改成 js 的路径，这样才能被 nodejs 识别

## npm run prune

可以把 development 相关的包清理掉，减少清理磁盘空间
