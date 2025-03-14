import { Storage } from '@plasmohq/storage'
import { platList } from '../utils/common'
export {}

console.log('background----------')

// 本地存储
const storage = new Storage({
    area: 'local',
    copiedKeyList: ['shield-modulation'],
})

// csdn发送文章平台请求地址, 也是background脚本检测文章发布的请求地址
const sendUrls = [
    'https://bizapi.csdn.net/blog-console-api/v1/postedit/saveArticle',
    'https://api.juejin.cn/content_api/v1/column/author_center_list?aid=2608&uuid=7392137755348682259&spider=0',
    'https://api.github.com/*',
    'https://bizapi.csdn.net/*',
]

const resUrls = ['*://dev.hado-official.cn/*']

let isSendJuejin = false

interface Article {
    id: string
    title: string
    content: string
    cate: string
    tags: string[]
    column: string[]
}

// handler csdn
const csdnHandle = async (details: any) => {
    try {
        const decoder = new TextDecoder('utf-8')
        const postedString = decoder.decode(
            new Uint8Array(details?.requestBody?.raw[0].bytes)
        )
        const postData = JSON.parse(postedString)
        console.log('请求体内容', postData)
        // if csdn status is 0 then get title and content
        if (postData.status === 0) {
            // get juejin cate and tags ...
            const juejinCate = await storage.getItem('juejinCate')
            const juejinTag: string[] = await storage.getItem('juejinTag')
            const juejinColumn: string[] = await storage.getItem('juejinColumn')
            // del img height
            const content = replaceImgHeight(postData.content)
            const articlePost = {
                id: postData.articleId as string,
                title: postData.title as string,
                content: content as string,
                description: postData.description as string,
                cate: juejinCate as string,
                tags: juejinTag,
                column: juejinColumn,
            }
            // save article to storage
            addArticle(articlePost)
        }
    } catch (error) {
        console.log('解析请求体出错', error)
    }
}

// set badge action
const setBadge = () => {
    chrome.action.setBadgeText({ text: '=>' }, () => {
        console.log('set badge text callback')
    })
    // chrome.action.setBadgeBackgroundColor(
    //     { color: '#00FF00' }, // Also green
    //     () => {
    //         console.log('set badge callback')
    //     }
    // )
}

const setBadgeHide = () => {
    chrome.action.setBadgeText({ text: '' }, () => {
        console.log('set badge text callback')
    })
    // chrome.action.setBadgeBackgroundColor(
    //     { color: '#00FF00' }, // Also green
    //     () => {
    //         console.log('set badge callback')
    //     }
    // )
}

// fetch juejin category list
const fetchJuejinCategory = async () => {
    isSendJuejin = true
    fetch(
        'https://api.juejin.cn/content_api/v1/column/author_center_list?aid=2608&uuid=7392137755348682259&spider=0',
        {
            headers: {
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                priority: 'u=1, i',
                'sec-ch-ua':
                    '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
                'x-secsdk-csrf-token':
                    '0001000000013653201c5613e44c2a17944b0cfcd6ff1996bcc07e523279d7bef579d172c78b18123a6f853f6262',
                cookie: 'csrf_session_id=7ba74a86552e8f84b3c0d7bfffcd9d2f; _tea_utm_cache_2608=undefined; __tea_cookie_tokens_2608=%257B%2522user_unique_id%2522%253A%25227392137755348682259%2522%252C%2522web_id%2522%253A%25227392137755348682259%2522%252C%2522timestamp%2522%253A1734231133127%257D; passport_csrf_token=048f0ddae33d5acd6d4417e8c857d5c3; passport_csrf_token_default=048f0ddae33d5acd6d4417e8c857d5c3; n_mh=nNwOatDm453msvu0tqEj4bZm3NsIprwo6zSkIjLfICk; sid_guard=c06ecb1e9bd93627ffc006f56b36c389%7C1734441141%7C31536000%7CWed%2C+17-Dec-2025+13%3A12%3A21+GMT; uid_tt=7741335db523caa10ca959a0c3b97e15; uid_tt_ss=7741335db523caa10ca959a0c3b97e15; sid_tt=c06ecb1e9bd93627ffc006f56b36c389; sessionid=c06ecb1e9bd93627ffc006f56b36c389; sessionid_ss=c06ecb1e9bd93627ffc006f56b36c389; is_staff_user=false; sid_ucp_v1=1.0.0-KDc1MjE1Mjg0NDU3ODQ2YTQ2ZjQ0ZGJjZjQzZmY3NjdmY2I0OGY2ZjMKFgj-8fDivfUPELXxhbsGGLAUOAdA9AcaAmxmIiBjMDZlY2IxZTliZDkzNjI3ZmZjMDA2ZjU2YjM2YzM4OQ; ssid_ucp_v1=1.0.0-KDc1MjE1Mjg0NDU3ODQ2YTQ2ZjQ0ZGJjZjQzZmY3NjdmY2I0OGY2ZjMKFgj-8fDivfUPELXxhbsGGLAUOAdA9AcaAmxmIiBjMDZlY2IxZTliZDkzNjI3ZmZjMDA2ZjU2YjM2YzM4OQ; store-region=cn-sh; store-region-src=uid; juejinDone=7449623993093439526',
                Referer: 'https://juejin.cn/',
                'Referrer-Policy': 'strict-origin-when-cross-origin',
            },
            body: '{"audit_status":null,"page_no":1,"page_size":10}',
            method: 'POST',
        }
    ).then((res) => {
        console.log('juejin category list', res)
    })
}

