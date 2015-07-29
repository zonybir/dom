超轻量且兼容到IE6的dom选择器
=====
###介绍
dom选择器是一个纯选择器, 兼容到IE6, 用法和document.querySelectorAll一样, dom选择器返回的是真数组不是伪数组.
dom选择器只暴露一个d的全局变量, 可自行设置. 比如设置为abc,则```window.abc = d; delete window.d;```
###引入
直接script标签引用

###例子
```
d('#main>ul li:eq(3) input:button')
d('ul:first li.item , body, #footer')
d('ul:even>li a[src$=.jpg]')
```

###协议
[MIT](https://github.com/flfwzgl/select/blob/master/LICENSE)