+++
author = "hxsf"
categories = ["安全", "iOS"]
date = 2015-09-20T06:35:59Z
description = ""
draft = true
image = "http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/144276373213dac5a04e94dea.jpg"
slug = "yong-yi-dong-de-hua-gao-su-ni-ping-guo-ios-app-da-mian-ji-gan-ran-xcodeghost-bing-du-dao-di-shi-shi-yao-hui-shi"
tags = ["安全", "iOS"]
title = "用易懂的话告诉你苹果 iOS APP 大面积感染 XcodeGhost 病毒到底是什么回事"

+++


今天最热的话题当属 XcodeGhost 木马后门病毒—— “苹果 iOS APP 集体中毒” 事件了吧，包括网易云音乐、滴滴出行、高德地图、同花顺、联通手机营业厅等等大量知名的 APP 均被渗透！影响面积相当大！

然而，很多不是程序员的小伙伴们貌似看得云里雾里，不太清楚到底什么回事，为什么 iPhone、iPad 没有越狱，从苹果官方的 AppStore 下载的 APP 也会受到影响？咱们就用通俗易懂的话给大家解释一下 XcodeGhost 病毒(木马后门) 是怎么回事吧……

    扩展阅读:
> 
 * [你以为这就是全部？让我们来告诉你完整的 XcodeGhost 事件](http://blog.wlxh.club/xcodeghost-more/)
 * [受 XcodeGhost 感染的全部「有后门」的 APP 列表](http://blog.wlxh.club/shou-xcodeghost-mu-ma-gan-ran-you-hou-men-de-ios-app-lie-biao/)

    大量知名 APP 被感染 XcodeGhost 恶意代码
据了解，在用户使用了被植入 XcodeGhost 恶意代码的 APP 后，APP 会自动向病毒制造者的服务器上传诸如手机型号、系统版本、应用名称、应用使用时间、系统语言等隐私信息。而根据一些知名开发者逆向分析的结果看，XcodeGhost 还有伪造 iCloud 密码输入框进行钓鱼的恶意代码存在。
![xcode](http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/14427619146dfa5d18a01eff8.jpg)

苹果今天已经开始对受感染的 APP 进行下架了，木马制造者用于接收窃取信息的服务器目前也已被关闭，用户目前应该不会受到什么直接威胁。但是，如果你之前有使用过受感染的 APP 并输入过密码的话还是有泄露 AppleID 的可能，强烈建议大家都去开通苹果账号的二步验证以防账号被盗或被利用。

    那么，XcodeGhost 到底是怎么回事呢？为什么没越狱也中招？

一款 APP 的发布，首先是要编写源代码，在编写完成后，则需要将代码「编译」成“可执行的文件”进行打包发布。在苹果 iOS 开发领域，代码编写以及编译两个主要骤都是通过苹果的 Xcode 集成开发工具来完成的。

这本来没什么问题的，但由于 Xcode 体积有几个 GB，国内开发者如果不番·羽·土·啬直接从苹果 (国外服务器) 下载的话速度实在坑爹 (这怎么看都像是F校长的错……)。XcodeGhost 木马的作者非常聪明地利用了这一点，将「加了后门木马的 Xcode 工具」上传到国内网盘上，然后在各种 iOS 开发论坛发帖、回复进行散播。

由于木马作者提供的 Xcode 版本齐全，国内网盘下载速度也飞快，各大公司的程序员在想要下载 Xcode 时只要轻轻地 “百度一下” 就这么愉快地上钩了。

这个“加了料”的 Xcode 会在程序员「编译」APP 的时候偷偷自动地把 XcodeGhost 的恶意代码也一并编译进去了，而这时候咱们勤劳的程序猿们还完全毫不知情，然后被加了料的 APP 也愉快地被发布出来了。用户下载了这些 APP 自然也就中招了……

    受 XcodeGhost 影响的 APP 列表 ：

> 目前已发现3百多款 App 感染了 XcodeGhost 木马，其中不乏有百度音乐，微信，高德， 滴滴，花椒，58同城，网易云音乐，12306，同花顺，南方航空，工行融e联，重庆银行等用户量极大的 App，涉及了互联网、金融、铁路航空、游戏等领域。

####[首感染有后门的 iOS APP 列表 (目前344款)](http://blog.wlxh.club/shou-xcodeghost-mu-ma-gan-ran-you-hou-men-de-ios-app-lie-biao/)

    普通用户应该怎么做？

* 暂停使用这些受感染的 APP，并在设置里关闭其“后台刷新”
* 强烈建议开启 AppleID 的二步验证，如果你之前有遇到过 APP 弹出输入 AppleID 密码的窗口，那么建议你尽快修改密码。
* 开启二步验证的具体设置位置是：“我的 Apple ID”-“管理您的 Apple ID”，选择“密码和帐户安全”。在“两步验证”下，选择“开始设置”，今天申请，三天后才能开通
* 如果你还不放心，最好连应用的账号密码也一并修改
* 银行、金融、理财类的应用请尽量使用独立的密码，与一般的密码区分开来以免受牵连
* 其实有线索表明 XcodeGhost 与某某助手有一定的联系，建议大家不要为小便宜给自己埋下安全隐患

```
开发者应该怎么做？
```
* 优先级检测所有编译服务器、自动发布服务器中的 Xcode 是否被感染
* 开发者需要检查系统中所有版本的 Xcode 是否被感染，先删除受感染的 Xcode，然后从 Mac AppStore 或者从开发者中心重新下载官方原版的 Xcode
* 如果线上的应用是用受感染的 Xcode 发布的话，请使用官方的 Xcode 清理并重新编译应用，然后上传 AppStore，尽量向苹果说明情况，从而走 AppStore 的紧急上线流程

```
总结：
```
这应该是苹果 AppStore 自上线以来遭受的规模最大的攻击了，涉及应用数量超过想象，但万幸的是 XcodeGhost 还在“试探性”阶段就被及时曝光，倘若病毒再升级增加更多丰富功能（如对各种密码输入框进行监听等），很有可能将会成为中国史上甚至世界史上涉案金额最高的黑客事件之一。

虽然 XcodeGhost 目前还没有做出严重的恶意行为，但不可否定，这是个处心积虑精心策划的局，先广撒网，后面再慢慢考虑收割，并用最少的资源获取最多的隐私资料，而且过了甚久才被察觉。手法之高明可以看出，幕后黑手要么是经验丰富的老道黑客，要么就是有专业的黑产公司。

其实，不单是 iOS，Android 开发的安全性同样也颇受考验，Android Studio、Android SDK 不番·羽·土·啬根本不能下载，而国内APP市场也比较混乱，黑产团伙在安卓平台上其实绝对也可以同样手法来一发！在这一点上，还是期待 Google 能早日回归中国吧。

