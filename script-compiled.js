'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VideoContent = function () {
  function VideoContent() {
    _classCallCheck(this, VideoContent);

    this.url = 'videos.json';
    this.videos = null;
    this.categories = null;
    this.message = null;
  }

  _createClass(VideoContent, [{
    key: 'showLoad',
    value: function showLoad() {
      this.message.innerHTML = 'Hleð gögnum...';
      this.message.classList.remove('hidden');
    }
  }, {
    key: 'hideLoad',
    value: function hideLoad() {
      this.message.innerHTML = null;
      this.message.classList.add('hidden');
    }
  }, {
    key: 'showError',
    value: function showError(e) {
      this.message.innerHTML = e;
      this.message.classList.remove('hidden');
    }
  }, {
    key: 'displayCategory',
    value: function displayCategory(id) {
      var h = document.createElement('h1');
      var container = document.querySelector('main');
      var s = document.createElement('section');
      h.classList.add('category__header');
      h.innerHTML = this.categories[id].title;
      var v = document.createElement('div');
      v.classList.add('videos');
      s.appendChild(h);

      for (var i = 0; i < this.categories[id].videos.length; i += 1) {
        var k = this.categories[id].videos[i] - 1;
        this.displayVideo(k, v);
      }
      s.appendChild(v);
      var cs = document.createElement('div');
      cs.classList.add('content-seperator');
      s.appendChild(cs);
      container.appendChild(s);
    }
  }, {
    key: 'displayVideo',
    value: function displayVideo(id, container) {
      var video = document.createElement('div');
      video.classList.add('video');

      var a = document.createElement('a');
      a.href = 'myndband.html?id=' + this.videos[id].id;

      var vimg = document.createElement('a');
      vimg.classList.add('video__img');

      var img = document.createElement('img');
      img.src = this.videos[id].poster;
      img.alt = this.videos[id].title;

      var vd = document.createElement('div');
      vd.classList.add('video__duration');
      vd.innerHTML = this.duration(this.videos[id].duration);
      vimg.appendChild(img);
      vimg.appendChild(vd);

      var vinfo = document.createElement('div');
      vinfo.classList.add('video__info');

      var h = document.createElement('h2');
      h.innerHTML = this.videos[id].title;

      var p = document.createElement('p');
      p.innerHTML = this.howLong(this.videos[id].created);

      vinfo.appendChild(h);
      vinfo.appendChild(p);

      a.appendChild(vimg);
      a.appendChild(vinfo);

      video.appendChild(a);

      container.appendChild(video);
    }
  }, {
    key: 'duration',
    value: function duration(x) {
      var dur = x;
      var mins = Math.floor(dur / 60);
      dur %= 60;
      var secs = Math.floor(dur);

      if (secs < 10) {
        return mins + ':0' + secs;
      }
      return mins + ':' + secs;
    }
  }, {
    key: 'howLong',
    value: function howLong(x) {
      var s = (Date.now() - x) / 1000;
      var years = Math.floor(s / (365 * 24 * 60 * 60));
      s %= 365 * 24 * 60 * 60;
      var months = Math.floor(s / (30 * 24 * 60 * 60));
      s %= 30 * 24 * 60 * 60;
      var weeks = Math.floor(s / (7 * 24 * 60 * 60));
      s %= 7 * 24 * 60 * 60;
      var days = Math.floor(s / (24 * 60 * 60));
      s %= 24 * 60 * 60;
      var hours = Math.floor(s / (60 * 60));
      s %= 60 * 60;

      if (years > 1) {
        if (this.lastDigit(years) === 1) {
          return 'Fyrir ' + years + ' \xE1ri';
        }
        return 'Fyrir ' + years + ' \xE1rum';
      }
      if (months > 1) {
        if (this.lastDigit(months) === 1) {
          return 'Fyrir ' + months + ' m\xE1nu\xF0i';
        }
        return 'Fyrir ' + months + ' m\xE1nu\xF0um';
      }
      if (weeks > 1) {
        if (this.lastDigit(weeks) === 1) {
          return 'Fyrir ' + weeks + ' viku';
        }
        return 'Fyrir ' + weeks + ' vikum';
      }
      if (days > 1) {
        if (this.lastDigit(days) === 1) {
          return 'Fyrir ' + days + ' degi';
        }
        return 'Fyrir ' + days + ' d\xF6gum';
      }
      if (this.lastDigit(hours) === 1) {
        return 'Fyrir ' + hours + ' klukkustund';
      }
      return 'Fyrir ' + hours + ' klukkustundum';
    }
  }, {
    key: 'lastDigit',
    value: function lastDigit(x) {
      var str = x.toString();
      str = str.slice(-1);
      return parseInt(str, 10);
    }
  }, {
    key: 'getJSON',
    value: function getJSON() {
      var _this = this;

      var request = new XMLHttpRequest();

      this.showLoad();
      request.open('GET', this.url, true);
      request.onload = function () {
        _this.hideLoad();
        if (request.status >= 200 && request.status < 400) {
          var data = JSON.parse(request.response);
          var _ref = [data.categories, data.videos];
          _this.categories = _ref[0];
          _this.videos = _ref[1];

          for (var i = 0; i < _this.categories.length; i += 1) {
            _this.displayCategory(i);
          }
        } else {
          _this.showError('Villa! ' + request.status);
        }
      };
      request.onerror = function () {
        _this.showError('Óþekkt villa');
      };
      try {
        request.send();
      } catch (e) {
        this.showError(e);
      }
    }
  }, {
    key: 'load',
    value: function load() {
      this.message = document.createElement('p');
      this.message.classList.add('message');
      document.querySelector('main').append(this.message);
      this.getJSON();
    }
  }]);

  return VideoContent;
}();

