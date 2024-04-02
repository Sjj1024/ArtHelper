import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import './index.scss'
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
                state: 'minimized',
                // state: 'maximized',
            },
            (win) => {
                console.log('windows创建成功', win)
                storage.setItem('juejinWin', win.id)
                // 5 second after close win
                // setTimeout(() => {
                //     chrome.windows.remove(win.id)
                // }, 19000)
            }
        )
    }

    // get juejin category data
    const getJuejin = async () => {
        storage.getItem('juejinCate').then((res: any) => {
            console.log('获取到的掘金数据:', res)
        })
    }

    useEffect(() => {
        initData()
        // get juejin category data
        getJuejin()
    }, [])

    return (
        <>
            <div className="titleBox">
                <h2 className="label">缓存的文章列表</h2>
                <Button type="primary" className="btn" onClick={clearData}>
                    清空数据
                </Button>
                {/* <Button type="primary" className="btn">
                    打开掘金
                </Button> */}
                <Button type="primary" className="btn" onClick={clearData}>
                    给掘金发消息
                </Button>
            </div>
            <Collapse accordion items={items} />
        </>
    )
}

export default DeltaFlyerPage
