import kanatable from './lib/kanatable.mjs'

const data = {
  タイトル: 'ひらがなとカタカナ JIGAKU',
  対象: '小学1年',
  科目: '国語'
}

if (typeof window !== 'undefined') {
  window.onload = () => kanatable.show(kanatable.HIRA, kanatable.KATA)
}

export default { data }
