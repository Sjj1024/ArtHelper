import { QuestionCircleOutlined } from '@ant-design/icons'
import './assets/index.scss'
import { Select } from 'antd'
import { Checkbox, Divider } from 'antd'
import type { CheckboxProps, GetProp } from 'antd'
import { useState } from 'react'

function IndexPopup() {
    const [data, setData] = useState('')

    const CheckboxGroup = Checkbox.Group

    const plainOptions = [
        'CSDN',
        '掘金',
        '博客园',
        '今日头条',
        '公众号',
        '知乎',
        '简书',
        '思否',
    ]
    const defaultCheckedList = ['CSDN']

    const handleChange = (value: string) => {
        console.log(`selected ${value}`)
    }

    const [checkedList, setCheckedList] = useState<any[]>(defaultCheckedList)

    const checkAll = plainOptions.length === checkedList.length
    const indeterminate =
        checkedList.length > 0 && checkedList.length < plainOptions.length

    const onChange = (list: any[]) => {
        setCheckedList(list)
    }

    const onCheckAllChange: CheckboxProps['onChange'] = (e) => {
        setCheckedList(e.target.checked ? plainOptions : [])
    }

    //  创建缩小版窗口
    const creatWindow = () => {
        chrome.windows.create({
            url: 'https://juejin.cn/',
            state: 'minimized',
        })
    }

    return (
        <div className="popBox">
            {/* 主工作平台 */}
            <div className="mainEdit">
                <div>
                    <span className="mainLabel">主操作平台：</span>
                    <Select
                        defaultValue="csdn"
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={[
                            { value: 'csdn', label: 'CSDN' },
                            { value: 'juejin', label: '掘金' },
                            { value: 'bokeyuan', label: '博客园' },
                        ]}
                    />
                </div>
                <QuestionCircleOutlined
                    className="helps"
                    onClick={creatWindow}
                />
            </div>
            {/* 同步平台控制 */}
            <div className="asyncBox">
                <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                    className="checkAll"
                >
                    同步平台控制
                </Checkbox>
                <CheckboxGroup
                    options={plainOptions}
                    value={checkedList}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default IndexPopup
