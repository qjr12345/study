import request from "./request";
export default {
    // 微信网页中调用wx.config进行初始化操作
    wxReadyIsLoading: false,
    wxReadyCallbacks: [],
    wxReadyData: null,
    wxReady: function (call) {
        var me = this
        if (call && me.wxReadyData) {
            call()
            return
        }
        if (me.wxReadyIsLoading) {
            me.wxReadyCallbacks.push(call)
            return
        }
        me.wxReadyIsLoading = true
        request({ url: '/weixin_center/api/weixin/wxSign' }).then(rs => {
            var wxJs = rs
            wxJs.jsApiList = [
                'chooseImage',
                'uploadImage',
                'scanQRCode',
                'downloadImage',
                'getLocalImgData',
                'previewImage',
                'openLocation',
            ]
            wxJs.debug = false
            lyWxJsSdk.config(wxJs)
            lyWxJsSdk.ready(function () {
                me.wxReadyIsLoading = false
                me.wxReadyData = wxJs
                if (call) {
                    call()
                }
                // for(var i=0; i<me.wxReadyCallbacks.length; i++){
                // 	if( me.wxReadyCallbacks[i] ){
                // 		me.wxReadyCallbacks[i]();
                // 	}
                // }
                // me.wxReadyCallbacks = [];
            })
            lyWxJsSdk.error(function (res) {
                console.log('lyWxJsSdk.config error --- ', res)
                alert('微信js-sdk出错了' + JSON.stringify(res))
            })
        })
    }
}