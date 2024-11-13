import type {
    PlasmoCSConfig,
    PlasmoGetInlineAnchor,
    PlasmoGetOverlayAnchorList,
} from 'plasmo'
import { Storage } from '@plasmohq/storage'
import antdResetCssText from 'data-text:antd/dist/reset.css'
import cssText from 'data-text:~/contents/index.css'
import { Button, Input, Modal, Select } from 'antd'
import { useEffect, useState } from 'react'

export const config: PlasmoCSConfig = {
    matches: ['https://live.douyin.com/*'],
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

// insert into page dom,紧挨着后面
export const getInlineAnchor: PlasmoGetInlineAnchor = () =>
    document.querySelector(`div.cjeyI4Ky > div > div.khbqOfnm`)

// 覆盖到元素上
// export const getOverlayAnchorList: PlasmoGetOverlayAnchorList = async () =>
//     document.querySelectorAll('div.RQFWObp0 > div > div:nth-child(1) > div')

const CustomConfig = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [typeValue, setTypeValue] = useState('sub')
    const [inputValue, setInputValue] = useState('')

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleOk = () => {
        storage.setItem('type', typeValue)
        storage.setItem('value', inputValue)
        location.reload()
        setIsModalOpen(false)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleChange = (value: string) => {
        console.log(`selected ${value}`)
        setTypeValue(value)
        handleInputChange('')
    }

    const handleInputChange = (value: string) => {
        setInputValue(value)
    }

    useEffect(() => {
        storage.getItem('type').then((typeVal) => {
            if (typeVal) {
                setTypeValue(typeVal)
            }
        })
        storage.getItem('value').then((value) => {
            if (value) {
                setInputValue(value)
            }
        })
    }, [])

    return (
        <div>
            <div className="controlBtn" onClick={showModal}>
                抢购
            </div>
            <Modal
                title="抢购配置"
                open={isModalOpen}
                okText="确认"
                cancelText="取消"
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className="labelBox">
                    <span style={{ marginRight: '10px' }}>抢购方式</span>
                    <Select
                        style={{ width: 200 }}
                        value={typeValue}
                        onChange={handleChange}
                        options={[
                            { value: 'sub', label: '原价现价差价' },
                            { value: 'rate', label: '原价现价比例' },
                            { value: 'world', label: '标题关键词匹配' },
                        ]}
                    />
                </div>
                <div
                    className="labelBox"
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        marginTop: '10px',
                    }}
                >
                    <span style={{ marginRight: '10px' }}>抢购条件</span>
                    <Input
                        style={{ width: '200px' }}
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                        placeholder="根据抢购方式填写抢购条件"
                    />
                </div>
            </Modal>
        </div>
    )
}

export default CustomConfig
