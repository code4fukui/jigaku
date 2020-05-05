import fs from 'fs'
import util from './util.mjs'
import cmd from './cmd.mjs'
import Jimp from 'jimp'

const makeIconFromThumbnail = async function (dstfn, srcfn, iconrect) { // right-top
  if (!iconrect) {
    iconrect = [922, 10, 256, 256]
  }
  const iconw = 256
  const offx = iconrect[0]
  const offy = iconrect[1]
  const capw = iconrect[2]
  const caph = iconrect[3]

  const png = await Jimp.read(srcfn)
  png.crop(offx, offy, capw, caph)
  png.resize(iconw, iconw)
  await png.write(dstfn)
}
const makeIndexHTML = function (list, baseurl) {
  const l = url => url.substring(baseurl.length)
  // <li><a href=hirakata.html><img src=http://fukuno.jig.jp/2012/blocks.jpg><br>小学1年 国語 ひらがなとカタカナ</a></li>
  let html = fs.readFileSync('../template/index.html', 'utf-8')
  const items = []
  items.push('<ul id="list" itemscope itemtype="https://schema.org/Course">')
  for (const i of list) {
    items.push(`<li><a itemprop="url" href="${l(i.URL)}"><img itemprop="image" src="${l(i.アイコンURL)}"><br>
      <span itemprop="educationalLevel">${i.対象}</span> <span itemprop="keywords">${i.科目}</span> <span itemprop="name">${i.タイトル}</span></a>
      <span itemprop="thumbnailUrl" value="${l(i.サムネイルURL)}"></span>
      <span itemprop="isPartOf" value="${i.教材URL}"></span>
      <span itemprop="license" value="${i.ライセンス}"></span>
      </li>`)
  }
  items.push('</ul>')
  html = html.replace(/\${list}/g, items.join('\n'))
  fs.writeFileSync('../docs/index.html', html, 'utf-8')
}
const SORT_KEY = { 対象: '小中高特大', 科目: '国算理社外G' }
const sortEducationMaterials = function (dataa, datab) {
  for (const name in SORT_KEY) {
    const a = dataa[name]
    const b = datab[name]
    const sortkey = SORT_KEY[name]
    const n = sortkey.indexOf(a.charAt(0))
    const m = sortkey.indexOf(b.charAt(0))
    if (n !== m) {
      if (n >= 0 && m >= 0) {
        return n - m
      } else if (n < 0) {
        return 1
      } else if (m < 0) {
        return -1
      }
    }
    if (a > b) {
      return 1
    } else if (a < b) {
      return -1
    }
  }
  return 0
}
const main = async function () {
  const baseurl = 'https://code4fukui.github.io/jigaku/'
  const testbaseurl = 'http://localhost:8888/fukunojigjp/app/jigaku/docs/'

  const series = {
    教材URL: 'https://code4fukui.github.io/jigaku/',
    提供: '福野泰介の一日一創',
    提供URL: 'https://fukuno.jig.jp/jigaku',
    教材シリーズ名: '自学サポートアプリJIGAKU',
    ライセンス: 'https://creativecommons.org/licenses/by/4.0/'
  }

  const list = []
  const mjs = fs.readdirSync('../src').filter(f => f.endsWith('.mjs'))
  for (const f of mjs) {
    const data = (await import('../src/' + f)).default.data
    console.log(data)
    list.push(data)

    Object.assign(data, series)

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
    fs.writeFileSync(`../docs/${base}.html`, html, 'utf-8')
    fs.copyFileSync('../src/' + f, '../docs/' + f)

    data.サムネイルURL = baseurl + thumb
    data.アイコンURL = baseurl + icon
    data.URL = baseurl + base + '.html'

    if (util.readFileSync('../docs/' + thumb) == null) {
      await cmd.cmd(`node ../../covid19/node/makeogp.mjs ${testbaseurl}${base}.html#demo ../docs/${thumb}`)
    }
    if (util.readFileSync('../docs/' + icon) == null) {
      await makeIconFromThumbnail('../docs/' + icon, '../docs/' + thumb, data.iconrect)
    }
    delete data.iconrect
  }
  list.sort(sortEducationMaterials)
  util.writeCSV('../docs/index', util.json2csv(list))

  makeIndexHTML(list, baseurl)
}
main()
