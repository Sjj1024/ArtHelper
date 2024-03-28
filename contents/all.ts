import type { PlasmoCSConfig } from 'plasmo'

// 可以匹配多个网址
export const config: PlasmoCSConfig = {
    matches: [
        'https://www.csdn.net/*',
        'https://mp.csdn.net/*',
        'https://juejin.cn/*',
        'https://www.cnblogs.com/*',
    ],
}

var curUrl = window.location.href

// 监听dom变化
const listenDom = () => {
    console.log('all content listen dom remove ad')
    //选择一个需要观察的节点
    var targetNode = document.body
    // 设置observer的配置选项
    var configMutation = { attributes: true, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = (mutationsList, observer) => {
        // const curUrl = window.location.href
        // console.log('监听所有页面资源加载完成的脚本', curUrl)
        listenCsdnTitle(curUrl)
        listenCsdnContent(curUrl)
        // clickNum(curUrl)
        for (var mutation of mutationsList) {
            // 如果type是childList说明是元素添加或者删除了
            if (mutation.type == 'childList') {
                //  remove csdn ad
                if (curUrl.includes('mp.csdn.net/mp_blog/manage/article')) {
                    // console.log('移除垃圾弹窗广告.', document.querySelector('.tip-box'))
                    if (document.getElementById('nps-box')) {
                        document.getElementById('nps-box').style.display =
                            'none'
                    }
                    if (document.querySelector('.tip-box')) {
                        const parent =
                            document.querySelector('.tip-box').parentElement
                        parent.removeChild(parent.lastElementChild)
                    }
                    if (document.querySelector('.traffic-show-box')) {
                        ;(
                            document.querySelector(
                                '.traffic-show-box'
                            ) as HTMLElement
                        ).style.display = 'none'
                    }
                }

                // document.getElementById('nps-box').style.display = 'none'
            } else if (mutation.type == 'attributes') {
                // console.log('样式发生了变化', mutation)
                if (document.getElementById('nps-box')) {
                    document.getElementById('nps-box').style.display = 'none'
                }
            }
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, configMutation)
}
// 停止观测
// observer.disconnect()

// 监听所有页面加载完成
listenDom()

// 测试点击事件有多少个
var isChangeEventBound = true // 初始化标志变量
const clickHandle = () => {
    console.log('点击了侧边栏')
}
const clickNum = (url: String) => {
    if (url.includes('csdn') && url.includes('editor') && isChangeEventBound) {
        const menuDom = document.querySelector(
            '#view-containe > div > div > div.catlog-guide-box > div'
        )
        if (menuDom) {
            menuDom.addEventListener('click', clickHandle)
            isChangeEventBound = false
        }
    }
}

// 监听标题变化
let addEnable = true
const listenCsdnTitle = (url: String) => {
    if (url.includes('csdn') && url.includes('editor')) {
        const titleInput = document.getElementById('txtTitle')
        // console.log('文章标题dom', titleInput)
        if (titleInput && addEnable) {
            addEnable = false
            titleInput.addEventListener('input', (e: any) => {
                console.log('文章标题发生变化:', e.target.value)
            })
        }
    }
}

// 监听内容变化
let textEnable = true
const listenCsdnContent = (url: String) => {
    if (url.includes('csdn') && url.includes('editor')) {
        const textInput: any = document.querySelector('.cke_wysiwyg_frame')
        const iframeDom = textInput?.contentWindow.document
        const iframeBody = iframeDom?.querySelector('body')
        // console.log('iframe元素', iframeBody?.innerHTML)
    }
}

const listenText = (ele) => {
    // 创建 MutationObserver 对象并传入回调函数
    var curUrl = window.location.href
    const observer = new MutationObserver((mutationsList) => {
        // mutationsList 包含了所有发生的 DOM 改动信息
        listenCsdnContent(curUrl)
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                console.log(`iframe里面属性变化 ${mutation}`)
            } else if (mutation.type === 'childList') {
                console.log('iframe里面节点发生变化')
            }
        }
    })

    // 配置观察选项
    const config = { attributes: true, childList: true }
    // 开始观察目标节点及其后代节点的变化
    observer.observe(ele, config)
}
