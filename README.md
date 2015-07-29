超轻量且兼容到IE6的dom选择器
=====
###介绍
dom选择器是一个超轻量级纯选择器, 兼容到IE5, 用法和document.querySelectorAll几乎一样.
如果浏览器支持document.querySelectorAll方法且查询语句正确, 则此选择器会优先使用此方法.
dom选择器只暴露一个d的全局变量, 可自行设置. 
比如设置为abc,则在自执行函数底部修改为:```window.abc = d; delete window.d;```
###引入
直接script标签引用即可, ```<script src='dom.min.js'></script>```

###用法
此选择器兼容大部分IE和全部其他浏览器, 常用特殊符号如下:
```
#			//id选择符, 如d('#list')
.			//class选择符, 如d('.item')
>			//直接子元素, 如 d('body>div'), 选择所有是body子元素的div
空格		//内部所有元素, 如 d('body div'), 选择body中所有div
,			//并列关系, 如 d('#list>li, #box'), 选择#list子元素中li和#box

/* [attr=value] 可以常用于放在#或.或标签名后面过滤, 属性和属性名只能包含字母,数字, _和-   */
[attr=value]	//过滤属性attr的值是value的所有元素. 可用与过滤
[attr!=value]   //过滤属性attr不是value的所有元素, 没有attr属性的不会被选择
[attr^=value]   //过滤属性attr以value开头的所有元素
[attr$=value]   //过滤属性attr以value结尾的所有元素

/* :开头的通常放在之前选择字符串之后, 用于过滤之前的, 直接用会在整个文档中大量查找, 性能很低!  */
:eq(n)		//过滤出匹配数组中的第n个元素
:gt(n)      //过滤出匹配数组中第n个元素之后所有
:lt(n)      //过滤出匹配数组中第n个元素之前所有
:header     //过滤出h1-h6标签
:first      //过滤出匹配数组中第一个元素(唯一)
:last       //过滤出匹配数组最后一个元素(唯一)
:odd        //过滤出匹配数组中奇数号元素
:even       //过滤出匹配数组中偶数号元素
:input      //过滤出匹配数组中input元素

:parent     //选择匹配数组中元素的父元素
:child      //选择匹配数组中元素的直接子元素
:firstChild //选择匹配数组中元素直接子元素的第一个(不一定唯一)
:lastChild  //选择匹配数组中元素直接子元素的最后一个(不一定唯一)
:child(n)   //选择匹配数组中元素直接子元素的第n个(不一定唯一)

:selected   //过滤出selected = 'true'的元素
:checked
:disabled
:enabled

:button		//过滤出type是button的元素, 以下同理
:checkbox
:file
:hiden
:image
:password
:reset
:submit
:text
```
#####再次强调: 执行d函数, 任何情况下均返回一个数组. 要想得到单个元素使用 d('#list')[0].

###例子
```
d('#main>ul li:eq(3) input:button')
d('ul:first li.item , body, #footer')
d('ul:even>li a[src$=.jpg]:last')
```

###协议
[MIT](https://github.com/flfwzgl/select/blob/master/LICENSE)