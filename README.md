# z-data

Z-data 是一个超轻量级的零配置嵌入式前端框架.
Z-data is an extremely lightweight zero configuration embedded mini front-end framework.

[[English](./README-en.md)] [[中文](./README-cn.md)]

# 1. 特性 | Features:

- 没有虚拟 DOM | Without VDOM
- 零配置零依赖, 无需编译 | Zero configuration zero dependency, no compile time
- 极简, 超轻量级 | Extremely simple and lightweight, minify ~ 8K, gzipped < 5K
- H5 模板技术, 支持 for/if/else/use 等 | H5 template supports for/if/else/use
- 模板支持多根 | Template supports multi-roots
- 支持双向数据绑定和事件  | Data dual-binding and events
- 嵌入式, 可以和其他框架无缝嵌入 | Embedded, run with other front-end frameworks (such as Vue) together easily
- 更多语法糖, 特别对 class 和 style 友好 | Useful syntax sugars, friendly for class and style
- 鼓励配合 tailwind 以 H5 DOM 为中心 | Run with tailwind, supports production with H5 DOM inline

# 2. 示例 | Examples:

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

在线 demo | Online demo:

* https://codepen.io/funlang/pen/NWdOQye

TodoMVC:

* https://codepen.io/funlang/pen/ExZOGJy

复杂数据绑定 | Data bindings for complex data:

* https://codepen.io/funlang/pen/OJWrJep

一个表单示例 | z-data form demo:

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
Online IDE for creating/debugging/previewing z-data code/app/comp

* https://funlang.org/z-data/

# 3. 用法 | Usage:

## 3.1. 安装 | Install

- CDN https://cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js

  ```html
  <script src=//cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js></script>
  ```

## 3.2. 作用域 | Scope

  - z-data 属性创建 ZData 作用域 | z-data attribute launch a ZData scope
  
    ```html
    <tag z-data=...></tag>
    ```

    z-data 支持一个 init 函数, 在组件初始化时执行
    z-data supports an init function, will run when initialization

    ```html
    <tag z-data=... init=...></tag>
    ```

    z-data 表达式可以是一个函数表达式, 如:
    z-data expression can be a function expression, e.g.:

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

    z-data HTML 模块文件 (文件开头是 z-data) | z-data html module (begin with z-data)

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

  - z-none 关闭 ZData 作用域, 其内部节点 ZData 会跳过 | z-none stop the ZData scope, all inner tags will be ignored with ZData

    ```html
    <tag z-none>
      ...
    </tag>
    ```

  - 与其他框架共存 | Run with another framework together

    在 ZData 根节点用类似以下的方式处理 (x-ignore 改为其他框架关闭作用域的属性名)
    add x-ignore attribute to the root tag of ZData (x-ignore and other name of the 3rd framework):
    ```html
    <tag z-data=... x-ignore></tag>
    ```
    在其他框架根节点加 z-none 即可
    add z-none to other tag will skip ZData process

## 3.3. 模板 | template

  - template for

    ```html
    <template for='k:v,i in ...' key=...></template>
    ```
    ZData 依赖 key, 如果没有指定 key, 则优先选用 k 做 key, 否则用 v 做 key 键
    k : v , i 可以部分可选, 如:
    ZData is key needed, if key specified, the k will be key, or the v will be key
    k : v , i is optional for some var, e.g.:

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

## 3.4. 绑定 | data binding

  - : 用来做属性绑定, 其中 :: 是双向绑定 | : directive a data binding, :: directive a data dual-binding (like modal in some framework)

    ```html
    <tag :attr-name1=... ::attr-name2=...></tag>
    ```

### 3.4.1. :text :html

  :text :html 分别对应 textContent 和 innerHTML
  :text :html for textContent and innerHTML

### 3.4.2. :class

  :class 支持 [] {} 和 字符串三种, 这些 classname 会按顺序合并处理
  :class supports [] {} and string, these will be combine to the classname in order

### 3.4.3. :class 简写 | :class shorthand

:class 支持 :class.name1.name2=...
:class supports :class.name1.name2=...
  ```
  可以简写为 .name1.name2=...
  如果 classname 后面为 -, 且返回值不是 boolean, 则将其值加入到 classname, 如:
    .p-=1 则 classList 里会增加 p-1
  ```
  ```
  the shorthand is .name1.name2=...
  if classname ends with -, and not return boolean, the value will be append to classname, e.g.:
    .p-=1 causes p-1 added to classList
  ```

### 3.4.4. :style

:style 支持 :css 别名, 支持 {} 和字符串两种, 字符串会按顺序覆盖
:style supports :css shorthand, supports {} and string, the style property will be overwrite in order

### 3.4.5. :style 简写 | :style shorthand

