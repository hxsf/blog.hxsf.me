+++
author = "hxsf"
categories = ["部署", "gitlab"]
date = 2015-02-19T04:19:00Z
description = ""
draft = false
image = "https://static.hxsf.me/image/b/85/15479f84b6b0e6cbb7b20bdd6fe33.jpg-webp"
slug = "an-zhuang-bing-pei-zhi-gitlabshou-ji"
tags = ["部署", "gitlab"]
title = "安装并配置GitLab手记"

+++


照着官方的下载页面 [https://about.gitlab.com/downloads/](https://about.gitlab.com/downloads/)

1-2步安装好GitLab 7.7.2 ，第三步里写的内容是使用一键配置来初始化GitLab

如果单纯的裸机(没有安装任何的服务器数据库之类的||防止端口占用)里只想安装GitLab那么没有任何问题，直接

```
sudo gitlab-ctl reconfigure
```

如果有特殊需求就得自己编辑这个自动配置的设置了(貌似有点绕。。。)

GitLab7.7.2 on Ubuntu 14.04中自带的有logrotate、nginx、postgresql、redis、sidekiq、unicorn这六个

我已经有的是nginx服务器这就造成了80、443端口的冲突。

## 1、先试一下默认的配置

先关掉了自己的nginx服务器，然后在 `/etc/gitlab/gitlab.rb` 中修改 `external_url "http://mydemo.com"` 这一行，改为自己的服务器url，然后自动配置

```
sudo service nginx stop
sudo gitlab-ctl reconfigure
```

打开浏览器访问，一切正常。

## 2、使用自己的nginx

gitlab.rb 中反注释掉 GitLab Nginx 下面的

```
nginx['enable'] = false
nginx_ci['enable'] = false
```

[官方文档地址](https://gitlab.com/gitlab-org/omnibus-gitlab/tree/629def0a7a26e7c2326566f0758d4a27857b52a3/doc/settings/nginx.md)

然后在自己的 nginx 中添加配置

```
server {
  listen *:80;
  server_name git.yourdomain.com;
  server_tokens off;
  root /opt/gitlab/embedded/service/gitlab-rails/public;

  client_max_body_size 250m;

  access_log  /var/log/gitlab/nginx/gitlab_access.log;
  error_log   /var/log/gitlab/nginx/gitlab_error.log;

  # Ensure Passenger uses the bundled Ruby version
  passenger_ruby /opt/gitlab/embedded/bin/ruby;

  # Correct the $PATH variable to included packaged executables
  passenger_set_cgi_param PATH &quot;/opt/gitlab/bin:/opt/gitlab/embedded/bin:/usr/local/bin:/usr/bin:/bin&quot;;

  # Make sure Passenger runs as the correct user and group to
  # prevent permission issues
  passenger_user git;
  passenger_group git;

  # Enable Passenger &amp; keep at least one instance running at all times
  passenger_enabled on;
  passenger_min_instances 1;

  error_page 502 /502.html;
}
```

```
sudo gitlab-ctl reconfigure
```

但是却不能访问，查看 nginx 的 log 发现是没有自己的 nginx 没有 passenger (用于使 nginx 支持 Ruby on rails)

于是添加了之后还是打不开。。。深深的忧桑中。。。明天再看看官方wiki吧。。。

