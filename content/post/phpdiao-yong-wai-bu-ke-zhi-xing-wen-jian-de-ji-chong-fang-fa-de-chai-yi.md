+++
author = "hxsf"
categories = ["php"]
date = 2015-02-12T05:09:00Z
description = ""
draft = false
image = "https://static.hxsf.me/image/8/f7/f97bcdf2f1baa84735fa707955d1d.jpg-webp"
slug = "phpdiao-yong-wai-bu-ke-zhi-xing-wen-jian-de-ji-chong-fang-fa-de-chai-yi"
tags = ["php"]
title = "PHP调用外部可执行文件的几种方法的差异"

+++

PHP 要调用 Shell 执行程式的时候, 偷懒有 `ls` 可以使用, 不过, 正规点可以使用 system()、exec()、shell_exec()、passthru()这四个 Function 来操作。
<!--more-->

当然php官方文档中对执行程序有以下的方法可以使用:

* [escapeshellarg](http://php.net/manual/zh/function.escapeshellarg.php) — 把字符串转码为可以在 shell 命令里使用的参数
* [escapeshellcmd](http://php.net/manual/zh/function.escapeshellcmd.php) — shell 元字符转义
* [exec](http://php.net/manual/zh/function.exec.php) — 执行一个外部程序
* [passthru](http://php.net/manual/zh/function.passthru.php) — 执行外部程序并且显示原始输出
* [proc_close](http://php.net/manual/zh/function.proc-close.php) — 关闭由 proc_open 打开的进程并且返回进程退出码
* [proc_get_status](http://php.net/manual/zh/function.proc-get-status.php) — 获取由 proc_open 函数打开的进程的信息
* [proc_nice](http://php.net/manual/zh/function.proc-nice.php) — 修改当前进程的优先级
* [proc_open](http://php.net/manual/zh/function.proc-open.php) — 执行一个命令，并且打开用来输入/输出的文件指针。
* [proc_terminate](http://php.net/manual/zh/function.proc-terminate.php) — 杀除由 proc_open 打开的进程
* [shell_exec](http://php.net/manual/zh/function.shell-exec.php) — 通过 shell 环境执行命令，并且将完整的输出以字符串的方式返回。
* [system](http://php.net/manual/zh/function.system.php) — 执行外部程序，并且显示输出
不过本文主要讨论这四个。

那 ``、system()、exec()、shell_exec()、passthru()这四个 Function 使用上有何差异呢?

## 官方文件说明如下:

### 1. 执行运算符：反引号（``）

PHP 支持一个执行运算符：反引号（``）。注意这不是单引号！PHP 将尝试将反引号中的内容作为外壳命令来执行，并将其输出信息返回（即，可以赋给一个变量而不是简单地丢弃到标准输出）。使用反引号运算符“`”的效果与函数 shell_exec() 相同。

```
$output = `ls -al`;
echo "$output";
```

### 2.system — 执行外部程序，并且显示输出

```
string system ( string $command [, int &$return_var ] )
```

同 C 版本的 system() 函数一样， 本函数执行 command 参数所指定的命令， 并且输出执行结果。
如果 PHP 运行在服务器模块中， system() 函数还会尝试在每行输出完毕之后， 自动刷新 web 服务器的输出缓存。
如果要获取一个命令未经任何处理的 原始输出， 请使用 passthru() 函数。

#### 参数

command
要执行的命令。

return_var
如果提供 return_var 参数， 则外部命令执行后的返回状态将会被设置到此变量中。

### 3.exec — 执行一个外部程序

```
string exec ( string $command [, array &$output [, int &$return_var ]] )
```

exec() 执行 command 参数所指定的命令。

#### 参数

command
要执行的命令。

output
如果提供了 output 参数， 那么会用命令执行的输出填充此数组， 每行输出填充数组中的一个元素。 数组中的数据不包含行尾的空白字符，例如 \n 字符。 请注意，如果数组中已经包含了部分元素，exec() 函数会在数组末尾追加内容。如果你不想在数组末尾进行追加， 请在传入 exec() 函数之前 对数组使用 unset() 函数进行重置。

return_var
如果同时提供 output 和 return_var 参数， 命令执行后的返回状态会被写入到此变量。

### 4.shell_exec — 通过 shell 环境执行命令，并且将完整的输出以字符串的方式返回。

```
string shell_exec ( string $cmd )
```

#### 参数

cmd - 要执行的命令。

#### 返回值

命令执行的输出。 如果执行过程中发生错误或者进程不产生输出，则返回 NULL。

### 5.passthru — 执行外部程序并且显示原始输出

```
void passthru ( string $command [, int &$return_var ] )
```

同 exec() 函数类似， passthru() 函数 也是用来执行外部命令（command）的。 当所执行的 Unix 命令输出二进制数据， 并且需要直接传送到浏览器的时候， 需要用此函数来替代 exec() 或 system() 函数。 常用来执行诸如 pbmplus 之类的可以直接输出图像流的命令。 通过设置 Content-type 为 image/gif， 然后调用 pbmplus 程序输出 gif 文件， 就可以从 PHP 脚本中直接输出图像到浏览器。

#### 参数

command
要执行的命令。

return_var
如果提供 return_var 参数， Unix 命令的返回状态会被记录到此参数。



<!--more-->
一般系统会有两种输出, 一种是系统状态(return code), 一种是输出文字(output string), 这三个 Function 主要就是这些回传的差异.

```
system()
$last_line = system('ls', $return_var);
//system() 会将输出内容直接印出, 所以若于网页, 会将所有回传内容都显示于页面上.
//$last_line: 只能取得最后一行的内容
//$return_var: 取得系统状态回传码
//exec()
exec('ls', $output, $return_var);
//$output: 回传内容都会存于此变数中(储存成阵列), 不会直接秀在页面上.
//$return_var: 取得系统状态回传码
//shell_exec()
$output = shell_exec('ls');
//$output: 回传内容都会存于此变数中(储存成纯文字内容), 不会直接秀在页面上.
```

范例程式

由此范例执行一次就比较容易理解. (请建立一个目录, 随便放两个档案, 再将此程式放置执行)

```
<?php
echo "\nsystem";
$last_line = system('ls', $return_var);
echo "\nreturn_var:";
print_r($return_var);
echo "\nlast_line:";
print_r($last_line);

echo "\n\nexec";
exec('ls', $output, $return_var);
echo "\nreturn_var:";
print_r($return_var);
echo "\noutput:";
print_r($output);

echo "\n\nshell_exec";
$output = shell_exec('ls');
echo "\noutput:";
print_r($output);
?>
```