:style 支持 :style.name.value=...
:style supports :style.name.value=...
  ```
  :style.name=value / :css.name=value
  :style.name.value=条件 / :css.name.value=...
  可以简写为 ..name 和 #name, 以及 !name=string-value, 如下:
    ..width=`100px`
    #border-width=`4px`
    !border-width=4px
    #--a-css-var=`'${theCssVarValue}'`
  ```
  ```
  :style.name=value / :css.name=value
  :style.name.value=condition / :css.name.value=...
  the shorthand is ..name and #name, and !name=string-value, as below:
    ..width=`100px`
    #border-width=`4px`
    !border-width=4px
    #--a-css-var=`'${theCssVarValue}'`
  ```

#### 3.4.5.1 ZData.ss(s)

```
ZData.ss = (s) => AShorthandMap[s] || s;
```

### 3.4.6. !!! 特别注意 | !!! Warning:

#### 3.4.6.1. : :: @ . .. \#

后面的值全部都是 js 表达式, 可以是 js 变量, 或者是字符串, 字符串要用 ' " ` 套住

Attribute value is a js expression, supports js variable, or string, string must quoted with ' " `

#### 3.4.6.2. ${...}

非绑定的属性值中含有 \${...}, 会自动解析成一个字符串, 相当于 \`...${...}...`

builtin attributes with \${...} in their values, will be paused as a string expression, to \`...${...}...`

#### 3.4.6.3. !

! 与 含有 ${} 的属性值类似, 会自动解析成 :css.style-name=\`string-value`

! will be compiled to :css.style-name=\`string-value`

### 3.4.7. attr

:xxx.attr 表示为可视 attribute 属性, 否则默认为不可见 prop 属性
:xxx.attr will be attribute, or default are prop (property)

:xxx.attr === false 表示为 boolean attribute 属性
:xxx.attr === false will be boolean attribute

#### 3.4.7.1. attr 简写 | attr shorthand
```
:!tag-attr  -> :tag-attr.attr
::!tag-attr -> ::tag-attr.attr
```
### 3.4.8. camel

:xxx.camel 支持驼峰表示法
:xxx.camel supports camel attributes or properties

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
  ```
  propName is camel only, DOM attribute/property(includes style) supports .camel modifier
  dual-binding will fire change event default, only input type=text will fire input event default
  .input / .change modifier will force the input / change event
  .trim / .number modifier will deal the value to trim or number
  ```
  ```
  style.value updated will not reactive automatically, must execute el.fireChange() manually in el
  ```

### 3.4.9. input type='radio'
```
::checked=opt==this.value

注: opt 是一个 data 内的属性变量名
Note: opt is prop name in data
```

## 3.5. 事件 | event

@ 用来绑定事件, 支持 modifiers
@ to bind events, supports modifiers

### 3.5.1. 全局 | Global modifier

```
camel     事件名驼峰表示法 | a-camel-name -> aCamelName
prevent   preventDefault
stop      stopPropagation
debounce  debounce mode, follow a time optional, such as
          debounce.750ms, debounce.2s, default 250ms
capture   capture mode
once      once mode, run once only
passive   passive mode
```

### 3.5.2. 范围 | Scope modifier

```
self      tag only
out       tag not
window
document
```

### 3.5.3. 键鼠 | Keyboard and mouse modifier

```
shift
ctrl
alt
meta      or cmd
```

### 3.5.4. 键盘 | Keyboard modifier
```
<key>     enter, escape, space, f1 etc., details refer to:
          https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
alias:  space: " ", slash: /, gt: >, eq: =
```

### 3.5.5. 鼠标 | Mouse modifier
```
<button>  left, mid, right
```
## 3.6. 动态属性/事件和自定义指令 | Dynamic props / events and custom directive

### 3.6.1. 动态属性 | Dynamic props/attrs

    :*={...}
    :*.attr={...}

  e.g.:

    :*="{
      min: '1',
      max: '100'
    }"

### 3.6.2. 动态事件 | Dynamic events

    @*={...}

  e.g.:

    @*="{
      input: 'console.log(event)',
      keydown: 'console.log(event)'
    }"

### 3.6.3. 自定义指令 | Custom directive

    z-d-...=...

  e.g.:

    z-d-rules-of-validate="[
      val => !!val || 'Name is required!',
      val => val.length > 5 || 'The field need 5 or more characters',
    ]"

  会翻译成调用如下形式的函数 | will be reformed and apply to

    rulesOfValidate({
      e: el,
      v: val, // attr value of z-d-rules-of-validate
      m: modifiers
    })

## 3.7. 变量 | Variables

### 3.7.1. $el

\$el 组件根节点
$el z-data root element

### 3.7.2. \$el.$data

\$el.\$data 组件的包装 data 对象
\$el.\$data the z-data data object

### 3.7.3. ZData.nobserve (default false)

