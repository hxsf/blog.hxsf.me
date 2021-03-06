+++
author = "hxsf"
categories = ["安全", "iOS"]
date = 2015-09-20T07:32:18Z
description = ""
draft = true
image = "http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/144276191188bf0277cd71f88.jpg"
slug = "xcodeghost-more"
tags = ["安全", "iOS"]
title = "你以为这就是全部？让我们来告诉你完整的 XCodeGhost 事件！"

+++


这几天安全圈几乎被苹果 iOS 病毒 XCodeGhost 事件刷屏，大家都非常关注，各安全团队都很给力，纷纷从不同角度分析了病毒行为、传播方式、影响面积甚至还人肉到了作者信息。拜读了所有网上公开或者半公开的分析报告后，我们 (腾讯) 认为，这还不是全部，所以我们来补充下完整的 XCodeGhost 事件。

![XcodeGhost](http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/144276191188bf0277cd71f88.jpg)

    事件溯源

不久前，我们(指腾讯)在跟进一个bug时发现有APP在启动、退出时会通过网络向某个域名发送异常的加密流量，行为非常可疑，于是终端安全团队立即跟进，经过加班加点的分析和追查，我们基本还原了感染方式、病毒行为、影响面。

随后，产品团队发布了新版本。同时考虑到事件影响面比较广，我们立即上报了CNCERT，CNCERT也马上采取了相关措施。所以从这个时间点开始，后续的大部分安全风险都得到了控制——可以看看这个时间点前后非法域名在全国的解析情况。

接到我们上报信息后，CNCERT发布了[这个事件的预警公告](http://www.cert.org.cn/publish/main/12/2015/20150914152821158428128/20150914152821158428128_.html)。我们也更新了移动APP安全检测系统“金刚”。

9月16日，我们发现 AppStore 上的TOP5000应用有76款被感染，于是我们向苹果官方及大部分受影响的厂商同步了这一情况。

9月17日，嗅觉敏锐的国外安全公司 paloalto发 现了这个问题，并发布第一版分析报告。

接下来的事情大家都知道了，XCodeGhost 事件迅速升温，成为行业热点，更多的安全团队和专家进行了深入分析，爆出了更多信息。

    被遗漏的样本行为分析

1. 在受感染的APP启动、后台、恢复、结束时上报信息至黑客控制的服务器

 上报的信息包括：APP版本、APP名称、本地语言、iOS版本、设备类型、国家码等设备信息，能精准的区分每一台iOS设备。

 上报的域名是icloud-analysis.com，同时我们还发现了攻击者的其他三个尚未使用的域名。

 ![代码上传机器数据的恶意代码片段](http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/1442764055312d35169ebab41.png)

2. 黑客可以下发伪协议命令在受感染的iPhone中执行

 黑客能够通过上报的信息区分每一台iOS设备，然后如同已经上线的肉鸡一般，随时、随地、给任何人下发伪协议指令，通过iOS openURL这个API来执行。

 相信了解iOS开发的同学都知道openURL这个API的强大，黑客通过这个能力，不仅能够在受感染的iPhone中完成打开网页、发短信、打电话等常规手机行为，甚至还可以操作具备伪协议能力的大量第三方APP。

 ![控制远程弹窗的恶意代码片段](http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/14427640576143dfeb077fa23.png)

3. 黑客可以在受感染的iPhone中弹出内容由服务器控制的对话框窗口

 还有远程执行指令类似，黑客也可以远程控制弹出任何对话框窗口。至于用途，将机器硬件数据上报、远程执行伪协议命令、远程弹窗这几个关键词连起来，反正我们是能够通过这几个功能，用一点点社工和诱导的方式，在受感染的iPhone中安装企业证书APP。装APP干什么？还记得几个月之前曝光的Hacking Team的iPhone非越狱远控（RCS）吗？

 ![控制远程弹窗的恶意代码片段](http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/1442764052dbd8a4c4ae5c5b1.png)

4. 远程控制模块协议存在漏洞，可被中间人攻击

 在进行样本分析的同时，我们还发现这个恶意模块的网络协议加密存问题，可以被轻易暴力破解。我们尝试了中间人攻击，验证确实可以代替服务器下发伪协议指令到手机，成为这些肉鸡的新主人。
图5 存在安全漏洞的协议解密代码片段

 值得一提的是，通过追查我们发现植入的远程控制模块并不只一个版本。而现已公开的分析中，都未指出模块具备远程控制能力和自定义弹窗能力，而远程控制模块本身还存在漏洞可被中间人攻击，组合利用的威力可想而知。这个事件的危害其实被大大的低估了。

```
感染途径
```
分析过程中我们发现，异常流量APP都是大公司的知名产品，也是都是从AppStore下载并具有官方的数字签名，因此并不存在APP被恶意篡改的可能。随后我们把精力集中到开发人员和相关编译环境中。果然，接下来很快从开发人员的xcode中找到了答案。

我们发现开发人员使用的xcode路径Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/Library/Frameworks/CoreServices.framework/下，存在一个名为CoreServices.framework的“系统组件”，而从苹果官方下载的xcode安装包，却不存在这些目录和“系统组件”。

原来开发人员的xcode安装包中，被别有用心的人植入了远程控制模块，通过修改xcode编译参数，将这个恶意模块自动的部署到任何通过xcode编译的苹果APP（iOS/Mac）中。

水落石出了，罪魁祸首是开发人员从非苹果官方渠道下载xcode开发环境。

通过百度搜索“xcode”出来的页面，除了指向苹果AppStore的那几个链接，其余的都是通过各种id（除了coderfun，还有使用了很多id，如lmznet、jrl568等）在各种开发社区、人气社区、下载站发帖，最终全链到了不同id的百度云盘上。为了验证，团队小伙伴们下载了近20个各版本的xcode安装包，发现居然无一例外的都被植入了恶意的CoreServices.framework，可见投放这些帖子的黑客对SEO也有相当的了解。

![xcodeghost](http://lighthumbs-lighthumbs.stor.sinaapp.com/photos/14427645628a06ed6c4de392c.jpg)

进一步来看，攻击者做到的效果是只要是通过搜索引擎下载xcode，都会下载到他们的XCodeGHost，还真的做到了幽灵一样的存在。

    影响面

在清楚危害和传播途径后，我们意识到在如此高级的攻击手法下，被感染的可能不只一个两个APP，于是我们马上对AppStore上的APP进行检测。

最后我们发现AppStore下载量最高的5000个APP中有76款APP被XCodeGhost感染，其中不乏大公司的知名应用，也有不少金融类应用，还有诸多民生类应用。根据保守估计，受这次事件影响的用户数超过一亿。

    后记

经过这一事件后，开发小伙伴们纷纷表示以后只敢下官方安装包，还要MD5和SHA1双校验。而这个事件本身所带来的思考，远不止改变不安全的下载习惯这么简单。

经过这两年若干次攻击手法的洗礼后，我们更加清醒的意识到，黑产从业者早已不是单兵作战的脚本小子，而是能力全面的黑客团队。

总结来看，移动互联网安全之路任重道远。当然，这里的危机也是安全行业的机遇。

