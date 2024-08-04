import type { PlasmoCSConfig } from 'plasmo'

// 可以匹配多个网址
export const config: PlasmoCSConfig = {
    matches: ['https://live.douyin.com/*'],
}

// 是否点击了全部商品
let isClickAll = false
// 是否开始监听商品变化
let listenGoodTimer = null
let isListenGoods = false
let listenNumber = 0

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
        // console.log('直播页面内容发生变化')
        // 查询全部商品按钮是否存在，存在就点击
        var allGoodsBtn: HTMLElement = document.querySelector(
            'div.YWlxyPHa.ToolbarPlugin > div > div > div:nth-child(2) > div > div'
        )
        if (allGoodsBtn && !isClickAll) {
            allGoodsBtn.click()
            isClickAll = true
            console.log('点击了全部商品')
            listenGoodTimer = setInterval(() => {
                listenGoods()
            }, 1000)
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, configMutation)
}

// 监听商品变化
const listenGoods = () => {
    console.log('start listen goods')
    //选择一个需要观察的节点
    var targetNode = document.querySelector('div.H9XscUc1.kcAx6UON')
    // 设置observer的配置选项
    var configMutation = { attributes: false, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = (mutationsList, observer) => {
        // const curUrl = window.location.href
        console.log('直播商品发生变化')
        listenNumber += 1
        var goodTitle = document.querySelector('div.S2RN5zDw')
        if (goodTitle) {
            goodTitle.innerHTML = '商品标题' + listenNumber
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    try {
        observer.observe(targetNode, configMutation)
        clearInterval(listenGoodTimer)
    } catch (error) {
        console.log('监听商品变化失败', error)
    }
}

// 监听所有页面加载完成
listenDom()

// 先点击全部商品,再监听元素变化
