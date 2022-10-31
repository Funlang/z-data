# z-data

Z-data 是一个超轻量级的零配置嵌入式前端框架.

[[English](./README-en.md)] [[中文](./README-cn.md)]

# 1. 特性

- 没有虚拟 DOM
- 零配置零依赖, 无需编译
- 极简, 超轻量级
- H5 模板技术, 支持 for/if/else/use 等
- 模板支持多根
- 支持双向数据绑定和事件 
- 嵌入式, 可以和其他框架无缝嵌入
- 更多语法糖, 特别对 class 和 style 友好
- 鼓励配合 tailwind 以 H5 DOM 为中心

# 2. 示例

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

在线 demo

* https://codepen.io/funlang/pen/NWdOQye

TodoMVC:

* https://codepen.io/funlang/pen/ExZOGJy

复杂数据绑定

* https://codepen.io/funlang/pen/OJWrJep

一个表单示例:

* https://funlang.org/z-data/?url=./test/z-data-form-demo.html

z-cloak example:

```html
z-data
<div z-cloak :z-cloak.attr=false>z-cloak example</div>

<style>
  [z-cloak] {
    display: none;
  }
</style>
```

## 2.1. z-data studio

可以在线创建/调试/预览 z-data 代码

* https://funlang.org/z-data/

# 3. 用法

## 3.1. 安装

- CDN https://cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js

  ```html
  <script src=//cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js></script>
  ```

## 3.2. 作用域

  - z-data 属性创建 ZData 作用域

    ```html
    <tag z-data=...></tag>
    ```
    z-data 支持一个 init 函数, 在组件初始化时执行

    ```html
    <tag z-data=... init=...></tag>
    ```

    z-data 表达式可以是一个函数表达式, 如:

    ```html
    <tag z-data="(args=>{
        // some codes ...
        return {
          // some props ...
        }
      })()"></tag>

    <tag z-data="args=>{
        // some codes ...
        return {
          // some props ...
        }
      }"></tag>
    ```

    z-data HTML 模块文件 (文件开头是 z-data)
    
    ```html
    z-data
    <tag init=...></tag>

    <script>
      // some codes ...
      return {
        // some props ...
      }
    </script>
    ```

  - z-none 关闭 ZData 作用域, 其内部节点 ZData 会跳过

    ```html
    <tag z-none>
      ...
    </tag>
    ```

  - 与其他框架共存

    在 ZData 根节点用类似以下的方式处理 (x-ignore 改为其他框架关闭作用域的属性名)
    ```html
    <tag z-data=... x-ignore></tag>
    ```
    在其他框架根节点加 z-none 即可

## 3.3. 模板

  - template for

    ```html
    <template for='k:v,i in ...' key=...></template>
    ```
    ZData 依赖 key, 如果没有指定 key, 则优先选用 k 做 key, 否则用 v 做 key 键
    k : v , i 可以部分可选, 如:

    ```html
    <template for='k:v,i in items'></template>
    <template for='  v   in items'></template>
    <template for='k:    in items'></template>
    <template for='   ,i in items'></template>
    <template for='k:v   in items'></template>
    <template for='  v,i in items'></template>
    <template for=items></template>
    ```

  - template if/else

    ```html
    <template if=...></template>
    <template else if=...></template>
    <template else></template>
    ```

  - template use

    ```html
    <z z-none>
        <template id=t1>
            <div>template id = t1</div>
        </template>
    </z>

    <template use=#t1></template>
    ```

## 3.4. 绑定

  - : 用来做属性绑定, 其中 :: 是双向绑定

    ```html
    <tag :attr-name1=... ::attr-name2=...></tag>
    ```

### 3.4.1. :text :html

  :text :html 分别对应 textContent 和 innerHTML

### 3.4.2. :class

  :class 支持 [] {} 和 字符串三种, 这些 classname 会按顺序合并处理

### 3.4.3. :class 简写

