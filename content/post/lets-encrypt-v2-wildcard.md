+++
author = "hxsf"
categories = ["安全", "部署", "ssl"]
date = 2018-03-13T19:28:50Z
description = "2018-03-14 Let's Encrypt 发布了 v02 的接口。可以签发泛域名证书了。 我们使用 acme.sh 这个工具来签发。详情点击查看。"
draft = false
slug = "lets-encrypt-v2-wildcard"
tags = ["安全", "部署", "ssl"]
title = "Let's Encrypt Wildcard 部署"

+++


> 2018-03-14 Let's Encrypt 发布了 v02 的接口。可以签发泛域名证书了。

我们使用 [`acme.sh`](https://acme.sh) 这个工具来签发。由于目前泛域名证书只能通过DNS来验证域名所有权。所以需要我们有对应域名的DNS记录的修改权限。

安装 `acme.sh` 的过程其官网写的很详细，略过不表。

## 申请证书

建议使用 dns-api 的方式进行验证。以 hxsf.me 为例：

``` bash
acme.sh --issue --dns <dns_api> -d hxsf.me -d '*.hxsf.me' -d '*.static.hxsf.me'
```

- `-d hxsf.me` 保证包含主域名
- `-d *.hxsf.me` 二级泛域名
- `-d *.static.hxsf.me` 三级泛域名

## 部署证书

不建议直接在 webserver 中直接使用 acme.sh 的内部目录。原因有很多。
1. `acme.sh` 安装在 `$HOME/.acme.sh` 下， 一般而言 webserver 会使用单独的用户和组。权限问题
2. `acme.sh` 内部的文件结构可能会变化，尽量的解耦合，防止后期自动更新证书出问题。
3. 在 `acme.sh` 更新证书之后，需要让 webserver 重新读取新的证书。这就需要个钩子。

好在新版本的 `acme.sh` 已经考虑到了这个特效，增加了部署hook，虽然目前只是简单的使用了文件拷贝和执行自定义命令。以nginx为例，使用方式如下：

``` bash
acme.sh --installcert -d hxsf.me --key-file /etc/nginx/ssl/wc.hxsf.me.key --fullchain-file /etc/nginx/ssl/wc.hxsf.me.crt --reloadcmd "nginx -s reload"
```

刷新下浏览器，网站已经挂上了小绿锁。

