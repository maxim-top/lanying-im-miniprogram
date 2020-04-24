## 美信拓扑IM 小程序版

此工程为标准微信工程，共有四个源码目录：

1. lib 存放美信拓扑IM SDK: floo-1.0.0.miniprogram.js
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
