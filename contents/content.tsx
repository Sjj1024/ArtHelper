import type { PlasmoCSConfig } from 'plasmo'

// // 可以匹配多个网址
export const config: PlasmoCSConfig = {
    matches: [
        'https://www.csdn.net/*',
        'https://blog.csdn.net/*',
        'https://mp.csdn.net/*',
        'https://juejin.cn/*',
        'https://www.cnblogs.com/*',
    ],
}

const CustomButton = () => {
    return <button>1</button>
}

export default CustomButton
