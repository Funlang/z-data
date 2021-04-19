
Z-data 是一个超轻量级的零配置嵌入式前端框架.
Z-data is an extremely lightweight zero configuration embedded front-end framework.

Z-Data 灵感来自于 Alpine, https://github.com/alpinejs/alpine
唯 Alpine 有一点慢, https://krausest.github.io/js-framework-benchmark/index.html
加上不支持多根模板及一些实用的语法糖, 在尝试一些做法以后, 决定自行启动 z-data 项目.

特性:

- 无 VDom, 采用 H5 template 技术
- 极简, 超轻量级, z-data minify < 4K, z-template minify < 3K
- 符合 H5 趋势, 技术简单, z-data 0.1 约300行代码, z-template 1.0 约200行代码
- template 支持 for, if else
- template 内支持多根
- 嵌入式, 可以和其他框架无缝嵌入
- 更多语法糖, 特别对 class 和 style 友好
- 可很好配合 tailwind, https://tailwindcss.com/, 以 H5 DOM 为中心的生产方式

例子:

<div z-data={name:'hello-world.html',items:{i:1,j:2,k:3}}
     #background=`silver`
>
    <template for='k:v,i in items' key=k>
        <template if=!i>
            <div :text=name
                 :style={fontSize:`200%`}
                 #color=`#fa0a`
            ></div>
            <div class=t0
                 :class={t1:true}
                 .t2
                 :k=k
            >[if !i] i=${i}</div>
        </template>
        <template else if='k=="j"'>
            <div :css.font-size=`120%`>[if k=="j"] k=${k}</div>
        </template>
        <template else>
            <div #font-weight=`bold`>[else] k=${k}</div>
        </template>
    </template>
</div>

用法:

- 安装

ZData 为零配置嵌入式前端框架, 不需要安装, 只需要引用即可.

临时地址:
全功能  https://funlang.org/zdata/z-data.min.js
或
仅渲染  https://funlang.org/zdata/z-template.min.js

* 当下(0.1版)需用户自动, 执行 ZData.start() 即可.

- 作用域
    - z-data 开启 ZData 作用域, 其内部节点为 ZData 组件
      <tag z-data=...

    - z-none 关闭 ZData 作用域, 其内部节点 ZData 会跳过
      <tag z-none

    - 与其他框架共存
      在 ZData 根节点用类似以下的方式处理 (x-ignore 改为其他框架关闭作用域的属性名):
      <tag z-data=... x-ignore
      在其他框架根节点加 z-none 即可

- 模板
    - template for
      <template for='k:v,i in ...' key=...
      ZData 依赖 key, 如果没有指定 key, 则优先选用 k 做 key, 否则用 v 做 key 键
      k : v , i 可以部分可选, 如
        <template for='k:v,i in items'
        <template for='  v   in items'
        <template for='k:    in items'
        <template for='   ,i in items'
        <template for='k:v   in items'
        <template for='  v,i in items'
        <template for=items

    - template if/else
      <template if=...
      <template else if=...
      <template else

- 绑定
    - : 用来做属性绑定, 其中 :: 是双向绑定
      <tag :attr-name1=... ::attr-name2=...

    - :text :html 分别对应 textContent 和 innerHTML

    - :class 支持 [] {} 和 字符串三种, 这些 classname 会按顺序合并处理

    - :class 支持 :class.name1.name2=...
      可以简写为 .name1.name2=...
      如果 classname 后面为 -, 且返回值不是 boolean, 则将其值加入到 classname, 如:
        .p-=1 则 classList 里会增加 p-1

    - :style 支持 :css 别名, 支持 {} 和字符串两种, 字符串会按顺序覆盖

    - :style 支持 :style.name.value=...
      :style.name=value / :css.name=value
      :style.name.value=条件 / :css.name.value=...
      可以简写为 ..name 和 #name, 如下:
        ..width=100
        #border-width=4

    - :attr.camel 支持驼峰表示法

    - @ 用来绑定事件, 支持 modifiers
