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
// article title
let title = null
// 当前要发送的文章
let sendArt: string | null = null
// all csdn image url
let csdnImg = null
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
                    console.log('sender listen 元素节点变化')
                    title = titleDiv.innerText
                    sendArt = contentDiv.innerText
                    // 找到所有的图片链接
                    findImg(sendArt)
                    // 给编辑器赋值
                    juejin(title, sendArt)
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

// find all img url
const findImg = (content: string) => {
    // console.log('findimg content is', content)
    const reImg = new RegExp(/<img.*?src="(.*?)"/g)
    var imgTags = content.match(reImg)
    console.log('re content img tag are', imgTags)
    if (imgTags) {
        let urls = imgTags.map((url) => {
            return url.match(/\ssrc=['"](.*?)['"]/)[1]
        })
        console.log('all image url is', urls)
        // 等监听到url变为文章的url后，将所有的url替换为掘金的图片地址
        csdnImg = urls
    }
}

// 监听url变化了
const listenUrl = () => {
    // https://juejin.cn/editor/drafts/7347165355586125861
    let timer = setInterval(() => {
        // re end num
        const url = window.location.href
        if (url.length > 40 && csdnImg) {
            console.log('has listen true url is', url)
            timer && clearInterval(timer)
            // replace all csdn image url
            let taskPromise = csdnImg.map((url) => {
                return urlSave(url)
            })
            Promise.all(taskPromise).then((res) => {
                const tid = url.split('/')[url.split('/').length - 1]
                console.log('send article content is', tid)
                // reset title and content
                juejin(title, sendArt)
                // click publish btn
                handlePub()
            })
        }
    }, 500)
}

// handle publish action
const handlePub = () => {
    // find publish btn
    const pubBtn: HTMLButtonElement = document.querySelector(
        'div.publish-popup > button'
    )
    pubBtn && pubBtn.click()
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
        // call change and blur
        // titleInput.change()
        var event = new Event('input', { bubbles: true })
        titleInput.dispatchEvent(event)
        // var changeEvent = new Event('change', { bubbles: true });
        // titleInput.dispatchEvent(changeEvent);
        // titleInput.blur()
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
const urlSave = (url) => {
    // 可以使用fetch替换csdn的文章里面图片链接
    return fetch('https://juejin.cn/image/urlSave', {
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
        referrer: window.location.href,
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `{"url":"${url}"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    }).then(async (res) => {
        let data = await res.json()
        console.log('replace response json is', data)
        // 如果成功，就替换文章里面的链接
        sendArt = sendArt.replaceAll(url, data.data)
        // console.log('send article content is', sendArt)
    })
}

// send background message


// juejin listen dom and set title and content
listenDom()
// listen url change get true url
listenUrl()
