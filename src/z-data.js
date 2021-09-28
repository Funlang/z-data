// Copyright (c) 2021 zwd@funlang.org
const ZData = (() => {
    var age = 0, cps = 0, _n_, ids = 0, updating = 0;

    const Attribute = "Attribute", Element = "Element", ElementSibling = Element + "Sibling", ElementChild = Element + "Child";

    const zdata = "z-data",  zcomp = "z-comp", znone = "z-none";
    const zinit = "init",    zargs = "args";
    const zfor  = "for",     zkey  = "key";
    const zif   = "if",      zelse = "else";
    const zuse  = "use",      _z_d = "_z_d",   qdata = `[${zdata}]`;

    const getAttribute    = "get"  + Attribute;
    const setAttribute    = "set"  + Attribute, remoVe = "remove";
    const removeAttribute = remoVe + Attribute;
    const firstEL  = "first"       + ElementChild;
    const lastEL   = "last"        + ElementChild;
    const prevEL   = "previous"    + ElementSibling, nexT = "next";
    const nextEL   = nexT          + ElementSibling;
    const createEl = "create"      + Element;
    const parentEL = "parent"      + Element;

    const insert = "insertBefore";
    const forEach = "forEach";
    const includes = "includes";
    const length = "length";
    const startsWith = "startsWith";
    const split = (s, d = / +/) => s.trim().split(d);
    const replace = "replace";
    const textC = "textContent";
    const input = "input";
    const change = "change";
    const c_lass = "class";
    const s_tyle = "style";
    const querySelector = "querySelector";
    const $ocument = document;
    const $ = (selector, el = $ocument) => el[querySelector+"All"](selector);
    const addEventListener = "addEventListener";
    const Obj_keys = Object.keys;
    const Obj_values = Object.values;
    const is_object = (obj, t = "object") => typeof obj == t;
    const is_function = (obj) => is_object(obj, "function");
    const con = console;
    const now = Date.now;
    const nil = undefined;

    const re_modifiers = /^(?:camel|prevent|stop|debounce|(\d+)(?:(m?)s)|capture|once|passive|self|away|window|document|(shift|ctrl|alt|meta)|(cmd|super))$/;
    const re_for = /^(?:\s*(?:(\w+)\s*:\s*)?(\w*)(?:\s*,\s*(\w+))?\s+in\s+)?(.+)$/;
    const re_bind = /^[:@.#!]./;
    const re_attr = /^(?:(:)(:?)|(@)|([.#!]))?([^.]*)(?:[.]([^.].*))?$/;
    const $e_text = (s) => s && s.indexOf("${") >= 0 && s.indexOf("`") < 0;
    const re_kebab = /[-_ ]+/g;
    const re_2camel = /-([a-z])/g;

    const liteProxy = (obj, cb) => {
        if (obj && is_object(obj) && !is_function(obj) && !obj.__ob__ && !obj._isVue && (delete obj[cb.id])) {
            for (let p in obj) try {
                obj[p] = getProxy()(obj[p], cb);
            } catch (e) {}
            return new Proxy(obj, cb);
        }
        return obj;
    };
    const getProxy = () => window.ZDataProxy || liteProxy;
    const initComponent = (el, env) => {
        if (el[_z_d] && (age <= el[_z_d].age || el[_z_d].ing)) return;
        (el[_z_d] || (el[_z_d] = {})).age = age;
        el[_z_d].ing = (el[_z_d].ing || 0) + 1;
        env = (env && (el[_z_d].env = env)) || el[_z_d].env || { ps: {}, ks: [], k: "", d: {} };
        let init = (self) => {
            updating++, stopObserve($ocument.body);
            goAnode({ r: el, p: el[parentEL], el }, { ...env, d: el[_z_d].zd }, self || age);
            updating--, observe($ocument.body);
        };
        let initLater = debounce(init);
        let zd = el[_z_d].zd;
        if (!zd) {
            let cb = {
                id: _z_d + now(),
                set(obj, prop, value, rec, zdataproxy) {
                    initLater();
                    try {
                        if (!zdataproxy) obj[prop] = getProxy()(value, cb);
                    } catch (e) {}
                    return true;
                },
                deleteProperty(obj, prop) {
                    return prop != this.id && delete obj[prop];
                }
            };
            ZData.proxy = (v) => getProxy()(v, cb);
            zd = tryEval(el, el._z = el[getAttribute](zdata) || 0, env) || {};
            el.$data = el[_z_d].zd = zd = getProxy()(zd, cb);
            el[setAttribute](zdata, "");
            if (el[zargs]) zd[zargs] = el[zargs];
            if (el[getAttribute](zinit)) tryEval(el, el[getAttribute](zinit), { ...env, d: zd });
        }
        init(true);
        el[_z_d].ing--;
    };

    const nodeCache = {};
    const goAnode = (args, env, self) => {
        let { p, el, cp } = args, nc;
        let zd = el[_z_d] || (el[_z_d] = {});
        let attrs = zd.as || (zd.as = (nc = nodeCache[el[getAttribute]("z-d")]) ? nc.as : el.getAttributeNames());
        if (attrs[includes](znone)) return;

        if (!cp) {
            let exp, res;
            if (self === nil && attrs[includes](zdata)) return initComponent(el, env);
            else if (attrs[includes](zcomp) && (exp = el[getAttribute](zcomp))) {
                try {
                    el[removeAttribute](zcomp);
                    if (/^([.\/]|https?:)/.test(exp)) res = fetch(exp).then((res) => res.text());
                    else if (/^z:/.test(exp) && ZData.get) res = ZData.get(exp[replace](/^z:\/*/, ""))
                    else res = tryEval(el, exp, env);
                    res.then((html) => {
                        let as = attrs[includes](zargs) && tryEval(el, el[getAttribute](zargs), env);
                        if (el.tagName[1] == "-" || attrs[includes]("del")) loadHTML(html, p, el, as), el[remoVe]();
                        else loadHTML(html, el, nil, as);
                    }).catch(nop);
                } catch (e) {}
                return;
            } else if (el.content && "TEMPLATE" == el.tagName) {
                if ((exp = el[getAttribute](zfor))) {
                    goFor(args, exp, env);
                } else if ((exp = el[getAttribute](zif)) || 1 /*attrs[includes](zelse)*/) {
                    goIf(args, exp, env);
                }
                return;
            }
        }
        setAttrs(args, env, attrs, nc);
        goNodes({ cp, r: args.r, p: el, el: (/*cp && el.content ||*/ el)[firstEL] }, env);
    };

    const goNodes = (args, env, cbIf, cbDo) => {
        for (; args.el && (!cbIf || cbIf(args) !== false); args.el = args[nexT]) {
            args[nexT] = args.el[nextEL];
            if (!cbDo || cbDo(args, env) === true) goAnode(args, env);
        }
    };

    const isElse = ({ el }) => el.hasAttribute(zelse);
    const nop = () => {};
    const goIf = (args, exp, env) => {
        let { p, el } = args;
        if (!exp || tryEval(el, exp, env)) {
            let next = args[nexT];
            if (el[_z_d].fi) {
                args.el = next;
                next = el[_z_d].fi[nextEL];
                goNodes(args, env, ({ el }) => el != next);
                goNodes(args, env, isElse, nop);
            } else {
                expand(args, env);
                args.el = args.el[nextEL];
                goNodes(args, env, ({ el }) => el != next);
                goNodes(args, env, isElse, fold);
            }
            el[_z_d].fi = next ? next[prevEL] : p[lastEL];
        } else fold(args, env);
    };

    const expand = ({ p, el, next, n, u, r }, env) => {
        if (!(n = el[_z_d].node)) {
            n = el[_z_d].node = (u=el[getAttribute](zuse)) && (u=tryEval(el,'`'+u+'`',env)) && (u=r[querySelector](u) || (n=r[parentEL].closest(qdata))&&n[querySelector](u)) && u.content || el.content;
            goNodes({ cp: 1, p: n, el: n[firstEL] }); // compile
        }
        for (let c = n[firstEL]; c; c = c[nextEL]) {
            n = c.cloneNode(true);
            p[insert](n, next);
        }
    };

    const fold = (args, env) => {
        if (args.el[_z_d] && args.el[_z_d].fi) {
            let next = args.el[_z_d].fi[nextEL];
            args.el[_z_d].fi = nil;
            args.el = args[nexT];
            remove(args, next, env);
        }
    };

    const remove = (args, next, env) => {
        goNodes(
            args, env,
            ({ el }) => el != next,
            ({ el }) => {
                el[remoVe]();
            }
        );
    };

    const goFor = (args, exp, env) => {
        let m = re_for.exec(exp);
        if (!m) return;
        let { p, el } = args;
        let items = tryEval(el, m[4], env),
            kvi = { k: m[1], v: m[2], i: m[3] },
            env2 = { ...env, ps: { ...env.ps } },
            akey = el[getAttribute](zkey),
            id = akey && split(akey, "."),
            keys = el[_z_d].ns || (el[_z_d].ns = {}),
            i = 0,
            cur = el,
            age = (el[_z_d].age = (el[_z_d].age || 0) + 1);
        id = id && id[length] == 2 && id[0] == kvi.v && id[1];
        if (kvi.k) env2.ps[kvi.k] = nil;
        if (kvi.v) env2.ps[kvi.v] = nil;
        if (kvi.i) env2.ps[kvi.i] = nil;
        env2.ks = Obj_keys(env2.ps);
        env2.k = env2.ks.join(",");
        for (let k in items /*of Obj_keys(items)*/) {
            let v = items[k];
            if (kvi.k) env2.ps[kvi.k] = k;
            if (kvi.v) env2.ps[kvi.v] = v;
            if (kvi.i) env2.ps[kvi.i] = i++;
            let key = id ? v[id] : akey ? tryEval(el, akey, env2) : kvi.k ? k : v;
            if (key === nil) continue; // key MUST BE !!!
            if (kvi.k) env2.ps[kvi.k] = key;

            let next = cur[nextEL];
            let curNode = keys[key];
            if (curNode) {
                let lastNext = curNode.t[nextEL];
                let moveable = curNode.s != next;
                if (moveable && next && !curNode.s[_z_d].skip) {
                    next[_z_d].skip = 1;
                    args.el = next;
                    next = next[_z_d].t[nextEL];
                    goNodes(args, env2, ({ el }) => el != next, nop);
                    moveable = curNode.s != (next = args[nexT]);
                }
                args.el = curNode.s;
                args.el[_z_d].skip = 0;
                goNodes(
                    args, env2,
                    ({ el }) => el != lastNext,
                    ({ p, el }) => {
                        if (moveable) p[insert](el, next);
                        return true;
                    }
                );
                moveable ? (args[nexT] = next) : (next = args[nexT]);
                curNode.age = age;
            } else {
                args.el = el;
                expand(args, env2);
                args.el = cur[nextEL];
                curNode = keys[key] = { age, s: args.el };
                goNodes(args, env2, ({ el }) => el != next);
            }
            curNode.s[_z_d].t = curNode.t = cur = next ? next[prevEL] : p[lastEL];
        }
        // remove ...
        Obj_keys(keys)
            .filter((k) => keys[k].age != age)
            [forEach]((k) => {
                remove({ el: keys[k].s }, keys[k].t[nextEL], env);
                delete keys[k];
            });
        args[nexT] = cur[nextEL];
    };

    const toCamel = (name) => name[replace](re_2camel, (m, c) => c.toUpperCase());
    const attrMaps = { css: s_tyle, text: textC, html: "innerHTML" };
    const setAttrs = (args, env, attrNames, nc) => {
        let { el } = args,
            zd = el[_z_d],
            vs = zd.vs || (zd.vs = []);
        let props = zd.ps || (zd.ps = nc && nc.ps);
        if (!props) {
            props = zd.ps = { ps: [] };
            if (args.cp) {
                nodeCache[++cps] = { as: attrNames, ps: props };
                el[setAttribute]("z-d", cps);
            }
            attrNames[forEach]((a) => {
                let v = el[getAttribute](a);
                if (!re_bind.test(a) && !$e_text(v)) return;
                let ms = re_attr.exec(a); // 1-bind 2 3-event 4-class/css 5-name 6-modifiers
                let k = ms[4] ? (ms[4] != "." || !ms[5] ? s_tyle : c_lass) : ms[5]; // key/name
                k = attrMaps[k] || k;
                if (k) {
                    let modifiers = ms[6] && split(ms[6], ".");
                    let ps = {
                        a,
                        k: k == c_lass || !modifiers || !modifiers[includes]("camel") ? k : toCamel(k),
                        b: (ms[3] && 3) || (ms[2] && 2) || ((ms[1] || ms[4]) && 1) || nil, // bind 1 2, event 3
                        m: ms[4] && ms[5] ? [ms[5]].concat(modifiers || []) : modifiers, // modifiers
                        e: v, // exp
                    };
                    if (!ps.b || ms[4] == "!") ps.e = "`" + ps.e + "`";
                    props.ps.push(ps);
                    ps.b && el[removeAttribute](a);
                }
            });
            let f, t;
            if ((f = el.firstChild) && f == el.lastChild && f.nodeType == 3 && $e_text((t = f.nodeValue))) {
                props.ps.push({
                    k: textC,
                    e: "`" + t + "`",
                });
            }
        }
        if (args.cp) return;
        let i = 0;
        props.ps[forEach]((ps) => {
            if (ps.b == 3) setEvent(args, ps, env);
            else {
                let v = ps.e && tryEval(el, ps.e, env, ps);
                if (vs[i] !== v) {
                    vs[i] = v;
                    setValue(el, ps, v);
                }
                if (ps.b == 2) {
                    if (!ps.b2) {
                        v = "this." + ps.k;
                        if (ps.k == s_tyle && ps.m && ps.m[length] > 0) v += "[`" + ps.m[0] + "`]";
                        let event = el.type == "text" ? input : change;
                        if (ps.m) {
                            if (ps.m[includes](input)) event = input;
                            else if (ps.m[includes](change)) event = change;
                            if (ps.m[includes]("trim")) v += ".trim()";
                            if (ps.m[includes]("number")) v = "parseFloat(" + v + ")";
                        }
                        let vi = "this." + _z_d + ".vs[" + i + "]=";
                        v = /==/.test(ps.e) ? v + "&&(" + ps.e[replace](/==+/, "=" + vi) + ")" : ps.e + "=" + vi + v
                        ps.b2 = { ...ps, e: v, k: event, ev: event, f: nil };
                    }
                    setEvent(args, ps.b2, env);
                }
                i++;
            }
        });
    };

    const setValue = (el, ps, value) => {
        if (ps.k == c_lass) {
            let cl = el.classList;
            if (ps.m && ps.m[length] > 0) {
                let v = ps.e === "" ? true : value;
                ps.m[forEach]((name) => {
                    if (is_object(v, "boolean") || !name.endsWith("-")) {
                        v ? cl.add(name) : cl[remoVe](name);
                    } else cl.add(name + v);
                });
            } else {
                if (Array.isArray(value)) {
                } else if (is_object(value)) {
                    Obj_keys(value)[forEach]((name) => value[name] ? cl.add(name) : cl[remoVe](name));
                    return;
                } else value = value ? split(value) : [];
                value[forEach]((name) => cl.add(name));
            }
        } else {
            if (ps.k == s_tyle) {
                if (ps.m && ps.m[length] > 0) {
                    if (ps.m[length] == 1) value = { [ps.m[0]]: value };
                    else value = { [ps.m[0]]: value && ps.m[1] };
                }
                if (is_object(value)) {
                    Obj_keys(value)[forEach]((name) => {
                        if (value[name] === false) el[s_tyle].removeProperty(name);
                        else name[0] == "-" ? el[s_tyle].setProperty(name, value[name]) : el[s_tyle][name] = value[name];
                    });
                    return;
                }
            }
            ps.m && ps.m[includes]("attr") ? value === false ? el[removeAttribute](ps.k) : el[setAttribute](ps.k, value) : el[ps.k] = value;
        }
    };

    const debounce = (fn, ms) => {
        let timer;
        return (...args) => {
            let me = this;
            let ifn = () => {
                timer = nil;
                fn.apply(me, args);
            };
            ms && (timer = clearTimeout(timer));
            timer || (timer = setTimeout(ifn, ms));
        };
    };

    const setEvent = ({ r, el }, ps, env) => {
        let { a: key, k: name, e: exp, ev, m: ms = [] } = ps;
        if (!el[_z_d][key]) {
            let target = ms[includes]("window") ? window : ms[includes]("document") || ms[includes]("away") ? $ocument : el;
            let fn = (e) => {
                if (ms[includes]("self") && el != e.target) return;
                if (ms[includes]("away") && (el.contains(e.target) || (el.offsetWidth < 1 && el.offsetHeight < 1))) return;
                // key and mouse (ctrl, alt, shift, meta, cmd, super)
                if (name[startsWith]("key") || name[startsWith]("mouse") || name.endsWith("click")) {
                    for (let modifier of ms) {
                        let m = re_modifiers.exec(modifier);
                        if (m && (m[3] || m[4])) {
                            let key = m[3] || (m[4] && "meta");
                            if (!key || !e[key + "Key"]) return;
                        }
                    }
                    let keys = ms.filter((m) => !re_modifiers.test(m));
                    if (keys[length] == 1) {
                        if (name[startsWith]("key") && e.key) {
                            let key = keys[0][replace](re_kebab, "");
                            key = { space: " ", slash: "/", gt: ">", eq: "=" }[key] || key;
                            if (key != (e.key.toLowerCase()[replace](re_kebab, "") || " ")) return;
                        } else if (["left", "mid", "right"][e.button] != keys[0]) return;
                    }
                }
                if (ms[includes]("prevent")) e.preventDefault();
                if (ms[includes]("stop")) e.stopPropagation();
                if (ms[includes]("once")) target.removeEventListener(name, fn, options);
                return tryEval(e.target, exp, {d: env.d, ks: [...env.ks, "$el"], k: env.k + "$el", ps: [...el[_z_d][key], r]});
            };
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
            ev && (el.fireChange = el.fireChange || ((name) => el.dispatchEvent(new Event(name || ev))));
        }
        el[_z_d][key] = Obj_values(env.ps);
    };

    const Functions = {};
    const newFun = (exp, ks, k, ps) => {
        let f = (ps && ps.f) || Functions[(k += exp)] ||
            (Functions[k] = new Function(["$z_d", ...ks], "let re$u1T;with($z_d){re$u1T=" + exp + "};return re$u1T"));
        ps && !ps.f && (ps.f = f);
        return f;
    };
    const tryEval = (el, exp, env, ps) => {
        return tryCatch(
            () => {
                if (is_function(exp)) return exp.call(env.d);
                return newFun(exp, env.ks, env.k, ps).call(el, env.d, ...Obj_values(env.ps));
            },
            { el, exp }
        );
    };

    const error = (el, exp, e) => con.warn(`${zdata} error: "${e}"\n\nexp: "${exp}"\nelement:`, el);
    const tryCatch = (cb, { el, exp }) => {
        try {
            let value = cb();
            return value instanceof Promise ? value.catch((e) => error(el, exp, e)) : value;
        } catch (e) {
            error(el, exp, e);
        }
    };

    const loadHTML = (html, p, before, args) => {
        p || (p = $ocument.body);
        let id, fn, name, el = $ocument[createEl](zdata);
        if (!(id = p[getAttribute]("z-i"))) p[setAttribute]("z-i", (id = ++ids));
        let fns = debounce(() => {
                fn[forEach]((f) => f());
                --updating < 0 ? (updating = 0) : 0, startLater();
            });
        el[attrMaps["html"]] = html[replace](/<!--[^]*?-->/g, "")
          [replace](/\bz-data\s*=\s*['"]?(\$[\w]+)/, ($0, $1) => (name = $1, $0 + "_" + id))
          [replace](/<(script)([^>]*)>([^]*?)<\/\1>/gi, ($0, $1, src, s) => {
            let m = src.match(/src\s*=\s*(?:'([^']+)|"([^"]+)|(\S+))/);
            src = m && (m[1] || m[2] || m[3]);
            if ((!src || $(`script[src="${src}"]`)[length]) && !s) return "";
            let e = $ocument[createEl]("script");
            e[setAttribute](znone, "");
            let f = () => p[insert](e, before);
            if (fn && !src) fn.push(f);
            else f();
            if (src) {
                e.src = src;
                e.onload = fns;
                e.onerror = () => (updating = 0);
                fn = [];
            } else e[textC] = name ? s[replace](name, name + "_" + id) : s;
            return "";
        })[replace](/(<(style)[^>@]*>)([^]+?)(<\/\2>)/gi, ($0, s1, $2, s, s2) => {
            s = s[replace](/([^{}]+)(?=\{)/g, ($0, names) => {
                if (/^\s*(@|\d+%|from|to)\b/.test(names)) return names; // @keyframes or [z-i=...
                return split(names, /\s*,\s*/).map((n) => n[replace](/^(\[z-i=.*?\] )?(.*)/, ($0,$1,$2)=>`[z-i="${id}"] `+$2)).join(",");
            });
            return s1 + s + s2;
        });
        if (args && $(qdata, el)[length]) $(qdata, el)[0][zargs] = args;
        for (let e = el[firstEL], n = e && e[nextEL]; e; e = n, n = n && n[nextEL]) p[insert](e, before);
        if (fn) updating++;
        else startLater();
    };

    const stopObserve = (el) => el[_z_d] && el[_z_d].ob && el[_z_d].ob.disconnect();
    const observe = (el) => {
        let ob = (el[_z_d] || (el[_z_d] = {})).ob ||
            (el[_z_d].ob = new MutationObserver((ms) => {
                if (updating) return;
                if (el == $ocument.body) {
                    if (ms[length] < 100 /* How Many ??? */) {
                        let ignore = true;
                        for (let i = 0, t; i < ms[length]; i++) {
                            ignore = ignore && ((t = ms[i].target).closest(`[${znone}]`) || !t.closest(qdata) && !t[querySelector](qdata));
                        }
                        if (ignore) return;
                    }
                    startLater();
                } else initComponent(el);
            }));
        ZData.nobserve || setTimeout(() => ob.observe(el, { childList: true, subtree: true }));
    };

    const startLater = debounce(() => start(nil, 1));
    const start = (e, onlyObserve) => {
        let l = nop;//con.log;
        l((_n_ = now()), onlyObserve || ++age, ++updating);
        stopObserve($ocument.body);
        $(qdata)[forEach]((el) => initComponent(el));
        l(now(), zdata, now() - _n_, --updating);
        observe($ocument.body);
    };

    const ons = {};
    const on = (name, fn) => ((ons[name] = ons[name] || []).push(fn), ZData);
    const call = (name, args) => (ons[name] || [])[forEach]((fn) => fn(args));
          
    $ocument[addEventListener]("DOMContentLoaded", start);
    return { start, loadHTML, on, call };
})();
