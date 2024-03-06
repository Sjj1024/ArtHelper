import { escape } from 'querystring'

export {}

console.log(
    'Live now; make now always the most precious time. Now will never come again.'
)
// 监听发送请求
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        console.log('请求详情', details)
        if (details.method == 'POST') {
            const decoder = new TextDecoder('utf-8')
            var postedString = decoder.decode(
                new Uint8Array(details?.requestBody?.raw[0].bytes)
            )
            console.log('请求体内容', JSON.parse(postedString))
        }
        return { cancel: false }
    },
    { urls: ['<all_urls>'] },
    ['requestBody']
)