:class 支持 :class.name1.name2=...
  ```
  可以简写为 .name1.name2=...
  如果 classname 后面为 -, 且返回值不是 boolean, 则将其值加入到 classname, 如:
    .p-=1 则 classList 里会增加 p-1
  ```

### 3.4.4. :style

:style 支持 :css 别名, 支持 {} 和字符串两种, 字符串会按顺序覆盖

### 3.4.5. :style 简写

:style 支持 :style.name.value=...
  ```
  :style.name=value / :css.name=value
  :style.name.value=条件 / :css.name.value=...
  可以简写为 ..name 和 #name, 以及 !name=string-value, 如下:
    ..width=`100px`
    #border-width=`4px`
    !border-width=4px
    #--a-css-var=`'${theCssVarValue}'`
  ```

#### 3.4.5.1 ZData.ss(s)

```
ZData.ss = (s) => AShorthandMap[s] || s;
```

### 3.4.6. !!! 特别注意

#### 3.4.6.1. : :: @ . .. \#

后面的值全部都是 js 表达式, 可以是 js 变量, 或者是字符串, 字符串要用 ' " ` 套住

#### 3.4.6.2. ${...}

非绑定的属性值中含有 \${...}, 会自动解析成一个字符串, 相当于 \`...${...}...`

#### 3.4.6.3. !

! 与 含有 ${} 的属性值类似, 会自动解析成 :css.style-name=\`string-value`

### 3.4.7. attr

:xxx.attr 表示为可视 attribute 属性, 否则默认为不可见 prop 属性

:xxx.attr === false 表示为 boolean attribute 属性

#### 3.4.7.1. attr 简写
```
:!tag-attr  -> :tag-attr.attr
::!tag-attr -> ::tag-attr.attr
```
### 3.4.8. camel

:xxx.camel 支持驼峰表示法

::value=propName, ::style.value=propName, ::css.value=propName
  ```
  其中 propName 只支持驼峰表示法, DOM 属性(包括 style)可以增加 .camel 修饰符
  双向绑定默认在 change 中触发回写行为, 只有 input text 同时在 input 中触发回写
  可以增加 .input / .change 强制在 input / change 中回写
  支持 .trim / .number 修饰符
  ```
  ```
  目前有些属性如 style.value 修改, 不会自动触发响应式, 需要在当前执行 el 执行 el.fireChange()
  ```

### 3.4.9. input type='radio'
```
::checked=opt==this.value

注: opt 是一个 data 内的属性变量名
```

## 3.5. 事件

@ 用来绑定事件, 支持 modifiers

### 3.5.1. 全局

```
camel     事件名驼峰表示法
prevent   preventDefault
stop      stopPropagation
debounce  debounce mode, follow a time optional, such as
          debounce.750ms, debounce.2s, default 250ms
capture   capture mode
once      once mode, run once only
passive   passive mode
```

### 3.5.2. 范围

```
self      tag only
out       tag not
window
document
```

### 3.5.3. 键鼠

```
shift
ctrl
alt
meta      or cmd
```

### 3.5.4. 键盘
```
<key>     enter, escape, space, f1 etc., details refer to:
          https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
alias:  space: " ", slash: /, gt: >, eq: =
```

### 3.5.5. 鼠标
```
<button>  left, mid, right
```

## 3.6. 动态属性/事件和自定义指令

### 3.6.1. 动态属性

    :*={...}
    :*.attr={...}

  e.g.:

    :*="{
      min: '1',
      max: '100'
    }"

### 3.6.2. 动态事件

    @*={...}

  e.g.:

    @*="{
      input: 'console.log(event)',
      keydown: 'console.log(event)'
    }"

### 3.6.3. 自定义指令

    z-d-...=...

  e.g.:

    z-d-rules-of-validate="[
      val => !!val || 'Name is required!',
      val => val.length > 5 || 'The field need 5 or more characters',
    ]"

  会翻译成调用如下形式的函数

    rulesOfValidate({
      e: el,
      v: val, // attr value of z-d-rules-of-validate
      m: modifiers
    })

