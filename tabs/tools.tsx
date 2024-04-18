import React, { useEffect, useState } from 'react'
import { Storage } from '@plasmohq/storage'
import './index.scss'
import imgPath from 'url:~/assets/icon.png'
import { Switch, Row, Col } from 'antd'

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
        const show: boolean = await storage.getItem('showUi')
        console.log('show ====', show)
        setShowUi(show)
        const sign: boolean = await storage.getItem('signin')
        console.log('sign ====', sign)
        setSignin(sign)
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
                        <span>屏蔽CSDN广告：</span>
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>屏蔽掘金广告：</span>
                        <Switch
                            checkedChildren="开启"
                            unCheckedChildren="关闭"
                        />
                    </Col>
                    <Col span={6} className="toolItem">
                        <span>屏蔽知乎广告：</span>
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
            </div>
        </>
    )
}

export default DeltaFlyerPage
