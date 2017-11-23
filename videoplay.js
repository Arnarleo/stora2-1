class Player {
  constructor() {
    // videos fylkið er frá 0 til n-1 en ids eru frá 1 til n
    this.id = null;
    this.url = 'videos.json';
    this.videos = null;
    this.categories = null;

    this.isPlaying = false;
    this.isMute = false;

    this.playButton = document.querySelector('.playButton');
    this.muteButton = document.querySelector('.muteButton');
    this.fullscreenButton = document.querySelector('.fullscreenButton');
    this.forwardButton = document.querySelector('.forwardButton');
    this.backwardButton = document.querySelector('.backwardButton');
    this.videoContainer = document.querySelector('.videoContainer');

    this.playButton.addEventListener('click', this.play.bind(this));
    this.muteButton.addEventListener('click', this.mute.bind(this));
    this.fullscreenButton.addEventListener('click', this.fullscreen.bind(this));
    this.forwardButton.addEventListener('click', this.forward.bind(this));
    this.backwardButton.addEventListener('click', this.backward.bind(this));
  }

  showLoad() {
    this.message.innerHTML = 'Hleð gögnum...';
    this.videoContainer.classList.add('hidden');
  }
  hideLoad() {
    this.message.innerHTML = null;
    this.videoContainer.classList.remove('hidden');
  }
  showError(e) {
    this.message.innerHTML = e;
    this.videoContainer.classList.add('hidden');
    this.message.classList.remove('hidden');
  }

  loadHTML() {
    const headerText = this.videos[this.id].title;
    const img = this.videos[this.id].poster;
    const source = this.videos[this.id].video;

    const wrapper = document.querySelector('.videoContainer__wrapper');

    // create header
    const header = document.createElement('h1');
    header.className = 'videoContainer__header';
    const headerNode = document.createTextNode(headerText);
    header.appendChild(headerNode);

    wrapper.appendChild(header);

    // create videoImg
    const videoImg = document.createElement('div');
    videoImg.className = 'videoContainer__videoImg';

    const video = document.createElement('video');
    video.className = 'videoContainer__video';
    video.poster = img;

    const videoSource = document.createElement('source');
    videoSource.src = source;
    videoSource.type = 'video/mp4';

    video.appendChild(videoSource);
    videoImg.appendChild(video);

    // create playOverlay
    const playOverlay = document.createElement('div');
    playOverlay.className = 'videoContainer__playOverlay';

    const playOverlayImage = document.createElement('img');
    playOverlayImage.className = 'videoContainer__playOverlayImage';
    playOverlayImage.src = 'img/play.svg';

    playOverlay.appendChild(playOverlayImage);

    videoImg.appendChild(playOverlay);

    wrapper.appendChild(videoImg);
  }

  preparePlayer() {
    this.video = document.querySelector('.videoContainer__video');
    this.playOverlay = document.querySelector('.videoContainer__playOverlay');
    this.playOverlayButton = document.querySelector('.videoContainer__playOverlayImage');
    this.playOverlayButton.addEventListener('click', this.play.bind(this));
  }

  load() {
    this.message = document.createElement('p');
    this.message.classList.add('message');
    document.querySelector('main').append(this.message);
    this.showLoad();
    if (window.location.href.split('?').length === 2) {
      const index = window.location.href.split('?')[1].split('=')[1];
      this.id = index - 1;
      const request = new XMLHttpRequest();
      request.open('GET', this.url, true);
      request.onload = () => {
        this.hideLoad();
        const data = JSON.parse(request.response);
        if (request.status >= 200 && request.status < 400) {
          [this.categories, this.videos] = [data.categories, data.videos];
          if (this.id < this.videos.length && this.id >= 0) {
            this.loadHTML();
            this.preparePlayer();
          } else {
            this.showError('Ólöglegt id gefið');
          }
        } else {
          this.showError(`Villa! ${data.error}`);
        }
      };
      request.onerror = () => {
        this.showError('Óþekkt villa');
      };
      request.send();
    } else {
      this.showError('Ekkert Id var gefið');
    }
  }

  play() {
    if (this.isPlaying) {
      this.video.pause();
      this.playButton.src = 'img/play.svg';
      this.playOverlay.classList.remove('hidden');
      // this.playOverlay.style.display = 'block';
    } else {
      this.video.play();
      this.playButton.src = 'img/pause.svg';
      this.playOverlay.classList.add('hidden');
      // this.playOverlay.style.display = 'none';
    }
    this.isPlaying = !this.isPlaying;
  }

  mute() {
    if (this.video.muted) {
      this.video.muted = false;
      this.muteButton.src = 'img/mute.svg';
    } else {
      this.video.muted = true;
      this.muteButton.src = 'img/unmute.svg';
    }
    this.isMute = !this.isMute;
  }

  fullscreen() {
    this.video.webkitRequestFullScreen();
  }

  forward() {
    this.video.currentTime = this.video.currentTime + 3;
  }

  backward() {
    this.video.currentTime = this.video.currentTime - 3;
  }
}

function onVideo() {
  return document.getElementById('myndband') != null;
}

document.addEventListener('DOMContentLoaded', () => {
  if (onVideo()) {
    const p = new Player();
    p.load();
  }
});
