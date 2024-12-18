import type {
    PlasmoCSConfig,
    PlasmoGetInlineAnchor,
    PlasmoGetShadowHostId,
} from 'plasmo'
import cssText from 'data-text:~/contents/index.scss'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { juejinCategory, juejinColumns, juejinTags } from 'utils/cookie'
import { Storage } from '@plasmohq/storage'
import { Select } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import antdResetCssText from 'data-text:antd/dist/reset.css'
import { useEffect, useState } from 'react'

export const config: PlasmoCSConfig = {
    matches: ['https://mp.csdn.net/*'],
}

// 初始化仓库存储
const storage = new Storage({
    area: 'local',
})

// load style file
export const getStyle = () => {
    const style = document.createElement('style')
    style.textContent = antdResetCssText + cssText
    return style
}

const HOST_ID = 'engage-csui'

export const getShadowHostId: PlasmoGetShadowHostId = () => HOST_ID

// insert into page dom
export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector(`#moreDiv > div:nth-child(9)`)

// Use this to optimize unmount lookups
// export const getShadowHostId = () => 'plasmo-inline-example-unique-id'

const PlasmoInline = () => {
    // category change
    const cateChange = (value: any) => {
        console.log(`selected handle change`, value)
        storage.setItem('juejinCate', value)
    }

    // tag change
    const tageChange = (value: any) => {
        console.log('tage selected change', value)
        storage.setItem('juejinTag', value)
    }

    // column changejuejinColumn
    const columnChange = (value: any) => {
        console.log('column selected change', value)
        storage.setItem('juejinColumn', value)
    }

    // init fun
    const defaultCate = juejinCategory[1].category_id
    const defaultTag = [juejinTags[0].tag_id, juejinTags[2].tag_id]
    const defaultColumn = [juejinColumns[5].column_id]
    const initValue = () => {
        storage.setItem('juejinCate', defaultCate)
        storage.setItem('juejinTag', defaultTag)
        storage.setItem('juejinColumn', defaultColumn)
    }

    // set select default value
    const [cates, setCates] = useState([])
    const [tags, setTags] = useState([])
    const [cols, setCols] = useState([])
    const setOptions = () => {
        const cateList = juejinCategory.map((item) => {
            return {
                label: item.category.category_name,
                value: item.category_id,
            }
        })
        const tagList = juejinTags.map((item) => {
            return {
                label: item.tag.tag_name,
                value: item.tag_id,
            }
        })
        const colList = juejinColumns.map((item) => {
            return {
                label: item.column_version.title,
                value: item.column_id,
            }
        })
        console.log('cate list is', cateList)
        setCates(cateList)
        setTags(tagList)
        setCols(colList)
    }

    const options = [
        {
            label: 'China',
            value: 'china',
            emoji: '🇨🇳',
            desc: 'China (中国)',
        },
        {
            label: 'USA',
            value: 'usa',
            emoji: '🇺🇸',
            desc: 'USA (美国)',
        },
        {
            label: 'Japan',
            value: 'japan',
            emoji: '🇯🇵',
            desc: 'Japan (日本)',
        },
        {
            label: 'Korea',
            value: 'korea',
            emoji: '🇰🇷',
            desc: 'Korea (韩国)',
        },
    ]

    // init reset cate tag and column value
    useEffect(() => {
        initValue()
        setOptions()
    }, [])

    return (
        <div className="juejinBox">
            <span className="labelBox">
                <span className="label">掘金配置</span>{' '}
                <QuestionCircleOutlined />
            </span>
            {/* seleted  juejin category and tages and store*/}

            <div className="selectBox">
                <div className="category">
                    <label htmlFor="cate" className="cate">
                        分类:
                    </label>
                    <StyleProvider
                        container={document.getElementById(HOST_ID).shadowRoot}
                    >
                        <Select
                            defaultValue={defaultCate}
                            style={{ width: 110 }}
                            size="small"
                            onChange={cateChange}
                            options={cates}
                        />
                    </StyleProvider>
                </div>
                <div className="category">
                    <label htmlFor="cate" className="cate">
                        标签:
                    </label>
                    <Select
                        defaultValue={defaultTag}
                        className="tagBox"
                        mode="multiple"
                        maxCount={3}
                        size="small"
                        style={{ width: 240 }}
                        onChange={tageChange}
                        options={tags}
                    />
                </div>
                <div className="category">
                    <label htmlFor="cate" className="cate">
                        专栏:
                    </label>
                    <Select
                        mode="multiple"
                        maxCount={3}
                        size="small"
                        defaultValue={defaultColumn}
                        style={{ width: 124 }}
                        onChange={columnChange}
                        options={cols}
                    />
                </div>
            </div>
        </div>
    )
}

export default PlasmoInline
