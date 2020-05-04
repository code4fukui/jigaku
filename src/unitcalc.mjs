import jigaku from './lib/jigaku.mjs'

const data = {
  タイトル: 'いろいろ単位電卓 JIGAKU',
  対象: '小学2年/小学3年/小学4年/小学5年/小学6年',
  科目: '算数',
  iconrect: [(1220 - 640) / 2, 0, 640, 640]
}

const UNITS = {
  長さ: {
    km: 1000,
    m: 1,
    cm: 0.1,
    mm: 0.001,
    μm: 0.000001,
    nm: 0.000000001,
    光年: 9460730472580800
  },
  重さ: {
    kg: 1000,
    g: 1,
    mg: 0.001,
    t: 1000000
  },
  広さ: {
    '㎡': 1,
    a: 100,
    ha: 10000,
    'k㎡': 1000000,
    'c㎡': 0.0001,
    坪: 400 / 121
  },
  '量・体積': {
    L: 1,
    dL: 0.1,
    kL: 1000,
    mL: 0.001,
    cc: 0.001,
    'c㎥': 0.001,
    '㎥': 1000
  },
  時間: {
    時間: 60 * 60,
    分: 60,
    秒: 1,
    日: 60 * 60 * 24,
    年: 60 * 60 * 24 * 365,
    世紀: 60 * 60 * 24 * 365 * 100,
    ミリ秒: 0.001
  },
  データ量: {
    byte: 1,
    bit: 1 / 8,
    kbyte: 1024,
    Mbyte: 1024 * 1024,
    Gbyte: 1024 * 1024 * 1024,
    Tbyte: 1024 * 1024 * 1024 * 1024
  },
  単位なし: {
    ' ': 1,
    'd(デシ)': 10,
    'h(ヘクト)': 100,
    'k(キロ)': 1000,
    'M(メガ)': 1000000,
    'G(ギガ)': 1000000000,
    'c(センチ)': 0.1,
    'm(ミリ)': 0.001,
    'μ(マイクロ)': 0.000001,
    'n(ナノ)': 0.000000001
  }
}

const setStyle = function (ele, css) {
  for (const name in css) {
    ele.style[name] = css[name]
  }
}

const show = function () {
  const demo = document.location.hash === '#demo'

  const div = jigaku.createFullElement('div')
  const cr = (tag, parent) => {
    const res = document.createElement(tag)
    parent.appendChild(res)
    return res
  }
  div.style.backgroundColor = 'hsl(210,70%,80%)'
  const main = cr('div', div)
  setStyle(main, { display: 'inline-block', width: '96vw', margin: '30vh 2vw', textAlign: 'center' })

  const cssSelUnit = {
    marginBottom: '5vw',
    height: '5.8vw',
    fontSize: '3.5vw',
    width: '20vw',
    textAlign: 'center'
  }

  const selUnit = cr('select', main)
  for (const u in UNITS) {
    const op = cr('option', selUnit)
    op.textContent = u
    op.units = UNITS[u]
  }
  setStyle(selUnit, cssSelUnit)
  cr('br', main)

  const fontSize = 4
  const inputWidth = 28
  const cssInput = {
    verticalAlign: 'top',
    width: inputWidth + 'vw',
    fontSize: fontSize + 'vw',
    height: '5vw',
    lineHeight: '5vw',
    textAlign: 'right',
    border: '.2vw solid #f0f0f0',
    borderTop: '.2vw solid #c0c0c0',
    borderRight: '.2vw solid #c0c0c0',
    paddingRight: '.5vw',
    borderRadius: '.4vw'
  }
  const cssSelect = {
    margin: '0 .5vw',
    width: '12vw',
    height: '5.8vw',
    fontSize: '3vw',
    backgroundColor: '#f7f7f7',
    verticalAlign: 'top',
    boxSizing: 'border-box',
    lineHeight: '3vw',
    textAlign: 'left'
  }
  const cssSpan = {
    padding: '0 1vw',
    width: '3vw',
    verticalAlign: 'top',
    fontSize: '5vw',
    lineHeight: '5vw',
    textAlign: 'center'
  }
  const in1 = cr('input', main)
  in1.type = 'text'
  setStyle(in1, cssInput)
  const sel1 = cr('select', main)
  setStyle(sel1, cssSelect)

  const span = cr('span', main)
  setStyle(span, cssSpan)
  span.textContent = '='

  const in2 = cr('input', main)
  setStyle(in2, cssInput)
  in2.type = 'text'
  const sel2 = cr('select', main)
  setStyle(sel2, cssSelect)

  const fitSize = function (inp) {
    const s = inp.value
    if (s.length > (inputWidth - 6) / (fontSize / 2)) {
      inp.style.fontSize = inputWidth / s.length * 1.5 + 'vw'
    } else {
      inp.style.fontSize = fontSize + 'vw'
    }
  }
  const decodeE = function (s) {
    if (typeof s === 'number') {
      s = '' + s
    }
    if (s === '999999999999.9999') {
      return 1000000000000
    }
    let num = s.match(/(-?\d)e([+-])(\d+)$/)
    if (num) {
      if (num[2] === '-') {
        let z = '0.'
        for (let i = 1; i < num[3]; i++) {
          z += '0'
        }
        return z + num[1]
      } else {
        let z = ''
        for (let i = 0; i < num[3]; i++) {
          z += '0'
        }
        return num[1] + z
      }
    }
    num = s.match(/(-?\d)\.(\d+)e([+-])(\d+)$/)
    if (!num) { return s }
    if (num[3] === '-') {
      let z = '0.'
      for (let i = 1; i < num[4]; i++) {
        z += '0'
      }
      return z + num[1] + num[2]
    } else {
      let z = ''
      for (let i = num[2].length; i < num[4]; i++) {
        z += '0'
      }
      return num[1] + num[2] + z
    }
  }
  const chg1 = function () {
    in2.value = decodeE(in1.value * sel1.value / sel2.value)
    fitSize(in2)
  }
  in1.onkeyup = in1.onchange = sel1.onchange = sel2.onchange = chg1
  const chg2 = function () {
    in1.value = decodeE(in2.value * sel2.value / sel1.value)
    fitSize(in1)
  }
  in2.onkeyup = in2.onchange = chg2

  const setUnit = function (unit) {
    for (const sel of [sel1, sel2]) {
      sel.innerHTML = ''
      let maxlen = 0
      for (const name in unit) {
        const op = cr('option', sel)
        op.textContent = name
        if (name.length > maxlen) { maxlen = name.length }
        op.value = unit[name]
      }
      if (sel === sel2) {
        sel.children[1].selected = true
      }
      sel.style.fontSize = maxlen > 5 ? '1.7vw' : '3vw'
    }
    chg1()
  }
  selUnit.onchange = function () {
    setUnit(selUnit.children[selUnit.selectedIndex].units)
  }
  selUnit.onchange()

  in1.value = 1
  if (demo) {
    sel1.selectedIndex = 6
    sel2.selectedIndex = 2
  }
  chg1()
}
if (typeof window !== 'undefined') {
  window.onload = () => show()
}

export default { data }
