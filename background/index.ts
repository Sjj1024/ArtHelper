import { Storage } from '@plasmohq/storage'
export {}

console.log('background----------')

// 本地存储
const storage = new Storage({
  area: 'local',
  copiedKeyList: ['shield-modulation']
})

// 发送文章平台请求地址
const sendUrls = [
  'https://bizapi.csdn.net/blog/phoenix/console/v1/article/get-quality-score'
]

// 拦截请求处理函数
const filterHandler = (details: any) => {
  // csdn发送文章的逻辑
  if (details.method == 'POST' && sendUrls.includes(details.url)) {
    console.log('请求详情', details)
    try {
      const decoder = new TextDecoder('utf-8')
      const postedString = decoder.decode(
        new Uint8Array(details?.requestBody?.raw[0].bytes)
      )
      const postData = JSON.parse(postedString)
      console.log('请求体内容', postData)
      csdnPostArticle(postData)
    } catch (error) {
      console.log('解析请求体出错', error)
    }
  }
  return { cancel: false }
}

// csdn发文章逻辑
const csdnPostArticle = async (details: any) => {
  const id = details.articleId
  const title = details.title
  const content = details.content
  // console.log('开始发送文章', title, content)
  addArticle(id, title, content)
}

// 存储发送的文章标题和内容:编辑的文章不会同步，如果文章标题相同，就视为发送过，不再同步
const addArticle = async (id: string, title: string, content: string) => {
  console.log('存储文章', title, content)
  const articles: [] = await storage.get('articles')
  if (articles && articles.length > 0) {
    const findArt = articles.find((item: any) => item.title === title)
    console.log('找到文章findArt:', findArt)
    if (!findArt) {
      storage.set('articles', [...articles, { id, title, content }])
    }
  } else {
    console.log('没有找到文章, 直接存储')
    storage.set('articles', [{ id, title, content }])
  }
}

// 监听发送请求
chrome.webRequest.onBeforeRequest.addListener(
  filterHandler,
  { urls: ['<all_urls>'] },
  ['requestBody']
)
