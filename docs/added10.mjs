import jigaku from './lib/jigaku.mjs'

const data = {
  タイトル: 'たして10 JIGAKU',
  対象: '小学1年生',
  科目: '算数',
  iconrect: [(1220 - 640) / 2, 0, 640, 640]
}

const rnd = (n) => Math.floor(Math.random() * n);
const sleep = (msec) => new Promise(resolve => setTimeout(resolve, msec));

class Part {
  draw (g) {
  };
  canMove () {
    return false;
  }

  isHit (x, y) {
    return false;
  }

  onDrag (x, y) {
  }

  onTouch (x, y) {
    if (this.resolve) this.resolve();
  }

  async waitTouch () {
    return new Promise((resolve) => this.resolve = resolve);
  }
}

class PartsCanvas {
  constructor () {
    this.parts = [];
    let bkw = 0;
    let bkh = 0;

    const getHitPart = (x, y) => this.parts.find(p => p.isHit && p.isHit(x, y))
    const c = jigaku.createFullCanvas();
    this.c = c;
    c.draw = (g, cw, ch) => {
      if (bkw !== cw || bkh !== ch) {
        this.parts.forEach(p => p.setSize && p.setSize(cw, ch));
        this.bkw = cw;
        this.bkh = ch;
      }
      this.parts.forEach(p => p.update && p.update())
      g.setColor(255, 255, 255)
      g.fillRect(0, 0, cw, ch)
      this.parts.forEach(p => p.update && p.update())
      this.parts.forEach(p => p.draw(g))
    }
    let drag = false;
    c.onuidown = (x, y) => {
      drag = true
      const hit = getHitPart(x, y)
      if (hit && hit.onTouch) {
        hit.onTouch(x, y)
      }
      c.redraw()
    }
    c.onuimove = (x, y) => {
      if (drag) {
        const hit = getHitPart(x, y);
        if (hit && hit.onDrag) {
          hit.onDrag(x, y);
          c.redraw();
        }
      }
    }
    c.onuiup = function () {
      drag = false;
    }
    c.redraw();
  }

  append (part) {
    this.parts.push(part);
    part.c = this.c;
    return part;
  }

  clear () {
    this.parts = [];
  }

  redraw () {
    this.c.redraw();
  }
}

class TextPart extends Part {
  constructor (s, x, y) {
    super();
    this.s = s;
    this.ox = x;
    this.oy = y;
    this.color = "rgb(0,0,0)";
  }

  setSize (w, h) {
    this.sh = w / 30
    this.x = this.ox / 1000 * w;
    this.y = this.oy / 1000 * h;
  }

  isHit (x, y) {
    this.c.g.setFontSize(this.sh)
    const sw = this.c.g.measureText(this.s).width * 1.2
    const sh = this.sh * 1.4
    return jigaku.containsRect(x, y, this.x - sw * .1, this.y - sh / 2, sw, sh)
  }

  draw (g) {
    const { x, y, sh } = this;
    g.setFontSize(sh);
    g.setColor(this.color);
    g.fillText(this.s, x, y + sh / 2)
  }
}

const show = async () => {
  const demo = document.location.hash === '#demo'

  const psys = new PartsCanvas();

  const sound_ok = new Audio("sound/ok.wav");
  const sound_ng = new Audio("sound/ng.wav");

  for (;;) {
    const n = rnd(8) + 1;

    psys.clear();
    psys.append(new TextPart("あてはまる かずだけ ◯をぬりましょう", 200, 300));
    psys.append(new TextPart("10は", 150, 500));
    psys.append(new TextPart("と", 500, 500));
    psys.append(new TextPart("と", 800, 500));

    class NumPart extends TextPart {
      draw (g) {
        super.draw(g);
        const { x, y, sh } = this;
        const sw = sh;
        const bw = sw * 1.5;
        const bh = sh * 1.5;
        g.drawRect(x - bw / 2 + sw / 2, y - bh / 2, bw, bh);
      }
    }

    const d = 80;
    const nbox1 = psys.append(new NumPart(n, 800, 500 - d));
    const nbox2 = psys.append(new NumPart(0, 800, 500 + d));

    const balls = [];
    class FillPart extends TextPart {
      constructor (x, y) {
        super("○", x, y);
        this.fillcolor = `hsl(${rnd(12) * 30},80%,65%)`;
        this.drawcolor = `hsl(${rnd(12) * 30},80%,0%)`;
      }
      setSize (w, h) {
        super.setSize(w, h);
        this.sh *= 3;
      }
      onTouch (x, y) {
        this.s = this.s === "●" ? "○" : "●";
        psys.redraw();
        nbox2.s = balls.reduce((a, b) => a + (b.isFilled() ? 1 : 0), 0);
      }
      draw (g) {
        this.color = this.isFilled() ? this.fillcolor : this.drawcolor;
        super.draw(g);
      }
      isFilled () {
        return this.s === "●";
      }
    }
    class FixFillPart extends FillPart {
      constructor (x, y) {
        super(x, y);
        this.s = "●";
      }
      onTouch (x, y) {
      }
    }
    for (let i = 0; i < 10; i++) {
      if (i < n) {
        psys.append(new FixFillPart(250 + i * 50, 500 - d - 20));
      }
      balls.push(psys.append(new FillPart(250 + i * 50, 500 + d - 20)));
    }

    const chk = psys.append(new TextPart("こたえあわせ！", 700, 800));
    psys.redraw();

    for (;;) {
      await chk.waitTouch();
      if (parseInt(nbox1.s) + parseInt(nbox2.s) === 10) {
        sound_ok.play();
        await sleep(600);
        break;
      } else {
        sound_ng.play();
      }
    }
  }
}

if (typeof window !== 'undefined') {
  window.onload = () => show()
}

export default { data }
