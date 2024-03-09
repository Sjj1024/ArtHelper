import type { PlasmoCSConfig } from 'plasmo'
import { Storage } from '@plasmohq/storage'

// 可以匹配多个网址
const matchList = ['https://juejin.cn/editor/drafts/*', 'https://mp.csdn.net/*']
export const config: PlasmoCSConfig = {
  matches: matchList
  //   world: 'MAIN'
  //   run_at: 'document_end'
}

// 接收发送文章的消息：模拟手动发文章操作
var curUrl = window.location.href
// 本地存储
const storage = new Storage({
  area: 'local',
  copiedKeyList: ['shield-modulation']
})

// 当前要发送的文章
let sendArt = null
// 是不是已经在md编辑模式了，是的话，就不要监听dom变化了
let editModul = null

// 监听dom变化
const listenDom = () => {
  //选择一个需要观察的节点
  var targetNode = document.body
  // 设置observer的配置选项
  var configMutation = { attributes: true, childList: true, subtree: true }
  // 当节点发生变化时的需要执行的函数
  var callback = function (mutationsList, observer) {
    // console.log('监听所有页面资源加载完成的脚本', curUrl)
    // clickNum(curUrl)
    for (var mutation of mutationsList) {
      // 如果type是childList说明是元素添加或者删除了
      if (mutation.type == 'childList' && editModul === null) {
        console.log('元素节点变化')
        juejin()
      } else {
        console.log('样式属性变化')
      }
    }
  }
  // 创建一个observer示例与回调函数相关联
  var observer = new MutationObserver(callback)
  //使用配置文件对目标节点进行观测
  observer.observe(targetNode, configMutation)
}

// 页面加载完毕：平台监测和模拟手动操作
const editUrls = [
  'https://juejin.cn/editor/drafts/new?v=2',
  'https://juejin.cn/editor/drafts/new'
]

const main = async () => {
  storage
    .setItem('one', { title: '文章标题', content: '文章内容' })
    .then(() => {
      storage.getItem('one').then((val) => {
        console.log('get one is ', val)
      })
    })
  console.log('Sender load', curUrl, storage)
  const articles: [] = await storage.getItem('articles')
  const one = await storage.getItem('one')
  console.log('articles one is ：', chrome.runtime, articles, one)
  if (editUrls.includes(curUrl)) {
    // 监听dom发生变化
    listenDom()
    // 获取同步一篇还是多篇
    const articles: [] = await storage.getItem('articles')
    const one = await storage.getItem('one')
    console.log('articles one is ：', one, articles)
    // sendArt = one ? one : articles.length > 0 ? [articles.length - 1] : ''
  }
}

window.onload = async () => {
  console.log('run on onload')
  await main()
}

// 模拟掘金发文章操作
const juejin = () => {
  // 判断是同步一篇还是同步多篇
  // 检测是不是markdown编辑模式:不是的话要调整到markdown模式
  const markdownEditor = document.querySelector('.bytemd-status-right')
  const titleInput: any = document.querySelector('.title-input')
  const contnetDiv: any = document.querySelector('.CodeMirror')
  if (markdownEditor && titleInput && contnetDiv) {
    console.log('开始编辑文章', titleInput, contnetDiv)
    titleInput.value = 'sendArt.title'
    // contnetDiv.innerHTML = '我是文章内容'
    try {
      contnetDiv.CodeMirror.setValue('12143124123')
      editModul = true
    } catch (error) {
      console.log('赋值文章内容出错')
    }
  } else {
    // console.log('富文本模式，需要切换到markdownEditor')
    const toggleBtn = document.querySelector('.toggle-btn') as HTMLElement
    const confirm = document.querySelector('.confirm-btn') as HTMLElement
    toggleBtn && toggleBtn.click()
    confirm && confirm.click()
  }
}
