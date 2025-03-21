// import type { PlasmoCSConfig } from 'plasmo'

// // 可以匹配多个网址
// export const config: PlasmoCSConfig = {
//     matches: [
//         'https://www.csdn.net/*',
//         'https://mp.csdn.net/*',
//         'https://juejin.cn/*',
//         'https://www.cnblogs.com/*',
//         'https://csdn.net/*',
//         'https://uiadmin.net/*',
//     ],
//     world: 'MAIN',
//     run_at: 'document_start',
// }

// // 拦截fetch请求
// ;(function () {
//     var originalFetch = window.fetch
//     window.fetch = function (input: any, init) {
//         const method = init?.method || 'GET'
//         const url = typeof input === 'string' ? input : input.url
//         const body = init?.body || ''

//         console.log('1024小神 Fetch request:', { method, url, body })

//         return originalFetch.apply(this, arguments).then((response) => {
//             response
//                 .clone()
//                 .text()
//                 .then((body) => {
//                     console.log('1024小神 Fetched body:', body)
//                     // 这里可以处理响应体内容，比如发送给后台或者存储起来
//                 })
//             return response
//         })
//     }

//     // 初始化请求
//     var originalXHROpen = XMLHttpRequest.prototype.open
//     XMLHttpRequest.prototype.open = function (method, url) {
//         this._url = url
//         this._method = method
//         originalXHROpen.apply(this, arguments)
//     }

//     // 发送请求
//     var originalXHRSend = XMLHttpRequest.prototype.send
//     XMLHttpRequest.prototype.send = function (body) {
//         this.addEventListener('load', function () {
//             // 这里可以处理响应体内容，比如发送给后台或者存储起来
//             console.log('1024小神 XHR request:', {
//                 method: this._method,
//                 url: this._url,
//                 body,
//                 responseBody: this.responseText,
//             })
//         })
//         originalXHRSend.apply(this, arguments)
//     }
// })()

// 获取页面中所有请求的域名
;(function () {
    const domains = new Set()
    const requests = performance.getEntriesByType('resource')
    requests.forEach((request) => {
        try {
            const url = new URL(request.name)
            domains.add(url.hostname)
        } catch (e) {
            console.error('Invalid URL:', request.name)
        }
    })
    // 统计一共有多少个，并将域名用逗号拼接
    const domainsCount = domains.size
    console.log('Domains count:', domainsCount)
    const domainsStr = Array.from(domains).join(',')
    console.log('Domains used:', domainsStr)
})()
