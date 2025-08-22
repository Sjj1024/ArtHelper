import type { PlasmoCSConfig } from 'plasmo'

// 可以匹配多个网址
const matchList = ['https://juejin.cn/editor/drafts/*']
export const config: PlasmoCSConfig = {
    matches: matchList,
    world: 'MAIN',
    run_at: 'document_end',
}

// 接收发送文章的消息：模拟手动发文章操作
// article tid
let tid = null
// article title
let title = null
// 当前要发送的文章
let sendArt: string | null = null
// description
let desc: string = null
// category id
let category: string = null
// tags id
let tags: string[] = []
// columns Column
let columns: string[] = []
// cover_image show image
let cover_image: string = null
// all csdn image url, use for replace juejin
let csdnImg = null
// 是不是已经在md编辑模式了，是的话，就不要监听dom变化了
let editModul = null

// 监听dom变化
const listenDom = () => {
    //选择一个需要观察的节点
    var targetNode = document.body
    // 设置observer的配置选项
    var configMutation = { attributes: true, childList: true, subtree: true }
    // 当节点发生变化时的需要执行的函数
    var callback = function (mutationsList, observer) {
        // 监听到文章内容后，就不再监听页面变化了
        if (editModul === null) {
            for (var mutation of mutationsList) {
                // 检测并获取article
                const articleContent = document.getElementById('article')
                // const contentDiv = document.getElementById('contentDiv')
                if (
                    mutation.type == 'childList' &&
                    editModul === null &&
                    articleContent
                ) {
                    const article = JSON.parse(articleContent.innerText)
                    console.log('sender listen 元素节点变化', article)
                    title = article.title
                    sendArt = article.content
                    desc =
                        article.description.length > 98
                            ? article.description.slice(0, 90)
                            : article.description
                    // category
                    category = article.cate
                    // tags list
                    tags = article.tags
                    // columns
                    columns = article.column
                    // 找到所有的图片链接
                    findImg(sendArt)
                    // 给编辑器赋值
                    juejin(title, sendArt)
                } else {
                    // console.log('sender listen 样式属性变化')
                }
            }
        }
    }
    // 创建一个observer示例与回调函数相关联
    var observer = new MutationObserver(callback)
    //使用配置文件对目标节点进行观测
    observer.observe(targetNode, configMutation)
}

