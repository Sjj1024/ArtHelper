export const hasCookie = (domain: string, name: string) => {
    let result = new Promise((resolve, reject) => {
        chrome.cookies.get({ url: domain, name }, (cookie) => {
            console.log('检测到cookie值', cookie)
            if (domain.includes('juejin')) {
                if (cookie && cookie.value.length >= 130) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } else {
                resolve(!!cookie ? cookie.value : false)
            }
        })
    })
    return result
}

// export default { hasCookie }
