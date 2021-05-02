# z-data

- z-data
  https://github.com/Funlang/z-data

- z-template (仅静态渲染)
  https://github.com/Funlang/z-template


## Z-data 是一个超轻量级的零配置嵌入式前端框架.

Z-data is an extremely lightweight zero configuration embedded front-end framework.

- Z-Data 灵感来自于 Alpine, https://github.com/alpinejs/alpine
- 唯 Alpine 有一点慢, https://krausest.github.io/js-framework-benchmark/index.html
- 加上不支持多根模板及一些实用的语法糖, 在尝试一些做法以后, 决定自行启动 z-data 项目.

## 特性:

- 无 VDom, 采用 H5 template 技术
- 极简, 超轻量级, z-data minify ~ 7K, z-template minify ~ 3K
- 符合 H5 趋势, 技术简单, z-data 0.7 ~500行代码, z-template 1.2 ~200多行代码
- template 支持 for, if else
- template 内支持多根
- 嵌入式, 可以和其他框架无缝嵌入
- 更多语法糖, 特别对 class 和 style 友好
- 可很好配合 tailwind, https://tailwindcss.com/, 支持以 H5 DOM 为中心的生产方式

## 例子:

```html
<div z-data="{name:'hello-world.html',items:{i:1,j:2,k:3}}"
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
```

在线 demo:

* https://codepen.io/funlang/pen/NWdOQye

TodoMVC:

* https://codepen.io/funlang/pen/ExZOGJy

复杂数据绑定:

* https://codepen.io/funlang/pen/OJWrJep

## 用法:

### 安装

ZData 为零配置嵌入式前端框架, 不需要安装, 只需要引用即可.

临时地址:
- 全功能  https://funlang.org/zdata/z-data.min.js
或
- 仅渲染  https://funlang.org/zdata/z-template.min.js

* z-template 需用户执行 ZData.start(), z-data 不需要.

* ZData 与 ZDataProxy 可以配合使用, 请自行加载 ZDataProxy

  ```js
  ZDataProxy = (target, handler) => ...

  // 其中:

    handler = (obj, prop, value, rec, isOuterProxy) => {
      if (! isOuterProxy) obj[prop] = value
    }
  ```

### 作用域

  - z-data 开启 ZData 作用域, 其内部节点为 ZData 组件

    ```html
    <tag z-data=...>
    ````
    z-data 支持一个 init 函数, 在组件初始化时执行

    ```html
    <tag z-data=... init=...>
    ````

  - z-none 关闭 ZData 作用域, 其内部节点 ZData 会跳过

    ```html
    <tag z-none>
    ````

  - 与其他框架共存

    在 ZData 根节点用类似以下的方式处理 (x-ignore 改为其他框架关闭作用域的属性名):
    ```html
    <tag z-data=... x-ignore>
    ````
    在其他框架根节点加 z-none 即可