```
no observe DOM for dynamic creating z-data node
  use ZData.loadHTML(), so observe DOM is not needed.
```

## 3.8. 函数 | Function

### 3.8.1. ZData.proxy()

在 z-data 获取 data 数据时, 用 ZData.proxy() 包装返回, 以使数据获得响应式

Reactive to the z-data data object, return ZData.proxy() wrapper, and it will reactive when change manual

### 3.8.2. ZData.loadHTML(html, p, before, args)

动态加载 html, p - 需要插入的父节点(默认 body), before - 需要插入该子节点之前

Dynamic load html, p - the parent element(default body), before - insert before

* html 内含有 script 的, 需要用此种方式加载, 否则可以用 :html=... 的方式加载
* html have script, must run loadHTML. Or you can use :html=... to load html properly

### 3.8.3. el.fireChange()

在 z-data 之外修改节点 style, 如果是双向绑定, 需要调用该节点的 .fireChange()
Change el style out of z-data, for dual-binding, needs to call .fireChange()

### 3.8.4. $emit(el, name, detail)

向 DOM 节点 el 发出名为 name 的事件, 携带 detail 参数
Dispatch an event (name) with detail param to el DOM Element 

### 3.8.5. ZData.deb(fn, ms)

延迟运行
Debounce

## 3.9. 组件 | Component

### 3.9.1. z-comp

z-comp 为 ZData 组件
z-comp is a ZData component

```html
<tag z-comp=...></tag>
```

### 3.9.2. 组件地址 | z-comp URL

z-comp 可以是一个 ./ 相对路径, 或者是一个 http(s): 的网络路径
z-comp may equal a ./ relative path, or a http(s): resource

```html
<tag z-comp=./z-comp-2.html></tag>
<tag z-comp=https://funlang.org/zdata/test/z-comp-2.html></tag>
```
z-comp 还可以是一个 Promise 函数, 用来加载组件代码
z-comp may be a Promise function, then return a z-comp code

```html
<tag z-comp="load_z_comp('z-comp-2')"></tag>
```

### 3.9.3. 组件加载器 | z-comp loader ZData.get

z-comp 支持 z:// 协议插件, ZData.get 函数存在时, z:// 插件生效
z-comp supports z:// protocol plugin, ZData.get is exists, z:// will be work

```
注意: ZData.get 是一个 Promise 函数, 返回类似于 fetch(url).then(res => res.text()) 之后的部分
```
```
Note: ZData.get is a Promise function, return like fetch(url).then(res => res.text()) rest part
```
```
定义并加载插件:
document.addEventListener("DOMContentLoaded", () => setTimeout(() => ZData.get = ...))

应用 ZData.get 加载 table-v1.5.2 组件
<z- z-comp=z://table-v1.5.2></z->
```
```
define and load the plugin:
document.addEventListener("DOMContentLoaded", () => setTimeout(() => ZData.get = ...))

and apply ZData.get to load table-v1.5.2 component
<z- z-comp=z://table-v1.5.2></z->
```

### 3.9.4. 组件占位符 | z-comp placeholder

z-comp 可以选择保留 / 删除组件占位符, z-xxx 或者含有 del 属性的, 删除占位符
z-comp supports keep / remove the placeholder tag, z-xxx or del attribute, then remove itself

```html
remove the placeholder tag:
<z-comp  z-comp=https://funlang.org/zdata/test/z-comp-2.html></z-comp>
<div del z-comp=https://funlang.org/zdata/test/z-comp-2.html></div>
```
```html
keep the placeholder tag:
<div z-comp=https://funlang.org/zdata/test/z-comp-2.html></div>
```

### 3.9.5. 组件参数 | z-comp args

```html
<tag z-comp=... args=...></tag>
```
在组件内部, 用 args.xxx 来使用传进来的参数, 形如:
and use args.xxx to get the args props, e.g.:
```html
<div z-data @mouseover.document=$el.textContent=event.target&&(event.target.title||(event.target.closest('[title]')||{}).title)||''
#color=args.color #background=args.bgcolor !height=100% !padding=8px
></div> 
```

### 3.9.6. z-comp demo:
* https://codepen.io/funlang/pen/ExZBPJL
* https://codepen.io/funlang/pen/RwKzaOo

# 4. 浏览器兼容性 | Browser compatibles

-  z-data.js, z-data.min.js
    ```
    2017: Chrome 61, Firefox 55, Opera 48
    ```

-  z-data.min.es2015.js, z-data.min.all.js
    ```
    2016: Chrome 49, Firefox 44, Opera 36, iOS 10, Android 7
    ```

# 5. 加入我们 | JOIN US

欢迎加入 z-data 项目, 一起工作, Enjoy!
Welcome to join z-data project, a front-end framework for future, Enjoy!
