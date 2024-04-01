import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from 'plasmo'
import cssText from 'data-text:~/contents/index.css'

export const config: PlasmoCSConfig = {
    matches: ['https://mp.csdn.net/*'],
}

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
    return (
        <div
            className="csui"
        >
            掘金配置：
        </div>
    )
}

export default PlasmoInline