### 模板

  - template for

    ```html
    <template for='k:v,i in ...' key=...>
    ````
    ZData 依赖 key, 如果没有指定 key, 则优先选用 k 做 key, 否则用 v 做 key 键
    k : v , i 可以部分可选, 如

    ```html
      <template for='k:v,i in items'>
      <template for='  v   in items'>
      <template for='k:    in items'>
      <template for='   ,i in items'>
      <template for='k:v   in items'>
      <template for='  v,i in items'>
      <template for=items>
    ````

  - template if/else

    ```html
    <template if=...>
    <template else if=...>
    <template else>
    ````

### 绑定

  - : 用来做属性绑定, 其中 :: 是双向绑定

    ```html
    <tag :attr-name1=... ::attr-name2=...>
    ````

  - :text :html 分别对应 textContent 和 innerHTML

  - :class 支持 [] {} 和 字符串三种, 这些 classname 会按顺序合并处理

  - :class 支持 :class.name1.name2=...
    ```
    可以简写为 .name1.name2=...
    如果 classname 后面为 -, 且返回值不是 boolean, 则将其值加入到 classname, 如:
      .p-=1 则 classList 里会增加 p-1
    ```
  - :style 支持 :css 别名, 支持 {} 和字符串两种, 字符串会按顺序覆盖

  - :style 支持 :style.name.value=...
    ```
    :style.name=value / :css.name=value
    :style.name.value=条件 / :css.name.value=...
    可以简写为 ..name 和 #name, 以及 !name=string-value, 如下:
      ..width=`100px`
      #border-width=`4px`
      !border-width=4px
    ```

  * !!! 特别注意:

    - : :: @ . .. #
    ```
    : :: @ . .. # 绑定, 后面的值全部都是 js 表达式, 可以是 js 变量, 或者是字符串, 字符串要用 ' " ` 套住
    ```
    - ${...}
    ```
    非绑定的属性值中含有 ${...}, 会自动解析成一个字符串, 相当于 `...${...}...`
    ```
    - !
    ```
    ! 与 含有 ${} 的属性值类似, 会自动解析成 :css.style-name=`string-value`
    ```

  - :attr.camel 支持驼峰表示法

  - ::value=propName, ::style.value=propName, ::css.value=propName
    ```
    其中 propName 只支持驼峰表示法, DOM 属性(包括 style)可以增加 .camel 修饰符
    双向绑定默认在 change 中触发回写行为, 只有 input text 同时在 input 中触发回写
    可以增加 .input / .change 强制在 input / change 中回写
    支持 .trim / .number 修饰符
    ```
    ```
    目前有些属性如 style.value 修改, 不会自动触发响应式, 需要在当前执行 el 执行 el.fireChange()
    ```

  - @ 用来绑定事件, 支持 modifiers

    * 全局 modifier
      ```
      camel     事件名驼峰表示法
      prevent   preventDefault
      stop      stopPropagation
      debounce  debounce 模式, 后面可以带一个时间, 如
                debounce.750ms, debounce.2s, 默认 250ms
      capture   capture 模式
      once      once 模式, 只调用一次
      passive   passive 模式
      ```
    * 范围 modifier
      ```
      self      只自己
      away      自己之外的
      window
      document
      ```
    * 键鼠 modifier
      ```
      shift
      ctrl
      alt
      meta      或 cmd, super
      ```
    * 键盘 modifier
      ```
      <key>     enter, escape, space, f1 等
      ```
### 变量

  - $el 组件根节点
    ```
    $el.$data 组件的包装 data 对象
    ```
  - $event 事件内的事件对象

### 函数

  - ZData.start()
    ```
    z-template 需要显式调用 ZData.start(), z-data 一般不需要
    ```
  - ZData.proxy()
    ```
    在 z-data 获取 data 数据时, 用 ZData.proxy() 包装返回, 以使数据获得响应式
    ```
  - ZData.loadHTML(html, p, before)
    ```
    动态加载 html, p - 需要插入的父节点(默认 body), before - 需要插入该子节点之前

    * html 内含有 script 的, 需要用此种方式加载, 否则可以用 :html=... 的方式加载
    ```
  - el.fireChange()
    ```
    在 z-data 之外修改节点 style, 如果是双向绑定, 需要调用该节点的 .fireChange()
    ```

### 组件

  - z-comp 为 ZData 组件

    ```html
    <tag z-comp=...>
    ````
    z-comp 可以是一个 ./ 相对路径, 或者是一个 http(s): 的网络路径

    ```html
    <tag z-comp=./z-comp-2.html>
    <tag z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    ````
    z-comp 还可以是一个 Promise 函数, 用来加载组件代码

    ```html
    <tag z-comp="load_z_comp('z-comp-2')">
    ````
    z-comp 可以选择保留 / 删除组件占位符, z-xxx 或者含有 del 属性的, 删除占位符

    ```html
    删除占位符:
    <z-comp  z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    <div del z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    ````
    ```html
    保留占位符:
    <div z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    ````

    z-comp demo:
    * https://codepen.io/funlang/pen/ExZBPJL
    * https://codepen.io/funlang/pen/RwKzaOo

## 加入我们

欢迎加入 z-data 项目, 一起工作, Enjoy!
