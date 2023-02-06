# Rules

## 1. padding/margin
p0, m.1, pl2, mt3px, px4%
m--varname, py--sm, px--lg

## 2. max/min - height/width, font-size/line-height, gap/border-radius
h1, w2, xh100%, nw4%, font12px, lh2
font--fontsize, lh--lineheight
gap2 gapr2px gapc2 brad2 bradtl2 bradbr2 bradt2 gap--a bradt--a bradb2px

## 3. left/top/right/bottom
l0, t1, r2pt, b3px
l--left, t--top

## 4. opacity/order/z-index
op.1, ord2, z3
op--opacity, z--zlevel

## 5. position ...
### position/display/cursor/visibility/white-space/user-select/pointer-events
pos-absolute, d-block, cs-pointer, v-visible, ws-nowrap, us-none, pe-all

## 6. overflow
o-scroll, ox-visible, oy-hidden

## 7. content/color/background
content-x, c#000, b#fff
c--color, b--bgcolor

## 8. media
### sm|s / md|m / lg|l / xl/2xl/xxl/print
s:p0

## 9. state
### hover|focus[-...]|active|after|before|(first|last)(-...)
hover=b#ff0, m:focus=c#f50, not-active=m0, l:after="content-x cs-move"
out-not-hover=c#000, parent^active=b#000, elder~hover=b#fff, prev+hover=c#fff

## X. group
### border, border-left, border-top, border-right, border-bottom, background, animation, align, ...
### bd|bl|bt|br|bb|bg|a|al|font|flex|grid|mask
bd="style: bold; width: 1px; color: red"
