+++
author = "hxsf"
date = 2015-07-28T05:14:20Z
description = ""
draft = false
image = "https://static.hxsf.me/images/2015/07/browsers.jpg-webp"
slug = "browsers-introduction"
title = "浏览器内核简介"
summary = "今天我们来聊聊常见的浏览器内核: Trident Geoko Presto WebKit Blink"

+++
# 浏览器内核

## 1. Trident

Trident 就是大名鼎鼎的 IE浏览器 所使用的内核，也是很多浏览器所使用的内核，通常被称为IE内核。基于Trident内核的浏览器非常多，这是因为Trident内核提供了丰富的调用接口。老的Trident内核（比如常说的IE6内核）一直是不遵循W3C标准的，但是由于当时IE6的市场份额最大，所以后果就是大量的网页专门为IE6等老Trident内核编写，在IE6下显示很正常，但其实这些网页的代码并不符合W3C标准，于是，完全依据W3C标准写的网页在老的Trident内核下面又出现偏差，这就是为什么很多人觉得后来的IE9的网页排版有时会乱了，而IE6则正常，其实不是浏览器兼容性差了，而是你访问的网页不符合新的标准。目前可供调用的最新版的Trident内核是IE9所用的内核，相较之前的版本对W3C标准的支持增强了很多。

> **Trident内核的常见浏览器有：**
> IE6、IE7、IE8（Trident 4.0）、IE9（Trident 5.0）、IE10（Trident 6.0）；
> *世界之窗、 360安全浏览器、傲游；搜狗浏览器；腾讯TT；阿云浏览器（早期版本）、百度浏览器（早期版本）、瑞星安全浏览器、Slim Browser； GreenBrowser、爱帆浏览器（12 之前版本）、115浏览器、155浏览器； 闪游浏览器、N氧化碳浏览器、糖果浏览器、彩虹浏览器、瑞影浏览器、勇者无疆浏览器、114浏览器、蚂蚁浏览器、飞腾浏览器、速达浏览器、佐罗浏览器、海豚浏览器（iPhone/iPad/Android）、UC浏览器（Blink内核+Trident内核）等。。。*
> 斜体中部分浏览器的新版本是“双核”甚至是“多核”，其中一个内核是Trident，然后再增加一个其他内核。国内的厂商一般把其他内核叫做“高速浏览模式”，而Trident则是“兼容浏览模式”，用户可以来回切换。

## 2. Geoko(跨平台)

Netscape6 启用的内核，现在主要由Mozilla基金会进行维护，是开源的浏览器内核，因此，其可开发程度很高，全世界的程序员都可以为其编写代码，增加功能。事实上，Gecko引擎的由来跟IE不无关系，前面说过IE没有使用W3C的标准，这导致了微软内部一些开发人员的不满；他们与当时已经停止更新了的 Netscape的一些员工一起创办了Mozilla，以当时的Mosaic内核为基础重新编写内核，于是开发出了Gecko。目前最主流的Gecko内核浏览器是Mozilla Firefox，所以也常常称之为火狐内核。因为Firefox的出现，IE的霸主地位逐步被削弱，Chrome的出现则是加速了这个进程。非Trident内核的兴起正在改变着整个互联网，最直接的就是推动了编码的标准化，也使得微软在竞争压力下不得不改进IE。不过比较可惜的是，虽然是开源的，也开发了这么多年，基于Gecko的浏览器并不多见，除了一些简单的改动（坑爹的X浏览器）或者是重新编译（绫川ayakawa、tete009），深度定制或者增强型外壳的还比较少见。另外就是有一些其它软件借用了Gecko内核，比如音乐管理软件SongBird。

> **常见的Gecko内核的浏览器：**
> Mozilla Firefox、Mozilla SeaMonkey、Epiphany（早期版本）、Flock（早期版本）、K-Meleon

## 3.Presto(Opera前内核) (已废弃)

