import fs from 'fs'
import util from './util.mjs'
import cmd from './cmd.mjs'
import Jimp from 'jimp'

const makeIconFromThumbnail = async function (dstfn, srcfn) { // right-top
  const iconw = 256
  const offx = 922
  const offy = 10
  const capw = 256

  const png = await Jimp.read(srcfn)
  png.crop(offx, offy, capw, capw)
  png.resize(iconw, iconw)
  await png.write(dstfn)
}
const makeIndexHTML = function (list) {
  // <li><a href=hirakata.html><img src=http://fukuno.jig.jp/2012/blocks.jpg><br>小学1年 国語 ひらがなとカタカナ</a></li>
  let html = fs.readFileSync('../template/index.html', 'utf-8')
  const items = []
  for (const i of list) {
    items.push(`<li><a href="${i.URL}"><img src="${i.アイコンURL}"><br>${i.対象} ${i.科目} ${i.タイトル}</a></li>`)
  }
  html = html.replace(/\${list}/g, items.join('\n'))
  fs.writeFileSync('../index.html', html, 'utf-8')
}
const main = async function () {
  const makethumb = false

  const baseurl = 'https://code4fukui.github.io/jigaku/'
  const testbaseurl = 'http://localhost:8888/fukunojigjp/app/jigaku/'

  const list = []
  const mjs = fs.readdirSync('..').filter(f => f.endsWith('.mjs'))
  for (const f of mjs) {
    const data = (await import('../' + f)).default.data
    console.log(data)
    list.push(data)

    const base = f.slice(0, f.length - 4)
    const thumb = base + '-thumb.png'
    const icon = base + '-icon.png'

    let html = fs.readFileSync('../template/template.html', 'utf-8')
    html = html.replace(/\${title}/g, data.タイトル)
    html = html.replace(/\${target}/g, data.対象)
    html = html.replace(/\${type}/g, data.科目)
    html = html.replace(/\${series}/g, data.教材シリーズ名)
    html = html.replace(/\${mjs}/g, f)
    html = html.replace(/\${icon}/g, baseurl + icon)
    html = html.replace(/\${thumbnail}/g, baseurl + thumb)
    console.log(html)
    fs.writeFileSync(`../${base}.html`, html, 'utf-8')

    data.サムネイルURL = baseurl + thumb
    data.アイコンURL = baseurl + icon
    data.URL = baseurl + base + '.html'

    if (makethumb) {
      await cmd.cmd(`node ../../covid19/node/makeogp.mjs ${testbaseurl}${base}.html#demo ../${thumb}`)
      await makeIconFromThumbnail('../' + icon, '../' + thumb)
    }
  }
  util.writeCSV('../index', util.json2csv(list))

  makeIndexHTML(list)
}
main()
