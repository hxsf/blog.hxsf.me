+++
author = "hxsf"
categories = ["安全"]
date = 2015-10-10T18:18:23Z
description = ""
draft = false
image = "https://static.hxsf.me/image/f/97/db3428c3b13dd12ce6c09d995fd6b.jpg-webp"
slug = "the-root-password-of-all-evil"
tags = ["安全"]
title = "比 XcodeGhost 更邪恶的手段 30 年前就出现了"

+++


最近在开发者圈里讨论最多的莫过于 XcodeGhost。其实在 20 年前，更高明的手段就出现了。

1984 年的时候，UNIX 创造者之一 Ken Thompson 获得了 ACM 图灵奖。他的获奖演讲叫做 Reflections on Trusting Trust（反思对信任的信任）。[演讲全文](https://www.win.tue.nl/~aeb/linux/hh/thompson/trust.html)
![1984 年图灵奖得主 Ken Thompson](https://static.hxsf.me/image/2/e5/19a344ebb2935b7824aae5fcb613c.jpeg)

在这个稿子只有三页纸的演讲中他分三步描述了如何构造一个非常难以被发现的编译器后门。这后来被称为 the Ken Thompson Hack（KTH），有人说它是 the root password of all evil。

在第一步里，Thompson 展示了一个可以输出自己的源代码的 C 程序。这需要一定技巧，但很多人作为编程练习都做过。

在第二步里，Thompson 在 C 的编译器里增加了一段代码（后门），让它在检测到自己在编译 UNIX 的 login 命令时在输出里插入一个后门。这个后门会允许作者用特定密码以 root 身份登录系统。

在第三步里，Thompson 在第二步的编译器里使用第一步的方法加入另一段代码（后门生成器），使得这个编译器在检测到它在编译自己时自动把第二步的后门和第三步的后门生成器插入到输出里。

在得到一个第三步的编译器后，就可以把第二、三步新增的代码从源代码里删除，因为这个新的编译器在编译它自己原来「干净」的源代码时会自动把后门和后门生成器加上。很多语言的编译器都会使用「自举」的方式编译，也就是会用一个编译器的旧版本可执行文件来编译新版本的源码，所以这样一个高危的后门完全可以在一个开源项目里存在。通过阅读这个编译器的源码是无法发现这个后门的。

KTH 还可以被加强，让它更难被察觉。比如这个编译器可以污染它编译的调试器、反编译器等开发过程中使用的工具，使得即使程序员反编译这个编译器后看到的仍是干净的代码，除非他使用的是 KTH 注入前的版本。所以当这个带有 KTH 注入的编译器来自于官方渠道时，它的后门是几乎不会被发现的，而且会影响所有用户。
最近的 XcodeGhost 最多只能算是 the Ken Thompson Hack 的一个简化版本，没有试图隐藏自己，并且修改的不是编译器本身，而是 Xcode 附带的框架库。

Thompson 在演讲里的结论是：即使开源项目也无法保证安全。在不考虑硬件或 microcode 后门的情况下，只有当运行的每一个程序都完全是自己写的时才能确保安全。可是谁的电脑上能只运行自己写的程序呢？恐怕只有 Ken Thompson 和 Dennis Ritchie 能在用自己发明的语言写的操作系统上用自己写的编译器编译自己写的操作系统吧。
Ken Thompson 从贝尔实验室退休几年之后加入了 Google。在 Google，他和原来贝尔的老同事一起发明了 Go 语言。Go 从 1.5 版开始以自举的方式编译。;-)

