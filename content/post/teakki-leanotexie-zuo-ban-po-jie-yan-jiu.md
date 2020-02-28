+++
author = "hxsf"
date = 2018-01-04T22:51:40Z
description = ""
draft = true
image = "https://static.hxsf.me/blog/149300.jpg-webp"
slug = "teakki-leanotexie-zuo-ban-po-jie-yan-jiu"
title = "Teakki  （Leanote协作版）破解研究"

+++


根据官方文档，Teakki 使用 Docker 镜像进行分发。
先下载好镜像，不急着启动，先 `docker save` 一下，看看里面最新的一个 `layer` 到底放了什么。
看起来主要是装了一大部分软件，和 `/root/` 下的 teakki 文件夹的内容。
查看这个 `layer` 的配置，发现启动脚本

``` yaml
ENV:
  - PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
  - SERVER=http://192.168.0.110:3002
  - SERVER2=http://192.168.0.110:3002
  - V=2.6.3
WORKDIR: /root
CMD: ["/bin/sh", "-c", "sh /root/teakki/bin/run.sh"]
```

那么大概 `/root/teakki` 就是软件放的位置了。

看一眼项目的文件，发现是 nodejs 写的。但是大部分文件都使用 `.teakki` 后缀，且文件内容是一串无意义的字符串。

加密了！！！

加密就会解密啊，入口文件没加密，但有些文件加密了。说明解密不是在 `node` 二进制里做的，应该是在那部分未加密的 `javascript` 代码里做的。观察入口文件，在引入第一个 `.teakki` 模块之前，一共引入了四个未加密模块。
``` javascript
var r = require("async"),
    o = require("log4js"),
    i = require("fs"),
    s = require("teakki_express"),
    l, a, t, n, c = require("npm/lib/npm.js");
r.waterfall([function (e) {
    c.load({}, function (r) {
        e(r)
    })
}, function (r) {
    l = require("ep_etherpad-lite/node/1443/1467.teakki")
    l.runMode = process.argv[2] || "dev"
    l.isDev = "dev" == l.runMode
    l.isDev || (l.port = "9002")
    process.argv[3] && (l.port = process.argv[3])
    console.info("Port " + l.port)
    e()
    a = require("ep_etherpad-lite/node/17/20.teakki")
    t = require("ep_etherpad-lite/static/js/pluginfw/plugins")
    n = require("ep_etherpad-lite/static/js/pluginfw/hooks")
    n.plugins = t
    r()
}, function (e) {
    a.init(e)
}, function (e) {
    t.update(e)
}, function (e) {
    n.aCallAll("loadSettings", {
        settings: l
    }), e()
}, function (e) {
    n.callAll("createServer", {}), e(null)
}]);
```

`async`, `log4js`, `fs`, `teakki_express`, `npm/lib/npm.js`

首先怀疑最大的是 `teakki_express`, 检查了下发现并没有找到相关代码。
只发现一个很可疑的加解密函数：

``` js
{
    key: null,
    getKey: function (e) {
        return e || (e = ""), this.key || (this.key = r.readFileSync(__dirname + "/ha.js")), this.key + e
    },
    en: function (e, r) {
        var t = n.createCipher("aes-256-cbc", this.getKey(r)),
            i = t.update(e, "utf8", "hex");
        return i += t["final"]("hex")
    },
    de: function (e, r) {
        var t = n.createDecipher("aes-256-cbc", this.getKey(r)),
            i = t.update(e, "hex", "utf8");
        return i += t["final"]("utf8")
    }
}
```

怎么办呢？？？

其实很简单，在对应的目录下（`/root/teakki/src_online`）启动 `node` ，进如 repl 模式。
先试着 `require("ep_etherpad-lite/node/1443/1467.teakki")` 下，果然报错了。
然后试了几次，发现 `require("log4js")` 后可以引入加密后的包了。果断去看 log4js 的代码。

``` js
// log4js/index.js
var teakki = require('teakki_express');
var ext = ['.t', 'e', 'a', 'k', 'ki'].join('');
var kky = ['ex', 'ten', 'si', 'ons'].join('');
var kky2 = ['_', 'co', 'mp', 'ile'].join('');
var fs = require('fs');
var a = {
  ha() {
      var me = this;
      require[kky][ext] = function (m, filename) {
        var content = teakki.de(fs.readFileSync(filename, 'utf-8'));
        m[kky2](content, filename);
      };
  }
};
a.ha();
```

。。。。。。大兄弟，你们是来逗我的么。。。。。。

改第三方包的代码就算了。。。简单的人肉混淆下，加密还是直接用绝对路径当 key 来 `aes-256-cbc` 一下，太随意了吧。。。

进而解密所有加密的代码，发现重要的几段：

``` js
// /root/teakki/src_online/node/1443/1467.teakki
function getTeakkiInfo () { /* ... */ } // 获取授权
function setTeakkiInfo () { /* ... */ } // 写入授权
```
``` bash
// 关于追踪统计的
// 统计的 域名都是 teakki.com， 使用 host 屏蔽即可。
/home/hxsf/teakki/src_online/node/0/1477/13.js:155 c.post
/home/hxsf/teakki/src_online/node/1443/1467.js:36 c.post
/home/hxsf/teakki/src_online/node/1443/1467.js:85 teakkiUrl
/home/hxsf/teakki/src_online/node/0/1477/13.js:155 c.post
```

``` js
// 一个可用的配置

{"/root/teakki/data/.installed":"dbbfe148165e4df069e3fb4b5b8d424d0e83a93f675c6f6c6cf20264589767ee64c62ee9b7824540abd1e729c0683fba9ef4f44d02b057706f26e2a4d85360a24eb77eefd47fe8683109c6de549c55a53898c7b2d75a4b01146ddadbf06a3e1f3d0f06993e70f59ab9919ef2c725ca3a2e4eb786cd2fb94138188759bc1074c0673386d7322eb0a1087abdcec5e2b215","encrypto_key":"\"use strict\";var e=require(\"methods\"),r=require(\"./lib/test\"),t=require(\"http\");module.exports=function(u){\"function\"==typeof u&&(u=t.createServer(u));var n={};return e.forEach(function(e){n[e]=function(t){return new r(u,e,t)}}),n.del=n[\"delete\"],n},module.exports.Test=r,module.exports.agent=require(\"./lib/agent\");"}


```

