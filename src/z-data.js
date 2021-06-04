// Copyright (c) 2021 zwd@funlang.org
const ZData = (() => {
    const zdata = "z-data";
    const znone = "z-none";
    const zcomp = "z-comp";
    const zinit = "init";
    const zargs = "args";
    const zfor = "for";
    const zkey = "key";
    const zif = "if";
    const zelse = "else";
    const qdata = `[${zdata}]`;
    const etAttribute = "etAttribute";
    const Element = "Element";
    const ElementSibling = `${Element}Sibling`;
    const ElementChild = `${Element}Child`;
    const getAttribute = `g${etAttribute}`;
    const setAttribute = `s${etAttribute}`;
    const firstEL = `first${ElementChild}`;
    const lastEL = `last${ElementChild}`;
    const prevEL = `previous${ElementSibling}`;
    const nextEL = `next${ElementSibling}`;
    const createEl = `create${Element}`;
    const insert = "insertBefore";
    const nexT = "next";
    const _z_d = "_z_d";
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
    const $ocument = document;
    const $ = (selector, el = $ocument) => el.querySelectorAll(selector);
    const addEventListener = "addEventListener";
    const Obj_keys = Object.keys;
    const Obj_values = Object.values;
    const is_object = (obj, t = "object") => typeof obj == t;
    const is_function = (obj) => is_object(obj, "function");
    const con = console;
    const now = Date.now;
    const nil = undefined;
    const re_for = /^(?:\s*(?:(\w+)\s*:\s*)?(\w*)(?:\s*,\s*(\w+))?\s+in\s+)?(.+)$/;
    const re_bind = /^[:@.#!]./;
    const re_attr = /^(?:(:)(:?)|(@)|([.#!]))?([^.]*)(?:[.]([^.].*))?$/;
    const $e_text = (s) => s.indexOf("${") >= 0 && s.indexOf("`") < 0;
    const re_2camel = /-([a-z])/g;
    const re_kebab = /[-_ ]+/g;
    const re_modifiers = /^(?:camel|prevent|stop|debounce|(\d+)(?:(m?)s)|capture|once|passive|self|away|window|document|(shift|ctrl|alt|meta)|(cmd|super))$/;
    let age = 0, cps = 0, _n_;

    let liteProxy = (obj, cb) => {
        if (obj && is_object(obj) && !is_function(obj) && !obj.__ob__ && (delete obj[cb.id])) {
            for (let p in obj) try {
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
        let init = (self) => {
            updating++, stopObserve($ocument.body);
            goAnode({ r: el, p: el.parentElement, el }, { ...env, d: el[_z_d].zd }, self || age);
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
            zd = tryEval(el, el[getAttribute](zdata) || 0, env) || {};
            el.$data = el[_z_d].zd = zd = getProxy()(zd, cb);
            if (el[zargs]) zd[zargs] = el[zargs];
            if (el[getAttribute](zinit)) tryEval(el, el[getAttribute](zinit), { ...env, d: zd });
        }
        init(true);
        el[_z_d].ing--;
    };

    let nodeCache = {};
    let goAnode = (args, env, self) => {
        let { p, el } = args, nc;
        let zd = el[_z_d] || (el[_z_d] = {});
        let attrs = zd.as || (zd.as = (nc = nodeCache[el[getAttribute]("z-d")]) ? nc.as : el.getAttributeNames());
        if (attrs[includes](znone)) return;

        if (!args.cp) {
            let exp, res;
            if (self === nil && attrs[includes](zdata)) return initComponent(el, env);
            else if (attrs[includes](zcomp) && (exp = el[getAttribute](zcomp))) {
                try {
                    if (/^([.\/]|https?:)/.test(exp)) res = fetch(exp).then((res) => res.text());
                    else if (/^z:/.test(exp) && ZData.get) res = ZData.get(exp[replace](/^z:\/*/, ""))
                    else res = tryEval(el, exp, env);
                    res.then((html) => {
                        let as = attrs[includes](zargs) && tryEval(el, el[getAttribute](zargs), env);
                        if (el.localName.charAt(1) == "-" || attrs[includes]("del")) loadHTML(html, p, el, as), el.remove();
                        else loadHTML(html, el, nil, as), el.removeAttribute(zcomp);
                    }).catch(nop);
                } catch (e) {}
                return;
            } else if (el.content && "template" == el.localName) {
                if ((exp = el[getAttribute](zfor))) {
                    goFor(args, exp, env);
                } else if ((exp = el[getAttribute](zif)) || 1 /*attrs[includes](zelse)*/) {
                    goIf(args, exp, env);
                }
                return;
            }
        }
        setAttrs(args, env, attrs, nc);
        goNodes({ cp: args.cp, r: args.r, p: el, el: el[firstEL] }, env);
    };

    let goNodes = (args, env, cbIf, cbDo) => {
        for (; args.el && (!cbIf || cbIf(args) !== false); args.el = args[nexT]) {
            args[nexT] = args.el[nextEL];
            if (!cbDo || cbDo(args, env) === true) goAnode(args, env);
        }
    };

    let isElse = ({ el }) => el.hasAttribute(zelse);
    let nop = () => {};
    let goIf = (args, exp, env) => {
        let { p, el } = args;
        if (!exp || tryEval(el, exp, env)) {
            let next = args[nexT];
            if (el[_z_d].fi) {
                args.el = next;
                next = el[_z_d].fi[nextEL];
                goNodes(args, env, ({ el }) => el != next);
                goNodes(args, env, isElse, nop);
            } else {
                expand(args);
                args.el = args.el[nextEL];
                goNodes(args, env, ({ el }) => el != next);
                goNodes(args, env, isElse, fold);
            }
            el[_z_d].fi = next ? next[prevEL] : p[lastEL];
        } else fold(args, env);
    };

    let expand = ({ p, el, next, n }) => {
        if (!(n = el[_z_d].node)) {
            n = el[_z_d].node = el.content;
            goNodes({ cp: 1, p: n, el: n[firstEL] }); // compile
        }
        for (let c = n[firstEL]; c; c = c[nextEL]) {
            n = c.cloneNode(true);
            p[insert](n, next);
        }
    };

    let fold = (args, env) => {
        if (args.el[_z_d] && args.el[_z_d].fi) {
            let next = args.el[_z_d].fi[nextEL];
            args.el[_z_d].fi = nil;
            args.el = args[nexT];
            remove(args, next, env);
        }
    };

    let remove = (args, next, env) => {
        goNodes(
            args, env,
            ({ el }) => el != next,
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
                let lastNext = curNode.to[nextEL];
                let moveable = curNode.from != next;
                if (moveable && next && !curNode.from[_z_d].skip) {
                    next[_z_d].skip = 1;
                    args.el = next;
                    next = next[_z_d].to[nextEL];
                    goNodes(args, env2, ({ el }) => el != next, nop);
                    moveable = curNode.from != (next = args[nexT]);
                }
                args.el = curNode.from;
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
                expand(args);
                args.el = cur[nextEL];
                curNode = keys[key] = { age, from: args.el };
                goNodes(args, env2, ({ el }) => el != next);
            }
            curNode.from[_z_d].to = curNode.to = cur = next ? next[prevEL] : p[lastEL];
        }
        // remove ...
        Obj_keys(keys)
            .filter((k) => keys[k].age != age)
            [forEach]((k) => {
                remove({ el: keys[k].from }, keys[k].to[nextEL], env);
                delete keys[k];
            });
        args[nexT] = cur[nextEL];
    };

    let toCamel = (name) => name[replace](re_2camel, (m, c) => c.toUpperCase());
    let classNames = {};
    let attrMaps = { css: s_tyle, text: textC, html: "innerHTML" };
    let setAttrs = (args, env, attrNames, nc) => {
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
            let c = el.className, ocl;
            if (c && is_object(c, "string")) {
                c = classNames[c] || (classNames[c] = split(c));
                c[forEach]((name) => ((ocl || (ocl = {}))[name] = 1));
            }
            attrNames[forEach]((a) => {
                let v = el[getAttribute](a);
                if (!re_bind.test(a) && !$e_text(v)) return;
                let ms = re_attr.exec(a); // 1-bind 2 3-event 4-class/css 5-name 6-modifiers
                let k = ms[4] ? (ms[4] != "." || !ms[5] ? s_tyle : c_lass) : ms[5]; // key/name
                k = attrMaps[k] ? attrMaps[k] : k;
                if (k) {
                    let modifiers = ms[6] && ms[6].split(".");
                    let ps = {
                        a,
                        k: k == c_lass || !modifiers || !modifiers[includes]("camel") ? k : toCamel(k),
                        b: (ms[3] && 3) || (ms[2] && 2) || ((ms[1] || ms[4]) && 1) || nil, // bind 1 2, event 3
                        m: ms[4] && ms[5] ? [ms[5]].concat(modifiers || []) : modifiers, // modifiers
                        e: v, // exp
                    };
                    if (!ps.b || ms[4] == "!") ps.e = "`" + ps.e + "`";
                    props.ps.push(ps);
                    if (ps.k == c_lass) props.ocl = ocl;
                }
            });
            let f, t;
            if ((f = el.firstChild) && f == el.lastChild && f.nodeType == 3 && $e_text((t = f.nodeValue))) {
                props.ps.push({
                    k: textC,
                    e: "`" + t + "`",
                });
            }
            if (args.cp) return;
        }
        let oldcls = props.ocl ? { ...props.ocl } : {};
        let clsChanged = false, i = 0;
        props.ps[forEach]((ps) => {
            if (ps.b == 3) setEvent(args, ps, env);
            else {
                let v = ps.e && tryEval(el, ps.e, env, ps);
                if (vs[i] !== v) {
                    vs[i] = v;
                    clsChanged = setValue(el, ps, v, oldcls) || clsChanged;
                }
                i++;
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
                        v = /==/.test(ps.e) ? "this.checked&&(" + ps.e[replace](/==+/, "=") + ")" : ps.e + "=" + v
                        ps.b2 = { ...ps, e: v, k: event, ev: event, f: nil };
                    }
                    setEvent(args, ps.b2, env);
                }
            }
        });
        if (clsChanged) {
            let cls = Obj_keys(oldcls).join(" ");
            if (zd.oc != cls) el.className = zd.oc = cls;
        }
    };

    let setValue = (el, ps, value, cls) => {
        if (ps.k == c_lass) {
            if (ps.m && ps.m[length] > 0) {
                let v = ps.e === "" ? true : value;
                ps.m[forEach]((name) => {
                    if (is_object(v, "boolean") || !name.endsWith("-")) {
                        v ? (cls[name] = 1) : delete cls[name];
                    } else cls[name + v] = 1;
                });
            } else {
                if (Array.isArray(value)) {
                } else if (is_object(value)) {
                    Obj_keys(value)[forEach]((name) => (value[name] ? (cls[name] = 1) : delete cls[name]));
                    return true;
                } else value = value ? split(value) : [];
                value[forEach]((name) => (cls[name] = 1));
            }
            return true;
        } else {
            if (ps.k == s_tyle) {
                if (ps.m && ps.m[length] > 0) {
                    if (ps.m[length] == 1) value = { [ps.m[0]]: value };
                    else value = { [ps.m[0]]: value && ps.m[1] };
                }
                if (is_object(value)) {
                    Obj_keys(value)[forEach]((name) => {
                        if (value[name] === false) el[s_tyle].removeProperty(name);
                        else el[s_tyle][name] = value[name];
                    });
                    return;
                }
            }
            el[ps.k] = value; // el[setAttribute](ps.k, value);
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
            ms && (timer = clearTimeout(timer));
            timer || (timer = setTimeout(ifn, ms));
        };
    };

    let setEvent = ({ r, el }, ps, env) => {
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
                        if (name[startsWith]("key")) {
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

    let Functions = {};
    let newFun = (exp, ks, k, ps) => {
        let f = (ps && ps.f) || Functions[(k += exp)] ||
            (Functions[k] = new Function(["$z_d", ...ks], "let re$u1T;with($z_d){re$u1T=" + exp + "};return re$u1T"));
        ps && !ps.f && (ps.f = f);
        return f;
    };
    let tryEval = (el, exp, env, ps) => {
        return tryCatch(
            () => {
                if (is_function(exp)) return exp.call(env.d);
                return newFun(exp, env.ks, env.k, ps).call(el, env.d, ...Obj_values(env.ps));
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

    let ids = 0;
    let loadHTML = (html, p, before, args) => {
        p || (p = $ocument.body);
        let id, fn, name, el = $ocument[createEl](zdata);
        if (!(id = p[getAttribute]("z-id"))) p[setAttribute]("z-id", (id = ++ids));
        let fns = debounce(() => {
                fn[forEach]((f) => f());
                --updating < 0 ? (updating = 0) : 0, startLater();
            });
        el[attrMaps["html"]] = html[replace](/<!--[^]*?-->/g, "")
          [replace](/(z-data\s*=\s*)(?:(')(\$[\w]+)([^'\w]*')|(")(\$[\w]+)([^"\w]*")|(\$[\w]+)([^\s>\w]*[\s>]))/, ($0,$1,$2="",$3="",$4="",$5="",$6="",$7="",$8="",$9="") => {
            name = $3 + $6 + $8;
            return $1 + $2 + $5 + name + "_" + id + $4 + $7 + $9;
        })[replace](/<(script)([^>]*)>([^]*?)<\/\1>/gi, ($0, $1, src, s) => {
            let m = src.match(/src\s*=\s*(?:'([^']+)'|"([^"]+)"|(\S+))/);
            src = m ? (m[1] || "") + (m[2] || "") + (m[3] || "") : "";
            if (!src && !s) return "";
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
        })[replace](/(<(style)[^>]*>)([^]+?)(<\/\2>)/gi, ($0, s1, $2, s, s2) => {
            s = s[replace](/([^{}]+)(?=\{)/g, ($0, names) => {
                if (/^\s*(@.*|\d+%(\s*,\s*\d+%)*|from|to)\s*$/.test(names)) return names; // @keyframes
                return split(names, /\s*,\s*/).map((n) => "[z-id='" + id + "'] " + n).join(",");
            });
            return s1 + s + s2;
        });
        if (args && $(qdata, el)[length]) $(qdata, el)[0][zargs] = args;
        for (let e = el[firstEL], n = e && e[nextEL]; e; e = n, n = n && n[nextEL]) p[insert](e, before);
        if (fn) updating++;
        else startLater();
    };

    let updating = 0;
    let stopObserve = (el) => el[_z_d] && el[_z_d].ob && el[_z_d].ob.disconnect();
    let observe = (el) => {
        let ob = (el[_z_d] || (el[_z_d] = {})).ob ||
            (el[_z_d].ob = new MutationObserver((ms) => {
                if (updating) return;
                if (el == $ocument.body) {
                    if (ms[length] < 100 /* How Many ??? */) {
                        let ignore = true;
                        for (let i = 0, t; i < ms[length]; i++) {
                            ignore = ignore && ((t = ms[i].target).closest(`[${znone}]`) || !t.closest(qdata) && !t.querySelector(qdata));
                        }
                        if (ignore) return;
                    }
                    startLater();
                } else initComponent(el);
            }));
        ZData.nobserve || setTimeout(() => ob.observe(el, { childList: true, subtree: true }));
    };

    let startLater = debounce(() => start(nil, 1));
    let start = (e, onlyObserve) => {
        let l = nop;//con.log;
        l((_n_ = now()), onlyObserve || ++age, ++updating);
        stopObserve($ocument.body);
        $(qdata)[forEach]((el) => initComponent(el));
        l(now(), zdata, now() - _n_, --updating);
        observe($ocument.body);
    };
    $ocument[addEventListener]("DOMContentLoaded", start);

    return { start, loadHTML };
})();
