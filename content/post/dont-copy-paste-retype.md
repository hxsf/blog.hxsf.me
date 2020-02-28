+++
author = "hxsf"
categories = ["编程", "思想"]
date = 2015-10-10T18:30:22Z
description = ""
draft = false
image = "https://static.hxsf.me/image/0/24/b3f3e2b730d4fdf64940973550d06.png-webp"
slug = "dont-copy-paste-retype"
tags = ["编程", "思想"]
title = "重新敲一遍代码，胜过拷贝粘贴"

+++


原文地址 (original source): http://xion.io/post/programming/dont-copy-paste-retype.html  
作者 (author): https://twitter.com/Xion__  
译文： http://www.labazhou.net/2015/10/dont-copy-paste-retype/  
译者： 腊八粥: http://www.labazhou.net/  

如今这个时代，[Google](https://google.com/?ncr) 和 [Stack Overflow](http://stackoverflow.com/) 已经成为了很多开发者不可或缺的工具。但是最近，后者貌似名声坏了。一方面，是因为表面上特别、有时候会偏离[适度的原则](https://medium.com/@johnslegers/the-decline-of-stack-overflow-7cb69faa575d)。说得更中肯些，取笑别人是「[十足的 Stack Overflow 式的开发者](https://www.christianheilmann.com/2015/07/17/the-full-stackoverflow-developer/)」的现象，明显增多了。

说简单点儿，有些人在 Stack Overflow 上扔代码、还大肆拷贝、粘贴回答里的代码示例，他们最应该得到这个称号。他们干起活来可能相当麻利，但是对于他们所面对的问题、以及他们乐于使用的解决方案，缺乏应有的理解。

当然，代码的拷贝粘贴不应该都被鄙视。我敢肯定，大部分阅读本文的读者（当然包括写本文的我！）耻于把 Stack Overflow 上的代码片段、原封不动地拷贝到他们自己的代码库里。那又能怎样呢，人家的代码为什么要这样写，我们或许根本没有兴趣去了解。从本质上讲，不是每一项技术都让人着迷，毕竟，deadline 有时过于急迫。

但是，果真如此的话，是不是意味着，我们渐渐就变成了十足的 Stack Overflow 式的开发者？对头！我们肯定不希望走到这一步！

##缓解对策

每当你想把 Stack Overflow 的一段代码拷贝到项目里时，别急着断网，而要考虑下面的技巧。

不要使用剪贴板。不要拷贝和粘贴。而是把你找到的代码，**重新敲一遍**。

是的，这要多花些时间。和你简单地敲击 Ctrl+C/Ctrl+V 相比，这肯定笨拙不堪。或许没有多少意义：如果最终结果是一样的，那么，代码的转移是否通过了剪贴板，又有多大的关系呢？

##理由

无论如何，我坚持认为，敲一遍代码，意义十分深远。按照重要程度，下面列出我的理由：

重新敲一遍，要比拷贝粘贴慢，这实际上非常好。如果你发誓不再使用剪贴板了，就不会只是寻找 Google 给出的第一条 Stack Overflow 的结果。你将权衡不同的解决方案，正常情况下，你将倾向于更短、更简洁的方案。
在你敲代码时，你不可能完全无意识地敲着。不管你是否愿意，你都将潜移默化地吸收一部分知识，因为当代码从浏览器转移到编辑器或 IDE 时，也是在你的眼睛和大脑之间流动。你下意识地会对部分信息感兴趣，并梳理清楚，便于今后使用。即使你不想这样做，你也会学到点儿东西。
最重要的、也是几乎可以肯定的是，你自己敲的东西不等同于原始代码片段的完全拷贝。在你敲代码的过程中，只要你遵从项目正在采用的、特定的风格规范，那么，你将不可避免地偏离原始代码。更有可能发生的是，你也会做出更大的修改。你将替换调用工具函数的常见模式。为了更好的可阅读性，你将重新组织代码。你将添加注释、或抽出功能，让其更加自文档化（self-documenting）。甚至改善并个性化，这样，你就能抽象并多次复用。
此后，你刚才敲好的代码，就不只是你从网上找到的代码。它成了你自己的代码。

延伸阅读：[《我不再需要Stack Overflow》](http://www.labazhou.net/2014/02/i-no-longer-need-stackoverflow/)

