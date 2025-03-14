import type { PlasmoCSConfig } from 'plasmo'
import { Storage } from '@plasmohq/storage'

// 可以匹配多个网址
export const config: PlasmoCSConfig = {
    matches: [
        'https://www.csdn.net/*',
        'https://mp.csdn.net/*',
        'https://editor.csdn.net/*',
        'https://juejin.cn/*',
        'https://www.cnblogs.com/*',
        'https://csdn.net/*',
        'https://uiadmin.net/*',
        'https://mpbeta.csdn.net/*',
    ],
}

// 初始化仓库存储
const storage = new Storage({
    area: 'local',
})

// current web url
var curUrl = window.location.href

// 监听dom变化
const listenDom = () => {
    console.log('all content listen dom remove ad and get juejin category')
    //选择一个需要观察的节点
    var targetNode = document.body
    // 设置observer的配置选项
    var configMutation = { attributes: true, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = (mutationsList, observer) => {
        // const curUrl = window.location.href
        console.log('监听所有页面资源加载完成的脚本', curUrl)
        listenCsdnTitle(curUrl)
        listenCsdnContent(curUrl)
        // clickNum(curUrl)
        if (
            curUrl.includes('mp.csdn.net/mp_blog') ||
            curUrl.includes('csdn.net') ||
            curUrl.includes('mpbeta.csdn.net')
        ) {
            csdnHandle()
        } else if (curUrl.includes('uiadmin.net')) {
            uiadminHandle()
        } else if (
            curUrl.includes('https://juejin.cn/creator/content/column')
        ) {
            getJuejinCategory()
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

// csdn handle
const csdnHandle = () => {
    // clear ad
    csdnClearAd()
    clickClick()
}

// 获取掘金分类
const getJuejinCategory = () => {
    const columnList = document.querySelector('.column-list')
    console.log('掘金分类', columnList)
    // 获取所有 a 标签
    const links = columnList.querySelectorAll('a.column-link')
    // 用于存储结果的数组
    const result = []
    // 遍历每个 a 标签
    links.forEach((link) => {
        // 获取 a 标签的 href 属性
        const href = link.getAttribute('href')
        // 从 href 中提取最后的 ID
        const id = href.split('/').pop() // 获取链接的最后一部分作为 ID
        // 获取 a 标签内 class="title" 的 span 标签中的文字
        const title = link.querySelector('span.title').textContent.trim()
        // 将 ID 和 title 组成对象，并添加到结果数组中
        result.push({
            value: id,
            label: title,
        })
    })
    // 输出结果
    console.log('掘金分类', result)
    storage.setItem('juejincolumn', result)
}

// uiadmin handle
const uiadminHandle = () => {
    console.log('uiadmin handle')
    if (document.querySelector('.v-modal')) {
        ;(document.querySelector('.v-modal') as HTMLElement).style.width = '0px'
        ;(document.querySelector('.v-modal') as HTMLElement).style.height =
            '0px'
    }
    if (
        document.querySelector(
            '#app > div.theme-container > main > div:nth-child(5) > div'
        )
    ) {
        ;(
            document.querySelector(
                '#app > div.theme-container > main > div:nth-child(5) > div'
            ) as HTMLElement
        ).style.width = '0px'
        ;(
            document.querySelector(
                '#app > div.theme-container > main > div:nth-child(5) > div'
            ) as HTMLElement
        ).style.height = '0px'
    }
    if (
        document.querySelector(
            '#app > div.theme-container > main > div:nth-child(4) > div'
        )
    ) {
        ;(
            document.querySelector(
                '#app > div.theme-container > main > div:nth-child(4) > div'
            ) as HTMLElement
        ).style.width = '0px'
        ;(
            document.querySelector(
                '#app > div.theme-container > main > div:nth-child(4) > div'
            ) as HTMLElement
        ).style.height = '0px'
    }
}

// csdn ad clear
const csdnClearAd = () => {
    // console.log('移除垃圾弹窗广告.', document.querySelector('.tip-box'))
    if (document.getElementById('nps-box')) {
        document.getElementById('nps-box').style.display = 'none'
    }
    if (document.querySelectorAll('#moreDiv .el_mcm-form-item')) {
        const formItems = document.querySelectorAll(
            '#moreDiv .el_mcm-form-item'
        )
        formItems.forEach((item: any) => {
            console.log('移除多余form item', item)
            item.style.marginBottom = '0px'
        })
    }
    if (document.querySelector('.tip-box')) {
        const parent = document.querySelector('.tip-box').parentElement
        parent.removeChild(parent.lastElementChild)
    }
    if (document.querySelector('.traffic-show-box')) {
        ;(
            document.querySelector('.traffic-show-box') as HTMLElement
        ).style.display = 'none'
    }
    if (
        document.querySelector(
            '.csdn-profile-bottom > ul > li:nth-child(2) > a'
        )
    ) {
        ;(
            document.querySelector(
                '.csdn-profile-bottom > ul > li:nth-child(2) > a'
            ) as HTMLElement
        ).style.display = 'none'
    }
}

// click input checkbox
const clickClick = () => {
    const checkbox: any =
        document.querySelector(
            '#moreDiv > div:nth-child(8) > div > label > span.el-checkbox__input > input'
        ) ||
        document.querySelector(
            '#moreDiv > div:nth-child(8) > div.el_mcm-form-item__content > label > span.el_mcm-checkbox__input > input'
        )
    if (checkbox.checked === false) {
        checkbox.click()
        console.log('checkbox', checkbox.checked)
    }
}

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
