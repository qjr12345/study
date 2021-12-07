import request from "./request";

const toast = (title, duration = 1500, mask = false, icon = 'none') => {
    if (Boolean(title) === false) {
        return
    }
    uni.showToast({
                      title,
                      duration,
                      mask,
                      icon,
                  })
}

/**
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
            time = parseInt(time)
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    return format.replace(/{([ymdhisa])+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
}


/**
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    if (option) {
        return parseTime(time, option)
    } else {
        const d = new Date(time)
        const now = Date.now()
        const diff = (now - d) / 1000
        if (diff < 30) {
            return '刚刚'
        } else if (diff < 3600) {
            // less 1 hour
            return Math.ceil(diff / 60) + '分钟前'
        } else if (diff < 3600 * 24) {
            return Math.ceil(diff / 3600) + '小时前'
        } else if (diff < 3600 * 24 * 2) {
            return '1天前'
        }
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日'
            // +
            // d.getHours() +
            // '时'
            //  +
            // d.getMinutes() +
            // '分'
        )
    }
}
/* 动态加载js */
function loadJS(url, success) {
    var domScript = document.createElement('script');
    domScript.src = url;
    success = success || function () { };
    domScript.onload = domScript.onreadystatechange = function () {
        if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
            success();
            this.onload = this.onreadystatechange = null;
        }
    }
    document.getElementsByTagName('head')[0].appendChild(domScript);
}

import wxJs from "./wx";
function loadWxJs() {
    loadJS('//cdn.static.magcloud.cc/flxx/js/jweixin-1.4.0.js', function () {
        console.log('jweixin -success')
        if (!window.lyWxJsSdk) {
            window.lyWxJsSdk = wx;
        }
        wxJs.wxReady()
    })
    loadJS('//cdn.static.magcloud.cc/flxx/js/exif.js', function () {
        console.log('exif -success')
    })
}
const h5Helper = {
    isAndroid: function () {
        return window.navigator.appVersion.toLowerCase().indexOf('android') != -1
    },
    isIOS: function () {
        return window.navigator.appVersion.toLowerCase().indexOf('iphone') != -1
    },
    isWeiXinWeb: function () {
        var ua = window.navigator.userAgent.toLowerCase()
        return ua.match(/MicroMessenger/i) == 'micromessenger'
    },
    isMagAppWeb: function () {
        return navigator.userAgent.indexOf('MAGAPP') !== -1
    },
}

function previewImage(current, urls) {
    current = current.url || current.content
    urls = urls.map(item => item.url || item.content)
    lyWxJsSdk.previewImage({
                               current, // 当前显示图片的http链接
                               urls // 需要预览的图片http链接列表
                           })
}

let role = null,
    getUserRoleCall = [],
    getUserRoleLoading = false

/**
 * @description 获取用户角色
 * @param {Function} call
 */
function getUserRole(call) {
    if (role) {
        call && call(role)
        return
    }
    if (getUserRoleLoading) {
        getUserRoleCall.push(call)
        return
    }
    getUserRoleLoading = true
    request({
                url: '/mljq/api/user/getRole',
            }).then(res => {
        role = res
        call && call(role)
        getUserRoleCall.forEach(item => item && item(role))
        getUserRoleCall = []
        getUserRoleLoading = false
    })
}
/**
 * @description 根据当前角色跳转相对应的页面
 */
function redirectPage() {
    getUserRole(res => {
        switch (res.role) {
            case 0:
                uni.redirectTo({
                                   url: '/pages/civilian/mine',
                               })
                break
            case 1:
                uni.redirectTo({
                                   url: '/pages/shop/index?id=' + res.data,
                               })
                break
            case 2:
                uni.switchTab({
                                  url: '/pages/index/index',
                              })
                break
            default:
                break
        }
    })
}

export default {
    getUserRole,
    redirectPage,
    previewImage,
    h5Helper,
    loadJS,
    loadWxJs,
    toast,
    formatTime,
    parseTime
}