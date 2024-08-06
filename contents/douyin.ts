import type { PlasmoCSConfig } from 'plasmo'
import { Storage } from '@plasmohq/storage'

// 可以匹配多个网址
export const config: PlasmoCSConfig = {
    matches: ['https://live.douyin.com/*'],
}

// 本地存储
const storage = new Storage({
    area: 'local',
})

// 是否点击了全部商品
let isClickAll = false
// 是否开始监听商品变化
let listenGoodTimer = null
let goodCanPay = false
let goodKeyList = []
let currentKey = ''
let listenNumber = 0

// inset listBtn into document
const innsetHtml = async () => {
    console.log('listBtns one is ：')
    document.querySelector(
        '#__living_right_panel_id > div > div > div > div > div > div > div > div.S2RN5zDw'
    ).innerHTML = '正在监听商品变化...'
    // 如果没有插入过，才插入这个功能按钮
    if (document.getElementById('listBtn')) {
        console.log('listenBtn is exist')
        // 查询到功能菜单按钮，添加
        return
    }
    // check listBtn is published
    const listBtn = document.createElement('div')
    listBtn.id = 'listBtn'
    listBtn.innerText = '抢购'
    listBtn.style.color = 'white'
    listBtn.style.cursor = 'pointer'
    listBtn.style.fontSize = '20px'
    listBtn.style.border = '1px solid #fff'
    listBtn.style.borderRadius = '5px'
    listBtn.style.padding = '5px 10px'
    listBtn.style.marginRight = '10px'
    listBtn.addEventListener('click', async () => {
        const keyworld: any = await storage.getItem('keyworld')
        var userInput = window.prompt(
            '请输入关键词:(多个以英文逗号分隔)',
            keyworld ?? ''
        )
        if (userInput != null) {
            // 用户输入了数据，可以处理用户输入
            console.log('用户输入的关键词是：', userInput)
            await storage.setItem('keyworld', userInput)
        }
    })
    // 查询到功能菜单按钮，添加
    const menuBox = document.querySelector('#island_b69f5 > div')
    menuBox.prepend(listBtn)
}

// 监听dom变化
const listenDom = () => {
    console.log('all content listen dom remove ad')
    //选择一个需要观察的节点
    var targetNode = document.body
    // 设置observer的配置选项
    var configMutation = { attributes: true, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = (mutationsList, observer) => {
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
        // 监测是否弹出了支付窗口
        var payBox: HTMLElement = document.querySelector(
            'div.v5dad8VL.Qduxj7vP.HeQTjIYM > div.Iog1z8uI.TTWj1Xyq'
        )
        if (payBox && !goodCanPay) {
            goodCanPay = true
            console.log('监听到了支付窗口')
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, configMutation)
}

// 异步执行抢购流程
const runPay = (goodEle: Element) => {
    console.log('start run', goodCanPay)
    return new Promise((resolve, reject) => {
        // 点击去抢购
        const goodBtn: HTMLButtonElement = goodEle.querySelector(
            'div.Y43O6OlD > div.bSqg0Bks > button'
        )
        goodBtn.click()
        // 点击去支付
        const payTimer = setInterval(() => {
            // console.log('payTimer')
            if (goodCanPay) {
                // 支付按钮
                var payBox: HTMLElement = document.querySelector(
                    'div.v5dad8VL.Qduxj7vP.HeQTjIYM > div.Iog1z8uI.TTWj1Xyq'
                )
                console.log('click payBox', payBox)
                if (payBox) {
                    payBox.click()
                    clearInterval(payTimer)
                    // 将关键词从列表中清除掉
                    goodKeyList = goodKeyList.filter(
                        (item: any) => item != currentKey
                    )
                    storage.setItem('keyworld', goodKeyList.join(','))
                    resolve(true)
                } else {
                    console.log('payBox not found')
                    reject(false)
                }
            }
        }, 500)
    })
}

// 获取商品列表和关键词等信息,然后进行匹配
const getGoods = async () => {
    // 获取关键词
    const keyworld: any = await storage.getItem('keyworld')
    goodKeyList = keyworld && keyworld.split(',')
    console.log('keyworldArr', goodKeyList)
    // 获取商品列表
    const goodsList = document.querySelectorAll(
        '#__living_right_panel_id > div > div > div > div > div > div > div > div.H9XscUc1.kcAx6UON > div > ul > li'
    )
    // 遍历所有商品，并获取标题，和关键词匹配
    for (var good of goodsList) {
        console.log('good', goodsList.length)
        const title = good.querySelector(
            'div.Y43O6OlD > div._RVz2Rea.zz01nUtb > span'
        )?.innerHTML
        // 判断标题是否包含关键词
        if (
            goodKeyList.length > 0 &&
            goodKeyList.some((item: any) => {
                var flag = title.includes(item)
                if (flag) {
                    currentKey = item
                }
                return flag
            })
        ) {
            console.log('匹配到了关键词', currentKey)
            console.log('title', title)
            await runPay(good)
        }
    }
}

// 监测去支付按钮，并立即点击支付
const listenPay = () => {
    console.log('start listen pay')
    // 选择一个需要观察的节点
    var payNode: HTMLDivElement = document.querySelector(
        'body > div:nth-child(125) > div.yGW2Oo6H > div.Z769DAb8.k0dJ_ARm > div > div > div.z3O4bsYz.CF11GksI > div.v5dad8VL.Qduxj7vP.HeQTjIYM > div.Iog1z8uI.TTWj1Xyq'
    )
    // 设置observer的配置选项
    payNode.click()
}

// 监听商品变化
const listenGoods = () => {
    console.log('start listen goods')
    // 插入功能按钮
    innsetHtml()
    //选择一个需要观察的节点
    var targetNode = document.querySelector('div.H9XscUc1.kcAx6UON')
    // 设置observer的配置选项
    var configMutation = { attributes: false, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = (mutationsList, observer) => {
        // const curUrl = window.location.href
        // console.log('直播商品发生变化')
        // 获取商品列表
        getGoods()
        // 清空定时器
        listenGoodTimer && clearInterval(listenGoodTimer)
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
        // 失败重新刷新页面: 有可能是没有登录
        // 检测是否登录
        const userBox = document.querySelector('#MS3tMtRG > button > span > p')
        console.log('userBox', userBox?.textContent)
        if (userBox?.textContent !== '登录') {
            window.location.reload()
        } else {
            console.log('用户已经登录')
        }
    }
}

// 监听所有页面加载完成
listenDom()
