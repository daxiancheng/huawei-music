
// let Swiper = (function () {
//     let root = document
//     let eventHub = { 'swipLeft': [], 'swipRight': [] }
//     function bind(node) {
//         root = node
//     }
//     function on(type, fn) {
//         if (eventHub[type]) {
//             eventHub[type].push(fn)
//         }
//     }

//     var initX
//     var newX
//     var clock
//     root.ontouchstart = function (e) {
//         console.log(e.changedTouches)
//     }

//     root.ontouchmove = function (e) {
//         if (clock) clearInterval(clock)
//         clock = setTimeout(() => {
//             newX = e.changedTouches[0].pageX
//             if (newX - initX > 0) {
//                 eventHub['swipRight'].forEach(fn => fn())
//             } else {
//                 eventHub['swipLeft'].forEach(fn => fn())
//             }
//         }, 100)
//     }
//     return {
//         bind: bind,
//         on: on
//     }
// })()

// Swiper.bind(document.querySelector('#huaweiMusic'))

// Swiper.on('swipLeft', function () {
//     console.log('swipLeft')
// })
// Swiper.on('swipLeft', function () {
//     console.log('swipLeft 111')
// })

// Swiper.on('swipRight', function () {
//     console.log('swipRight')
// })


class swiper {
    constructor(node) {
        if(!node) throw new Error('需要传递需要绑定的DOM元素')
        let root = typeof node === 'string' ? document.querySelector(node):node
        let swiperMethod = { swipLeft: [], swipRight: [] }
        let oldX
        let newX
        let clearTime
        root.ontouchstart = (e) => { oldX = e.changedTouches[0].pageX }
        root.ontouchmove = (e) => {
            newX = e.changedTouches[0].pageX
            if (clearTime) { clearTimeout(clearTime) }
            clearTime = setTimeout(() => {
                if (newX - oldX > 50) {
                    swiperMethod.swipRight.forEach((fn) => fn.bind(root)())
                } else if (oldX - newX > 50) {
                    swiperMethod.swipLeft.forEach((fn) => fn.bind(root)())
                }
            }, 100)

        }
        this.on = function (type, fn) {
            if(swiperMethod[type]) {
                swiperMethod[type].push(fn)
            }
          }
    }
}
export default swiper
