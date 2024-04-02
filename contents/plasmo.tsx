import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo'
import cssText from 'data-text:~/contents/index.css'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { juejinCategory, juejinColumns, juejinTags } from 'utils/cookie'
import { Storage } from '@plasmohq/storage'
import { useEffect } from 'react'

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
    style.textContent = cssText
    return style
}

// insert into page dom
export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector(`#moreDiv > div:nth-child(9)`)

// Use this to optimize unmount lookups
export const getShadowHostId = () => 'plasmo-inline-example-unique-id'

const PlasmoInline = () => {
    // category change
    const cateChange = (value: any) => {
        console.log(`selected handle change`, value.target.value)
        storage.setItem('juejinCate', value.target.value)
    }

    // tag change
    const tageChange = (value: any) => {
        console.log('tage selected change', value.target.value)
        storage.setItem('juejinTag', [value.target.value])
    }

    // column changejuejinColumn
    const columnChange = (value: any) => {
        console.log('column selected change', value.target.value)
        storage.setItem('juejinColumn', [value.target.value])
    }

    // init fun
    const initValue = () => {
        storage.setItem('juejinCate', juejinCategory[0].category_id)
        storage.setItem('juejinTag', [juejinTags[0].tag_id])
        storage.setItem('juejinColumn', [juejinColumns[0].column_id])
    }

    // init reset cate tag and column value
    useEffect(() => {
        initValue()
    }, [])

    return (
        <div className="juejinBox">
            <span>
                掘金配置 <QuestionCircleOutlined />
            </span>
            {/* seleted  juejin category and tages and store*/}
            <div className="selectBox">
                <div className="category">
                    <label htmlFor="cate">分类:</label>
                    <select id="cate" name="cate" onChange={cateChange}>
                        {juejinCategory.map((item) => {
                            return (
                                <option
                                    value={item.category_id}
                                    key={item.category_id}
                                >
                                    {item.category.category_name}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="category">
                    <label htmlFor="tages">标签:</label>
                    <select id="tages" name="tages" onChange={tageChange}>
                        {juejinTags.map((item) => {
                            return (
                                <option value={item.tag_id} key={item.tag_id}>
                                    {item.tag.tag_name}
                                </option>
                            )
                        })}
                    </select>
                </div>
                <div className="category">
                    <label htmlFor="column">专栏:</label>
                    <select id="column" name="column" onChange={columnChange}>
                        {juejinColumns.map((item) => {
                            return (
                                <option
                                    value={item.column_id}
                                    key={item.column_id}
                                >
                                    {item.column_version.title}
                                </option>
                            )
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default PlasmoInline
