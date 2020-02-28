+++
author = "hxsf"
date = 2019-07-10T04:49:46Z
description = ""
draft = true
slug = "qun-hui"
title = "群晖 DSM 6.2.1 去除升级红点"

+++


网上很多改 js、css甚至改图片的教程，还加上了“完美”的标签。。。真叫人头大
其实很简单，懒得看过程的直接看答案

> ${USER} 代表你的用户名
> `/usr/syno/etc/preference/${USER}/appnotify` 里把 `SYNO.SDS.AdminCenter.Update_Reset.Main` 删除或标记为 `read` 即可

## 找出 web 服务

看下 DSM web 界面的请求，都是由 nginx 负责处理的。直接去找 nginx 的配置
``` bash
# ps aux | grep nginx
root      9370  0.0  0.1  33296  6600 ?        S<s  20:17   0:00 nginx: master process /usr/bin/nginx -g pid /run/nginx.pid; daemon on; master_process on;
http     11644  0.0  0.1  33300  5284 ?        S<   20:17   0:00 nginx: worker process
http     11645  0.0  0.1  33300  6080 ?        S<   20:17   0:00 nginx: worker process
http     11646  0.0  0.1  33300  7372 ?        S<   20:17   0:00 nginx: worker process
http     11647  0.0  0.1  33300  6808 ?        S<   20:17   0:00 nginx: worker process
root     18139  0.0  0.0  23148  2412 pts/8    S+   20:56   0:00 grep --color=auto nginx
```
看起来 nginx 的配置路径是用的默认配置，

`nginx -V` 和 `nginx -h` 看下默认值，发现没改，在 `/etc/nginx/nginx.conf` 下

## 找出真正的接口提供方

看 nginx.conf，重要的有这么几条

``` conf
upstream synoscgi {
    server unix:/run/synoscgi.sock;
}
root /usr/syno/synoman;
index index.cgi;

location ~ \.cgi {
    include     scgi_params;
    scgi_pass   synoscgi;

    scgi_read_timeout   3600s;
}

```

找到正主了，web接口由一个 cgi 程序提供。直接 strings 看看有没有有效信息。没啥发现，同级目录下的 webapi 目录引起了我的注意。
打开发现此目录用于保存所有模块的引用信息。其中有一个文件 `SYNO.Core.Upgrade.lib` 记录了 upgrade 模块是由 `lib/SYNO.Core.Upgrade.so` 实际处理的

strings 此文件发现了很多升级逻辑中使用的文件路径
但是这跟小红点有啥关系？
发现了配置 `/synoinfo.conf`

## 小红点哪来的？

分析接口发现，小红点由 AppNotify 模块提供。直接strings 一把 `SYNO.Core.AppNotify.so`

发现了一个路径 `/appnotify`

发现了

