+++
author = "hxsf"
categories = ["Javascript", "tools"]
date = 2015-02-24T19:52:00Z
description = ""
draft = false
image = "https://static.hxsf.me/image/d/96/0fe823d7b706f9075423906f19207.jpg-webp"
slug = "web-clock-jstools"
tags = ["Javascript", "tools"]
title = "标题栏显示时钟 - js书签工具"

+++


早上看到的，微博回复没办法贴代码，所以贴在这。

使用很简单，浏览器书签/收藏 新建一个，名字随意，网址填如下代码。

功能很简单，点击上一步添加的书签，当前网页的标题就会变身时钟。

需求地址([新浪微博@小众软件](http://weibo.com/1684197391/C5MBZ2dAk?type=comment "新浪微博@小众软件"))

```
javascript: (function () {window.showLeftTime=function(){var now=new Date();var year=now.getFullYear();var month=now.getMonth();var day=now.getDate();var hours=now.getHours();var minutes=now.getMinutes();var seconds=now.getSeconds();document.title=&quot;&quot;+year+&quot;-&quot;+month+&quot;-&quot;+day+&quot;- &quot;+hours+&quot;:&quot;+minutes+&quot;:&quot;+seconds+&quot;&quot;};setInterval(showLeftTime,1000); }());
```

