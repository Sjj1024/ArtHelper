import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import './index.scss'
import { Collapse, Button } from 'antd'

// 初始化仓库存储
const storage = new Storage({
    area: 'local',
})

// 显示已经发过的文章缓存
function DeltaFlyerPage() {
    const [text, setText] = useState('')

    const [items, setItems]: any = useState([])

    // 初始化页面数据
    const initData = async () => {
        const articles: [] = await storage.getItem('articles')
        console.log('加载缓存的文章:', articles)
        if (articles && articles.length > 0) {
            const artList = articles.map((item: any, index) => {
                return {
                    key: index,
                    label: item.title,
                    children: <p>{item.content}</p>,
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
    const creatJuejin = () => {
        chrome.windows.create(
            {
                url: 'https://juejin.cn/editor/drafts/new',
                type: 'normal',
                state: 'minimized',
            },
            (win) => {
                console.log('windows创建成功', win)
            }
        )
    }

    useEffect(() => {
        initData()
    }, [])

    return (
        <>
            <div className="titleBox">
                <h2 className="label">缓存的文章列表</h2>
                <Button type="primary" className="btn" onClick={clearData}>
                    清空数据
                </Button>
                <Button type="primary" className="btn" onClick={creatJuejin}>
                    打开掘金
                </Button>
                <Button type="primary" className="btn" onClick={clearData}>
                    给掘金发消息
                </Button>
            </div>
            <Collapse accordion items={items} />
        </>
    )
}

export default DeltaFlyerPage
