
let DOMAIN = ''
if (process.env.NODE_ENV !== 'development') {
    DOMAIN = window.location.origin
}
export default (options = {}) => {
    if (options.data == undefined) {
        options.data = {}
    }
    return new Promise((reslove, reject) => {
        uni.request({
            url: DOMAIN + options.url,
            data: options.data || {},
            header: {
                Authorization: `Bearer ${uni.getStorageSync('auth-token')}`,
            },
            method: options.method || 'GET',
            success: async (res) => {
                if (res.data.success === false) {
                    uni.showToast({
                        title: res.data.msg || '网络异常，请稍后再试',
                        duration: 2000,
                        icon: 'none'
                    });
                    setTimeout(() => {
                        errHandler(res.data.code)
                    }, 2000);
                } else {
                    reslove(res.data)
                }
            },
            fail: (err) => {
                reject(err)
                uni.showToast({
                    icon: 'none',
                    title: '网络异常，请稍后再试',
                })
            },
        })
    })
}

/**
 * 错误处理
 * @param {Number} code 错误码
 */
function errHandler(code) {
    switch (code) {
        case 1002: 
            uni.redirectTo({
                url: '/pages/index/home'
            });
            break;
        default:
            break;
    }
}
