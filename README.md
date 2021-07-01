# z-data

- z-data
  https://github.com/Funlang/z-data

- z-template (template for static website)
  https://github.com/Funlang/z-template

- [[English](./README-en.md)] [[中文](./README-cn.md)]


## Z-data is an extremely lightweight zero configuration embedded front-end framework.

- Z-Data is inspired from Alpine, https://github.com/alpinejs/alpine
- But Alpine is a little slow, https://krausest.github.io/js-framework-benchmark/index.html
- And Alpine didn't support multi-roots in template and some useful syntax. After something happened, I decided to start z-data by myself.

## Features:

- Without VDom, and use H5 template tech (1/3 of web components tech)
- Extremely simple and easy, lightweight. z-data minify ~ 8K, z-template minify ~ 3K
- Follow the H5 tech's now and future. Few code, z-data ~500 code lines, z-template ~200 lines
- template supports for, if else
- template supports multi-roots
- Embedded, run with other front-end frameworks (such as Vue) together easily
- More useful syntax sugars, friendly for class and style
- Run with tailwind, https://tailwindcss.com/, supports production with H5 DOM inline

## Examples:

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

Online demo:

* https://codepen.io/funlang/pen/NWdOQye

TodoMVC:

* https://codepen.io/funlang/pen/ExZOGJy

Data bindings for complex data:

* https://codepen.io/funlang/pen/OJWrJep

### z-data studio

Online IDE for creating/debugging/previewing z-data code/app/comp

* https://funlang.org/z-data/

## Usage:

### Install

ZData is zero-configuration embedded front-end framework, install it with CDN directly.

Links:
- full features:
  https://funlang.org/zdata/z-data.min.js
- CDN
  https://cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js

Or

- static template
  https://funlang.org/zdata/z-template.min.js
- CDN
  https://cdn.jsdelivr.net/gh/Funlang/z-template@main/dist/z-template.min.js

* z-template needs ZData.start() on loaded, z-data not need.

* ZData supports customize ZDataProxy, as below:

  ```js
  ZDataProxy = (target, handler) => ...

  // the handler:

    handler = (obj, prop, value, rec, isOuterProxy) => {
      if (! isOuterProxy) obj[prop] = value
    }
  ```

