import jigaku from './jigaku.mjs'

const HIRA = Array.from('あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもや ゆ よらりるれろわ　を　ん')
const KATA = Array.from('アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤ ユ ヨラリルレロワ　ヲ　ン')
const ROMA = jigaku.pairCharsToArray('A I U E O KAKIKUKEKOSASISUSESOTATITUTETONANINUNENOHAHIHUHEHOMAMIMUMEMOYA  YU  YORARIRUREROWA  WO  NN')
const N_COLUMN = 5

const color = ['#f0bf3a', '#47a339', '#1736a7', '#e1312b', '#9ebb2e']

const show = function (showchars, hiddenchars) {
  const c = jigaku.createFullCanvas()
  const demo = document.location.hash === '#demo'

  let mx = -1
  let my = -1
  c.draw = function (g, cw, ch) {
    g.setColor('#fff')
    g.fillRect(0, 0, cw, ch)

    const nrow = showchars.length / N_COLUMN
    const sh = cw * 0.9 / nrow * 0.8
    const tw = cw * 0.9 / nrow
    const th = ch * 0.9 / N_COLUMN
    for (let i = 0; i < nrow; i++) {
      for (let j = 0; j < N_COLUMN; j++) {
        g.setColor(color[j])
        const x = cw * 0.05 + (nrow - i - 1) * tw + tw / 2
        const y = ch * 0.05 + (j + 1 / 2) * th
        const open = jigaku.containsRect(mx, my, x - tw / 2, y - th / 2, tw, th) || (demo && i === 0 && j === 0)
        const n = i * 5 + j
        const c = open ? hiddenchars[n] : showchars[n]
        const fonth = c.length > 1 ? sh * 0.7 : sh
        g.setFontSize(fonth)
        g.fillTextCenter(c, x, y)
      }
    }
  }
  let drag = false
  c.onuidown = function (x, y) {
    drag = true
    mx = x
    my = y
    this.redraw()
  }
  c.onuimove = function (x, y) {
    if (drag) {
      mx = x
      my = y
      this.redraw()
    }
  }
  c.onuiup = function () {
    drag = false
    mx = my = -1
    this.redraw()
  }
  c.redraw()
}

export default { show, HIRA, KATA, ROMA }
