
// * 默认缩放值
const scale = {
    width: '1',
    height: '1',
}

// * 设计稿尺寸（px）
const baseWidth = 1920
const baseHeight = 1080

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))

export default {
    data() {
        return {
            // * 定时函数
            drawTiming: null
        }
    },
    mounted() {
        console.log(123213);
        this.calcRate()
        window.addEventListener('resize', this.resize)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.resize)
    },
    methods: {
        calcRate() {
            const appRef = this.$refs["appRef"]
            console.log(appRef.$el.style);
            if (!appRef) return
            // 当前宽高比
            const currentRate = parseFloat((window.innerWidth / window.innerHeight).toFixed(5))
            if (appRef) {
                if (currentRate > baseProportion) {
                    // 表示更宽
                    scale.width = ((window.innerHeight * baseProportion) / baseWidth).toFixed(5)
                    scale.height = (window.innerHeight / baseHeight).toFixed(5)
                    appRef.$el.style.transform = `scale(${scale.width}, ${scale.height}) translateX(-50%)`
                } else {
                    // 表示更高
                    scale.height = ((window.innerWidth / baseProportion) / baseHeight).toFixed(5)
                    scale.width = (window.innerWidth / baseWidth).toFixed(5)
                    appRef.$el.style.transform = `scale(${scale.width}, ${scale.height}) translateX(-50%)`
                }
            }
        },
        resize() {
            clearTimeout(this.drawTiming)
            this.drawTiming = setTimeout(() => {
                this.calcRate()
            }, 200)
        }
    },
}