## 3.7. 变量

### 3.7.1. $el

\$el 组件根节点

### 3.7.2. \$el.$data

\$el.\$data 组件的包装 data 对象

### 3.7.3. ZData.nobserve (default false)

```
no observe DOM for dynamic creating z-data node
  use ZData.loadHTML(), so observe DOM is not needed.
```

## 3.8. 函数

### 3.8.1. ZData.proxy()

在 z-data 获取 data 数据时, 用 ZData.proxy() 包装返回, 以使数据获得响应式

### 3.8.2. ZData.loadHTML(html, p, before, args)

动态加载 html, p - 需要插入的父节点(默认 body), before - 需要插入该子节点之前

* html 内含有 script 的, 需要用此种方式加载, 否则可以用 :html=... 的方式加载

### 3.8.3. el.fireChange()

在 z-data 之外修改节点 style, 如果是双向绑定, 需要调用该节点的 .fireChange()

### 3.8.4. $emit(el, name, detail)

向 DOM 节点 el 发出名为 name 的事件, 携带 detail 参数

### 3.8.5. ZData.deb(fn, ms)

延迟运行
Debounce

## 3.9. 组件

### 3.9.1. z-comp

z-comp 为 ZData 组件

```html
<tag z-comp=...></tag>
```

### 3.9.2. 组件地址

z-comp 可以是一个 ./ 相对路径, 或者是一个 http(s): 的网络路径

```html
<tag z-comp=./z-comp-2.html></tag>
<tag z-comp=https://funlang.org/zdata/test/z-comp-2.html></tag>
```
z-comp 还可以是一个 Promise 函数, 用来加载组件代码

```html
<tag z-comp="load_z_comp('z-comp-2')"></tag>
```

### 3.9.3. 组件加载器

z-comp 支持 z:// 协议插件, ZData.get 函数存在时, z:// 插件生效

```
注意: ZData.get 是一个 Promise 函数, 返回类似于 fetch(url).then(res => res.text()) 之后的部分
```
```
定义并加载插件:
document.addEventListener("DOMContentLoaded", () => setTimeout(() => ZData.get = ...))

应用 ZData.get 加载 table-v1.5.2 组件
<z- z-comp=z://table-v1.5.2></z->
```

### 3.9.4. 组件占位符

z-comp 可以选择保留 / 删除组件占位符, z-xxx 或者含有 del 属性的, 删除占位符

```html
remove the placeholder tag:
<z-comp  z-comp=https://funlang.org/zdata/test/z-comp-2.html></z-comp>
<div del z-comp=https://funlang.org/zdata/test/z-comp-2.html></div>
```
```html
keep the placeholder tag:
<div z-comp=https://funlang.org/zdata/test/z-comp-2.html></div>
```

### 3.9.5. 组件参数

```html
<tag z-comp=... args=...></tag>
```
在组件内部, 用 args.xxx 来使用传进来的参数, 形如:
```html
<div z-data @mouseover.document=$el.textContent=event.target&&(event.target.title||(event.target.closest('[title]')||{}).title)||''
#color=args.color #background=args.bgcolor !height=100% !padding=8px
></div> 
```

### 3.9.6. z-comp demo:
* https://codepen.io/funlang/pen/ExZBPJL
* https://codepen.io/funlang/pen/RwKzaOo

# 4. 浏览器兼容性

Chrome 61+, Firefox 55+, Opera 48+, ES2018

  - Polyfill.js (Element.prototype.getAttributeNames)

    Chrome 60+, Firefox 55+, Opera 47+

  - z-data.min.es2015.js

    Chrome 54+, Firefox 50+, Opera 41+

# 5. 加入我们

欢迎加入 z-data 项目, 一起工作, Enjoy!
