## 美信拓扑IM 小程序版

[美信拓扑](https://www.maximtop.com/)，一键启用多云架构的即时通讯云服务

美信拓扑IM为美信拓扑云服务的DemoApp，方便 App 开发者体验和使用 IM SDK，可以直接[在线试用](https://chat-h5.maximtop.com)，也可以在官网[下载页面](https://www.maximtop.com/downloads/)选择试用所有客户端。

[![Scc Count Badge](https://sloc.xyz/github/maxim-top/maxim-miniprogram/?category=total&avg-wage=1)](https://github.com/maxim-top/maxim-miniprogram/) [![Scc Count Badge](https://sloc.xyz/github/maxim-top/maxim-miniprogram/?category=code&avg-wage=1)](https://github.com/maxim-top/maxim-miniprogram/)

## 重要！重要！重要！ 

由于 [Uniapp版](https://github.com/maxim-top/maxim-uniapp) 已经发布，本工程已进入维护阶段，推荐开发小程序/H5的开发者使用 Uniapp 版本。

维护阶段意味着 UI 和 API 调用示例等代码将不会是最新，这意味着即使功能可用，但也可能使用了已被废弃的调用方式。当然，SDK 本身是好用的，实质上使用的是跟 Uniapp 版本同一个库，都是从 [floo-uniapp](https://github.com/maxim-top/floo-web)工程打包出来的。

## 工程说明

此工程为标准微信工程，共有四个源码目录：

1. im 存放美信拓扑IM SDK，当前最新版本为 floo-2.0.0.miniprogram.js
2. pages 为 UI 源码目录；
3. utils 为使用的工具类源码；
4. third 为第三方源码；

如要开发应用的小程序，请注意需要修改以下配置：

1. 微信小程序 AppID

打开文件 project.config.json，修改其中的 AppID 为你的小程序在微信后台的 appid。

2. 美信拓扑 AppID

打开文件 app.js, 修改变量 USER_CONFIG_APPID 为你的应用AppID，此 AppID 为在[美信拓扑后台](https://console.maximtop.com/)创建应用后获取。

修改以上信息后，可以直接通过微信小程序IDE发版了，好好玩吧。

## 开发准备

本工程用到了 protobuf.js npm 库，由于微信小程序的文档仍不完善，请在开发前严格按照以下步骤操作：

1. 本地安装 npm 包

```
npm init
npm install --production
npm install -S --production ericliang/protobufjs.wechat
```
2. 在小程序 IDE 菜单「工具」中找到「构建 npm」

此步骤会生成 miniprogram_npm 文件夹

执行完就可以正常编译小程序啦！

了解更多信息可以阅读[在线文档](https://www.maximtop.com/docs/)，或者在本仓库提问 :)
