import kanatable from './lib/kanatable.mjs'

const data = {
  タイトル: 'カタカナとひらがな JIGAKU',
  対象: '小学1年',
  科目: '国語'
}

if (typeof window !== 'undefined') {
  window.onload = () => kanatable.show(kanatable.KATA, kanatable.HIRA)
}

export default { data }
