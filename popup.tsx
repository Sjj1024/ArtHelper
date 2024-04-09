import { QuestionCircleOutlined } from '@ant-design/icons'
import './assets/index.scss'
import { Select } from 'antd'
import { Storage } from '@plasmohq/storage'
import { Checkbox } from 'antd'
import type { CheckboxProps } from 'antd'
import { useEffect, useState } from 'react'
import { hasCookie } from './utils/cookie'
import { sendToBackground } from '@plasmohq/messaging'

function IndexPopup() {
    // 本地存储
    const storage = new Storage({
        area: 'local',
        copiedKeyList: ['shield-modulation'],
    })
    // 主发文平台
    const [main, setMain] = useState('')
    // 同步平台的名称列表
    const CheckboxGroup = Checkbox.Group

    // 可选平台列表：value是编辑文章的网站地址，cooid：用户登录后的校验id，edit：用户编辑文章的地址，login：用户登录地址，
    const platList = [
        {
            label: 'CSDN',
            value: 'https://mp.csdn.net',
            cookid: 'UserToken',
            edit: 'https://mp.csdn.net/mp_blog/creation/editor',
            login: 'https://passport.csdn.net/login?code=applets',
            desc: 'China (中国)',
        },
        {
            label: '掘金',
            value: 'https://juejin.cn',
            cookid: 'sid_ucp_v1',
            edit: 'https://juejin.cn/editor/drafts/new',
            login: 'https://juejin.cn/login',
            desc: 'USA (美国)',
        },
        {
            label: '博客园',
            value: 'https://i.cnblogs.com',
            cookid: '.CNBlogsCookie',
            edit: 'https://i.cnblogs.com/posts/edit',
            login: 'https://account.cnblogs.com/signin',
            desc: 'Japan (日本)',
        },
        {
            label: '知乎',
            value: 'https://zhihu.com',
            cookid: 'z_c0',
            edit: 'https://zhuanlan.zhihu.com/write',
            login: 'https://www.zhihu.com/signin',
            desc: 'Korea (韩国)',
        },
    ]

    // 可同步平台列表
    const [platOptions, setPlatOptions] = useState(platList)

    // const platOptions = [
    //     'CSDN',
    //     '掘金',
    //     '博客园',
    //     '今日头条',
    //     '公众号',
    //     '知乎',
    //     '简书',
    //     '思否',
    // ]
    // const defaultCheckedList = ['https://juejin.cn/editor/drafts/new?v=2']

    // 可以选中还是打开登录页
    const handleCheck = async (domain: string) => {
        const curPlat = platOptions.find((item) => item.value === domain)
        const isLogin = await hasCookie(curPlat.value, curPlat.cookid)
        console.log('是否登录', isLogin)
        if (isLogin) {
            return true
        } else {
            // 打开掘金的登录页面
            chrome.tabs.create({
                url: curPlat.login,
            })
            return false
        }
    }

    // 主操作平台改变
    const handleChange = async (value: string) => {
        console.log(`selected ${value}`)
        // 判断主平台是否登录，登录后才可以选择，没有登陆跳转到登录页
        if (handleCheck(value)) {
            setMain(value)
            storage.set('main', value)
        }
    }

    // 同步平台列表
    const [checkedList, setCheckedList] = useState<any[]>([])

    const checkAll = platOptions.length === checkedList.length
    const indeterminate =
        checkedList.length > 0 && checkedList.length < platOptions.length

    // 同步平台选择变化
    const onChange = async (list: any[]) => {
        console.log('items are ', list)
        let enableItem = []
        let fnPromise = list.map((item) => {
            return handleCheck(item)
        })
        Promise.all(fnPromise).then((res) => {
            console.log('判断结果是', res)
            res.forEach((item, index) => {
                item && enableItem.push(list[index])
            })
            setCheckedList(enableItem)
            console.log('存储的platforms:', enableItem)
            storage.set('platforms', enableItem)
        })

        // asyncPlat()
    }

    // 选择了所有的同步平台
    const onCheckAllChange: CheckboxProps['onChange'] = async (e) => {
        console.log('check all', e.target.checked)
        let enableItem = []
        if (e.target.checked) {
            platOptions.forEach(async (item) => {
                if (await handleCheck(item.value)) {
                    enableItem.push(item)
                }
            })
            setCheckedList(enableItem)
            await storage.set('platforms', enableItem)
        } else {
            setCheckedList([])
        }
        // asyncPlat()
    }

    //  创建缩小版窗口:根据选中的同步平台变化来定
    const creatWindow = () => {
        // chrome.tabs.query({ windowType: 'normal' }, (tabs) => {
        //     console.log('查询到的窗口是', tabs)
        // })
        // chrome.cookies.getAll({ url: 'https://www.zhihu.com' }, (cookie) => {
        //     console.log('检测到cookie值', cookie)
        // })
        chrome.tabs.create({ url: './tabs/first.html' })
        // asyncPlat()
    }

    // 通知：同步列表变化
    const asyncPlat = async () => {
        const resp = await sendToBackground({
            name: 'ping',
            body: {
                id: 123,
            },
        })
        console.log(resp)
    }

    // 改变同步平台列表
    const changePlat = async () => {
        const getMain = await storage.get('main')
        console.log('getMain is ', getMain)
        if (getMain) {
            setMain(getMain)
            const plats = platList.filter((item) => item.value !== getMain)
            setPlatOptions(plats)
            console.log('main and plats is ', getMain, platOptions)
        }
        // 同步已经选择的平台
        const getPlat: string[] = await storage.get('platforms')
        console.log('获取到默认选择同步平台是', getPlat)
        if (getPlat && getPlat.length > 0) {
            setCheckedList(getPlat)
        }
    }

    // useEffect(() => {
    //     changePlat()
    // }, [])

    useEffect(() => {
        console.log('主操作平台变化')
        changePlat()
    }, [main])

    return (
        <div className="popBox">
            {/* 主工作平台 */}
            <div className="mainEdit">
                <div>
                    <span className="mainLabel">主写作平台：</span>
                    <Select
                        value={main}
                        style={{ width: 120 }}
                        onChange={handleChange}
                        options={platList}
                    />
                </div>
                <QuestionCircleOutlined
                    className="helps"
                    onClick={creatWindow}
                />
            </div>
            {/* 同步平台控制 */}
            <div className="asyncBox">
                {/* <Checkbox
                    indeterminate={indeterminate}
                    onChange={onCheckAllChange}
                    checked={checkAll}
                    className="checkAll"
                >
                    同步平台控制
                </Checkbox> */}
                <span className="checkAll">同步平台选择</span>
                <CheckboxGroup
                    options={platOptions}
                    value={checkedList}
                    onChange={onChange}
                />
            </div>
        </div>
    )
}

export default IndexPopup
