// 可选平台列表：value是编辑文章的网站地址，cooid：用户登录后的校验id，edit：用户编辑文章的地址，login：用户登录地址，
export const platList = [
    {
        label: 'CSDN',
        value: 'https://mp.csdn.net',
        cookid: 'UserToken',
        edit: 'https://mp.csdn.net/mp_blog/creation/editor',
        login: 'https://passport.csdn.net/login?code=applets',
        desc: 'China (中国)',
    },
    {
        label: '掘金',
        value: 'https://juejin.cn',
        cookid: 'sid_ucp_v1',
        edit: 'https://juejin.cn/editor/drafts/new',
        login: 'https://juejin.cn/login',
        desc: 'USA (美国)',
    },
    {
        label: '博客园',
        value: 'https://i.cnblogs.com',
        cookid: '.CNBlogsCookie',
        edit: 'https://i.cnblogs.com/posts/edit',
        login: 'https://account.cnblogs.com/signin',
        desc: 'Japan (日本)',
    },
    {
        label: '知乎',
        value: 'https://zhihu.com',
        cookid: 'z_c0',
        edit: 'https://zhuanlan.zhihu.com/write',
        login: 'https://www.zhihu.com/signin',
        desc: 'Korea (韩国)',
    },
]