// find all img url
const findImg = (content: string) => {
    // console.log('findimg content is', content)
    const reImg = new RegExp(/<img.*?src="(.*?)"/g)
    var imgTags = content.match(reImg)
    console.log('re content img tag are', imgTags)
    if (imgTags) {
        let urls = imgTags.map((url) => {
            return url.match(/\ssrc=['"](.*?)['"]/)[1]
        })
        console.log('all image url is', urls)
        // 等监听到url变为文章的url后，将所有的url替换为掘金的图片地址
        csdnImg = urls
    }
}

// 监听url变化了
const listenUrl = () => {
    // https://juejin.cn/editor/drafts/7347165355586125861
    // const url = window.location.href
    // const tid = url.split('/')[url.split('/').length - 1]
    // title = '前端跨页面通信方案介绍'
    // // desc length cant more 100
    // const brief_content =
    //     '在浏览器中，我们可以同时打开多个Tab页，每个Tab页可以粗略理解为一个“独立”的运行环境，即使是全局对象也不会在多个Tab间共享。然而有些时候，我们希望能在这些“独立”的Tab页面之间同步页面的数据、信息或状态。这就是本文说说的跨页面通信方案，那么目前有哪些跨页面的通信方案呢？本文重点介绍一下。同源页面之间跨页面通信一般有如下几种方案。'
    // sendArt = ``
    // console.log('send article tid is', tid, title, sendArt)
    // updateArt(tid, title, sendArt, brief_content)
    let timer = setInterval(() => {
        // re end num
        const url = window.location.href
        if (url.length > 40 && csdnImg) {
            console.log('has listen true url is', url)
            timer && clearInterval(timer)
            // replace all csdn image url
            let taskPromise = csdnImg.map((url) => {
                return urlSave(url)
            })
            Promise.all(taskPromise).then((res) => {
                tid = url.split('/')[url.split('/').length - 1]
                console.log('send article content is', tid)
                // reset title and content
                juejin(title, sendArt)
                // update article category and tags
                setTimeout(() => {
                    console.log('set timeout update art', desc, columns)
                    updateArt(tid, title, sendArt)
                }, 5000)
            })
        }
    }, 500)
}

// 模拟掘金发文章操作
const juejin = (title, content) => {
    // 判断是同步一篇还是同步多篇
    // 检测是不是markdown编辑模式:不是的话要调整到markdown模式
    const markdownEditor = document.querySelector('.bytemd-status-right')
    const titleInput: any = document.querySelector('.title-input')
    const contnetDiv: any = document.querySelector('.CodeMirror')
    if (markdownEditor && titleInput && contnetDiv) {
        console.log('开始编辑文章', titleInput, contnetDiv)
        titleInput.value = title
        // call change and blur
        // titleInput.change()
        var event = new Event('input', { bubbles: true })
        titleInput.dispatchEvent(event)
        // var changeEvent = new Event('change', { bubbles: true });
        // titleInput.dispatchEvent(changeEvent);
        // titleInput.blur()
        try {
            contnetDiv.CodeMirror.setValue(content)
            editModul = true
        } catch (error) {
            console.log('赋值文章内容出错')
        }
    } else {
        console.log('富文本模式，需要切换到markdownEditor')
        // const toggleBtn = document.querySelector('.toggle-btn') as HTMLElement
        // const confirm = document.querySelector('.confirm-btn') as HTMLElement
        // toggleBtn && toggleBtn.click()
        // confirm && confirm.click()
    }
}

// 发送替换图片url的请求
const urlSave = (url) => {
    // 可以使用fetch替换csdn的文章里面图片链接
    return fetch('https://juejin.cn/image/urlSave', {
        headers: {
            accept: '*/*',
            'accept-language': 'zh-CN,zh;q=0.9',
            'content-type': 'application/json',
            'sec-ch-ua':
                '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
        },
        referrer: window.location.href,
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: `{"url":"${url}"}`,
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
    }).then(async (res) => {
        let data = await res.json()
        console.log('replace response json is', data)
        // 如果成功，就替换文章里面的链接
        sendArt = sendArt.replaceAll(url, data.data)
        // if cover_image is null, set one
        if (!cover_image) {
            cover_image = data.data
        }
    })
}

//send fetch update juejin article
const updateArt = (id, title, content) => {
    const link_url = ''
    const is_gfw = 0
    const is_english = 0
    const is_original = 1
    const edit_type = 10
    const html_content = 'deprecated'
    const mark_content = content
    const theme_ids = []
    const postJson = {
        id,
        category_id: category,
        tag_ids: tags,
        link_url,
        cover_image,
        is_gfw,
        title,
        brief_content: desc,
        is_english,
        is_original,
        edit_type,
        html_content,
        mark_content,
        theme_ids,
        column_ids: ['7331070714765230106', '7348654457427689523'],
    }
    console.log('send fetch update art', postJson)
    fetch(
        'https://api.juejin.cn/content_api/v1/article_draft/update?aid=2608&uuid=7345439647391155738',
        {
            headers: {
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'sec-ch-ua':
                    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
            },
            referrer: 'https://juejin.cn/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: JSON.stringify(postJson),
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        }
    )
        .then(async (res) => {
            let data = await res.json()
            console.log('updateArt response json is', data)
            // get article desc fetch
            getArtDesc()
        })
        .catch((err) => {
            console.log('updateArt juejin article arr:', err)
        })
}

// find theme lottery
const findThemeLottery = () => {
    const lotteryThemes = localStorage.getItem('lotteryThemes')
    console.log('get juejin lotteryThemes:', lotteryThemes)
    const lotteryThemesList = JSON.parse(lotteryThemes)
    console.log('get juejin lotteryThemesList:', lotteryThemesList)
    if (lotteryThemesList.length > 0) {
        return lotteryThemesList.map((item) => item.value)
    }
    return []
}

//send fetch update juejin article
const updateArt2 = (id, title, content) => {
    const themeLottery = findThemeLottery()
    console.log('get updateArt2 themeLottery:', themeLottery)
    const link_url = ''
    const is_gfw = 0
    const is_english = 0
    const is_original = 1
    const edit_type = 10
    const html_content = 'deprecated'
    const mark_content = content
    const theme_ids = themeLottery
    const postJson = {
        id,
        category_id: category,
        tag_ids: tags,
        link_url,
        cover_image,
        is_gfw,
        title,
        brief_content: desc,
        is_english,
        is_original,
        edit_type,
        html_content,
        mark_content,
        theme_ids,
        column_ids: ['7331070714765230106', '7348654457427689523'],
    }
    console.log('send fetch update art', postJson)
    fetch(
        'https://api.juejin.cn/content_api/v1/article_draft/update?aid=2608&uuid=7345439647391155738',
        {
            headers: {
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'sec-ch-ua':
                    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
            },
            referrer: 'https://juejin.cn/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: JSON.stringify(postJson),
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        }
    )
        .then(async (res) => {
            let data = await res.json()
            console.log('updateArt response json is', data)
            updateColumn()
        })
        .catch((err) => {
            console.log('updateArt juejin article arr:', err)
        })
}

// get article desc fetch
const getArtDesc = () => {
    fetch(
        `https://api.juejin.cn/content_api/v1/article_draft/abstract?draft_id=${tid}&aid=2608&uuid=7345439647391155738`,
        {
            headers: {
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'sec-ch-ua':
                    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
            },
            referrer: `https://juejin.cn/editor/drafts/${tid}`,
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: null,
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
        }
    ).then(async (res) => {
        let data = await res.json()
        console.log('get article desc response json is', data)
        desc = data.data.text
        // then update article desc
        updateArt2(tid, title, sendArt)
    })
}

// publish article to update columns
const updateColumn = () => {
    const themeLottery = findThemeLottery()
    console.log('get updateColumn themeLottery:', themeLottery)
    const postJson = {
        draft_id: tid,
        sync_to_org: false,
        column_ids: columns,
        theme_ids: themeLottery,
    }
    console.log('update column post json', postJson)
    fetch(
        'https://api.juejin.cn/content_api/v1/article/publish?aid=2608&uuid=7345439647391155738',
        {
            headers: {
                accept: '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'content-type': 'application/json',
                'sec-ch-ua':
                    '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site',
            },
            referrer: 'https://juejin.cn/',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: JSON.stringify(postJson),
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
        }
    )
        .then(async (res) => {
            let data = await res.json()
            console.log('update Column response json is', data)
            if (data.err_no !== 0) {
                console.log('update Column err_msg is', data.err_msg)
                alert(`发布错误：${data.err_msg}`)
            } else {
                // update juejin cookie juejinDone send message to close win
                document.cookie = `juejinDone=${tid}; path=/; domain=juejin.cn; secure`
            }
        })
        .catch((err) => {
            console.log('update Column article arr:', err)
        })
}

console.log('sender------')
// juejin listen dom and set title and content
listenDom()
// listen url change get true url
listenUrl()
