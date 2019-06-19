import './icon'
import Swiper from './swiper'
class player {
    constructor(node) {
        this.root = document.querySelector(node)
        this.playList = []
        this.currentIndex = 0
        this.audio = new Audio() //相当于在html中创建audio标签
        this.lyricArr = []
        this.lyricArrIndex = 0
        this.start()
        this.bind()
    }
    start() {
        fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
            .then((res) => { return res.json() })
            .then((data) => {
                console.log(data)
                this.playList = data
                this.loadSong()
            })
    }
    bind() {
        let self = this
        this.root.querySelector('.iconplay').onclick = function () {
            if (this.classList.contains('playing')) {
                self.audio.play()
                this.classList.remove('playing')
                this.classList.add('pause')
                this.querySelector('use').setAttribute('xlink:href', '#icon-pause')
            } else if (this.classList.contains('pause')) {
                self.audio.pause()
                this.classList.remove('pause')
                this.classList.add('playing')
                this.querySelector('use').setAttribute('xlink:href', '#icon-play')
            }
        }
        this.root.querySelector('.iconnext').onclick = function () {
            self.nextplay()
            self.root.querySelector('.iconplay').classList.remove('playing')
            self.root.querySelector('.iconplay').classList.add('pause')
            self.root.querySelector('.iconplay').querySelector('use').setAttribute('xlink:href', '#icon-pause')
        }
        this.root.querySelector('.iconpre').onclick = function () {
            self.preplay()
            self.root.querySelector('.iconplay').classList.remove('playing')
            self.root.querySelector('.iconplay').classList.add('pause')
            self.root.querySelector('.iconplay').querySelector('use').setAttribute('xlink:href', '#icon-pause')
        }
        let swiper = new Swiper(this.root.querySelector('.mainShow'))
        swiper.on('swipLeft', function () {
            this.classList.remove('active1')
            this.classList.add('active0')
            console.log('left')
        })
        swiper.on('swipRight', function () {
            this.classList.remove('active0')
            this.classList.add('active1')
            console.log('right')
        })
        this.audio.ontimeupdate = function () {
            console.log(parseInt(self.audio.currentTime * 1000))
            self.setLocalLyric()
            self.setProgressBar()
        }
    }
    preplay() {
        this.currentIndex = (this.currentIndex + this.playList.length - 1) % this.playList.length
        this.audio.src = this.playList[this.currentIndex].url
        this.audio.oncanplaythrough = () => this.audio.play()
    }
    nextplay() {
        this.currentIndex = (this.currentIndex + this.playList.length + 1) % this.playList.length
        this.audio.src = this.playList[this.currentIndex].url
        this.audio.oncanplaythrough = () => this.audio.play()
    }
    loadSong() { //加载歌曲
        let songObj = this.playList[this.currentIndex]
        this.root.querySelector('.header h1').innerText = songObj.title
        this.root.querySelector('.header p').innerText = songObj.author + '-' + songObj.albumn
        this.audio.src = songObj.url
        this.audio.onloadedmetadata = () => this.root.querySelector('.timeEnd').innerText = this.formatTime(this.audio.duration) //歌词总时长（毫秒）
        this.loadlyric()
    }
    formatTime(totalTime) {
        let min = parseInt(totalTime / 60)
        min = min >= 10 ? '' + min : '0' + min //变成字符串
        let sec = parseInt(totalTime % 60)
        sec = sec >= 10 ? '' + sec : '0' + sec //变成字符串
        return min + ':' + sec
    }
    loadlyric() { //加载歌词
        fetch(this.playList[this.currentIndex].lyric)
            .then(res => res.json())
            .then(data => this.formatlyrics(data.lrc.lyric))
    }
    formatlyrics(lyric) {
        let fragment = document.createDocumentFragment()
        lyric.split(/\n/)
            .filter((str) => str.match(/\[.+?\]/))
            .forEach(line => {
                let str = line.replace(/\[.+?\]/g, '')
                line.match(/\[.+?\]/g)
                    .forEach(t => {
                        t = t.replace(/^\[|\]?/, '')
                        let milliseconds = parseInt(t.slice(0, 2)) * 60 * 1000 + parseInt(t.slice(3, 5)) * 1000 + parseInt(t.slice(6))
                        this.lyricArr.push([milliseconds, str])
                    })
            })
        this.lyricArr.filter(line => line[1].trim() !== '').sort((v1, v2) => v1[0] - v2[0])
            .forEach(line => {
                let p = document.createElement('p')
                p.innerText = line[1]
                p.setAttribute('data', line[0])
                fragment.appendChild(p)
            })
        console.log(this.lyricArr)
        this.root.querySelector('.mainShow2 .contentLyics').innerHTML = ''
        this.root.querySelector('.mainShow2 .contentLyics').appendChild(fragment)
    }
    setLocalLyric() { // 是数组来比较 不是节点 只有在设置高亮的时候才需要用到节点
        let current = parseInt(this.audio.currentTime*1000)
        let nextLineTime = this.lyricArr[this.lyricArrIndex][0]
        if(current>nextLineTime && this.lyricArrIndex<this.lyricArr.length){
            let node = this.root.querySelector('[data = "' + this.lyricArr[this.lyricArrIndex][0] + '"]')
            console.log(node)
            if(node) this.localLyics(node) //因为数组里面有空字符串
            this.root.querySelector('.lyricsBox .lyricsActive').innerText = this.lyricArr[this.lyricArrIndex][1]
            this.root.querySelector('.lyricsBox .lyrics').innerText = this.lyricArr[this.lyricArrIndex + 1] ? this.lyricArr[this.lyricArrIndex + 1][1] : ''
            this.lyricArrIndex++
        }
    }
    setProgressBar(){
        let progress = (this.audio.currentTime / this.audio.duration + 0.05)*100 + '%'
        let progressBar = this.root.querySelector('.progressBar')
        progressBar.style.width = progress
        this.root.querySelector('.timeStart').innerText = this.formatTime(this.audio.currentTime)
    }
    localLyics(node) { //当前歌词高亮
        let offset = node.offsetTop - this.root.querySelector('.mainShow2').offsetHeight / 2
        offset = offset > 0 ? offset : 0
        this.root.querySelector('.mainShow2 .contentLyics').style.transform = `translateY(-${offset}px)`
        this.root.querySelectorAll('.mainShow2 .contentLyics p').forEach(element => {
            element.classList.remove('active')
        })
        node.classList.add('active')
    }
}
window.p = new player('#huaweiMusic')