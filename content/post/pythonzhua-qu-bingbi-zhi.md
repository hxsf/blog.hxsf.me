+++
author = "hxsf"
categories = ["python", "bing", "wallpaper"]
date = 2016-05-09T22:40:42Z
description = ""
draft = false
image = "https://static.hxsf.me/image/e/58/7d96901e5cef8eb0351a383fb77aa.jpg-webp"
slug = "pythonzhua-qu-bingbi-zhi"
tags = ["python", "bing", "wallpaper"]
title = "python抓取bing壁纸"

+++


bing背景图很不错,一直用别人的bing壁纸获取软件(大部分C#写的)，
但是那些都或多或少不符合自己期望，不是会自动改桌面壁纸就是需要常驻后台，或者保存数量有上限。
然后想用python练个手。
看源码，有 `g_img={url:` 后面的url就是图片地址，点击右下角的上一页下一页可以换图片。
FF中的FireBug没找出具体路径，那就HttpFox来抓个包吧。

get it！有一串json加载进了一张jpeg和相关信息
`http://cn.bing.com/HPImageArchive.aspx?format=js&amp;idx=0&amp;n=1&amp;nc=1361089515117&amp;FORM=HYLH1`
返回的是一个json,格式化后如下

```
{
     images : [
        {
             startdate :  20150402 ,
             fullstartdate :  201504021600 ,
             enddate :  20150403 ,
             url :  http://s.cn.bing.net/az/hprichbg/rb/FranzJosef_ZH-CN6046406720_1920x1080.jpg ,
             urlbase :  /az/hprichbg/rb/FranzJosef_ZH-CN6046406720 ,
             copyright :  新西兰弗兰兹·约瑟夫冰河的徒步旅行者 (© Keri Oberly/Aurora Photos) ,
             copyrightlink :  http://www.bing.com/search?q=%E5%BC%97%E5%85%B0%E5%85%B9%C2%B7%E7%BA%A6%E7%91%9F%E5%A4%AB%E5%86%B0%E6%B2%B3&amp;form=hpcapt&amp;mkt=zh-cn ,
             wp : true,
             hsh :  7f487ef404037a5dda101b4febf83362 ,
             drk : 1,
             top : 1,
             bot : 1,
             hs : [
                {
                     desc :  它由大块的冰和雪块组成的，绵延12.1公里， ,
                     link :  http://www.bing.com/search?q=%E5%BC%97%E5%85%B0%E5%85%B9%C2%B7%E7%BA%A6%E7%91%9F%E5%A4%AB%E5%86%B0%E6%B2%B3&amp;form=hphot1&amp;mkt=zh-cn ,
                     query :  它是弗兰兹·约瑟夫冰河。 ,
                     locx : 21,
                     locy : 39
                },
                {
                     desc :  看过它的长相，你可能会猜想，会不会是某人不小心， ,
                     link :  http://www.bing.com/images/search?q=Franz+Josef+Glacier+in+New+Zealand&amp;form=hphot2&amp;mkt=zh-cn ,
                     query :  而将这个冰河掉落在两座山之间？ ,
                     locx : 34,
                     locy : 49
                },
                {
                     desc :  在这，不要让你的背包或者车辆处于无人看守的情况…… ,
                     link :  http://www.bing.com/videos/search?q=%E5%95%84%E7%BE%8A%E9%B9%A6%E9%B9%89&amp;form=hphot3&amp;mkt=zh-cn ,
                     query :  聪明又狡猾的鸟儿正在旁盯着呢！ ,
                     locx : 55,
                     locy : 38
                }
            ],
             msg : [
                {
                     title :  今日图片故事 ,
                     link :  http://www.bing.com/search?q=%E5%BC%97%E5%85%B0%E5%85%B9%C2%B7%E7%BA%A6%E7%91%9F%E5%A4%AB%E5%86%B0%E6%B2%B3&amp;form=pgbar1&amp;mkt=zh-cn ,
                     text :  弗兰兹·约瑟夫冰河，旅行者
                }
            ]
        }
    ],
     tooltips : {
         loading :  正在加载... ,
         previous :  上一页 ,
         next :  下一页 ,
         walle :  此图片不能下载用作壁纸。 ,
         walls :  下载今日美图。仅限用作桌面壁纸。
    }
}
```

知道API之后就好办了，话不多说，直接上代码


```
#!/usr/bin/python3
# -*- coding:utf-8 -*-
# python3抓取bing主页所有背景图片
import urllib.request,re,sys,os,getopt,json
def get_bing_backphoto(index, path='bing_photos/'):
	url = 'http://cn.bing.com/HPImageArchive.aspx?format=js&amp;idx='+str(index)+'&amp;n=1&amp;nc=1361089515117&amp;FORM=HYLH1'
	html = urllib.request.urlopen(url).read()
	if html == 'null':
		print( 'open &amp; read bing error!')
		sys.exit(-1)
	html = html.decode('utf-8')
	s = json.loads(html)
	if s!=None:
		date = s[ images ][0][ enddate ]
		imgurl = s[ images ][0][ url ]
		right = imgurl.rindex('/')
		name = imgurl.replace(imgurl[:right+1],'')
		savepath = path + date + '_' + name
		urllib.request.urlretrieve(imgurl, savepath)
		print (date + '_' + name + ' save success!')
def get_bing_all(num, savepath='photos/'):
	if (os.path.exists(savepath)== False):
		os.mkdir(savepath)
	for i in range(0,int(num)):
		get_bing_backphoto(i, savepath)
def usage():
	print( \n\tuse command like this:\n\t\t./bing.py [-n num] [-f savepath] )
	print( \n\tExample:\n\t\t./bing.py -n 17 -f bing_photos/ )
	print( \t参数:\n\t\tn\t获取最前n天的壁纸,默认为1(当天),由于bing网站只保留十几天的壁纸,最大取20 )
	print( \t\tf\t存放目录,支持相对路径和绝对路径,请以'/'结尾 )
opts, args = getopt.getopt(sys.argv[1:],  hn:f: )
num= 1
output_folder= bing_photos/
for op, value in opts:
	if op ==  -n :
		num = value if (int(value)&lt;20) else '20'
	elif op ==  -f :
		output_folder = value if (value[-1]=='/') else (value + '/')
	elif op ==  -h :
		usage()
		sys.exit()
get_bing_all(num, output_folder)
```

