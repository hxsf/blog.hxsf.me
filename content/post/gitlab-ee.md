+++
author = "hxsf"
date = 2017-12-29T22:41:48Z
description = ""
draft = true
slug = "gitlab-ee"
title = "Gitlab-EE License 研究"

+++


一直使用 Gitlab-CE，无奈社区版没有全局搜索，查询帮助页面，GitLab-EE 的高级版支持高可用、ES全局搜索、集群部署。

申请了试用。拿到一个 License 。

忽然想到 Gitlab 部署在我的服务器上，它验证 License 是通过网络授权么？还是单纯的靠加密算法？

Gitlab 是用 ROR 写的。
进安装目录看了下代码，没有加花、加密。代码原原本本的放在那里。
忍不住翻了下 Gitlab 的代码，代码结构和内容都很清晰，我这个不会写 ROR 的人都能看懂其中做的工作。
翻到 `/ee/app/models/license.rb` 发现是解析 License 操作的。
这个文件又引用了 `gitlab-license` 这个 gem 。

去翻 gitlab-license 这个包的内容，发现加解密过程异常的简单。

1. Gitlab-EE 的 License 的实质内容是个 JSON 格式的文本。
2. 生成**随机**的 key 和 iv
3. 通过 AES-128-CBC 加密 License 内容，得到 endata
4. 使用**私钥**加密 key，得到 enkey
5. 将 endata、enkey、iv 使用 JSON 格式组装为文本
6. base64 后得到 License 文件

其中的难点是第四步使用的私钥，部署的文件中只有与之对应的公钥（存放于`gitlab/embedded/service/gitlab-rails# cat .license_encryption_key.pub`）。
没有私钥就无法进行自己签发 License 的操作。
不过搜索了整个 Gitlab-EE 的代码，只有初始化的时候读入了这个文件（`/config/initializers/0_license.rb`），读 License 的时候使用到了这个公钥。理论上用自己生成的公钥替换这个公钥就可以了。

