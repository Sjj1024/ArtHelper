import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import './index.scss'
import someImage from 'data-base64:~assets/icon.png'
import imgPath from 'url:~/assets/icon.png'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Collapse, Button } from 'antd'

// 初始化仓库存储
const storage = new Storage({
    area: 'local',
    // copiedKeyList: ['shield-modulation']
})

// chrome.storage.local.set({ 'shield-modulation': '11111111111' })

// 显示已经发过的文章缓存
function DeltaFlyerPage() {
    const [text, setText] = useState('')

    const [items, setItems]: any = useState([])

    const genExtra = (item: any) => (
        <div className="syncBox">
            <div
                className="syncItem"
                onClick={async (event) => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    console.log('点击了一篇文章:', item)
                    // save to local storage and creat juejin window
                    await storage.setItem('one', item)
                    creatJuejin('https://juejin.cn/editor/drafts/new')
                }}
            >
                <ArrowRightOutlined />
                <span>掘金</span>
            </div>
            <div className="syncItem">
                <ArrowRightOutlined
                    onClick={(event) => {
                        // If you don't want click extra trigger collapse, you can prevent this:
                        event.stopPropagation()
                        console.log('点击了一篇文章:', item)
                    }}
                />
                <span>博客园</span>
            </div>
        </div>
    )

    // 初始化页面数据
    const initData = async () => {
        const articles: [] = await storage.getItem('articles')
        console.log('加载缓存的文章:', storage, articles)
        if (articles && articles.length > 0) {
            const artList = articles.map((item: any, index) => {
                return {
                    key: index,
                    label: item.title,
                    children: <p>{item.content}</p>,
                    extra: genExtra(item),
                }
            })
            setItems(artList)
        }
    }

    // 清空数据
    const clearData = async () => {
        await storage.removeItem('articles')
        setItems([])
    }

    // get data from local storage
    const getSyncs = async () => {
        const platforms = await storage.get('platforms')
        console.log('platforms-----', platforms)
    }

    // 给掘金发消息
    const sendMessage = () => {
        console.log('给掘金发消息')
        // chrome.tabs.sendMessage(
        //   tabId: 12132,
        //   message: "any",
        //   callback: ()=>{},
        // )
    }

    // 创建掘金tab
    const creatJuejin = (url?: string) => {
        chrome.windows.create(
            {
                url: url,
                type: 'normal',
                // state: 'minimized',
                state: 'maximized',
            },
            (win) => {
                console.log('windows创建成功', win)
                storage.setItem('juejinWin', win.id)
            }
        )
    }

    // get juejin category data
    const getJuejin = async () => {
        storage.getItem('juejinCate').then((res: any) => {
            console.log('获取到的掘金数据:', res)
        })
    }

    // change action icon
    const setIcon = () => {
        const canvas = new OffscreenCanvas(16, 16)
        const context = canvas.getContext('2d')
        context.clearRect(0, 0, 16, 16)
        context.fillStyle = '#00FF00' // Green
        context.fillRect(0, 0, 16, 16)
        const imageData = context.getImageData(0, 0, 16, 16)
        chrome.action.setIcon({ imageData: imageData }, () => {
            console.log('set icon callback')
        })
    }

    // set custom icon
    const setPngIcon = () => {
        var img = new Image()
        img.onload = function () {
            const canvas = new OffscreenCanvas(16, 16)
            const context = canvas.getContext('2d')
            context.drawImage(img, 0, 0, 16, 16)
            const imageData = context.getImageData(0, 0, 16, 16)
            chrome.action.setIcon({ imageData: imageData }, () => {
                console.log('set icon callback')
            })
        }
        img.src = someImage
    }

    // test set img path
    const setPngPath = () => {
        chrome.action.setIcon({ path: imgPath }, () => {
            console.log('set icon callback')
        })
    }

    // set badge action
    const setBadge = () => {
        chrome.action.setBadgeText({ text: '1' }, () => {
            console.log('set badge text callback')
        })
        chrome.action.setBadgeBackgroundColor(
            { color: '#00FF00' }, // Also green
            () => {
                console.log('set badge callback')
            }
        )
    }

    // set badge action
    const setBadgeHide = () => {
        chrome.action.setBadgeText({ text: '' }, () => {
            console.log('set badge text callback')
        })
        chrome.action.setBadgeBackgroundColor(
            { color: '#00FF00' }, // Also green
            () => {
                console.log('set badge callback')
            }
        )
    }

    // setTitle
    const setTitle = () => {
        chrome.action.setTitle({ title: '自定义标题' }, () => {
            console.log('set title callback')
        })
    }

    useEffect(() => {
        initData()
        // get juejin category data
        getJuejin()
        // see image
        console.log('imgPath-----', imgPath)
    }, [])

    return (
        <>
            <div className="titleBox">
                <h2 className="label">缓存的文章列表</h2>
                <Button type="primary" className="btn" onClick={clearData}>
                    清空数据
                </Button>
                <Button type="primary" className="btn" onClick={setIcon}>
                    改变ICON
                </Button>
                <Button type="primary" className="btn" onClick={setPngIcon}>
                    CanvasPNG
                </Button>
                <Button type="primary" className="btn" onClick={setPngPath}>
                    设置源PNG
                </Button>
                <Button type="primary" className="btn" onClick={setTitle}>
                    改变Title
                </Button>
                <Button type="primary" className="btn" onClick={setBadge}>
                    SetBadge
                </Button>
                <Button type="primary" className="btn" onClick={setBadgeHide}>
                    HideBadge
                </Button>
                {/* <Button type="primary" className="btn">
                    打开掘金
                </Button> */}
                <Button type="primary" className="btn" onClick={getSyncs}>
                    Get Syncs
                </Button>
                {/* <img src={someImage} alt="" /> */}
            </div>
            <Collapse accordion items={items} />
        </>
    )
}

export default DeltaFlyerPage
