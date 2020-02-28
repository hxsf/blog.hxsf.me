+++
author = "hxsf"
categories = ["Javascript", "js", "event"]
date = 2015-01-30T21:38:00Z
description = ""
draft = false
image = "https://static.hxsf.me/image/5/31/132bbaee4c63df0aab95df205c2a5.png-webp"
slug = "shi-jian-bang-ding-he-shi-jian-wei-tuo-yi-jquery-wei-li-2"
tags = ["Javascript", "js", "event"]
title = "事件绑定和事件委托 (以 jQuery 为例)"

+++


随着DOM结构的复杂化和Ajax等动态脚本技术的运用，事件委托自然浮出了水面。jQuery为绑定和委托事件提供了 `.bind()` 、`.live()` 和 `.delegate()` 方法。本文在讨论这几个方法内部实现的基础上，展示它们的优劣势及适用场合。

## 事件委托

事件委托的事例在现实当中比比皆是。比如，有三个同事预计会在周一收到快递。为签收快递，有两种办法：一是三个人在公司门口等快递；二是委托给前台MM代为签收。现实当中，我们大都采用委托的方案（公司也不会容忍那么多员工站在门口就为了等快递）。前台MM收到快递后，她会判断收件人是谁，然后按照收件人的要求签收，甚至代为付款。这种方案还有一个优势，那就是即使公司里来了新员工（不管多少），前台MM也会在收到寄给新员工的快递后核实并代为签收。

我们知道，DOM在为页面中的每个元素分派事件时，相应的元素一般都在事件冒泡阶段处理事件。在类似 `body > div > a` 这样的结构中，如果单击a元素，click 事件会从a一直冒泡到div和body（即document对象）。因此，发生在a上面的单击事件，div和body元素同样可以处理。而利用事件传播（这里是冒泡）这个机制，就可以实现事件委托。具体来说，事件委托就是事件目标自身不处理事件，而是把处理任务委托给其父元素或者祖先元素，甚至根元素（document）。

## .bind()

假设有一个多行多列的表格，我们想让用户单击每个单元格都能看到与其中内容相关的更多信息（比如，通过提示条）。为此，可以为每个单元格都绑定click事件：

```
$("info_table td").bind("click", function(){/*显示更多信息*/});
```

问题是，如果表格中要绑定单击事件的有10列500行，那么查找和遍历5000个单元格会导致脚本执行速度明显变慢，而保存5000个td元素和相应的事件处理程序也会占用大量内存（类似于让每个人亲自站在门口等快递）。

在前面这个例子的基础上，如果我们想实现一个简单的相册应用，每页只显示50张照片的缩略图（50个单元格），用户点击“第x页”（或“下一页”）链接可以通过Ajax从服务器动态加载另外50张照片。在这种情况下，似乎使用.bind()方法为50个单元格绑定事件又可以接受了。

事实却不然。使用 `.bind()` 方法只会给第一页中的50个单元格绑定单击事件，动态加载的后续页面中的单元格都不会有这个单击事件。换句话说， `.bind()` 只能给调用它的时候已经存在的元素绑定事件，不能给未来新增的元素绑定事件（类似于新来的员工收不到快递）。

事件委托可以解决上述两个问题。具体到代码上，只要用jQuery 1.3新增的.live()方法代替 `.bind()` 方法即可：

```
$("#info_table td").live("click",function(){/*显示更多信息*/});
```
这里的.live()方法会把click事件绑定到$(document)对象（但这一点从代码中体现不出来，这也是.live()方法饱受诟病的一个重要原因，稍后再详细讨论），而且只需要给$(document)绑定一次（不是50次，更不是5000次），然后就能够处理后续动态加载的照片单元格的单击事件。在接收到任何事件时，$(document)对象都会检查事件类型和事件目标，如果是click事件且事件目标是td，那么就执行委托给它的处理程序。

## .live()

到目前为止，一切似乎很完美。可惜，事实并非如此。因为.live()方法并不完美，它有如下几个主要缺点：

