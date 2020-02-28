+++
author = "hxsf"
categories = ["经验", "linux", "安全", "dns", "named", "centos", "firewall"]
date = 2016-02-19T05:38:32Z
description = "使用 Centos7 搭建内网DNS服务器及排错。"
draft = false
image = "https://static.hxsf.me/image/d/67/bc9a0427e88c8a50c2af28daa1ac2.png-webp"
slug = "create-dns-server"
tags = ["经验", "linux", "安全", "dns", "named", "centos", "firewall"]
title = "自建DNS ——记一次注定坑爹的排错"

+++


## 背景：
- 服务一直用Ubuntu Server(deb包管理)
- 个人使用OS X

## 起因

因部分网站在学校内部，如果自己提供DNS服务则可以使内网用户访问内网地址，减小带宽压力。遂决定自己搭建一个DNS服务器。

心血来潮想试试rpm包管理系的Linux。然后选定了Centos，版本选了最新版7。悲剧也是由此引起。

## 过程

1. 换国内源。身在天朝，你懂的。

2. 安装bind。[详细介绍](http://www.isc.org/downloads/bind/)(国外)

3. 配置bind，按照手册来写，一部分是学校一些域名对应的内网地址(姑且称为**静态**解析吧)，其它的外网都通过上级DNS获取(姑且称为**动态**解析吧)，没啥好说的。

## 问题

自己电脑的DNS设置改机器，通过nslookup测试，发现无法连接。

1. 初认为是服务器上bind服务没开。使用 `service named status` 确认服务正常。
2. 排查服务有效性，在服务器上使用 `nslookup` 进行测试，同样**无法获取到动态解析，但是能获取到静态的解析**。
3. 查看`named`服务日志，发现动态解析的时候会请求到 IPv6 的 AAAA 记录，由于校内没有分配到 IPv6 的地址，所以会出现 `network unreachable` 错误。
4. 关闭 named 的 IPv6 ，
```
# vi /etc/sysconfig/named
//add following line:
OPTIONS="－4"
```

5. 重启服务后发现本机仍然获取不到动态解析。查看日志发现
```
SOA: got insecure response; parent indicates it should be secure
error (no valid RRSIG) resolving
```
查手册后搞定
```
# vi /etc/named.conf
//change following lines:
dnssec-enable no;
dnssec-validation no;
```
6. 发现本机可以正常获取到动态和静态解析了。

**然而这肯定不是结局。**

## 神坑

自己电脑上使用 `nslookup` 依然无法获取。
于是把目标转向了防火墙。

1. 首先看了下服务器机房的防火墙，找了半天也没找到哪台防火墙里有关于 `udp:53` 端口的策略。然后滚去吃饭了。。。

2. 吃饭时忽然想到是不是 CentOS 自带的防火墙，于是回来装了个 `Nginx` ，发现自己curl能看到html，而通过自己电脑无法访问。

3. 使用 `iptables` 修改防火墙相关规则。报错：未安装iptables。

4. 是的这就是最后等着我的坑，花了半个小时之后， 才得知 CentOS 7 把 默认防火墙换成 `Firewalld` 了。。。

5. 使用 `Firewalld` 开放 `udp:53` 端口。自己电脑测试正常。

