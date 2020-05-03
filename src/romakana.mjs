import kanatable from './lib/kanatable.mjs'

const data = {
  タイトル: 'ローマ字とかな JIGAKU',
  対象: '小学3年',
  科目: '国語'
}

if (typeof window !== 'undefined') {
  window.onload = () => kanatable.show(kanatable.ROMA, kanatable.HIRA)
}

export default { data }