* $()函数会找到当前页面中的所有td元素并创建jQuery对象，但在确认事件目标时却不用这个td元素集合，而是使用选择符表达式与event.target或其祖先元素进行比较，因而生成这个jQuery对象会造成不必要的开销；
* 默认把事件绑定到$(document)元素，如果DOM嵌套结构很深，事件冒泡通过大量祖先元素会导致性能损失；
* 只能放在直接选择的元素后面，不能在连缀的DOM遍历方法后面使用，即$("#info_table td").live...可以，但$("#info_table").find("td").live...不行；
* 收集td元素并创建jQuery对象，但实际操作的却是$(document)对象，令人费解。

### 解决之道

为了避免生成不必要的jQuery对象，可以使用一种叫做“早委托”的hack，即在$(document).ready()方法外部调用.live()：

```
(function($){
    $("#info_table td").live("click",function(){/*显示更多信息*/});
})(jQuery);
```

在此，`(function($){...})(jQuery)` 是一个“**立即执行的匿名函数**”，构成了一个闭包，可以防止命名冲突。在匿名函数内部， $ 参数引用 jQuery 对象。这个匿名函数不会等到DOM就绪就会执行。注意，使用这个hack时，脚本必须是在页面的head元素中链接和(或)执行的。之所以选择这个时机，因为这时候刚好document元素可用，而整个DOM还远未生成；如果把脚本放在结束的body标签前面，就没有意义了，因为那时候DOM已经完全可用了。

为了避免事件冒泡造成的性能损失，jQuery从1.4开始支持在使用.live()方法时配合使用一个上下文参数：
```
$("td",$("#info_table")[0]).live("click",function(){/*显示更多信息*/});
```

这样，“受托方”就从默认的 `$(document)` 变成了 `$("#info_table")[0]` ，节省了冒泡的旅程。不过，与 `.live()` 共同使用的上下文参数必须是一个单独的DOM元素，所以这里指定上下文对象时使用的是 `$("#info_table")[0]` ，即使用数组的索引操作符来取得的一个DOM元素。

## .delegate()

如前所述，为了突破单一`.bind()`方法的局限性，实现事件委托，jQuery 1.3 引入了`.live()`方法。后来，为解决“事件传播链”过长的问题，jQuery 1.4又支持为`.live()`方法指定上下文对象。而为了解决无谓生成元素集合的问题，jQuery 1.4.2 干脆直接引入了一个新方法`.delegate()`。

使用`.delegate()`，前面的例子可以这样写：

```
$("#info_table").delegate("td","click",function(){/*显示更多信息*/});
```

使用`.delegate()`有如下优点（或者说解决了`.live()`方法的如下问题）：

* 直接将目标元素选择符（"td"）、事件（"click"）及处理程序与“受拖方” $("#info_table") 绑定，不额外收集元素、事件传播路径缩短、语义明确；
* 支持在连缀的DOM遍历方法后面调用，即支持 `$("table").find("#info").delegate...` ，支持精确控制；
可见， `.delegate()` 方法是一个相对完美的解决方案。但在DOM结构简单的情况下，也可以使用 `.live()` 。

> 提示：使用事件委托时，如果注册到目标元素上的其他事件处理程序使用 `.stopPropagation()` 阻止了事件传播，那么事件委托就会失效。

## 结论

在下列情况下，应该使用`.live()`或`.delegate()`，而不能使用`.bind()`：

* 为DOM中的很多元素绑定相同事件；
* 为DOM中尚不存在的元素绑定事件；

> PS：根据[jQuery 1.7 Beta 1](http://blog.jquery.com/2011/09/28/jquery-1-7-beta-1-released/)的发版说明，jQuery 1.7为了解决.bind()、.live()和.delegate()并存造成的不一致性问题，将会增加一对新的事件方法：.on()和.off()：
>
> `$(elems).on(events, selector, data, fn);`
>
> `$(elems).off(events, selector, fn);`
>
> 如果指定selector，则为事件委托；否则，就是常规绑定。
>
> 《jQuery基础教程（第3版）》  
> [The Difference Between jQuery’s .bind(), .live(), and .delegate()](http://www.alfajango.com/blog/the-difference-between-jquerys-bind-live-and-delegate/)  
> [bind() vs live() vs delegate() function](http://jquerybyexample.blogspot.com/2010/08/bind-vs- live-vs-delegate-function.html)  
> [jQuery API](http://api.jquery.com/)

