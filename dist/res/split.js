"use strict";
addEventListener("pointerdown", function(t) {
    var e = t.target,
        i = e.parentElement;
    if (
        i &&
        t.isPrimary &&
        0 === t.button &&
        "separator" === e.getAttribute("role")
    ) {
        var n = i.hasAttribute("data-flex-splitter-vertical"),
            r = i.hasAttribute("data-flex-splitter-horizontal");
        if (n || r) {
            t.preventDefault();
            var a,
                o = t.pointerId,
                s = e.previousElementSibling,
                p = e.nextElementSibling;
            if (getComputedStyle(i).flexDirection.indexOf('reverse') > 0) {
                [s, p] = [p, s]
            }
            var h = getComputedStyle(s),
                l = getComputedStyle(p),
                d = s.getBoundingClientRect();
            if (n) {
                var m = d.top + t.offsetY,
                    f = s.offsetHeight + p.offsetHeight,
                    v = Math.max(
                        parseInt(h.minHeight, 10) || 0,
                        f - (parseInt(l.maxHeight, 10) || f)
                    ),
                    u = Math.min(
                        parseInt(h.maxHeight, 10) || f,
                        f - (parseInt(l.minHeight, 10) || 0)
                    );
                a = function(t) {
                    if (t.pointerId === o) {
                        var e = Math.round(
                            Math.min(Math.max(t.clientY - m, v), u)
                        );
                        (s.style.height = e + "px"),
                            (p.style.height = f - e + "px");
                    }
                };
            } else {
                var x = d.left + t.offsetX,
                    g = s.offsetWidth + p.clientWidth,
                    c = Math.max(
                        parseInt(h.minWidth, 10) || 0,
                        g - (parseInt(l.maxWidth, 10) || g)
                    ),
                    I = Math.min(
                        parseInt(h.maxWidth, 10) || g,
                        g - (parseInt(l.minWidth, 10) || 0)
                    );
                a = function(t) {
                    if (t.pointerId === o) {
                        var e = Math.round(
                            Math.min(Math.max(t.clientX - x, c), I)
                        );
                        (s.style.width = e + "px"),
                            (p.style.width = g - e + "px");
                    }
                };
            }
            var E = function(t) {
                t.pointerId === o &&
                    (e.releasePointerCapture(o),
                    e.removeEventListener("pointermove", a),
                    e.removeEventListener("pointerup", E),
                    e.removeEventListener("pointercancel", E));
            };
            a(t),
                (s.style.flexShrink = p.style.flexShrink = 1),
                e.addEventListener("pointercancel", E),
                e.addEventListener("pointerup", E),
                e.addEventListener("pointermove", a),
                e.setPointerCapture(o);
        }
    }
});
