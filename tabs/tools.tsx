import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import './index.scss'
import imgPath from 'url:~/assets/icon.png'
import { Switch, Row, Col, Select } from 'antd'
import { juejinCategory, juejinTags } from 'utils/cookie'

// 初始化仓库存储
const storage = new Storage({
    area: 'local',
    // copiedKeyList: ['shield-modulation']
})

// 显示已经发过的文章缓存
function DeltaFlyerPage() {
    // default show ui value
    const [showUi, setShowUi] = useState(false)
    // default signin value
    const [signin, setSignin] = useState(false)
    // default category value
    const [category, setCategory] = useState(0)
    // default tag value
    const [tag, setTag] = useState([])
    // default column value
    const [column, setColumn] = useState([])
    // 掘金全部分类
    const [allColumn, setAllColumn] = useState([])

    // set category value
    const setCategoryValue = (value: any) => {
        console.log('setCategoryValue-----', value)
        setCategory(value)
        storage.setItem('jjDefaultCate', value)
    }

    // set tag value
    const setTagValue = (value: any) => {
        console.log('setTagValue-----', value)
        setTag(value)
        storage.setItem('jjDefaultTag', value)
    }

    // set column value
    const setColumnValue = (value: any) => {
        console.log('setColumnValue-----', value)
        setColumn(value)
        storage.setItem('jjDefaultColumn', value)
    }

    // hand signin action
    const handSignin = async (value: boolean) => {
        console.log('handSignin-----', value)
        setSignin(value)
        await storage.setItem('signin', value)
        const res = await storage.getItem('signin')
    }

    // hand sync helper action show or hide
    const handShow = async (value: boolean) => {
        console.log('handShow-----', value)
        setShowUi(value)
        await storage.setItem('showUi', value)
        const res = await storage.getItem('showUi')
        console.log('res-----', res)
    }

    // init value
    const init = async () => {
        const allColumn: any = await storage.getItem('juejincolumn')
        console.log('allColumn ====', allColumn)
        setAllColumn(allColumn)
        // 设置默认值
        const category: any = await storage.getItem('jjDefaultCate')
        const tag: any = await storage.getItem('jjDefaultTag')
        const column: any = await storage.getItem('jjDefaultColumn')
        setCategory(category)
        setTag(tag)
        setColumn(column)
    }

    useEffect(() => {
        console.log('imgPath-----', imgPath)
        init()
    }, [])

    return (
        <>
            <div className="titleBox">
                <h2 className="label">工具箱</h2>
            </div>
            <div className="toolBox">
                <Row className="toolRow" justify="center" align={'middle'}>
                    <Col span={6} className="toolItem">
                        <span>同步助手操作：</span>
                        <Switch
                            checkedChildren="显示"
                            unCheckedChildren="隐藏"
                            value={showUi}
                            onChange={handShow}
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>掘金自动签到：</span>
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            value={signin}
                            onChange={handSignin}
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>文章相互同步：</span>
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            defaultChecked={false}
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>专栏相互同步：</span>
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                            defaultChecked={false}
                        />
                    </Col>
                </Row>
                <Row className="toolRow" justify="center" align={'middle'}>
                    <Col span={6} className="toolItem">
                        <span>默认分类：</span>
                        <Select
                            style={{ width: 120 }}
                            value={category}
                            onChange={setCategoryValue}
                            options={juejinCategory.map((item) => {
                                return {
                                    value: item.category.category_id,
                                    label: item.category.category_name,
                                }
                            })}
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>默认标签：</span>
                        <Select
                            mode="multiple"
                            maxCount={3}
                            style={{ width: 260 }}
                            value={tag}
                            onChange={setTagValue}
                            options={juejinTags.map((item) => {
                                return {
                                    value: item.tag.tag_id,
                                    label: item.tag.tag_name,
                                }
                            })}
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>默认专栏：</span>
                        <Select
                            mode="multiple"
                            maxCount={1}
                            style={{ width: 150 }}
                            value={column}
                            onChange={setColumnValue}
                            options={allColumn}
                        />
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default DeltaFlyerPage
