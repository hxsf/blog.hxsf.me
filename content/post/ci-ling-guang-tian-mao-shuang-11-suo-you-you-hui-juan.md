+++
author = "hxsf"
date = 2015-10-14T19:32:05Z
description = ""
draft = true
image = "https://static.hxsf.me/image/b/a1/72b6382300a944e519edb2525c127.jpg-webp"
slug = "ci-ling-guang-tian-mao-shuang-11-suo-you-you-hui-juan"
title = "一次领光天猫双 11 所有优惠卷 - 技术改变生活"

+++


> 技术改变生活，极客改变世界。

**注: 此操作需要使用webkit内核的浏览器**
> 常见webkit浏览器: 火狐,谷歌,众多国产浏览器的极速模式

> 此处以谷歌浏览器为例

0. 先进一下淘宝的我的购物车之类的地方。
目的是**确保你登录了，确保你登录了，确保你登录了。**
重要的话说三遍。
1. 进入活动页面 [http://www.tmall.com/wow/act/14931/1111](http://www.tmall.com/wow/act/14931/1111) ,一直翻到最下面,等待网页全部加载出来.
2. 页面空白处右击->选择**审查元素**,点击标签中的**Console**.
 ![2](https://static.hxsf.me/image/e/f8/b078a5880f1c3f673f1c2b7e23462.png)
3. 复制最下面代码在空白处后按回车，即可。如果到时候有优惠的商品，就不用担心了。
 ![3](https://static.hxsf.me/image/e/08/513b51eff0e702d20244f8fb03d1b.png)
4. 然后就等着领光所有优惠卷了！(由于部分优惠券是每天限量的,所以最后部分领取失败.)
 ![4](https://static.hxsf.me/image/d/60/a62dcca12482d372b5fa1399d4f21.png)

> 代码如下
```javascript
    (function(window, document, undefined) {
        var interval = 800;
        var closeDelay = 200;
        var index = 0;
        var couponLinks;
        var getCoupon = function() {
            if (index >= couponLinks.length) {
                console.log("领取完毕");
                return;
            }
            var coponLink = couponLinks[index];
            coponLink.click();
            index++;
            console.log("领取 第" + index + " 张");
            setTimeout(getCoupon, interval);
            setTimeout(function() {
                var close = document.querySelector('.mui-dialog-close');
                if (close != null) close.click();
            }, closeDelay);
        }
        var _scrollTop = 0;
        var _scrollStep = document.documentElement.clientHeight;
        var _maxScrollTop = document.body.clientHeight - document.documentElement.clientHeight;
        var autoScrollDown = setInterval(function() {
            _scrollTop += _scrollStep;
            if (_scrollTop > _maxScrollTop) {
                clearInterval(autoScrollDown);
                couponLinks = document.querySelectorAll('.mui-act-item-yhqbtn');
                console.log("总共：" + couponLinks.length + "条张优惠券待领取...");
                getCoupon();
            } else {
                document.body.scrollTop = _scrollTop;
            }
        }, 500);
    })(window, document);
```

