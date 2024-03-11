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
        titleDiv.innerText = one.title
        document.body.appendChild(titleDiv)
        const contentDiv = document.createElement('div')
        contentDiv.id = 'contentDiv'
        contentDiv.innerText = one.content
        document.body.appendChild(contentDiv)
        // sendArt = one ? one : articles.length > 0 ? [articles.length - 1] : ''
    }
}

window.onload = () => {
    console.log('middle on load')
    innsetHtml()
}
