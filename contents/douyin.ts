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
        // 检测到支付盒子并可以支付了
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
            // 可以支付了，就去点击支付
            if (goodCanPay) {
                // 支付按钮
                var payBox: HTMLElement = document.querySelector(
                    'div.v5dad8VL.Qduxj7vP.HeQTjIYM > div.Iog1z8uI.TTWj1Xyq'
                )
                console.log('click payBox', payBox)
                if (payBox) {
                    payBox.click()
                    clearInterval(payTimer)
                    // 将关键词从列表中清除掉，然后就不会自动购买了
                    storage.setItem('value', '')
                    resolve(true)
                } else {
                    console.log('payBox not found')
                    clearInterval(payTimer)
                    reject(false)
                }
            }
        }, 500)
    })
}

// 根据标题匹配商品执行购买逻辑
const switchTitlePay = async (good, val) => {
    const title = good.querySelector(
        'div.Y43O6OlD > div._RVz2Rea.zz01nUtb > span'
    )?.innerHTML
    goodKeyList = val && val.split(',')
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

// 根据原价和现价的差价购买
const switchSubPay = async (good, val) => {
    console.log('根据原价和现价差价购买')
    const pricePre = good.querySelector(
        'div.Y43O6OlD > div.bSqg0Bks > div > div.h_SMKwrz'
    )?.innerText
    const priceNow = good.querySelector(
        'div.Y43O6OlD > div.bSqg0Bks > div > span'
    )?.innerText
    if (pricePre && priceNow) {
        // pricePre ¥159 ¥59.9
        console.log('pricePre', pricePre, priceNow)
        const pricePreNum = parseFloat(pricePre.replace('¥', ''))
        const priceNowNum = parseFloat(priceNow.replace('¥', ''))
        const sub = pricePreNum - priceNowNum
        if (sub >= val) {
            console.log('差价满足条件', sub)
            await runPay(good)
        }
    }
}

// 根据原价和现价比例购买
const switchRatioPay = async (good, val) => {
    console.log('根据原价和现价比例购买')
    const pricePre = good.querySelector(
        'div.Y43O6OlD > div.bSqg0Bks > div > div.h_SMKwrz'
    )?.innerText
    const priceNow = good.querySelector(
        'div.Y43O6OlD > div.bSqg0Bks > div > span'
    )?.innerText
    if (pricePre && priceNow) {
        // pricePre ¥159 ¥59.9
        console.log('pricePre', pricePre, priceNow)
        const pricePreNum = parseFloat(pricePre.replace('¥', ''))
        const priceNowNum = parseFloat(priceNow.replace('¥', ''))
        const ratio = priceNowNum / pricePreNum
        if (ratio <= val) {
            console.log('比例满足条件', ratio)
            await runPay(good)
        }
    }
}

// 获取商品列表和关键词等信息,然后进行匹配
const getGoods = async () => {
    // 获取商品列表
    const goodsList = document.querySelectorAll(
        '#__living_right_panel_id > div > div > div > div > div > div > div > div.H9XscUc1.kcAx6UON > div > ul > li'
    )
    // 获取监控类型，不同类型执行不同的匹配逻辑
    const monitorType: any = await storage.getItem('type')
    const monitorVal: any = await storage.getItem('value')
    // 遍历所有商品，并获取标题，和关键词匹配
    for (var good of goodsList) {
        console.log('good', goodsList.length)
        // 判断是不是已经抢光
        const soldOut = good.querySelector('div.mAkqt5F0 > div.whVNvRNu')
        if (soldOut && soldOut.innerHTML == '- 已抢光 -') {
            console.log('商品已抢光')
            continue
        }
        if (monitorType == 'world') {
            await switchTitlePay(good, monitorVal)
        } else if (monitorType == 'rate') {
            await switchRatioPay(good, monitorVal)
        } else if (monitorType == 'sub') {
            await switchSubPay(good, monitorVal)
        }
    }
}

// 监听商品变化
const listenGoods = () => {
    console.log('start listen goods')
    //选择一个需要观察的节点
    var targetNode = document.querySelector('div.H9XscUc1.kcAx6UON')
    // 设置observer的配置选项
    var configMutation = { attributes: true, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = (mutationsList, observer) => {
        // const curUrl = window.location.href
        // console.log('直播商品发生变化')
        // 获取商品列表并监测匹配和支付
        getGoods()
        // 清空监测商品列表的定时器，不然第一次可能没有商品列表
        listenGoodTimer && clearInterval(listenGoodTimer)
        listenNumber += 1
        var goodTitle = document.querySelector('div.S2RN5zDw')
        if (goodTitle) {
            goodTitle.innerHTML = '商品变化' + listenNumber
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
