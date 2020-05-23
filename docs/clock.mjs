import jigaku from './lib/jigaku.mjs'

const data = {
  タイトル: '読みやすい時計 JIGAKU',
  対象: '小学1年/小学2年/小学3年',
  科目: '算数',
  iconrect: [(1220 - 640) / 2, 0, 640, 640]
}

const show = function () {
  const demo = document.location.hash === '#demo'

  const c = jigaku.createFullCanvas()

  let analog = false

  c.draw = function (g, cw, ch) {
    g.setColor('#fff')
    g.fillRect(0, 0, cw, ch)

    const sh = cw > ch ? ch / 8 : cw / 8
    const ch2 = ch - sh

    const cx = cw / 2
    const cy = ch2 / 2
    const r = Math.min(cw, ch2) / 2 * 0.85
    const rs = r * 1.0
    const rm = r * 0.8
    const rh = r * 0.6
    const lw = r * 0.02

    const drawLineWithAngle = (angle, r, linetype) => {
      const th = angle * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(th) * r + cx
      const y = Math.sin(th) * r + cy
      if (linetype === 0) {
        g.drawLine(cx, cy, x, y)
      } else if (linetype === 1) {
        const r2 = r / 4
        const dth = Math.PI / 20
        g.beginPath()
        g.moveTo(cx, cy)
        g.lineTo(cx + Math.cos(th + dth) * r2, cy + Math.sin(th + dth) * r2)
        g.lineTo(x, y)
        g.lineTo(cx + Math.cos(th - dth) * r2, cy + Math.sin(th - dth) * r2)
        g.lineTo(cx, cy)
        g.closePath()
        g.fill()
      }
    }
    const drawScale = (max, r, usemax) => {
      g.drawCircle(cx, cy, r)
      const scalelen = r / 20
      g.setFontSize(scalelen)
      const subscale = analog ? 10 : 1
      for (let i = 0; i < max * subscale; i++) {
        const th = Math.PI * 2 / (max * subscale) * i - Math.PI / 2
        const len = i % subscale ? scalelen / 2 : scalelen
        const cth = Math.cos(th)
        const sth = Math.sin(th)
        g.drawLine(
          cx + cth * r, cy + sth * r,
          cx + cth * (r + len), cy + sth * (r + len)
        )
        if (!(i % subscale)) {
          const rs = r + len * 2
          const s = i / subscale
          g.fillTextCenter(s === 0 && usemax ? max : s, cx + cth * rs, cy + sth * rs)
        }
      }
    }

    g.setColor('#aaa')
    g.lineWidth = lw / 4
    drawScale(60, rs)
    drawScale(60, rm)
    drawScale(12, rh, true)

    const d = demo ? new Date('2020-01-01T08:55:21.05') : new Date()
    const fix0 = n => n < 10 ? '0' + n : n
    const fix00 = n => n < 10 ? '00' + n : (n < 100 ? '0' + n : n)
    g.setColor('#000')
    const snow = fix0(d.getHours() % 12) + ':' + fix0(d.getMinutes()) + ':' + fix0(d.getSeconds()) + (analog ? '.' + fix00(d.getMilliseconds()) : '')
    const fh = sh * 0.8
    // g.setFontSize(fh)
    g.font = 'normal ' + fh + 'px Courier New'
    g.fillTextCenter(snow, cx, ch - (sh - fh))

    const s = d.getSeconds() + (analog ? d.getMilliseconds() / 1000 : 0)
    const m = d.getMinutes() + (analog ? s / 60 : 0)
    const h = d.getHours() % 12 + (analog ? m / 60 : 0)
    g.lineWidth = 1
    g.lineJoin = 'round'
    drawLineWithAngle(h / 12, rh, 1)
    drawLineWithAngle(m / 60, rm, 1)
    drawLineWithAngle(s / 60, rs, 0)
  }
  const f = () => {
    c.redraw()
    requestAnimationFrame(f)
  }
  c.onuidown = (x, y) => {
    analog = !analog
  }
  f()
}
if (typeof window !== 'undefined') {
  window.onload = () => show()
}

export default { data }
