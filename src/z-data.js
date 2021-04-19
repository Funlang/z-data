"use strict"; // Copyright (c) 2021 zwd@funlang.org
const ZData = (() => {
    const zdata = "z-data";
    const znone = "z-none";
    const qdata = `[${zdata}]`;
    const zfor = "for";
    const zkey = "key";
    const zif = "if";
    const zelse = "else";
    const attributes = "attributes";
    const getAttribute = "getAttribute";
    const getAttributeNames = `${getAttribute}Names`;
    const Element = "Element";
    const ElementSibling = `${Element}Sibling`;
    const ElementChild = `${Element}Child`;
    const firstEL = `first${ElementChild}`;
    const lastEL = `last${ElementChild}`;
    const nextEL = `next${ElementSibling}`;
    const prevEL = `previous${ElementSibling}`;
    const parentEL = `parent${Element}`;
    const insert = "insertBefore";
    const forEach = "forEach";
    const includes = "includes";
    const startsWith = "startsWith";
    const length = "length";
    const test = "test";
    const last = "last";
    const _z_d = "_z_d";
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
    const re_2camel = /-([a-z])/g;
    const re_kebab = /[-_ ]+/g;
    const re_modifiers = /^(?:camel|prevent|stop|debounce|\d+(?:m?s)|capture|once|passive|self|away|window|document|(shift|ctrl|alt|meta)|(cmd|super))$/;
    let age = 0;
    let _n_;

    let initComponent = (el, data, env) => {
        if (el[_z_d] && age < el[_z_d].age) return;
        (el[_z_d] = el[_z_d] || {}).age = age;
        log(now(), `${zdata} component`, now() - _n_);
        let zd = tryEval(el, el[getAttribute](zdata) || "{}", data, env);
        goAnode({ p: el[parentEL], el }, zd, env, true);
    };

    let goAnode = (args, data, env, self) => {
        let { el } = args;
        let attrs = el[getAttributeNames]();
        if (attrs[includes](znone)) return;

        el[_z_d] = el[_z_d] || {};
        if (!self && attrs[includes](zdata)) initComponent(el, data, env);
        else if ("template" === el.localName) {
            let exp;
            if ((exp = el[getAttribute](zfor))) {
                goFor(args, exp, data, env);
            } else if ((exp = el[getAttribute](zif)) || attrs[includes](zelse)) {
                goIf(args, exp, data, env);
            }
        } else {
            setAttrs(el, data, env, attrs);
            goNodes({ p: el, el: el[firstEL] }, data, env);
        }
    };

    let goNodes = (args, data, env, cbIf, cbDo) => {
        for (; args.el && (!cbIf || cbIf(args) !== false); args.el = args.next) {
            args.next = args.el[nextEL];
            if (!cbDo || cbDo(args, data, env) === true) goAnode(args, data, env);
        }
    };

    let goIf = (args, exp, data, env) => {
        let { p, el } = args;
        if (!exp || tryEval(el, exp, data, env)) {
            let next = args.next;
            if (el[_z_d][last]) {
                args.el = next;
                next = el[_z_d][last][nextEL];
                goNodes(args, data, env, ({ el }) => el !== next);
                goNodes(
                    args,
                    data,
                    env,
                    ({ el }) => el[attributes][zelse],
                    () => {}
                );
            } else {
                expand(args);
                args.el = args.el[nextEL];
                goNodes(args, data, env, ({ el }) => el !== next);
                goNodes(args, data, env, ({ el }) => el[attributes][zelse], fold);
            }
            el[_z_d][last] = next ? next[prevEL] : p[lastEL];
        } else fold(args, data, env);
    };

    let expand = ({ p, el, next }) => {
        let n;
        if (el[_z_d].node) {
            n = el[_z_d].node.cloneNode(true);
        } else {
            n = el[_z_d].node = $ocument.createElement(zdata);
            n[insert]($ocument.importNode(el.content, true), nil);
        }
        for (let c = n[firstEL]; c; c = c[nextEL]) {
            n = c.cloneNode(true);
            p[insert](n, next);
        }
    };

    let fold = (args, data, env) => {
        if (args.el[_z_d] && args.el[_z_d][last]) {
            let next = args.el[_z_d][last][nextEL];
            args.el[_z_d][last] = nil;
            args.el = args.next;
            goNodes(
                args,
                data,
                env,
                ({ el }) => el !== next,
                ({ el }) => {
                    el.remove();
                }
            );
        }
    };

    let goFor = (args, exp, data, env) => {
        let m = re_for.exec(exp);
        if (!m) return;
        let { p, el } = args;
        let items = tryEval(el, m[4], data, env),
            kvi = { k: m[1], v: m[2], i: m[3] },
            ps = {},
            akey = el[getAttribute](zkey),
            keys = el[_z_d].ns || (el[_z_d].ns = {}),
            i = 0,
            cur = el;
        for (let k in items) {
            if (kvi.k) ps[kvi.k] = k;
            if (kvi.v) ps[kvi.v] = items[k];
            if (kvi.i) ps[kvi.i] = i++;
            let env2 = { ...env, ...ps };
            let key = akey ? tryEval(el, akey, data, env2) : kvi.k ? k : items[k];

            let next = cur[nextEL];
            let curNode = keys[key];
            if (curNode) {
                let lastNext = curNode[last][nextEL];
                args.el = curNode.head;
                let moveable = args.el !== next;
                goNodes(
                    args,
                    data,
                    env2,
                    ({ el }) => el !== lastNext,
                    ({ p, el }) => {
                        if (moveable) p[insert](el, next);
                        return true;
                    }
                );
                if (!moveable) next = args.next;
                curNode.age = age;
            } else {
                args.el = el;
                expand(args);
                args.el = cur[nextEL];
                curNode = keys[key] = { age, head: args.el };
                goNodes(args, data, env2, ({ el }) => el !== next);
            }
            curNode[last] = cur = next ? next[prevEL] : p[lastEL];
        }
        // remove ...
        Obj_keys(keys)
            .filter((k) => keys[k].age != age)
            [forEach]((k) => {
                let next = keys[k][last][nextEL];
                goNodes(
                    { el: keys[k].head },
                    data,
                    env,
                    ({ el }) => el !== next,
                    ({ el }) => {
                        el.remove();
                    }
                );
                delete keys[k];
            });
        args.next = cur[nextEL];
    };

    let toCamel = (name) => name.replace(re_2camel, (m, c) => c.toUpperCase());
    let classNames = {};
    let setAttrs = (el, data, env, attrNames) => {
        let props = el[_z_d].ps;
        if (!props) {
            props = el[_z_d].ps = { ps: [], ocl: {} };
            let c = el.className;
            if (c) {
                c = classNames[c] || (classNames[c] = c.split(" "));
                c[forEach]((name) => (props.ocl[name] = true));
            }
            attrNames[forEach]((a) => {
                let v = el[getAttribute](a);
                if (!re_bind[test](a) && !re_text[test](v)) return;
                let ms = re_attr.exec(a); // 1-bind 2 3-event 4-class/css 5-name 6-modifiers
                let k = ms[4] ? (ms[4] === "#" || !ms[5] ? s_tyle : c_lass) : ms[5]; // key/name
                if (k) {
                    let modifiers = ms[6] && ms[6].split(".");
                    let ps = {
                        k: k === c_lass || !modifiers || !modifiers[includes]("camel") ? k : toCamel(k),
                        b: (ms[3] && 3) || (ms[2] && 2) || ((ms[1] || ms[4]) && 1) || nil, // bind 1 2, event 3
                        m: ms[4] && ms[5] ? [ms[5]].concat(modifiers || []) : modifiers, // modifiers
                        e: v, // exp
                    };
                    if (!ps.b) ps.e = "`" + ps.e + "`";
                    props.ps.push(ps);
                }
            });
            let f, t;
            if ((f = el.firstChild) && f === el.lastChild && f.nodeType === 3 && re_text[test]((t = f.nodeValue))) {
                props.ps.push({
                    k: "text",
                    e: "`" + t + "`",
                });
            }
        }
        let oldcls = { ...props.ocl };
        let clsChanged = false;
        props.ps[forEach]((ps) => {
            if (ps.b === 3) setEvent(el, ps, data, env);
            else {
                let v = ps.e && tryEval(el, ps.e, data, env);
                if (ps.v !== v) {
                    ps.v = v;
                    clsChanged = setValue(el, ps, v, oldcls) || clsChanged;
                }
            }
        });
        let cls = Obj_keys(oldcls).join(" ");
        if (props.oc !== cls) ((props.oc = cls) && 0) || (clsChanged && (el.className = cls));
    };

    let setValue = (el, ps, value, cls) => {
        if (ps.k === "text") el.textContent = value;
        else if (ps.k === "html") el.innerHTML = value;
        else if (ps.k === c_lass) {
            if (ps.m && ps.m[length] > 0) {
                let v = ps.e === "" ? true : value;
                ps.m[forEach]((name) => {
                    if (typeof v === "boolean" || "-" === name[name[length]]) {
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
            el[ps.k] = value; // el.setAttribute(ps.k, value);
        }
    };

    let keyMaps = { slash: "/", space: " " };
    let setEvent = (el, { k: name, e: exp, m: ms = [] }, data, env = {}) => {
        if (el[_z_d]["@" + name]) return;
        let target = ms[includes]("window") ? window : ms[includes]("document") || ms[includes]("away") ? $ocument : el;
        let fn = (...args) => (e) => {
            // away, self
            if (ms[includes]("self") && el !== e.target) return;
            if (ms[includes]("away") && (el.contains(e.target) || (el.offsetWidth < 1 && el.offsetHeight < 1))) return;
            // key and mouse (ctrl, alt, shift, meta, cmd, super)
            if (name[startsWith]("key") || name[startsWith]("mouse")) {
                for (let modifier of ms) {
                    let m = re_modifiers.exec(modifier);
                    if (m && (m[1] || m[2])) {
                        let key = m[1] || (m[2] && "meta");
                        if (!key || !e[key + "Key"]) return;
                    }
                }
                // key
                if (name[startsWith]("key")) {
                    let keys = ms.filter((m) => !re_modifiers[test](m));
                    if (keys[length] === 1) {
                        let key = e.key.toLowerCase().replace(re_kebab, "");
                        key = keyMaps[key] || key;
                        if (key !== keys[0].replace(re_kebab, "")) return;
                    }
                }
            }
            if (ms[includes]("prevent")) e.preventDefault();
            if (ms[includes]("stop")) e.stopPropagation();
            return newFun(exp, env)(...args);
        };
        // debounce
        // todo
        let options = ms && {
            capture: ms[includes]("capture"),
            once: ms[includes]("once"), // todo
            passive: ms[includes]("passive"),
        };
        target.addEventListener(name, fn(data, ...Object.values(env)), options);
        el[_z_d]["@" + name] = true;
    };

    let Functions = {};
    let newFun = (exp, env) => {
        return (
            Functions[exp] || // todo
            (Functions[exp] = new Function(
                ["$z_d", ...Obj_keys(env)],
                "let re$u1T;with($z_d){re$u1T=" + exp + "};return re$u1T"
            ))
        );
    };
    let tryEval = (el, exp, data = {}, env = {}) => {
        return tryCatch(
            () => {
                if (typeof exp === "function") return exp.call(data);
                return newFun(exp, env)(data, ...Object.values(env));
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
