/*
 * @Author: 仲春阳
 * @Date: 2021-11-26 09:08:03
 * @LastEditTime: 2021-11-29 13:22:24
 * @LastEditors: your name
 * @Description: 
 * 程序中蕴含着很多的道理，唯有大彻大悟者方能体会其中的奥妙。
 */
// 屏幕适配 mixin 函数

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