import React, { useState } from 'react'
import './index.scss'
import { Layout, Menu, theme } from 'antd'
import Debug from './debug'
import Control from './control'
import Tools from './tools'
import { GithubOutlined } from '@ant-design/icons'
const { Header, Content, Footer } = Layout

const menus = [
    {
        key: `control`,
        label: `首页`,
        value: <Control />,
    },
    {
        key: `tools`,
        label: `工具箱`,
        value: <Tools />,
    },
    {
        key: `debug`,
        label: `DEBUG`,
        value: <Debug />,
    },
]

// menu item
const App: React.FC = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken()

    // dynamic show component
    const [content, setContent] = useState(<Control />)

    // click menu item
    const clickMenu = (item: any) => {
        const component = menus.find((menu) => menu.key === item.key)?.value
        setContent(component)
    }

    return (
        <Layout className="layout">
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <div className="logoBox">1024写作助手</div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[menus[0].key]}
                    items={menus}
                    onClick={clickMenu}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>
                <div
                    style={{
                        background: colorBgContainer,
                        height: '100%',
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}
                    className="contentBox"
                >
                    {content}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                1024写作助手 ©{new Date().getFullYear()} Created by{' '}
                <a
                    href="https://blog.csdn.net/weixin_44786530?type=blog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform"
                >
                    1024小神
                </a>
                <a
                    href="https://github.com/Sjj1024"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform"
                >
                    <GithubOutlined />
                </a>
                {/* <a
                    href="http://"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="platform"
                >
                    <WechatOutlined />
                </a> */}
            </Footer>
        </Layout>
    )
}

export default App
