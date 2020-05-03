import kanatable from './lib/kanatable.mjs'

const data = {
  教材URL: 'https://code4sabae.github.io/jigaku/',
  提供: '福野泰介の一日一創',
  提供URL: 'https://fukuno.jig.jp/',
  教材シリーズ名: '自学サポートアプリJIGAKUシリーズ',
  タイトル: 'かなとローマ字',
  対象: '小学3年',
  科目: '国語'
}

if (typeof window !== 'undefined') {
  window.onload = () => kanatable.show(kanatable.HIRA, kanatable.ROMA)
}

export default { data }
