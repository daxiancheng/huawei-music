import './icon'
class player{
    constructor(node) {
        this.root = document.querySelector(node)
        this.playList = []
        this.currentIndex = 0
        this.audio = new Audio() //相当于在html中创建audio标签
        this.start()
        this.bind()
    }
    start() {
        fetch('https://jirengu.github.io/data-mock/huawei-music/music-list.json')
        .then((res)=>{return res.json()})
        .then((data)=>{
            console.log(data)
            this.playList = data
            this.audio.src = this.playList[this.currentIndex].url
        })
    }
    bind() {
        let self = this
        this.root.querySelector('.iconplay').onclick = function() {
           if(this.classList.contains('playing')){
            self.audio.play()
            this.classList.remove('playing')
            this.classList.add('pause')
            this.querySelector('use').setAttribute('xlink:href','#icon-pause')
           }else if(this.classList.contains('pause')){
            self.audio.pause()
            this.classList.remove('pause')
            this.classList.add('playing')
            this.querySelector('use').setAttribute('xlink:href','#icon-play')
           }
        }
        this.root.querySelector('.iconnext').onclick = function() {
            self.nextplay()
            self.audio.play()
            self.root.querySelector('.iconplay').classList.remove('playing')
            self.root.querySelector('.iconplay').classList.add('pause')
            self.root.querySelector('.iconplay').querySelector('use').setAttribute('xlink:href','#icon-pause')
        }
        this.root.querySelector('.iconpre').onclick = function() {
            self.preplay()
            self.audio.play()
            self.root.querySelector('.iconplay').classList.remove('playing')
            self.root.querySelector('.iconplay').classList.add('pause')
            self.root.querySelector('.iconplay').querySelector('use').setAttribute('xlink:href','#icon-pause')
        }
    }
    preplay() {
        this.currentIndex = (this.currentIndex + this.playList.length - 1)%4
        this.audio.src = this.playList[this.currentIndex].url
    }
    nextplay() {
        this.currentIndex = (this.currentIndex + this.playList.length + 1)%4
        this.audio.src = this.playList[this.currentIndex].url
    }
}
new player('#huaweiMusic')