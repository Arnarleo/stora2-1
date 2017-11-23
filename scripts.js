class VideoContent {
  constructor() {
    this.url = 'videos.json';
    this.videos = null;
    this.categories = null;
    this.message = null;
  }
  showLoad() {
     this.message.innerHTML = 'Hleð gögnum...';
     this.message.classList.remove('hidden');
   }
   hideLoad() {
     this.message.innerHTML = null;
     this.message.classList.add('hidden');
   }
   showError(e) {
     this.message.innerHTML = e;
     this.message.classList.remove('hidden');
   }

   displayCategory(id) {
     const h = document.createElement('h1');
     const container = document.querySelector('main');
     const s = document.createElement('section');
     h.classList.add('category__header');
     h.innerHTML = this.categories[id].title;
     const v = document.createElement('div');
     v.classList.add('videos');
     s.appendChild(h);

     for (let i = 0; i < this.categories[id].videos.length; i += 1) {
       const k = this.categories[id].videos[i] - 1;
       this.displayVideo(k, v);
     }
     s.appendChild(v);
     const cs = document.createElement('div');
     cs.classList.add('content-seperator');
     s.appendChild(cs);
     container.appendChild(s);
   }
   displayVideo(id, container) {
    const video = document.createElement('div');
    video.classList.add('video');

    const a = document.createElement('a');
    a.href = `myndband.html?id=${this.videos[id].id}`;

    const vimg = document.createElement('a');
    vimg.classList.add('video__img');

    const img = document.createElement('img');
    img.src = this.videos[id].poster;
    img.alt = this.videos[id].title;

    const vd = document.createElement('div');
    vd.classList.add('video__duration');
    vd.innerHTML = this.duration(this.videos[id].duration);
    vimg.appendChild(img);
    vimg.appendChild(vd);

    const vinfo = document.createElement('div');
    vinfo.classList.add('video__info');

    const h = document.createElement('h2');
    h.innerHTML = this.videos[id].title;

    const p = document.createElement('p');
    p.innerHTML = this.howLong(this.videos[id].created);

    vinfo.appendChild(h);
    vinfo.appendChild(p);

    a.appendChild(vimg);
    a.appendChild(vinfo);

    video.appendChild(a);

    container.appendChild(video);
  }
  duration(x) {
    let dur = x;
    const mins = Math.floor(dur / 60);
    dur %= 60;
    const secs = Math.floor(dur);

    if (secs < 10) {
      return `${mins}:0${secs}`;
    }
    return `${mins}:${secs}`;
  }
  howLong(x) {
    let s = (Date.now() - x) / 1000;
    const years = Math.floor(s / (365 * 24 * 60 * 60));
    s %= (365 * 24 * 60 * 60);
    const months = Math.floor(s / (30 * 24 * 60 * 60));
    s %= (30 * 24 * 60 * 60);
    const weeks = Math.floor(s / (7 * 24 * 60 * 60));
    s %= (7 * 24 * 60 * 60);
    const days = Math.floor(s / (24 * 60 * 60));
    s %= (24 * 60 * 60);
    const hours = Math.floor(s / (60 * 60));
    s %= (60 * 60);

    if (years > 1) {
      if (this.lastDigit(years) === 1) {
        return `Fyrir ${years} ári`;
      }
      return `Fyrir ${years} árum`;
    }
    if (months > 1) {
      if (this.lastDigit(months) === 1) {
        return `Fyrir ${months} mánuði`;
      }
      return `Fyrir ${months} mánuðum`;
    }
    if (weeks > 1) {
      if (this.lastDigit(weeks) === 1) {
        return `Fyrir ${weeks} viku`;
      }
      return `Fyrir ${weeks} vikum`;
    }
    if (days > 1) {
      if (this.lastDigit(days) === 1) {
        return `Fyrir ${days} degi`;
      }
      return `Fyrir ${days} dögum`;
    }
    if (this.lastDigit(hours) === 1) {
      return `Fyrir ${hours} klukkustund`;
    }
    return `Fyrir ${hours} klukkustundum`;
  }

  lastDigit(x) {
    let str = x.toString();
    str = str.slice(-1);
    return parseInt(str, 10);
  }

  getJSON() {
    const request = new XMLHttpRequest();

    this.showLoad();
    request.open('GET', this.url, true);
    request.onload = () => {
      this.hideLoad();
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.response);
        [this.categories, this.videos] = [data.categories, data.videos];
        for (let i = 0; i < this.categories.length; i += 1) {
          this.displayCategory(i);
        }
      } else {
        this.showError(`Villa! ${request.status}`);
      }
    };
    request.onerror = () => {
      this.showError('Óþekkt villa');
    };
    try {
      request.send();
    } catch (e) {
      this.showError(e);
    }
  }

  load() {
    this.message = document.createElement('p');
    this.message.classList.add('message');
    document.querySelector('main').append(this.message);
    this.getJSON();
  }
}

function onIndex() {
  return document.getElementById('myndbandaleigan') != null;
}

document.addEventListener('DOMContentLoaded', () => {
  if (onIndex()) {
    const videoContent = new VideoContent();
    videoContent.load();
  }
});

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