function onIndex() {
  return document.getElementById('myndbandaleigan') != null;
}

document.addEventListener('DOMContentLoaded', function () {
  if (onIndex()) {
    var videoContent = new VideoContent();
    videoContent.load();
  }
});

var Player = function () {
  function Player() {
    _classCallCheck(this, Player);

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

  _createClass(Player, [{
    key: 'showLoad',
    value: function showLoad() {
      this.message.innerHTML = 'Hleð gögnum...';
      this.videoContainer.classList.add('hidden');
    }
  }, {
    key: 'hideLoad',
    value: function hideLoad() {
      this.message.innerHTML = null;
      this.videoContainer.classList.remove('hidden');
    }
  }, {
    key: 'showError',
    value: function showError(e) {
      this.message.innerHTML = e;
      this.videoContainer.classList.add('hidden');
      this.message.classList.remove('hidden');
    }
  }, {
    key: 'loadHTML',
    value: function loadHTML() {
      var headerText = this.videos[this.id].title;
      var img = this.videos[this.id].poster;
      var source = this.videos[this.id].video;

      var wrapper = document.querySelector('.videoContainer__wrapper');

      // create header
      var header = document.createElement('h1');
      header.className = 'videoContainer__header';
      var headerNode = document.createTextNode(headerText);
      header.appendChild(headerNode);

      wrapper.appendChild(header);

      // create videoImg
      var videoImg = document.createElement('div');
      videoImg.className = 'videoContainer__videoImg';

      var video = document.createElement('video');
      video.className = 'videoContainer__video';
      video.poster = img;

      var videoSource = document.createElement('source');
      videoSource.src = source;
      videoSource.type = 'video/mp4';

      video.appendChild(videoSource);
      videoImg.appendChild(video);

      // create playOverlay
      var playOverlay = document.createElement('div');
      playOverlay.className = 'videoContainer__playOverlay';

      var playOverlayImage = document.createElement('img');
      playOverlayImage.className = 'videoContainer__playOverlayImage';
      playOverlayImage.src = 'img/play.svg';

      playOverlay.appendChild(playOverlayImage);

      videoImg.appendChild(playOverlay);

      wrapper.appendChild(videoImg);
    }
  }, {
    key: 'preparePlayer',
    value: function preparePlayer() {
      this.video = document.querySelector('.videoContainer__video');
      this.playOverlay = document.querySelector('.videoContainer__playOverlay');
      this.playOverlayButton = document.querySelector('.videoContainer__playOverlayImage');
      this.playOverlayButton.addEventListener('click', this.play.bind(this));
    }
  }, {
    key: 'load',
    value: function load() {
      var _this2 = this;

      this.message = document.createElement('p');
      this.message.classList.add('message');
      document.querySelector('main').append(this.message);
      this.showLoad();
      if (window.location.href.split('?').length === 2) {
        var index = window.location.href.split('?')[1].split('=')[1];
        this.id = index - 1;
        var request = new XMLHttpRequest();
        request.open('GET', this.url, true);
        request.onload = function () {
          _this2.hideLoad();
          var data = JSON.parse(request.response);
          if (request.status >= 200 && request.status < 400) {
            var _ref2 = [data.categories, data.videos];
            _this2.categories = _ref2[0];
            _this2.videos = _ref2[1];

            if (_this2.id < _this2.videos.length && _this2.id >= 0) {
              _this2.loadHTML();
              _this2.preparePlayer();
            } else {
              _this2.showError('Ólöglegt id gefið');
            }
          } else {
            _this2.showError('Villa! ' + data.error);
          }
        };
        request.onerror = function () {
          _this2.showError('Óþekkt villa');
        };
        request.send();
      } else {
        this.showError('Ekkert Id var gefið');
      }
    }
  }, {
    key: 'play',
    value: function play() {
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
  }, {
    key: 'mute',
    value: function mute() {
      if (this.video.muted) {
        this.video.muted = false;
        this.muteButton.src = 'img/mute.svg';
      } else {
        this.video.muted = true;
        this.muteButton.src = 'img/unmute.svg';
      }
      this.isMute = !this.isMute;
    }
  }, {
    key: 'fullscreen',
    value: function fullscreen() {
      this.video.webkitRequestFullScreen();
    }
  }, {
    key: 'forward',
    value: function forward() {
      this.video.currentTime = this.video.currentTime + 3;
    }
  }, {
    key: 'backward',
    value: function backward() {
      this.video.currentTime = this.video.currentTime - 3;
    }
  }]);

  return Player;
}();

function onVideo() {
  return document.getElementById('myndband') != null;
}

document.addEventListener('DOMContentLoaded', function () {
  if (onVideo()) {
    var p = new Player();
    p.load();
  }
});

//# sourceMappingURL=script-compiled.js.map