### Scope

  - z-data attribute launch a ZData scope, inner of z-data are all in ZData component

    ```html
    <tag z-data=...>
    ````
    z-data supports an init function, will run when initialization

    ```html
    <tag z-data=... init=...>
    ````
    localize for variables (module)
    ```html
    <tag z-data=$xxx init=...></tag>

    <script>
      var $xxx = ...
    </script>
    ````

  - z-none stop the ZData scope, all inner tags will be ignored with ZData

    ```html
    <tag z-none>
    ````

  - Run with another framework together

    add x-ignore attribute to the root tag of ZData (x-ignore and other name of the 3rd framework):
    ```html
    <tag z-data=... x-ignore>
    ````
    add z-none to other tag will skip ZData process

### template

  - template for

    ```html
    <template for='k:v,i in ...' key=...>
    ````
    ZData is key needed, if key specified, the k will be key, or the v will be key
    k : v , i is optional for some var, e.g.:

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

  - template use

    ```html
    <z z-none>
        <template id=t1>
            <div>template id = t1</div>
        </template>
    </z>

    <template use=t1></template>
    ````

### data binding

  - : directive a data binding, :: directive a data dual-binding (like modal in some framework)

    ```html
    <tag :attr-name1=... ::attr-name2=...>
    ````

  - :text :html for textContent and innerHTML

  - :class supports [] {} and string, these will be combine to the classname in order

  - :class supports :class.name1.name2=...
    ```
    the shorthand is .name1.name2=...
    if classname ends with -, and not return boolean, the value will be append to classname, e.g.:
      .p-=1 causes p-1 added to classList
    ```
  - :style supports :css shorthand, supports {} and string, the style property will be overwrite in order

  - :style supports :style.name.value=...
    ```
    :style.name=value / :css.name=value
    :style.name.value=condition / :css.name.value=...
    the shorthand is ..name and #name, and !name=string-value, as below:
      ..width=`100px`
      #border-width=`4px`
      !border-width=4px
      #--a-css-var=`'${theCssVarValue}'`
    ```

  * !!! Warning:

    - : :: @ . .. #
    ```
    : :: @ . .. # directive, all of the attribute value is a js expression, supports js variable, or string, string must quoted with ' " `
    ```
    - ${...}
    ```
    builtin attributes with ${...} in their values, will be paused as a string expression, to `...${...}...`
    ```
    - !
    ```
    ! will be compiled to :css.style-name=`string-value`
    ```

  - :attr.attr will be attribute, or default are prop (property)

  - :attr.camel supports camel attributes or properties

  - ::value=propName, ::style.value=propName, ::css.value=propName
    ```
    propName is camel only, DOM attribute/property(includes style) supports .camel modifier
    dual-binding will fire change event default, only input type=text will fire input event default
    .input / .change modifier will force the input / change event
    .trim / .number modifier will deal the value to trim or number
    ```
    ```
    style.value updated will not reactive automatically, must execute el.fireChange() manually in el
    ```

    - input type='radio'
    ```
    ::checked=opt==this.value

    Note: opt is prop name in data
    ```

  - @ to bind events, supports modifiers

    * Global modifier
      ```
      camel     a-camel-name -> aCamelName
      prevent   preventDefault
      stop      stopPropagation
      debounce  debounce mode, follow a time optional, such as
                debounce.750ms, debounce.2s, default 250ms
      capture   capture mode
      once      once mode, run once only
      passive   passive mode
      ```
    * Scope modifier
      ```
      self      tag only
      away      tag not
      window
      document
      ```
    * Keyboard and mouse modifier
      ```
      shift
      ctrl
      alt
      meta      or cmd, super
      ```
    * Keyboard modifier
      ```
      <key>     enter, escape, space, f1 etc., details refer to:
                https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
      alias:  space: " ", slash: /, gt: >, eq: =
      ```
    * Mouse modifier
      ```
      <button>  left, mid, right
      ```
### Variable

  - $el z-data root element
    ```
    $el.$data the z-data data object
    ```
  - ZData.nobserve (default false)
    ```
    no observe DOM for dynamic creating z-data node
      use ZData.loadHTML(), so observe DOM is not needed.
    ```

### Function

  - ZData.start()
    ```
    z-template needs to run ZData.start() manually, z-data not
    ```
  - ZData.proxy()
    ```
    Reactive to the z-data data object, return ZData.proxy() wrapper, and it will reactive when change manual
    ```
  - ZData.loadHTML(html, p, before, args)
    ```
    Dynamic load html, p - the parent element(default body), before - insert before

    * html have script, must run loadHTML. Or you can use :html=... to load html properly
    ```
  - el.fireChange()
    ```
    Change el style out of z-data, for dual-binding, needs to call .fireChange()
    ```

### Component

  - z-comp is a ZData component

    ```html
    <tag z-comp=...>
    ````
    z-comp may equal a ./ relative path, or a http(s): resource

    ```html
    <tag z-comp=./z-comp-2.html>
    <tag z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    ````
    z-comp may be a Promise function, then return a z-comp code

    ```html
    <tag z-comp="load_z_comp('z-comp-2')">
    ````

    * ZData.get

      z-comp supports z:// protocol plugin, ZData.get is exists, z:// will be work
      ```
      Note: ZData.get is a Promise function, return like fetch(url).then(res => res.text()) rest part
      ```
      ```
      define and load the plugin:
      document.addEventListener("DOMContentLoaded", () => setTimeout(() => ZData.get = ...))

      and apply ZData.get to load table-v1.5.2 component
      <z- z-comp=z://table-v1.5.2></z->
      ```

    z-comp supports keep / remove the placeholder tag, z-xxx or del attribute, then remove itself

    ```html
    remove the placeholder tag:
    <z-comp  z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    <div del z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    ````
    ```html
    keep the placeholder tag:
    <div z-comp=https://funlang.org/zdata/test/z-comp-2.html>
    ````

  - z-comp args
    ```html
    <tag z-comp=... args=...>
    ````
    and use args.xxx to get the args props, e.g.:
    ```html
    <div z-data @mouseover.document=$el.textContent=this&&(this.title||(this.closest('[title]')||{}).title)||''
     #color=args.color #background=args.bgcolor !height=100% !padding=8px
    ></div> 
    ```

  - z-comp demo:
    * https://codepen.io/funlang/pen/ExZBPJL
    * https://codepen.io/funlang/pen/RwKzaOo

## Browser compatibles

Chrome 61+, Firefox 55+, Opera 48+

  - Polyfill.js (Element.prototype.getAttributeNames)

    Chrome 60+, Firefox 55+, Opera 47+

## JOIN US

Welcome to join z-data project, a front-end framework for future, Enjoy!
