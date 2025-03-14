import type {
    PlasmoCSConfig,
    PlasmoGetInlineAnchor,
    PlasmoGetShadowHostId,
} from 'plasmo'
import cssText from 'data-text:~/contents/index.scss'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { juejinCategory, juejinTags } from 'utils/cookie'
import { Storage } from '@plasmohq/storage'
import { Select } from 'antd'
import { StyleProvider } from '@ant-design/cssinjs'
import antdResetCssText from 'data-text:antd/dist/reset.css'
import { useEffect, useState } from 'react'

export const config: PlasmoCSConfig = {
    matches: [
        'https://mp.csdn.net/*',
        'https://mpbeta.csdn.net/*',
        'https://editor.csdn.net/*',
    ],
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
export const getInlineAnchor: PlasmoGetInlineAnchor = () => {
    const divMore = document.querySelector(`#moreDiv > div:nth-child(9)`)
    if (divMore) {
        return divMore
    }
    // markdown inline
    const divMarkdown = document.querySelector(`#moreDiv > div:nth-child(9)`)
    if (divMarkdown) {
        return divMarkdown
    }
    return null
}

const PlasmoInline = () => {
    // default category value
    const [category, setCategory] = useState(0)
    // default tag value
    const [tag, setTag] = useState([])
    // default column value
    const [column, setColumn] = useState([])

    // category change
    const cateChange = (value: any) => {
        console.log(`selected handle change`, value)
        setCategory(value)
        storage.setItem('juejinCate', value)
    }

    // tag change 掘金
    const tageChange = (value: any) => {
        console.log('tage selected change', value)
        setTag(value)
        storage.setItem('juejinTag', value)
    }

    // column changejuejinColumn
    const columnChange = (value: any) => {
        console.log('column selected change', value)
        setColumn(value)
        storage.setItem('juejinColumn', value)
    }

    const initValue = () => {
        storage.getItem('jjDefaultCate').then((res: any) => {
            console.log('jjDefaultCate is', res)
            setCategory(res)
            storage.setItem('juejinCate', res)
        })
        storage.getItem('jjDefaultTag').then((res: any) => {
            console.log('jjDefaultTag is', res)
            setTag(res)
            storage.setItem('juejinTag', res)
        })
        storage.getItem('jjDefaultColumn').then((res: any) => {
            console.log('jjDefaultColumn is', res)
            setColumn(res)
            storage.setItem('juejinColumn', res)
        })
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
        setCates(cateList)

        const tagList = juejinTags.map((item) => {
            return {
                label: item.tag.tag_name,
                value: item.tag_id,
            }
        })
        setTags(tagList)

        storage.getItem('juejincolumn').then((res: any) => {
            console.log('juejincolumn list is', res)
            setCols(res)
        })

        console.log('cate list is', cateList)
    }

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
                            value={category}
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
                        value={tag}
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
                        maxCount={1}
                        size="small"
                        value={column}
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
