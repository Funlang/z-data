"use strict"; // Copyright (c) 2021 zwd@funlang.org
const ZData = (() => {
    const zdata = "z-data";
    const znone = "z-none";
    const qdata = `[${zdata}]`;
    const zinit = "init";
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
    const textC = "textContent";
    const length = "length";
    const test = "test";
    const last = "last";
    const _z_d = "_z_d";
    const c_lass = "class";
    const s_tyle = "style";
    const $ocument = document;
    const createEl = "createElement";
    const $ = (selector) => $ocument.querySelectorAll(selector);
    const addEventListener = "addEventListener";
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
    const re_modifiers = /^(?:camel|prevent|stop|debounce|(\d+)(?:(m?)s)|capture|once|passive|self|away|window|document|(shift|ctrl|alt|meta)|(cmd|super))$/;
    let age = 0;
    let cps = 0;
    let _n_;

    let liteProxy = (obj, cb) => {
        if (obj && typeof obj === "object" && typeof obj !== "function") {
            for (let p in obj)
                try {
                    obj[p] = getProxy()(obj[p], cb);
                } catch (e) {}
            return new Proxy(obj, cb);
        }
        return obj;
    };
    let getProxy = () => window.ZDataProxy || liteProxy;
    let initComponent = (el, env) => {
        if (el[_z_d] && (age <= el[_z_d].age || el[_z_d].ing)) return;
        (el[_z_d] || (el[_z_d] = {})).age = age;
        el[_z_d].ing = (el[_z_d].ing || 0) + 1;
        env = (env && (el[_z_d].env = env)) || el[_z_d].env || { ps: {}, ks: [], k: "", d: {} };
        // log(now(), `${zdata} component`, age, now() - _n_, el);
        let init = (self) => {
            updating++, stopObserve($ocument.body);
            goAnode({ r: el, p: el[parentEL], el }, { ...env, d: el[_z_d].zd }, self || age);
            updating--, observe($ocument.body);
        };
        let initLater = debounce(init);
        let zd = el[_z_d].zd;
        if (!zd) {
            zd = tryEval(el, el[getAttribute](zdata) || "{}", env);
            let cb = {
                set: (obj, prop, value, rec, zdataproxy) => {
                    initLater();
                    try {
                        if (!zdataproxy) obj[prop] = getProxy()(value, cb);
                    } catch (e) {}
                    return true;
                },
            };
            el.$data = el[_z_d].zd = zd = getProxy()(zd, cb);
            if (el[getAttribute](zinit)) tryEval(el, el[getAttribute](zinit), { ...env, d: zd });
        }
        init(true);
        el[_z_d].ing--;
    };

    let nodeCache = {};
    let goAnode = (args, env, self) => {
        let { el } = args,
            nc;
        let zd = el[_z_d] || (el[_z_d] = {});
        let attrs = zd.as || (zd.as = (nc = nodeCache[el[getAttribute]("z-d")]) ? nc.as : el[getAttributeNames]());
        if (attrs[includes](znone)) return;

        if (args.cp) {
            setAttrs(args, env, attrs, nc);
            goNodes({ cp: args.cp, r: args.r, p: el, el: el[firstEL] }, env);
        } else if (self === nil && attrs[includes](zdata)) initComponent(el, env);
        else if ("template" === el.localName) {
            let exp;
            if ((exp = el[getAttribute](zfor))) {
                goFor(args, exp, env);
            } else if ((exp = el[getAttribute](zif)) || attrs[includes](zelse)) {
                goIf(args, exp, env);
            }
        } else {
            setAttrs(args, env, attrs, nc);
            goNodes({ cp: args.cp, r: args.r, p: el, el: el[firstEL] }, env);
        }
    };

    let goNodes = (args, env, cbIf, cbDo) => {
        for (; args.el && (!cbIf || cbIf(args) !== false); args.el = args.next) {
            args.next = args.el[nextEL];
            if (!cbDo || cbDo(args, env) === true) goAnode(args, env);
        }
    };

    let isElse = ({ el }) => !!el[attributes][zelse];
    let nop = () => {};
    let goIf = (args, exp, env) => {
        let { p, el } = args;
        if (!exp || tryEval(el, exp, env)) {
            let next = args.next;
            if (el[_z_d][last]) {
                args.el = next;
                next = el[_z_d][last][nextEL];
                goNodes(args, env, ({ el }) => el !== next);
                goNodes(args, env, isElse, nop);
            } else {
                expand(args);
                args.el = args.el[nextEL];
                goNodes(args, env, ({ el }) => el !== next);
                goNodes(args, env, isElse, fold);
            }
            el[_z_d][last] = next ? next[prevEL] : p[lastEL];
        } else fold(args, env);
    };

    let expand = ({ p, el, next }) => {
        let n;
        if (el[_z_d].node) {
            n = el[_z_d].node.cloneNode(true);
        } else {
            n = el[_z_d].node = $ocument[createEl](zdata);
            n[insert]($ocument.importNode(el.content, true), nil);
            goNodes({ cp: 1, p: n, el: n[firstEL] }); // compile
        }
        for (let c = n[firstEL]; c; c = c[nextEL]) {
            n = c.cloneNode(true);
            p[insert](n, next);
        }
    };

    let fold = (args, env) => {
        if (args.el[_z_d] && args.el[_z_d][last]) {
            let next = args.el[_z_d][last][nextEL];
            args.el[_z_d][last] = nil;
            args.el = args.next;
            remove(args, next, env);
        }
    };

    let remove = (args, next, env) => {
        goNodes(
            args,
            env,
            ({ el }) => el !== next,
            ({ el }) => {
                el.remove();
            }
        );
    };

    let goFor = (args, exp, env) => {
        let m = re_for.exec(exp);
        if (!m) return;
        let { p, el } = args;
        let items = tryEval(el, m[4], env),
            kvi = { k: m[1], v: m[2], i: m[3] },
            env2 = { ...env },
            akey = el[getAttribute](zkey),
            keys = el[_z_d].ns || (el[_z_d].ns = {}),
            i = 0,
            cur = el,
            age = (el[_z_d].age = (el[_z_d].age || 0) + 1);
        if (kvi.k) env2.ps[kvi.k] = nil;
        if (kvi.v) env2.ps[kvi.v] = nil;
        if (kvi.i) env2.ps[kvi.i] = nil;
        (env2.ks = Obj_keys(env2.ps)), (env2.k = env2.ks.join(","));
        for (let k in items /*of Obj_Keys(items)*/) {
            if (kvi.k) env2.ps[kvi.k] = k;
            if (kvi.v) env2.ps[kvi.v] = items[k];
            if (kvi.i) env2.ps[kvi.i] = i++;
            let key = akey ? tryEval(el, akey, env2) : kvi.k ? k : items[k];
            if (key === nil) continue; // key MUST BE !!!

            let next = cur[nextEL];
            let curNode = keys[key];
            if (curNode) {
                let lastNext = curNode[last][nextEL];
                let moveable = curNode.head !== next;
                if (moveable && next && !curNode.head[_z_d].skip) {
                    next[_z_d].skip = true;
                    args.el = next;
                    next = next[_z_d][last][nextEL];
                    goNodes(args, env2, ({ el }) => el != next, nop);
                    moveable = curNode.head !== (next = args.next);
                }
                args.el = curNode.head;
                args.el[_z_d].skip = false;
                goNodes(
                    args,
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
                goNodes(args, env2, ({ el }) => el !== next);
            }
            curNode.head[_z_d][last] = curNode[last] = cur = next ? next[prevEL] : p[lastEL];
        }
        // remove ...
        Obj_keys(keys)
            .filter((k) => keys[k].age != age)
            [forEach]((k) => {
                remove({ el: keys[k].head }, keys[k][last][nextEL], env);
                delete keys[k];
            });
        args.next = cur[nextEL];
    };

    let toCamel = (name) => name.replace(re_2camel, (m, c) => c.toUpperCase());
    let classNames = {};
    let attrMaps = { css: "style", text: textC, html: "innerHTML" };
    let setAttrs = (args, env, attrNames, nc) => {
        let { el } = args,
            zd = el[_z_d],
            vs = zd.vs || (zd.vs = []);
        let props = zd.ps || (zd.ps = nc && nc.ps);
        if (!props) {
            props = zd.ps = { ps: [], ocl: {} };
            if (args.cp) {
                nodeCache[++cps] = { as: attrNames, ps: props };
                el.setAttribute("z-d", cps);
            }
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
                k = attrMaps[k] ? attrMaps[k] : k;
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
                    k: textC,
                    e: "`" + t + "`",
                });
            }
            if (args.cp) return;
        }
        let oldcls = { ...props.ocl };
        let clsChanged = false,
            i = 0;
        props.ps[forEach]((ps) => {
            if (ps.b === 3) setEvent(args, ps, env);
            else {
                let v = ps.e && tryEval(el, ps.e, env);
                if (vs[i] !== v) {
                    vs[i] = v;
                    clsChanged = setValue(el, ps, v, oldcls) || clsChanged;
                }
                i++;
                if (ps.b === 2) {
                    let ps2 = { ...ps };
                    ps2.e = ps.e + "=$event.target." + ps.k;
                    let key = "@" + ps.k;
                    if (ps.k === s_tyle && ps.m && ps.m[length] > 0) {
                        ps2.e += "[`" + ps.m[0] + "`]";
                        key += ps.m[0];
                    }
                    let event = "change";
                    if (el.type === "text" || (ps.m && ps.m[includes]("input") && !ps.m[includes](event))) event = "input";
                    ps2.key = key + event;
                    ps2.k = event;
                    setEvent(args, ps2, env);
                    el.fireChange = el.fireChange || ((name) => el.dispatchEvent(new Event(name || event)));
                }
            }
        });
        if (clsChanged) {
            let cls = Obj_keys(oldcls).join(" ");
            if (zd.oc !== cls) el.className = zd.oc = cls;
        }
    };

    let setValue = (el, ps, value, cls) => {
        if (ps.k === c_lass) {
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
            if (ps.k === s_tyle) {
                if (ps.m && ps.m[length] > 0) {
                    if (ps.m[length] === 1) value = { [ps.m[0]]: value };
                    else value = { [ps.m[0]]: value && ps.m[1] };
                }
                if (typeof value === "object") {
                    Obj_keys(value)[forEach]((name) => {
                        if (value[name] === false) el[s_tyle].removeProperty(name);
                        else el[s_tyle][name] = value[name];
                    });
                    return;
                }
            }
            el[ps.k] = value; // el.setAttribute(ps.k, value);
        }
    };

    let debounce = (fn, ms) => {
        let timer;
        return (...args) => {
            let me = this;
            let ifn = () => {
                timer = nil;
                fn.apply(me, args);
            };
            ms || (timer = clearTimeout(timer));
            timer || (timer = setTimeout(ifn, ms));
        };
    };

    let keyMaps = { slash: "/", space: " " };
    let setEvent = ({ r, el }, { k: name, e: exp, m: ms = [], key }, env) => {
        key = key || "@" + name + ms.join(".");
        if (el[_z_d][key]) return;
        let target = ms[includes]("window") ? window : ms[includes]("document") || ms[includes]("away") ? $ocument : el;
        let fn = (...args) => (e) => {
            if (ms[includes]("self") && el !== e.target) return;
            if (ms[includes]("away") && (el.contains(e.target) || (el.offsetWidth < 1 && el.offsetHeight < 1))) return;
            // key and mouse (ctrl, alt, shift, meta, cmd, super)
            if (name[startsWith]("key") || name[startsWith]("mouse")) {
                for (let modifier of ms) {
                    let m = re_modifiers.exec(modifier);
                    if (m && (m[3] || m[4])) {
                        let key = m[3] || (m[4] && "meta");
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
            if (ms[includes]("once")) target.removeEventListener(name, fn, options);
            return newFun(exp, [...env.ks, "$el", "$event"], "")(...args, e);
        };
        fn = fn(env.d, ...Object.values(env.ps), r);
        // debounce
        let i = ms.indexOf("debounce");
        if (i >= 0) {
            i = ms[i + 1];
            let m = re_modifiers.exec(i);
            i = m && m[1] ? (m[2] ? m[1] : m[1] * 1000) : 250;
            fn = debounce(fn, i >> 0);
        }
        let options = ms && {
            capture: ms[includes]("capture"),
            passive: ms[includes]("passive"),
        };
        target[addEventListener](name, fn, options);
        el[_z_d][key] = true;
    };

    let Functions = {};
    let newFun = (exp, ks, k) => {
        k += exp;
        return (
            Functions[k] ||
            (Functions[k] = new Function(["$z_d", ...ks], "let re$u1T;with($z_d){re$u1T=" + exp + "};return re$u1T"))
        );
    };
    let tryEval = (el, exp, env) => {
        return tryCatch(
            () => {
                if (typeof exp === "function") return exp.call(env.d);
                return newFun(exp, env.ks, env.k)(env.d, ...Object.values(env.ps));
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

    let loadHTML = (html, p, before) => {
        p || (p = $ocument.body);
        let name = html.match(/^\s*<(\w+)/)[1];
        let el = $ocument[createEl](name);
        el[attrMaps["html"]] = html;
        p[insert](el, before);
        html.replace(/<script[^>]*>(.+)<\/script>/gis, ($0, s) => {
            let e = $ocument[createEl]("script");
            e[textC] = s;
            el[insert](e, nil);
        });
    };

    let updating = 0;
    // let changeLater = debounce((e) => e.fireChange(), 100);
    let stopObserve = (el) => el[_z_d] && el[_z_d].ob && el[_z_d].ob.disconnect();
    let observe = (el) => {
        // return; // speedy
        let ob =
            (el[_z_d] || (el[_z_d] = {})).ob ||
            (el[_z_d].ob = new MutationObserver((ms) => {
                if (updating) return;
                // if (ms[length] === 1 && ms[0].type === attributes && ms[0].attributeName === "style" && ms[0].fireChange) changeLater(ms[0]); else
                if (el === $ocument.body) startLater();
                else initComponent(el);
            }));
        setTimeout(() => ob.observe(el, { childList: true, subtree: true, [attributes]: false }));
    };

    let startLater = debounce(() => start(nil, true));
    let start = (e, onlyObserve) => {
        let l = log;
        l((_n_ = now()), onlyObserve || ++age, ++updating);
        stopObserve($ocument.body);
        $(qdata)[forEach]((el) => initComponent(el));
        l(now(), zdata, now() - _n_, --updating);
        observe($ocument.body);
    };
    $ocument[addEventListener]("DOMContentLoaded", start);

    return { start, loadHTML };
})();
