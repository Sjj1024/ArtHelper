import { Storage } from '@plasmohq/storage'
import { platList } from '../utils/common'
export {}

console.log('background----------')

// 本地存储
const storage = new Storage({
    area: 'local',
    copiedKeyList: ['shield-modulation'],
})

// csdn发送文章平台请求地址
const sendUrls = [
    'https://bizapi.csdn.net/blog-console-api/v1/postedit/saveArticle',
]

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

// csdn：status = 0
// {
//   "article_id": "137015832",
//   "title": "阿里云OSS连接工具",
//   "description": "",
//   "content": "---",
//   "markdowncontent": "",
//   "tags": "阿里云,云计算",
//   "categories": "",
//   "type": "original",
//   "status": 0,
//   "read_type": "public",
//   "reason": "",
//   "resource_url": "",
//   "resource_id": "",
//   "original_link": "",
//   "authorized_status": false,
//   "check_original": false,
//   "editor_type": 0,
//   "plan": [],
//   "vote_id": 0,
//   "scheduled_time": 0,
//   "level": "1",
//   "cover_type": 1,
//   "cover_images": [
//       "https://img-blog.csdnimg.cn/direct/16a524894695417eaa2617eedb117faa.png"
//   ],
//   "not_auto_saved": 1,
//   "is_new": 1
// }

// 拦截请求处理函数
const filterHandler = (details: any) => {
    console.log('art helper filter handler get')
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
const creatJuejin = (url?: string) => {
    // show sync icon
    setBadge()
    chrome.windows.create(
        {
            url: url,
            type: 'normal',
            state: 'minimized',
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

// 监听发送请求：get csdn post and update juejin article
chrome.webRequest.onBeforeRequest.addListener(
    filterHandler,
    { urls: ['<all_urls>'] },
    ['requestBody']
)
