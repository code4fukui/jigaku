import jigaku from './lib/jigaku.mjs'

const data = {
  タイトル: '分数表現 JIGAKU',
  対象: '小学3年',
  科目: '算数',
  iconrect: [(1220 - 640) / 2, 0, 640, 640]
}

const show = function () {
  const c = jigaku.createFullCanvas()

  const color = [240, 191, 58]
  const bgcolor = [240, 240, 240]

  let parts = null

  class Frac {
    constructor () {
      this.col = color
      this.bgcol = bgcolor
      this.numc = 5
      this.numm = 8
    }

    setSize (w, h) {
      this.x = w / 2
      this.y = h / 2 - h * 0.05
      this.r = Math.min(w / 2, h * 0.8) / 2
    }

    draw (g) {
      g.lineWidth = this.r / 40
      const nm = this.numm
      const nc = this.numc
      for (var i = 0; i < nm; i++) {
        const srad = Math.PI * 2 / nm * i - Math.PI / 2
        const erad = Math.PI * 2 / nm * (i + 1) - Math.PI / 2
        g.setColor(i < nc ? this.col : this.bgcol)
        g.fillArc(this.x, this.y, this.r, srad, erad)
        g.setColor(0, 0, 0)
        g.drawArc(this.x, this.y, this.r, srad, erad)
      }
    }

    isHit (x, y) {
      const dx = x - this.x
      const dy = y - this.y
      return dx * dx + dy * dy < this.r * this.r
    }

    canMove () {
      return false
    }

    onTouch (x, y) {
      const dx = this.x - x
      const dy = this.y - y
      let rad = Math.atan2(dy, dx) - Math.PI / 2
      if (rad < 0) { rad += Math.PI * 2 }
      if (rad > Math.PI * 2) { rad -= Math.PI * 2 }
      const n = rad / (Math.PI * 2) * this.numm
      this.numc = (n >> 0) + 1
      if (this.numc > this.numm) { this.numc = this.numm }
      c.redraw()
    }

    onDrag (x, y) {
      this.onTouch(x, y)
    }
  }
  class TextButton {
    constructor (s) {
      this.s = s
      this.col = '#000'
    }

    draw (g) {
      g.setFontSize(this.sh)
      g.setColor(this.col)
      g.fillTextCenter(this.s, this.x, this.y + this.sh / 2)
    }

    isHit (x, y) {
      c.g.setFontSize(this.sh)
      const sw = c.g.measureText(this.s).width * 1.3
      const sh = this.sh * 1.4
      return jigaku.containsRect(x, y, this.x - sw / 2, this.y - sh / 2, sw, sh)
    }
  }
  class FracNum {
    constructor () {
      this.numc = 1
      this.numm = 1
    }

    setSize (w, h) {
      this.sh = w / 15
      this.x = w - w / 8
      this.y = h / 2 - h * 0.05
    }

    isHit (x, y) {
      const sh = this.sh
      return jigaku.containsRect(x, y, this.x - sh, this.y - sh, sh * 2, sh * 2)
    }

    draw (g) {
      const { x, y, sh } = this
      g.setFontSize(sh)
      g.setColor(0, 0, 0)
      g.drawLine(x - sh, y, x + sh, y)
      g.fillTextCenter(this.numc, x, y - sh / 2)
      g.fillTextCenter(this.numm, x, y + sh)
    }
  }

  const getHitPart = (x, y) => parts.find(p => p.isHit && p.isHit(x, y))

  const initParts = function () {
    parts = []
    const frac = new Frac()
    parts.push(frac)
    const fracnum = new FracNum()
    const btnup = new TextButton('↑')
    btnup.setSize = function (w, h) {
      this.sh = w / 10
      this.x = w / 8
      this.y = h / 2 - h * 0.05 - this.sh
    }
    const btnup2 = new TextButton('分母')
    btnup2.setSize = function (w, h) {
      this.sh = w / 20
      this.x = w / 8
      this.y = h / 2 - h * 0.05
    }
    parts.push(btnup2)
    const btndown = new TextButton('↓')
    btndown.setSize = function (w, h) {
      this.sh = w / 10
      this.x = w / 8
      this.y = h / 2 - h * 0.05 + this.sh
    }
    const btnsp = new TextButton('通分する')
    btnsp.setSize = function (w, h) {
      this.sh = w / 25
      this.x = w - w / 8
      this.y = h / 2 - h * 0.05 + this.sh * 3
    }
    parts.push(fracnum)
    const num = new TextButton(1)
    num.update = function () {
      this.s = fracnum.numc + (this.flg ? ' / ' : ' ÷ ') + fracnum.numm + ' = ' + (fracnum.numc / fracnum.numm)
    }
    num.onTouch = function () {
      this.flg = !this.flg
      c.redraw()
    }
    num.setSize = function (w, h) {
      const r = Math.min(w / 2, h * 0.8) / 2
      this.sh = Math.min(h / 15, w / 15)
      this.x = w / 2
      this.y = h / 2 - h * 0.05 + r + h * 0.025 + this.sh / 2
    }
    parts.push(num)

    fracnum.update = function () {
      fracnum.numm = frac.numm
      fracnum.numc = frac.numc
    }
    fracnum.onTouch = function () {
      if (frac.numm <= 64) {
        frac.numm *= 2
        frac.numc *= 2
        c.redraw()
      }
    }
    parts.push(btnup)
    parts.push(btndown)
    parts.push(btnsp)
    btnup.onTouch = btnup2.onTouch = function () {
      if (frac.numm <= 127) {
        frac.numm++
        c.redraw()
      }
    }
    btndown.onTouch = function () {
      if (frac.numm > 1) {
        frac.numm--
        if (frac.numc > frac.numm) {
          frac.numc = frac.numm
        }
      }
      c.redraw()
    }
    btnsp.update = function () {
      this.col = canSmall(frac.numc, frac.numm) ? '#f00' : '#aaa'
    }
    var canSmall = function (nc, nm) {
      for (let i = 2; i <= nm; i++) {
        if (nm % i === 0 && nc % i === 0) {
          return true
        }
      }
      return false
    }
    btnsp.onTouch = function () {
      var nm = frac.numm
      var nc = frac.numc
      for (var i = 2; i <= nm; i++) {
        if (nm % i === 0 && nc % i === 0) {
          frac.numm = nm / i
          frac.numc = nc / i
          c.redraw()
          return
        }
      }
    }
  }
  initParts()

  let bkw = 0
  let bkh = 0
  c.draw = function (g, cw, ch) {
    if (bkw !== cw || bkh !== ch) {
      parts.forEach(p => p.setSize && p.setSize(cw, ch))
      bkw = cw
      bkh = ch
    }
    parts.forEach(p => p.update && p.update())
    g.setColor(255, 255, 255)
    g.fillRect(0, 0, cw, ch)
    parts.forEach(p => p.update && p.update())
    parts.forEach(p => p.draw(g))
  }
  let drag = false
  c.onuidown = function (x, y) {
    drag = true
    const hit = getHitPart(x, y)
    if (hit && hit.onTouch) {
      hit.onTouch(x, y)
    }
    c.redraw()
  }
  c.onuimove = function (x, y) {
    if (drag) {
      const hit = getHitPart(x, y)
      if (hit && hit.onDrag) {
        hit.onDrag(x, y)
        c.redraw()
      }
    }
  }
  c.onuiup = function () {
    drag = false
  }
  c.redraw()
}

if (typeof window !== 'undefined') {
  window.onload = () => show()
}

export default { data }
