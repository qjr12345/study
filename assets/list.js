export default {
    onPullDownRefresh() {
        this.store && this.store.reload()
        this.store.loadedCallback = () => {
            uni.stopPullDownRefresh()
        }
    },
    onReachBottom() {
        if (this.store.status != 'noMore') {
            this.store.next && this.store.next()
        }
    },
    data() {
        return {
            store: {},
        }
    },
    methods: {
        DataSource(url) {
            var me = this
            return {
                data: [],
                status: 'more',
                empty: false,
                total: 0,
                params: {
                    page: 1,
                    step: 20,
                },
                reload() {
                    this.status = 'loading'
                    this.empty = false
                    this.params.page = 1
                    this.next()
                },
                callBack: null,
                firstCallBack: null,
                loadedCallback: null,
                next() {
                    console.log(this);
                    me.$request({
                        url: url,
                        data: this.params,
                        method: 'POST',
                    }).then(res => {
                        let resultData = res.data
                        if (this.params.page == 1) {
                            this.data = resultData
                            if (resultData.length == 0 || resultData==0) {
                                this.empty = true
                            } else if (resultData.length < this.params.step) {
                                this.status = 'noMore'
                            } else if (res.total == resultData.length) {
                                this.status = 'noMore'
                            }
                        } else {
                            this.data.push(...resultData)
                            if (resultData.length < this.params.step) {
                                this.status = 'noMore'
                            }
                        }

                        if (this.params.page == 1) {
                            this.firstCallBack && this.firstCallBack()
                        }
                        this.loadedCallback && this.loadedCallback()
                        this.params.page++
                        this.total = res.total
                        this.loading = false
                    })
                }
            }
        }
    },
}
