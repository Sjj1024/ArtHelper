import type { PlasmoCSConfig } from 'plasmo'

// 可以匹配多个网址
const matchList = ['https://juejin.cn/editor/drafts/*']
export const config: PlasmoCSConfig = {
    matches: matchList,
    world: 'MAIN',
    run_at: 'document_end',
}

// 接收发送文章的消息：模拟手动发文章操作
var curUrl = window.location.href
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
        // 监听到文章内容后，就不再监听页面变化了
        if (editModul === null) {
            for (var mutation of mutationsList) {
                // 检测并获取titleDiv和contentDiv
                const titleDiv = document.getElementById('titleDiv')
                const contentDiv = document.getElementById('contentDiv')
                if (
                    mutation.type == 'childList' &&
                    editModul === null &&
                    titleDiv &&
                    contentDiv
                ) {
                    console.log(
                        'sender listen 元素节点变化',
                        titleDiv,
                        contentDiv
                    )
                    juejin(titleDiv.innerText, contentDiv.innerText)
                } else {
                    // console.log('sender listen 样式属性变化')
                }
            }
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, configMutation)
}

window.onload = () => {
    listenDom()
    // 模拟两秒发送一次
    // setInterval(urlSave, 3000)
}

// 模拟掘金发文章操作
const juejin = (title, content) => {
    // 判断是同步一篇还是同步多篇
    // 检测是不是markdown编辑模式:不是的话要调整到markdown模式
    const markdownEditor = document.querySelector('.bytemd-status-right')
    const titleInput: any = document.querySelector('.title-input')
    const contnetDiv: any = document.querySelector('.CodeMirror')
    if (markdownEditor && titleInput && contnetDiv) {
        console.log('开始编辑文章', titleInput, contnetDiv)
        titleInput.value = title
        // contnetDiv.innerHTML = '我是文章内容'
        try {
            contnetDiv.CodeMirror.setValue(content)
            editModul = true
        } catch (error) {
            console.log('赋值文章内容出错')
        }
    } else {
        console.log('富文本模式，需要切换到markdownEditor')
        // const toggleBtn = document.querySelector('.toggle-btn') as HTMLElement
        // const confirm = document.querySelector('.confirm-btn') as HTMLElement
        // toggleBtn && toggleBtn.click()
        // confirm && confirm.click()
    }
}

// 发送替换图片url的请求
const urlSave = () => {
    // 可以使用fetch替换csdn的文章里面图片链接
    fetch('https://juejin.cn/image/urlSave', {
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua':
                '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
        },
        referrer: 'https://juejin.cn/editor/drafts/7344970197130428455',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: '{"url":"https://img-blog.csdnimg.cn/direct/9943cd2cdf394f5c94502b194d00f250.png"}',
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    })
}
