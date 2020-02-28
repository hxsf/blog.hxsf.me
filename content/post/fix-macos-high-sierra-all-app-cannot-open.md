+++
author = "hxsf"
date = 2018-04-26T18:37:52Z
description = ""
draft = false
image = "https://static.hxsf.me/blog/kernel-panic-mac-os-x-restart-pieriezaghruzka-nadpis-sieryi-1920x1200.jpg-webp"
slug = "fix-macos-high-sierra-all-app-cannot-open"
title = "修复 macOS 10.13 所有软件无法打开"

+++


## 问题表现

1. 所有图标变空白
2. 点击所有软件，显示已损坏或不完整

如图：
![7e6addf678bd47b44ec3409639740720](https://static.hxsf.me/blog/7e6addf678bd47b44ec3409639740720.jpg)


## 修复

> macOS 每个用户有两个ID，一个是 UniqeID (uid) ，一个GeneratedUID
> 出现所有app 都打不开，貌似是跟 GeneratedUID 相关的某个东西出问题导致的。
> 默认的第一个用户 uid = 501

1. 新建一个管理员用户 temp（ uid 应该是 502）。然后登录到 temp
2. 将老用户重命名为 gg，修改 uid 为 任意值（如555），新建管理员用户，将 uid 修改为 501（为了继承老用户的所有 fs 的权限）。
3. 重启，用新用户登录。
4. 然后把 老用户和 temp 用户删掉。
5. 修复下权限。。。

    ``` bash
    sudo find / -uid 502 -exec chown 501 {} \;
    sudo find / -uid 555 -exec chown 501 {} \;
    ```

- PS： 目前 GeneratedUID 修改会不会引发什么问题，不是很清楚。
- PPS： 启动的 APFS 貌似跟着初始账号的 GeneratedUID 有关系导致不能删除初始用户。不过我强制删了老用户没感觉有啥影响。

- PPPS：因为啥都打不开（包括系统偏好设置.app），但是可以ssh 上去。
ssh 上去后， /Applications/System\ Preferences.app/Contents/MacOS/System\ Preferences 能拉起各种 APP。
- PPPPS：没开 ssh 和 远程管理的 可以进安全模式搞。

感觉直接重置下当前用户的 GeneratedUID 就可以了。
具体导致问题的原因不知道在哪（不在 ～ 下）。可能在 apfs preboot 里。

对 APFS preboot 不了解。。。有了解大大佬嘛？

