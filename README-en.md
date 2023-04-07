# z-data

Z-data is an extremely lightweight zero configuration embedded mini front-end framework.

[[English](./README-en.md)] [[中文](./README-cn.md)]

# 1. Features:

- Without VDOM
- Zero configuration zero dependency, no compile time
- Extremely simple and lightweight, minify ~ 8K, gzipped < 5K
- H5 template supports for/if/else/use
- Template supports multi-roots
- Data dual-binding and events
- Embedded, run with other front-end frameworks (such as Vue) together easily
- Useful syntax sugars, friendly for class and style
- Run with tailwind, supports production with H5 DOM inline

# 2. Examples:

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

z-data form demo:

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

Online IDE for creating/debugging/previewing z-data code/app/comp

* https://funlang.org/z-data/

# 3. Usage:

## 3.1. Install

- CDN https://cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js

  ```html
  <script src=//cdn.jsdelivr.net/gh/Funlang/z-data@main/dist/z-data.min.js></script>
  ```

## 3.2. Scope

  - z- z-data attribute launch a ZData scope
    ```html
    <tag z-data=...></tag>
    ```

    z-data supports an init function, will run when initialization

    ```html
    <tag z-data=... init=...></tag>
    ```

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

    z-data html module (begin with z-data)
    
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

  - z-none stop the ZData scope, all inner tags will be ignored with ZData

    ```html
    <tag z-none>
      ...
    </tag>
    ```

  - Run with another framework together

    add x-ignore attribute to the root tag of ZData (x-ignore and other name of the 3rd framework):
    ```html
    <tag z-data=... x-ignore></tag>
    ```
    add z-none to other tag will skip ZData process

## 3.3. template

  - template for

    ```html
    <template for='k:v,i in ...' key=...></template>
    ```
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

## 3.4. data binding

  - : directive a data binding, :: directive a data dual-binding (like modal in some framework)

    ```html
    <tag :attr-name1=... ::attr-name2=...></tag>
    ```

### 3.4.1. :text :html

  :text :html for textContent and innerHTML

### 3.4.2. :class

  :class supports [] {} and string, these will be combine to the classname in order

### 3.4.3. :class shorthand

:class supports :class.name1.name2=...
  ```
  the shorthand is .name1.name2=...
  if classname ends with -, and not return boolean, the value will be append to classname, e.g.:
    .p-=1 causes p-1 added to classList
  ```

### 3.4.4. :style

:style supports :css shorthand, supports {} and string, the style property will be overwrite in order

### 3.4.5. :style shorthand

:style supports :style.name.value=...
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

### 3.4.6. !!! Warning:

#### 3.4.6.1. : :: @ . .. \#

Attribute value is a js expression, supports js variable, or string, string must quoted with ' " `

#### 3.4.6.2. ${...}

builtin attributes with \${...} in their values, will be paused as a string expression, to \`...${...}...`

#### 3.4.6.3. !

! will be compiled to :css.style-name=\`string-value`

### 3.4.7. attr

:xxx.attr will be attribute, or default are prop (property)

:xxx.attr === false will be boolean attribute

#### 3.4.7.1. attr shorthand
```
:!tag-attr  -> :tag-attr.attr
::!tag-attr -> ::tag-attr.attr
```
### 3.4.8. camel

:xxx.camel supports camel attributes or properties

::value=propName, ::style.value=propName, ::css.value=propName
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

Note: opt is prop name in data
```

## 3.5. event

@ to bind events, supports modifiers

### 3.5.1. Global modifier

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

### 3.5.2. Scope modifier

```
self      tag only
out       tag not
window
document
```

### 3.5.3. Keyboard and mouse modifier

```
shift
ctrl
alt
meta      or cmd
```

### 3.5.4. Keyboard modifier
```
<key>     enter, escape, space, f1 etc., details refer to:
          https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
alias:  space: " ", slash: /, gt: >, eq: =
```

### 3.5.5. Mouse modifier
```
<button>  left, mid, right
```

## 3.6. Dynamic props / events and custom directive

### 3.6.1. Dynamic props/attrs

    :*={...}
    :*.attr={...}

  e.g.:

    :*="{
      min: '1',
      max: '100'
    }"

### 3.6.2. Dynamic events

    @*={...}

  e.g.:

    @*="{
      input: 'console.log(event)',
      keydown: 'console.log(event)'
    }"

### 3.6.3. Custom directive

    z-d-...=...

  e.g.:

    z-d-rules-of-validate="[
      val => !!val || 'Name is required!',
      val => val.length > 5 || 'The field need 5 or more characters',
    ]"

  will be reformed and apply to

    rulesOfValidate({
      e: el,
      v: val, // attr value of z-d-rules-of-validate
      m: modifiers
    })

## 3.7. Variables

### 3.7.1. $el

$el z-data root element

### 3.7.2. \$el.$data

\$el.\$data the z-data data object

### 3.7.3. ZData.nobserve (default false)

```
no observe DOM for dynamic creating z-data node
  use ZData.loadHTML(), so observe DOM is not needed.
```

## 3.8. Function

### 3.8.1. ZData.proxy()

Reactive to the z-data data object, return ZData.proxy() wrapper, and it will reactive when change manual

### 3.8.2. ZData.loadHTML(html, p, before, args)

Dynamic load html, p - the parent element(default body), before - insert before

* html have script, must run loadHTML. Or you can use :html=... to load html properly

### 3.8.3. el.fireChange()

Change el style out of z-data, for dual-binding, needs to call .fireChange()

### 3.8.4. $emit(el, name, detail)

Dispatch an event (name) with detail param to el DOM Element 

### 3.8.5. ZData.deb(fn, ms)

Debounce

## 3.9. Component

### 3.9.1. z-comp

z-comp is a ZData component

```html
<tag z-comp=...></tag>
```

### 3.9.2. z-comp URL

z-comp may equal a ./ relative path, or a http(s): resource

```html
<tag z-comp=./z-comp-2.html></tag>
<tag z-comp=https://funlang.org/zdata/test/z-comp-2.html></tag>
```
z-comp may be a Promise function, then return a z-comp code

```html
<tag z-comp="load_z_comp('z-comp-2')"></tag>
```

### 3.9.3. z-comp loader ZData.get

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

### 3.9.4. z-comp placeholder

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

### 3.9.5. z-comp args

```html
<tag z-comp=... args=...></tag>
```
and use args.xxx to get the args props, e.g.:
```html
<div z-data @mouseover.document=$el.textContent=event.target&&(event.target.title||(event.target.closest('[title]')||{}).title)||''
#color=args.color #background=args.bgcolor !height=100% !padding=8px
></div> 
```

### 3.9.6. z-comp demo:
* https://codepen.io/funlang/pen/ExZBPJL
* https://codepen.io/funlang/pen/RwKzaOo

# 4. Browser compatibles

-  z-data.js, z-data.min.js
  **2017: Chrome 61, Firefox 55, Opera 48**

-  z-data.min.es2015.js, z-data.min.all.js
  **2016: Chrome 49, Firefox 44, Opera 36, iOS 10, Android 7**

# 5. JOIN US

Welcome to join z-data project, a front-end framework for future, Enjoy!