Opera 12.17及更早版本曾经采用的内核，现已停止开发并废弃，该内核在2003年的Opera7中首次被使用，该款引擎的特点就是渲染速度的优化达到了极致，然而代价是牺牲了网页的兼容性。
实际上这是一个动态内核，与前面几个内核的最大的区别就在脚本处理上，Presto有着天生的优势，页面的全部或者部分都能够在回应脚本事件时等情况下被重新解析。此外该内核在执行Javascrīpt的时候有着最快的速度，根据在同等条件下的测试，Presto内核执行同等Javascrīpt所需的时间仅有Trident和Gecko内核的约1/3（Trident内核最慢，不过两者相差没有多大），本文的其中一个修改者认为上述测试信息过于老旧且不完整，因为他曾做过的小测试显示Presto部分快部分慢，各内核总体相当。那次测试的时候因为Apple机的硬件条件和普通PC机不同所以没有测试WebCore内核。只可惜Presto是商业引擎，使用Presto的除开Opera以外，只剩下NDSBrowser、Wii Internet Channle、Nokia 770网络浏览器等，这很大程度上限制了Presto的发展。

> 注：2013年2月Opera宣布转向WebKit引擎，Opera现已改用Google Chrome的Blink内核。

## 4.WebKit(Safari内核,Chrome内核原型,开源)

它是苹果公司自己的内核，也是苹果的Safari浏览器使用的内核。 Webkit引擎包含WebCore排版引擎及JavaScriptCore解析引擎，均是从KDE的KHTML及KJS引擎衍生而来，它们都是自由软件，在GPL条约下授权，同时支持BSD系统的开发。所以Webkit也是自由软件，同时开放源代码。在安全方面不受IE、Firefox的制约，所以Safari浏览器在国内还是很安全的。
限于Mac OS X的使用不广泛和Safari浏览器曾经只是Mac OS X的专属浏览器，这个内核本身应该说市场范围并不大；但似乎根据最新的浏览器调查表明，该浏览器的市场甚至已经超过了Opera的Presto了——当然这一方面得益于苹果转到x86架构之后的人气暴涨，另外也是因为Safari 3终于推出了Windows版的缘故吧。Mac下还有OmniWeb、Shiira等人气很高的浏览器。
Google Chrome、360极速浏览器以及搜狗浏览器高速模式也使用webkit作为内核(在脚本理解方面，Chrome使用自己研发的V8引擎)。WebKit 内核在手机上的应用也十分广泛，例如 Google 的手机 Gphone、 Apple 的iPhone， Nokia’s Series 60 browser 等所使用的 Browser 内核引擎，都是基于 WebKit。

> **WebKit内核常见的浏览器：**
> Apple Safari (Win/Mac/iPhone/iPad)、Symbian手机浏览器、Android 默认浏览器、Chrome(28以前版本)、傲游浏览器3

## 5.Blink(开源)
尽管上面一众经常被统称为 WebKit，实际上各自都使用了自己的 WebKit 分支或者编译时选项，使得最终的渲染结果也是存在一定的差异的。不过大体上 WebKit 社区内部还是比较和谐的，各个成员之间也为维持兼容性作出了努力，直到 2010 年随着 OS X Lion 一起面世的 WebKit2。由于 WebKit2 在 WebCore 层面上实现的进程隔离在一定程度上与 Google Chrome/Chromium 自己的沙箱设计存在冲突，故 Google Chrome/Chromium 一直停留在 WebKit，使用 Backport 的方式实现和主线 WebKit2 的兼容。显而易见这增加了 WebKit 和 Chromium 的复杂性，且在一定程度上影响了 Chromium 的架构移植工作。
基于以上原因，Google 决定从 WebKit fork 出自己的 Blink Web 引擎：

> 现阶段以精简内部结构为主，将删除大约 7000 个文件和 450 万行 WebKit2 兼容代码。
> 未来将着重改善 DOM 架构，将使用 JavaScript 实现 DOM。
> 提升安全性，实现进程外 iframes 。

Blink是一个由Google和Opera Software开发的浏览器排版引擎，Google计划将这个渲染引擎作为Chromium计划的一部分，并且在2013年4月的时候公布了这一消息。这一渲染引擎是开源引擎WebKit中WebCore组件的一个分支。

> **常见的Blink内核的浏览器：**
> 在Chrome（28及往后版本）、Opera（15及往后版本）和Yandex浏览器

