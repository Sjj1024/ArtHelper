import type { PlasmoCSConfig } from 'plasmo'

// 可以匹配多个网址
export const config: PlasmoCSConfig = {
  matches: ['https://www.plasmo.com/*']
}

window.addEventListener('load', () => {
  document.body.style.background = 'pink'
})
