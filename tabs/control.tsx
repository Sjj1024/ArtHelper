import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import './index.scss'
import imgPath from 'url:~/assets/icon.png'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Collapse, Button } from 'antd'

// 初始化仓库存储
const storage = new Storage({
    area: 'local',
    // copiedKeyList: ['shield-modulation']
})

// 显示已经发过的文章缓存
function DeltaFlyerPage() {
    const [items, setItems]: any = useState([])

    const genExtra = (item: any) => (
        <div className="syncBox">
            {/* category and tags */}

            <div
                className="syncItem"
                onClick={async (event) => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    console.log('sync to 掘金:', item)
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
                        console.log('sync to 博客园:', item)
                    }}
                />
                <span>博客园</span>
            </div>
            <div
                className="syncItem"
                onClick={(event) => {
                    // If you don't want click extra trigger collapse, you can prevent this:
                    event.stopPropagation()
                    delOne(item)
                }}
            >
                <span>删除</span>
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
                    children: (
                        <div>
                            <div>
                                分类：{item.cate}&nbsp;&nbsp; 标签：
                                {item.tags.map((tag: any) => tag + ',')}
                                &nbsp;&nbsp; 专栏：
                                {item.column.map((column: any) => column + ',')}
                            </div>
                            <p>内容：{item.content}</p>
                        </div>
                    ),
                    extra: genExtra(item),
                }
            })
            setItems(artList)
        } else {
            setItems([])
        }
    }

    // open help document
    const openDoc = async () => {
        window.open(
            'https://xiaoshen.blog.csdn.net/article/details/137928542',
            '_blank'
        )
    }

    // delete one article
    const delOne = async (item: any) => {
        console.log('delete item:', item)
        const articles: [] = await storage.getItem('articles')
        const newArticles = articles.filter(
            (art: any) => art.title !== item.title
        )
        console.log('new articles:', newArticles)
        await storage.setItem('articles', newArticles)
        initData()
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
            console.log('control 获取到的掘金数据:', res)
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
                <h2 className="label">
                    缓存的文章列表(掘金需要先切换到md编辑器)
                </h2>
                <Button type="primary" className="btn" onClick={openDoc}>
                    使用文档
                </Button>
            </div>
            <Collapse accordion items={items} />
        </>
    )
}

export default DeltaFlyerPage
