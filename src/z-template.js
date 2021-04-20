"use strict"; // Copyright (c) 2021 zwd@funlang.org
const ZData = (() => {
    const zdata = "z-data";
    const znone = "z-none";
    const qdata = `[${zdata}]`;
    const zfor = "for";
    const zif = "if";
    const zelse = "else";
    const z_data = "z_data";
    const z_age = "z_age";
    const z_node = "z_node";
    const attributes = "attributes";
    const getAttribute = "getAttribute";
    const getAttributeNames = `${getAttribute}Names`;
    const Element = "Element";
    const ElementSibling = `${Element}Sibling`;
    const ElementChild = `${Element}Child`;
    const firstEL = `first${ElementChild}`;
    const nextEL = `next${ElementSibling}`;
    const parentEL = `parent${Element}`;
    const insert = "insertBefore";
    const forEach = "forEach";
    const includes = "includes";
    const length = "length";
    const test = "test";
    const c_lass = "class";
    const s_tyle = "style";
    const $ocument = document;
    const $ = (selector) => $ocument.querySelectorAll(selector);
    const Obj_keys = Object.keys;
    const con = console;
    const log = con.log;
    const now = Date.now;
    const nil = undefined;
    const re_for = /^(?:\s*(?:(\w+)\s*:\s*)?(\w*)(?:\s*,\s*(\w+))?\s+in\s+)?(.+)$/;
    const re_attr = /^(?:(:)(:?)|(@)|([.#]))?([^.]*)(?:[.]([^.].*))?$/;
    const re_text = /\$\{/;
    const re_bind = /^[:@.#]./;
    let age = 0;
    let _n_;

    let initComponent = (el, data, env) => {
        log(now(), `${zdata} component`, now() - _n_);
        el[z_data] = tryEval(el, el[getAttribute](zdata) || "{}", data, env);
        initElements(el, el[z_data], env, true);
    };

    let initElements = (el, data, env, self) => {
        walk(el, (el) => {
            let attrs;
            if (el[z_age] === age || (attrs = el[getAttributeNames]())[includes](znone)) return false;
            if ((attrs = attrs || el[getAttributeNames]())[includes](zdata) && !self) initComponent(el, data, env);
            else if ("template" === el.localName) {
                let exp;
                if ((exp = el[getAttribute](zfor))) execFor(el, exp, data, env);
                else if ((exp = el[getAttribute](zif)) || attrs[includes](zelse)) execIf(el, exp, data, env);
            } else setAttrs(el, data, env, attrs);
            el[z_age] = age;
        });
    };

    let walk = (el, cb) => {
        if (cb(el) === false) return;
        for (let n = el[firstEL]; n; n = n[nextEL]) walk(n, cb);
    };

    let expand = (el, ret, data, env) => {
        let n;
        if (el[z_node]) n = el[z_node].cloneNode(true);
        else {
            n = el[z_node] = $ocument.createElement(zdata);
            n[insert]($ocument.importNode(el.content, true), nil);
        }
        for (let c = n[firstEL]; c; c = c[nextEL]) {
            n = c.cloneNode(true);
            el[parentEL][insert](n, ret.curr[nextEL]);
            ret.curr = ret.curr[nextEL];
            let fn = ((el, data, env) => () => initElements(el, data, env))(n, data, env);
            ret.fns.push(fn);
        }
    };

    let execFor = (el, exp, data, env) => {
        let ms = re_for.exec(exp);
        if (ms) {
            ms = { k: ms[1], v: ms[2], i: ms[3], exp: ms[4] };
            let vs = tryEval(el, ms.exp, data, env),
                ps = {},
                i = 0,
                ret = { curr: el, fns: [] };
            for (let v in vs) {
                ps[ms.v] = vs[v];
                if (ms.k) ps[ms.k] = v;
                if (ms.i) ps[ms.i] = i++;
                expand(el, ret, data, { ...env, ...ps });
            }
            ret.fns[forEach]((fn) => fn());
        }
    };

    let execIf = (el, exp, data, env) => {
        if (!exp || tryEval(el, exp, data, env)) {
            let ret = { curr: el, fns: [] };
            expand(el, ret, data, env);
            for (let curr = ret.curr[nextEL]; curr && curr[attributes][zelse]; curr = curr[nextEL]) {
                curr[z_age] = age;
            }
            ret.fns[forEach]((fn) => fn());
        }
    };

    let classNames = {};
    let setAttrs = (el, data, env, attrNames) => {
        let oldc = {};
        let c = el.className;
        if (c) {
            c = classNames[c] || (classNames[c] = c.split(" "));
            c[forEach]((name) => (oldc[name] = true));
        }
        let f, t, clsChanged;
        attrNames[forEach]((a) => {
            let v = el[getAttribute](a);
            if (!re_bind[test](a) && !re_text[test](v)) return;
            let ms = re_attr.exec(a); // 1-bind 2 3-event 4-class/css 5-name 6-modifiers
            let k = ms[4] ? (ms[4] === "#" || !ms[5] ? s_tyle : c_lass) : ms[5]; // key/name
            if (k) {
                let modifiers = ms[6] && ms[6].split(".");
                let ps = {
                    k,
                    b: (ms[3] && 3) || (ms[2] && 2) || ((ms[1] || ms[4]) && 1) || nil, // bind 1 2, event 3
                    m: ms[4] && ms[5] ? [ms[5]].concat(modifiers || []) : modifiers, // modifiers
                    e: v, // exp
                };
                if (!ps.b) ps.e = "`" + ps.e + "`";
                if (ps.b === 3) setEvent();
                else clsChanged = setValue(el, ps, ps.e && tryEval(el, ps.e, data, env), oldc) || clsChanged;
            }
        });
        if ((f = el.firstChild) && f === el.lastChild && f.nodeType === 3 && re_text[test]((t = f.nodeValue))) {
            setValue(el, { k: "text" }, tryEval(el, "`" + t + "`", data, env));
        }
        if (clsChanged) el.className = Obj_keys(oldc).join(" ");
    };

    let setValue = (el, ps, value, cls) => {
        if (ps.k === "text") el.textContent = value;
        else if (ps.k === "html") el.innerHTML = value;
        else if (ps.k === c_lass) {
            if (ps.m && ps.m[length] > 0) {
                let v = ps.e === "" ? true : value;
                ps.m[forEach]((name) => {
                    if (typeof v === "boolean" || !name.endsWith("-")) {
                        v ? (cls[name] = true) : delete cls[name];
                    } else cls[name + v] = true;
                });
            } else {
                if (Array.isArray(value)) {
                } else if (typeof value === "object") {
                    Obj_keys(value)[forEach]((name) => (value[name] ? (cls[name] = true) : delete cls[name]));
                    return true;
                } else value = value ? value.split(" ") : [];
                value[forEach]((name) => (cls[name] = true));
            }
            return true;
        } else {
            if (ps.k === s_tyle || ps.k === "css") {
                if (ps.m && ps.m[length] > 0) {
                    if (ps.m[length] === 1) value = { [ps.m[0]]: value };
                    else value = { [ps.m[0]]: value && ps.m[1] };
                }
                if (typeof value === "object") {
                    Obj_keys(value)[forEach]((name) => (el[s_tyle][name] = value[name]));
                    return;
                }
            }
            el.setAttribute(ps.k, value);
        }
    };

    let setEvent = () => {};

    let Functions = {};
    let tryEval = (el, exp, data = {}, env = {}) => {
        return tryCatch(
            () => {
                if (typeof exp === "function") return exp.call(data);
                let f =
                    Functions[exp] ||
                    (Functions[exp] = new Function(
                        ["$z_d", ...Obj_keys(env)],
                        "let re$u1T;with($z_d){re$u1T=" + exp + "};return re$u1T"
                    ));
                return f(data, ...Object.values(env));
            },
            { el, exp }
        );
    };

    let error = (el, exp, e) => con.warn(`${zdata} error: "${e}"\n\nexp: "${exp}"\nelement:`, el);
    let tryCatch = (cb, { el, exp }) => {
        try {
            let value = cb();
            return value instanceof Promise ? value.catch((e) => error(el, exp, e)) : value;
        } catch (e) {
            error(el, exp, e);
        }
    };

    return {
        start: (env) => {
            log((_n_ = now()), `${zdata} start`, ++age);
            $(qdata)[forEach]((el) => initComponent(el, env, env));
            log(now(), `${zdata} ended`, now() - _n_);
        },
    };
})();
