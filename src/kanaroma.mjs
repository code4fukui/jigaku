import kanatable from './lib/kanatable.mjs'

const data = {
  タイトル: 'かなとローマ字 JIGAKU',
  対象: '小学3年',
  科目: '国語'
}

if (typeof window !== 'undefined') {
  window.onload = () => kanatable.show(kanatable.HIRA, kanatable.ROMA)
}

export default { data }