// 拦截请求处理函数
const filterHandler = (details: any) => {
    console.log('art helper filter handler get', details)
    // csdn发送文章的逻辑
    if (details.method == 'POST' && sendUrls.includes(details.url)) {
        console.log('请求详情', details)
        csdnHandle(details)
    }
    // get juejin category list and tag list
    if (details.method == 'GET' && details.url.includes('category')) {
        console.log('请求详情', details)
    }
    return { cancel: false }
}

// replace img height to none
const replaceImgHeight = (content) => {
    const reImg = new RegExp(/<img.*?height="\d+".*?>/g)
    var imgTags = content.match(reImg)
    console.log('re content img tag are', imgTags)
    if (imgTags) {
        let heights = imgTags.map((url) => {
            return url.match(/(\sheight=['"]\d*?['"])\s/)[1]
        })
        console.log('all image height is', heights)
        heights.forEach((height) => {
            content = content.replace(height, '')
        })
        console.log('replace all img height to none', content)
    }
    return content
}

// control platform publish article
const winControl = async () => {
    // get seleted async platform list
    const platforms: [] = await storage.get('platforms')
    console.log('platforms-----', platforms)
    // for each platform to publish
    platforms.forEach(async (item) => {
        const plat = platList.find((p) => p.value === item)
        console.log('plat-----', plat)
        // creat juejin window to publish
        creatJuejin(plat.edit)
    })
}

// 创建掘金tab
const creatJuejin = async (url?: string) => {
    // show sync icon
    setBadge()
    // show or hide auto ui action
    const showUi = await storage.getItem('showUi')
    // open juejin edit window
    chrome.windows.create(
        {
            url: url,
            type: 'normal',
            state: showUi ? 'maximized' : 'minimized',
            // state: 'maximized',
        },
        (win) => {
            // TODO control window map platform, when published close current window
            console.log('windows创建成功', win)
            storage.setItem('juejinWin', win.id)
        }
    )
}

// 存储发送的文章标题和内容:编辑的文章不会同步，如果文章标题相同，就视为发送过，不再同步
const addArticle = async (articleObj: Article) => {
    console.log('background 存储文章', articleObj)
    const articles: [] = await storage.get('articles')
    // if article list exist and length eg 0 run save article
    if (articles && articles.length > 0) {
        const findArt = articles.find(
            (item: any) => item.title === articleObj.title
        )
        console.log('找到文章findArt:', findArt)
        // if dont find article, add list
        if (!findArt) {
            storage.set('articles', [...articles, { ...articleObj }])
        } else {
            console.log('background update article ')
        }
    } else {
        console.log('background 没有找到文章, 直接存储')
        storage.set('articles', [{ ...articleObj }])
    }
    // run publish flow
    // send juejin article
    await storage.setItem('one', articleObj)
    // control win publisher
    winControl()
}

// listen juejin cookie change and control chrme windows query and close
chrome.cookies.onChanged.addListener(async (changeInfo) => {
    if (changeInfo.cookie.name === 'juejinDone') {
        console.log('juejin cookie change', changeInfo)
        // close juejin windows
        try {
            const juejinWinId: number = await storage.getItem('juejinWin')
            console.log('juejin win id', juejinWinId)
            juejinWinId &&
                chrome.windows.remove(juejinWinId).then(() => {
                    // close juejin edit window
                    storage.removeItem('juejinWin')
                    // set badege hide
                    setBadgeHide()
                    // clear one article
                    storage.removeItem('one')
                })
        } catch (error) {
            console.log('close juejin win err', error)
        }
    }
})

// 过滤响应体
const filterResponse = (details: any) => {
    console.log('filterResponse', details)
    // !isSendJuejin && fetchJuejinCategory()
}

// 监听发送请求：get csdn post and update juejin article
chrome.webRequest.onBeforeRequest.addListener(
    filterHandler,
    {
        urls: sendUrls,
    },
    ['requestBody']
)

// 监听response 内容
chrome.webRequest.onResponseStarted.addListener(
    filterResponse,
    {
        urls: sendUrls,
    },
    ['responseHeaders']
)
