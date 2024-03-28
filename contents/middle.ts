// 将store里面的文章加载到html里面，然后由sender将html里面的文章插入到编辑器中
import type { PlasmoCSConfig } from 'plasmo'
import { Storage } from '@plasmohq/storage'

// 可以匹配多个网址
export const config: PlasmoCSConfig = {
    matches: [
        'https://www.csdn.net/*',
        'https://mp.csdn.net/*',
        'https://juejin.cn/*',
        'https://www.cnblogs.com/*',
    ],
}

// 接收发送文章的消息：模拟手动发文章操作
var curUrl = window.location.href
// 本地存储
const storage = new Storage({
    area: 'local',
    // copiedKeyList: ['shield-modulation'],
})

// 页面加载完毕：平台监测和模拟手动操作
const editUrls = [
    'https://juejin.cn/editor/drafts/new?v=2',
    'https://juejin.cn/editor/drafts/new',
]

// check confirm and publish
let confirmPubBtn = null

// listening document change and set windows full
const listenDom = () => {
    //选择一个需要观察的节点
    var targetNode = document.body
    // 设置observer的配置选项
    var configMutation = { attributes: true, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = function (mutationsList, observer) {
        // 监听到文章内容后，就不再监听页面变化了
        if (confirmPubBtn === null) {
            // 检测并获取titleDiv和contentDiv
            const publishDiv: HTMLDivElement = document.querySelector(
                'div.publish-popup > div'
            )
            // console.log('sender listen publishDiv', publishDiv)
            if (publishDiv && publishDiv.style.display !== 'none') {
                console.log('middle listen 元素节点变化', publishDiv)
                confirmPubBtn = publishDiv
                // set windows fullwindows
                showWin()
            }
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, configMutation)
}

// set window full
const showWin = () => {
    let queryOptions = { active: true }
    chrome.tabs.query(queryOptions, ([tab]) => {
        console.log('chrome tabs query tab is', tab)
    })
}

// inset article into document
const innsetHtml = async () => {
    console.log('middle load', curUrl, storage)
    const articles: [] = await storage.getItem('articles')
    const one: any = await storage.getItem('one')
    console.log('articles one is ：', one, articles)
    if (editUrls.includes(curUrl)) {
        // 将文章追加到html中，间接给sender发文章数据
        console.log('articles one is ：', one, articles)
        const titleDiv = document.createElement('div')
        titleDiv.id = 'titleDiv'
        titleDiv.style.display = 'none'
        titleDiv.innerText = one.title
        document.body.appendChild(titleDiv)
        const contentDiv = document.createElement('div')
        contentDiv.id = 'contentDiv'
        contentDiv.style.display = 'none'
        contentDiv.innerText = one.content
        document.body.appendChild(contentDiv)
    }
}

console.log('middle on load')
innsetHtml()

// listen dom change and set windows full
listenDom()
