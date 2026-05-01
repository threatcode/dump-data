/*
 * © Ipvision
 */
(function PlayerInit(window) {
    'use strict';

    function Player(option) {
        var $this = this,
            _idleTimer = null;

        $this.dicts = {
            maximize: 'Back to normal view',
            minimize: 'Go to small view',
            fullScreen: 'Full Screen',
            auto: 'Auto Play',
        };

        $this.webview = '<div class="rg-player webview">'
                        + '<div class="container">'
                        + '</div>'
                        + '</div>';
        $this.template = '<div class="rg-player">'
                + '<div class="container">'
                + '<div class="play-info"></div>'
                + '<div class="play-error"></div>'
                + '<div class="player-debug">Meta Data</div>'
                + ' <div class="music-bars">'
                + '<span></span><span></span>'
                + '<span></span><span></span>'
                + '<span></span><span></span><span>'
                + '</span><span></span><span></span><span>'
                + '</span><span></span><span></span><span>'
                + '</span><span></span><span></span><span>'
                + '</span><span></span><span></span><span>'
                + '</span><span></span>'
                + '</div>'
                + '<div class="big-play"><span class="player-sprite icon-player"></span></div>'
                + '<div style="display:none;" class="loader">'
                + '<div class="circle1"></div>'
                + '<div class="circle2"></div>'
                + '<div class="circle3"></div>'
                + '</div>'
                + '<div class="player-poster">'
                + '<img class="poster" />'
                + '</div>'
                + '<div class="ringid-logo">'
                + '</div>'
                + '</div>'
                + '<div class="media-control">'
                + '<div class="media-tip"></div>'
                + '<div class="media-control-bg"></div>'
                + '<div class="media-control-layer">'
                + '<div class="bar-panel">'
                + '<div class="bar-container">'
                + '<div class="bar-background">'
                + '<div class="bar-fill-1"></div>'
                + '<div class="bar-fill-2"></div>'
                + '<div class="bar-hover"></div>'
                + '</div>'
                + '<div class="bar-scrubber">'
                + '<div class="bar-scrubber-icon"></div>'
                + '</div>'
                + '<div class="seek-time">'
                + '<div class="timer"></div>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '<div class="control-left">'
                + '<div class="play-btns">'
                + '<button class="player-sprite icon-play-p control-btn start-btn"></button>'
                + '</div>'
                + '<div class="volume-bar">'
                + '<div class="player-sprite icon-speaker-fill volume-icon unmute"></div>'
                + '<div class="volume-bar-container volume-bar-hide">'
                + '<div data-rel="0" class="bar fill"></div>'
                + '<div data-rel="1" class="bar fill"></div>'
                + '<div data-rel="2" class="bar fill"></div>'
                + '<div data-rel="3" class="bar fill"></div>'
                + '<div data-rel="4" class="bar"></div>'
                + '<div data-rel="5" class="bar"></div>'
                + '<div data-rel="6" class="bar"></div>'
                + '<div data-rel="7" class="bar"></div>'
                + '<div data-rel="8" class="bar"></div>'
                + '<div data-rel="9" class="bar"></div>'
                + '</div>'
                + '</div>'
                + '<div class="time-indicator time-running"></div>'
                + '<div class="time-indicator time-total"></div>'
                + '</div>'
                + '<div class="control-right">'
                + '<button class="control-btn hd">HD</button>'
                + '<button class="player-sprite icon-screen-f control-btn full-screen" tooltip="' + this.dicts.fullScreen + '"></button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';

        $this.secToTime = function secToTime(sec) {
            var seconds,
                hours,
                minutes,
                result = '';

            seconds = Math.floor(sec);
            hours = parseInt(seconds / 3600, 10) % 24;
            minutes = parseInt(seconds / 60, 10) % 60;
            seconds = (seconds < 0) ? 0 : seconds % 60;

            if (hours > 0)
                result += (hours < 10 ? '0' + hours : hours);
            result += (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
            return result;
        };

        $this.findPos = function findPos(element) {
            var x = 0,
                y = 0,
                el = element;
            if (el.offsetParent) {
                do {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                } while ((el = el.offsetParent) !== null);
            }
            return { x: x, y: y };
        };

        $this.destroy = function destroy() {
            try {
                $this.removeEvent();
                $this.provider.pause();
                $this.provider.src = '';
                $this.dom = null;
                delete $this.provider;
                    // delete instance;
            } catch (e) {
                throw new Error('undfined instance provided. ignoring...');
            }
        };

        $this.addRemoveClass = function addRemoveClass(el, add, remove) {
            var i;
            for (i = 0; i < remove.length; i++) {
                el.className = el.className.replace(remove[i], '').trim();
            }

            for (i = 0; i < add.length; i++) {
                el.className += ' ' + add[i];
            }
        };

        $this.createMediaObject = function createMediaObject(type) {
            return (type === 'audio') ? document.createElement('audio') : document.createElement('video');
        };


        $this.init = function init() {
            $this.source = option.source || '';
            $this.autoPlay = option.autoPlay || false;
            $this.auto = option.auto || false;
            $this.parent = document.getElementById(option.parentId);
            $this.poster = option.poster || '';
            $this.mediaType = option.type || 'video';
            $this.dom = {};
            $this.playingState = (this.autoPlay) ? 'INIT' : 'STOPPED';
            $this.bufferState = 'BUFFERING';
            $this.screenState = 'NORMAL';
            $this.volumeState = 'UNMUTE';
            $this.controlState = true;
            $this.volume = 5;
            $this.duration = 0;
            $this.currentTrack = 0;
            $this.title = option.title || '';
            $this.hd = false;
            $this.debug = false;
            $this.isMouseDown = false;
            $this.isTouchable = 'ontouchstart' in window || navigator.msMaxTouchPoints;
            $this.isTouchInitiate = false;

            if ($this.isTouchable) $this.autoPlay = false;

            $this.isLoading = $this.autoPlay;
            $this.isFirefox = !!(navigator.userAgent.match(/firefox/i));
            $this.isSafari = !!(navigator.userAgent.match(/safari/i));
            $this.isWebView = !window.navigator.standalone && !$this.isSafari && !$this.isFirefox;
            $this.canPlay = true;

            if ($this.isWebView) {
                $this.mediaType = 'video';
            }

            $this.provider = $this.createMediaObject($this.mediaType);

            if ($this.isWebView) {
                $this.provider.src = option.source;
                $this.provider.setAttribute('airplay', 'allow');
                $this.provider.setAttribute('controls', 'true');
                $this.provider.setAttribute('x-webkit-airplay', 'allow');
                if ($this.poster) {
                    $this.provider.setAttribute('poster', $this.poster);
                }
                $this.parent.innerHTML = $this.webview;
                $this.dom.player = $this.parent.querySelector('.rg-player');
                $this.dom.container = $this.parent.querySelector('.container');
                $this.dom.player.style.width = (option.width) ? option.width + 'px' : '100%';
                $this.dom.player.style.height = (option.height) ? option.height + 'px' : '100%';
                $this.dom.container.appendChild($this.provider);
                return;
            }

            $this.parent.innerHTML = $this.template;

            $this.dom.player = $this.parent.querySelector('.rg-player');
            $this.dom.container = $this.parent.querySelector('.container');
            $this.dom.control = $this.parent.querySelector('.media-control');
            $this.dom.bigBlay = $this.dom.container.querySelector('.big-play');
            $this.dom.bigBlayIcon = $this.dom.bigBlay.querySelector('span');
            $this.dom.playError = $this.dom.container.querySelector('.play-error');
            $this.dom.debug = $this.dom.container.querySelector('.player-debug');
            $this.dom.playInfo = $this.dom.container.querySelector('.play-info');
            $this.dom.musicBar = $this.dom.container.querySelector('.music-bars');
            $this.dom.loader = $this.dom.container.querySelector('.loader');
            $this.dom.poster = $this.dom.container.querySelector('.player-poster');
            $this.dom.logo = $this.dom.container.querySelector('.ringid-logo');
            $this.dom.posterImg = $this.dom.poster.querySelector('.poster');
            $this.dom.barContainer = $this.dom.control.querySelector('.bar-container');
            $this.dom.barScrubber = $this.dom.control.querySelector('.bar-scrubber');
            $this.dom.barLoaded = $this.dom.control.querySelector('.bar-fill-1');
            $this.dom.barPosition = $this.dom.control.querySelector('.bar-fill-2');
            $this.dom.barHover = $this.dom.control.querySelector('.bar-hover');
            $this.dom.controlLayer = $this.dom.control.querySelector('.media-control-layer');
            $this.dom.controlBG = $this.dom.control.querySelector('.media-control-bg');
            $this.dom.controlTip = $this.dom.control.querySelector('.media-tip');
            $this.dom.playBtn = $this.dom.control.querySelector('.start-btn');
            $this.dom.timeRunning = $this.dom.control.querySelector('.time-running');
            $this.dom.timeTotal = $this.dom.control.querySelector('.time-total');
            $this.dom.hd = $this.dom.control.querySelector('.hd');
            $this.dom.volumeIcon = $this.dom.control.querySelector('.volume-icon');
            $this.dom.volumeBarContainer = $this.dom.control.querySelector('.volume-bar-container');
            $this.dom.volumeBars = $this.dom.volumeBarContainer.querySelectorAll('.bar');
            $this.dom.fullScreenBtn = $this.dom.control.querySelector('.full-screen');
            $this.dom.seekTimer = $this.dom.control.querySelector('.seek-time');
            $this.dom.timer = $this.dom.control.querySelector('.timer');

            $this.dom.player.style.width = (option.width) ? option.width + 'px' : '100%';
            $this.dom.player.style.height = (option.height) ? option.height + 'px' : '100%';
            $this.dom.timeRunning.innerHTML = '00:00';
            $this.dom.timeTotal.innerHTML = '00:00';

            $this.dom.poster.appendChild($this.provider);

            if ($this.autoPlay) {
                $this.dom.loader.style.display = 'block';
            }
        };


        $this.initEvent = function initEvent() {
            var i;
            $this.dom.playBtn.addEventListener('click', clickPlayBtnCallback, false);
            $this.dom.volumeIcon.addEventListener('click', clickVolumeCallback, false);
            $this.dom.fullScreenBtn.addEventListener('click', clickFullScreenCallback, false);


            $this.dom.container.addEventListener('click', clickContainerCallback, false);
            $this.dom.container.addEventListener('mouseover', mouseoverPlayerCallback, false);
            $this.dom.container.addEventListener('mouseleave', mouseleavePlayerCallback, false);


            if ($this.isTouchable) {
                $this.dom.barContainer.addEventListener('touchmove', mousemoveBarCallback, false);
                $this.dom.barContainer.addEventListener('touchstart', mousedownBarCallback, false);
                $this.dom.barContainer.addEventListener('touchend', mouseupBarCallback, false);
                $this.dom.barContainer.addEventListener('touchcancel', mouseleaveBarCallback, false);
            }

            $this.dom.barContainer.addEventListener('mousemove', mousemoveBarCallback, false);
            $this.dom.barContainer.addEventListener('mousedown', mousedownBarCallback, false);
            $this.dom.barContainer.addEventListener('mouseup', mouseupBarCallback, false);
            $this.dom.barContainer.addEventListener('mouseleave', mouseleaveBarCallback, false);

            $this.dom.logo.addEventListener('click', clickOnLogo, false);


            for (i = 0; i < $this.dom.volumeBars.length; i++) {
                $this.dom.volumeBars[i].addEventListener('click', clickVolumeBarCallback);
            }

            /* tooptip event */
            $this.dom.fullScreenBtn.addEventListener('mouseover', mouseoverFullCallback, false);
            $this.dom.fullScreenBtn.addEventListener('mouseleave', mouseleaveFullCallback, false);

            // document events
            document.addEventListener('mozfullscreenchange', playerFullScreen, false);
            document.addEventListener('webkitfullscreenchange', playerFullScreen, false);
            document.addEventListener('fullscreenchange', playerFullScreen, false);
            document.addEventListener('keyup', playerKeyEvt, false);

            if ($this.isTouchable) {
                window.addEventListener('touchend', touchendOnContainer);
            }

            $this.setMediaEvent();
            $this.showPoster(true);
        };


        $this.setMediaEvent = function setMediaEvent() {
            $this.provider.addEventListener('loadedmetadata', function loadedmetadataCallback() {
                $this.initTime($this.provider.duration);
                if ($this.autoPlay) {
                    $this.play();
                    $this.deferControlHide();
                    $this.controlState = true;
                }
            });

            $this.provider.addEventListener('timeupdate', function timeupdateCallback() {
                var buffered,
                    bufferState,
                    currentTime,
                    duration;
                if (!$this.provider || $this.isMouseDown)
                    return;

                duration = $this.provider.duration;
                currentTime = $this.provider.currentTime;
                buffered = $this.provider.buffered.length > 0 ? $this.provider.buffered.end($this.provider.buffered.length - 1) : 0;
                bufferState = (currentTime + 0.05) >= buffered ? 'BUFFERING' : 'PLAYING_BUFFERING';

                if ($this.provider.readyState !== 4 || currentTime < 0.05 || buffered === 0) bufferState = 'BUFFERING';

                $this.showBuffered(buffered, duration);
                $this.stateChanged(bufferState);
                $this.bufferState = bufferState;
                $this.showPosition(currentTime, duration);
                $this.showDebug();
            });

            $this.provider.addEventListener('play', function playCallback() {
                $this.stateChanged('PLAYING');

                if ($this.mediaType === 'video') {
                    $this.showPoster(false);
                }
            });

            $this.provider.addEventListener('pause', function pauseCallback() {
                $this.stateChanged('PAUSED');

                if ($this.mediaType === 'video') {
                    $this.showPoster(false);
                }
            });

            $this.provider.addEventListener('ended', function endedCallBack() {
                $this.stateChanged('ENDED');

                if ($this.mediaType === 'video') {
                    $this.showPoster(false);
                }
            });

            $this.provider.addEventListener('stalled', function stalledCallback() {
                if (!$this.provider)
                    return;
            });

            $this.provider.addEventListener('error', function errorCallback() {
                if (!$this.provider)
                    return;
                $this.error = $this.provider.error.code;
                $this.canPlay = false;
                $this.showError();
            });
        };

        $this.removeEvent = function removeEvent() {
            var i;
            $this.dom.playBtn.removeEventListener('click', clickPlayBtnCallback);
            $this.dom.volumeIcon.removeEventListener('click', clickVolumeCallback);
            $this.dom.fullScreenBtn.removeEventListener('click', clickFullScreenCallback);
            $this.dom.barContainer.removeEventListener('mousemove', mousemoveBarCallback);
            $this.dom.barContainer.removeEventListener('mousedown', mousedownBarCallback);
            $this.dom.barContainer.removeEventListener('mouseup', mouseupBarCallback);
            $this.dom.barContainer.removeEventListener('mouseleave', mouseleaveBarCallback);


            $this.dom.barContainer.removeEventListener('touchmove', mousemoveBarCallback);
            $this.dom.barContainer.removeEventListener('touchstart', mousedownBarCallback);
            $this.dom.barContainer.removeEventListener('touchend', mouseupBarCallback);
            $this.dom.barContainer.removeEventListener('touchcancel', mouseleaveBarCallback);


            $this.dom.container.removeEventListener('click', clickContainerCallback);
            // $this.dom.player.removeEventListener('mouseover', mouseoverPlayerCallback);
            // $this.dom.player.removeEventListener('mouseleave', mouseleavePlayerCallback);


            for (i = 0; i < $this.dom.volumeBars.length; i++) {
                $this.dom.volumeBars[i].removeEventListener('click', clickVolumeBarCallback);
            }

            $this.dom.fullScreenBtn.removeEventListener('mouseover', mouseoverFullCallback);
            $this.dom.fullScreenBtn.removeEventListener('mouseleave', mouseleaveFullCallback);

            document.removeEventListener('mozfullscreenchange', playerFullScreen);
            document.removeEventListener('webkitfullscreenchange', playerFullScreen);
            document.removeEventListener('fullscreenchange', playerFullScreen);
            document.removeEventListener('keyup', playerKeyEvt);
        };


        $this.playPause = function playPause() {
            if (!$this.canPlay)
                return;

            if ($this.playingState === 'PLAYING') {
                $this.pause();
                $this.showLoader();
                $this.showControl();
                $this.showInfo(true);
                hideControl();
                return;
            }

            if ($this.playingState === 'PAUSED') {
                $this.resume();
                $this.showLoader();
                $this.showBigPlay();
                $this.showControl();
                $this.showInfo();
                return;
            }

            if ($this.playingState === 'STOPPED') {
                $this.play();
                $this.showLoader();
                $this.showBigPlay();
                $this.showInfo();
                $this.showControl();
                return;
            }
        };

        $this.muteUnmute = function muteUnmute() {
            if ($this.volumeState === 'UNMUTE') {
                $this.provider.muted = true;
                $this.addRemoveClass($this.dom.volumeIcon, ['icon-speaker-m'], ['icon-speaker-fill']);
                $this.volumeState = 'MUTE';
                return;
            }

            if ($this.volumeState === 'MUTE') {
                $this.provider.muted = true;
                $this.addRemoveClass($this.dom.volumeIcon, ['icon-speaker-fill'], ['icon-speaker-m']);
                $this.volumeState = 'UNMUTE';
                return;
            }
        };

        $this.initTime = function initTime(duration) {
            $this.dom.timeTotal.innerHTML = $this.secToTime(duration);
            $this.duration = duration;
        };

        $this.showPosition = function showPosition(position, duration) {
            if ($this.duration === 0 && duration > 0) {
                $this.initTime(duration);
            }

            if (position > duration) {
                $this.initTime(position);
            }

            $this.dom.timeRunning.innerHTML = $this.secToTime(position);
            $this.dom.barScrubber.style.left = ($this.duration === 0) ? '-' + ($this.dom.barScrubber.offsetWidth / 2) + 'px' :
            'calc(' + ((position / $this.duration) * 100) + '% - ' + ($this.dom.barScrubber.offsetWidth / 2) + 'px)';
            $this.dom.barPosition.style.width = ($this.duration === 0) ? '0%' : ((position / $this.duration) * 100) + '%';
        };

        $this.showBuffered = function showBuffered(buffered, duration) {
            if ($this.duration === 0 && duration > 0) {
                $this.initTime(duration);
            }
            $this.dom.barLoaded.style.width = ($this.duration === 0) ? '0%' : ((buffered / $this.duration) * 100) + '%';
        };

        $this.timeInfo = function timeInfo(event) {
            var pos,
                diff,
                curTime,
                pageX;
            if (event.type === 'touchend') return;

            pageX = event.pageX ? event.pageX : event.touches[0].pageX;

            pos = ($this.screenState === 'FULL') ? { x: 0, y: 0 } : $this.findPos($this.dom.barContainer);
            diff = pageX - pos.x;
            curTime = Math.round((diff * $this.duration) / $this.dom.barContainer.offsetWidth);
            if (curTime < 0)
                curTime = 0;
            $this.dom.timer.innerHTML = $this.secToTime(curTime);
            $this.dom.seekTimer.style.left = (diff - ($this.dom.seekTimer.offsetWidth / 2)) + 'px';
            $this.dom.barHover.style.left = (diff - ($this.dom.barHover.offsetWidth / 2)) + 'px';
        };

        $this.showTootip = function showTootip(event, text) {
            var pageX,
                pos,
                diff,
                pw,
                tw;
            if (event.type === 'touchend') return;

            pageX = event.pageX ? event.pageX : event.touches[0].pageX;

            pos = ($this.screenState === 'FULL') ? { x: 0, y: 0 } : $this.findPos($this.dom.barContainer);
            diff = pageX - pos.x;
            $this.dom.controlTip.innerHTML = text;

            $this.dom.controlTip.style.display = 'block';
            pw = $this.dom.barContainer.offsetWidth;
            tw = $this.dom.controlTip.offsetWidth;
            diff = pw <= ((tw / 2) + diff) ? (pw - (tw / 2)) : diff;
            $this.dom.controlTip.style.left = (diff - (tw / 2)) + 'px';
        };

        $this.setPosition = function setPosition(event, seek) {
            var pageX,
                pos,
                diff,
                curTime;
            if ($this.playingState === 'STOPPED' || !$this.canPlay)
                return;

            if (event.type === 'touchend') {
                diff = $this.findPos($this.dom.barScrubber).x;
                curTime = Math.round((diff * $this.duration) / $this.dom.barContainer.offsetWidth);
                $this.seek(curTime);
                return;
            }

            pageX = event.pageX ? event.pageX : event.touches[0].pageX;

            pos = ($this.screenState === 'FULL') ? { x: 0, y: 0 } : $this.findPos($this.dom.barContainer);
            diff = pageX - pos.x;
            curTime = Math.round((diff * $this.duration) / $this.dom.barContainer.offsetWidth);

            if (seek) {
                $this.seek(curTime);
            }

            $this.showPosition(curTime);
        };

        $this.changeVolume = function changeVolume(volume) {
            var i;
            for (i = 0; i < $this.dom.volumeBars.length; i++) {
                $this.addRemoveClass($this.dom.volumeBars[i], [], ['fill']);
            }
            for (i = 0; i <= volume; i++) {
                $this.addRemoveClass($this.dom.volumeBars[i], ['fill'], []);
            }

            $this.volume = volume + 1;

                /* if mute and try to change volume, then unmute*/
            if ($this.volumeState === 'MUTE') {
                $this.muteUnmute();
                return;
            }

            $this.setVolume($this.volume);
        };

        $this.showHD = function showHD() {
            /* keeping it for future
             var currentLevel = $this.levels[level]
             if (currentLevel) {
             $this.hd = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000);
             }*/

            if ($this.hd) {
                $this.dom.hd.style.display = 'inline-block';
            } else {
                $this.dom.hd.style.display = 'none';
            }
        };


        $this.showPoster = function showPoster(show) {
            if ($this.poster === '')
                return;

            if (show) {
                $this.dom.posterImg.src = $this.poster;
                $this.dom.posterImg.style.display = 'inline-block';
            } else {
                $this.dom.posterImg.style.display = 'none';
            }
        };

        $this.showInfo = function showInfo(force) {
            if ($this.title === '' || $this.mediaType !== 'audio' || force) {
                $this.dom.playInfo.style.display = 'none';
            } else {
                $this.dom.playInfo.innerHTML = $this.title;
                $this.dom.playInfo.style.display = 'block';
            }
        };


        $this.showLoader = function showLoader() {
            if ($this.isTouchable && !$this.isTouchInitiate) return;

            if ($this.isLoading && $this.canPlay && $this.bufferState === 'BUFFERING')
                $this.dom.loader.style.display = 'block';
            else
               $this.dom.loader.style.display = 'none';

            $this.showMusicBar();
            $this.showBigPlay();
        };

        $this.showError = function showError() {
            $this.dom.playError.innerHTML = 'Sorry, your browser does not support this media format OR your are trying to access invalid URL.';

            if (!$this.canPlay) {
                $this.showPoster(false);
                $this.showLoader();
                $this.dom.playError.style.display = 'block';
                // $this.showControl();
                $this.showBigPlay();
                $this.addRemoveClass($this.dom.playBtn, ['icon-play-p'], ['icon-pause-p', 'icon-play-p']);
            } else {
                $this.dom.playError.style.display = 'none';
            }
        };

        $this.showBigPlay = function showBigPlay(replay) {
            if (!$this.canPlay) {
                $this.dom.bigBlay.style.display = 'none';
                return;
            }

            if (replay) {
                $this.addRemoveClass($this.dom.bigBlayIcon, ['icon-reload-p'], []);
            } else {
                $this.addRemoveClass($this.dom.bigBlayIcon, [], ['icon-reload-p']);
            }

            if (replay && $this.playingState === 'STOPPED') {
                $this.dom.bigBlay.style.display = 'block';
                return;
            }

            if (($this.playingState === 'PAUSED' || $this.playingState === 'STOPPED' || ($this.isTouchable && !$this.isTouchInitiate)) && !$this.isLoading) {
                $this.dom.bigBlay.style.display = 'block';
            } else {
                $this.dom.bigBlay.style.display = 'none';
            }

            $this.showMusicBar();
        };


        $this.setAuto = function setAuto(force) {
            if (force) {
                $this.addRemoveClass($this.dom.auto, ['enbled'], []);
                return;
            }

            if ($this.auto) {
                $this.auto = false;
                $this.addRemoveClass($this.dom.auto, [], ['enbled']);
                return;
            }

            if (!$this.auto) {
                $this.auto = true;
                $this.addRemoveClass($this.dom.auto, ['enbled'], []);
                return;
            }
        };

        $this.showMusicBar = function showMusicBar() {
            if ($this.mediaType === 'audio' && $this.playingState === 'PLAYING' && $this.bufferState === 'PLAYING_BUFFERING' && !$this.isLoading) {
                $this.dom.musicBar.style.display = 'block';
            } else {
                $this.dom.musicBar.style.display = 'none';
            }
        };

        $this.showControl = function showControl() {
            if ($this.playingState === 'PLAYING') {
                $this.dom.controlLayer.style.bottom = '0px';
                $this.dom.controlBG.style.opacity = 1;
                $this.controlState = true;
                $this.deferControlHide();
            }
        };

        $this.deferControlHide = function deferControlHide() {
            if (_idleTimer) {
                clearTimeout(_idleTimer);
            }

            if ($this.controlState) {
                _idleTimer = setTimeout(hideControl, 6000);
            }
        };

        $this.showDebug = function showDebug() {
            var buffered;
            if ($this.debug) {
                buffered = $this.provider.buffered.length > 0 ? $this.provider.buffered.end($this.provider.buffered.length - 1) : 0;
                $this.dom.debug.innerHTML = 'ready State: ' + $this.provider.readyState
                + ' <br />Buffered: ' + buffered
                + ' <br />Current time: ' + $this.provider.currentTime
                + ' <br />Playing State: ' + $this.playingState
                + ' <br />Buffer State: ' + $this.bufferState
                + ' <br />Loading State: ' + (($this.isLoading) ? 'true' : 'false');
            }
        };

        $this.stateChanged = function stateChanged(state) {
            if ($this.bufferState === 'BUFFERING') {
                $this.isLoading = true;
            } else {
                $this.isLoading = false;
            }

            if (state === 'PLAYING') {
                $this.playingState = 'PLAYING';
                $this.showBigPlay();
                $this.addRemoveClass($this.dom.playBtn, ['icon-pause-p'], ['icon-play-p', 'icon-pause-p']);
            }
            if (state === 'ENDED' || state === 'IDLE') {
                $this.playingState = 'STOPPED';
                $this.bufferState = 'BUFFERING';
                $this.isLoading = false;
                $this.showBigPlay(true);

                $this.addRemoveClass($this.dom.playBtn, ['icon-play-p'], ['icon-pause-p', 'icon-play-p']);
                $this.initTime(0);
                $this.showPosition(0);
                $this.showInfo(true);
            }

            $this.showLoader();
        };

        $this.reset = function reset() {
            $this.isLoading = true;
            $this.initTime(0);
            $this.showPosition(0);
            $this.showBuffered(0);
            $this.showLoader();
            $this.showInfo();
        };

        $this.fullScreen = function fullScreen() {
            if ($this.screenState === 'NORMAL') {
                if ($this.dom.player.requestFullscreen) {
                    $this.dom.player.requestFullscreen();
                } else if ($this.dom.player.mozRequestFullScreen) {
                    $this.dom.player.mozRequestFullScreen();
                } else if ($this.dom.player.webkitRequestFullScreen) {
                    $this.dom.player.webkitRequestFullScreen();
                } else {
                    return false;
                }

                $this.screenState = 'FULL';
                $this.showControl();

                $this.addRemoveClass($this.dom.player, ['full'], []);
                $this.addRemoveClass($this.dom.fullScreenBtn, ['icon-screen-fe'], ['icon-screen-f']);

                $this.dom.fullScreenBtn.setAttribute('tooltip', $this.dicts.maximize);

                if ($this.isTouchable) {
                    $this.dom.controlTip.style.display = 'none';
                }

                return true;
            }

            if ($this.screenState === 'FULL') {
                if (document.cancelFullscreen) {
                    document.cancelFullscreen();
                } else if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                $this.addRemoveClass($this.dom.player, [], ['full']);
                $this.addRemoveClass($this.dom.fullScreenBtn, ['icon-screen-f'], ['icon-screen-fe']);

                // $this.showControl(true);
                $this.screenState = 'NORMAL';
                $this.dom.fullScreenBtn.setAttribute('tooltip', $this.dicts.fullScreen);

                if ($this.isTouchable) {
                    $this.dom.controlTip.style.display = 'none';
                }
                return true;
            }

            return true;
        };

           /*  media object related*/
        $this.load = function load(url) {
            $this.reset();

            $this.provider.pause();
            $this.seek(0);
            $this.provider.src = url;

            $this.source = url;
        };

        $this.play = function play() {
            $this.provider.play();

            $this.playingState = 'PLAYING';
            $this.addRemoveClass($this.dom.playBtn, ['icon-pause-p'], ['icon-play-p', 'icon-pause-p']);

            if (!$this.isTouchInitiate) {
                $this.isLoading = true;
            }
            $this.isTouchInitiate = true;
        };

        $this.pause = function pause() {
            $this.provider.pause();

            $this.playingState = 'PAUSED';
            $this.addRemoveClass($this.dom.playBtn, ['icon-play-p'], ['icon-pause-p', 'icon-play-p']);
        };

        $this.resume = function resume() {
            $this.provider.play();

            $this.playingState = 'PLAYING';
            $this.addRemoveClass($this.dom.playBtn, ['icon-pause-p'], ['icon-play-p', 'icon-pause-p']);
        };

        $this.seek = function seek(offset) {
            try {
                $this.provider.currentTime = offset;
            } catch (e) {
                throw new Error('provider is not defined. So ignoring...');
            }
        };

        $this.stop = function stop() {
            $this.provider.pause();
            $this.seek(0);
            $this.playingState = 'STOPPED';
            $this.addRemoveClass($this.dom.playBtn, ['icon-play-p'], ['icon-pause-p', 'icon-play-p']);
        };

        $this.setVolume = function setVolume(volume) {
            $this.provider.volume = volume / 10;
        };

        function hideControl() {
            $this.dom.controlLayer.style.bottom = '-60px';
            $this.dom.controlBG.style.opacity = 0;
            if (_idleTimer) {
                clearTimeout(_idleTimer);
            }
            $this.controlState = false;
            $this.addRemoveClass($this.dom.container, [], ['hover']);
        }


        /* DOM event methods */
        function playerFullScreen() {
            var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
            if (!isFullScreen && $this.screenState === 'FULL') {
                $this.fullScreen();
            }
        }
        function playerKeyEvt(evt) {
            var keyCode = evt.which || evt.keyCode || evt.key;
            if (keyCode === 32) {
                $this.playPause();
            }
        }


        function clickPlayBtnCallback(e) {
            e.stopPropagation();
            $this.playPause();
        }


        function clickVolumeCallback(e) {
            e.stopPropagation();
            $this.muteUnmute();
        }

        function clickFullScreenCallback(e) {
            e.stopPropagation();
            $this.fullScreen();
        }


        function mousemoveBarCallback(e) {
            $this.timeInfo(e);
            if ($this.isMouseDown) {
                $this.setPosition(e, false);
            }
        }


        function mousedownBarCallback() {
            $this.isMouseDown = true;
            $this.addRemoveClass($this.dom.barContainer, ['down'], []);
        }

        function mouseupBarCallback(e) {
            $this.isMouseDown = false;
            $this.setPosition(e, true);
            $this.addRemoveClass($this.dom.barContainer, [], ['down']);
        }

        function mouseleaveBarCallback() {
            $this.isMouseDown = false;
            $this.addRemoveClass($this.dom.barContainer, [], ['down']);
        }

        function clickContainerCallback(e) {
            e.stopPropagation();
            $this.deferControlHide();
            if (!$this.controlState && $this.playingState === 'PLAYING') {
                $this.showControl();
            } else {
                $this.playPause();
            }

            if ($this.isTouchable) {
                $this.addRemoveClass($this.dom.container, ['hover'], ['hover']);
            }
        }

        function mouseoverPlayerCallback(e) {
            e.stopPropagation();
            $this.addRemoveClass($this.dom.container, ['hover'], ['hover']);

            if (!$this.isTouchable) {
                if ($this.controlState && $this.playingState === 'PLAYING') {
                    $this.deferControlHide();
                } else {
                    $this.showControl();
                }
            }
        }

        function mouseleavePlayerCallback(e) {
            e.stopPropagation();
            $this.addRemoveClass($this.dom.container, [], ['hover']);
        }

        function mouseoverFullCallback(e) {
            e.stopPropagation();
            $this.showTootip(e, this.getAttribute('tooltip'));
        }

        function mouseleaveFullCallback(e) {
            e.stopPropagation();
            $this.dom.controlTip.style.display = 'none';
        }


        function clickVolumeBarCallback(e) {
            var volume;
            e.stopPropagation();
            volume = parseInt(this.getAttribute('data-rel'), 10);
            $this.changeVolume(volume);
        }

        function touchendOnContainer(e) {
            e.stopPropagation();
            $this.addRemoveClass($this.dom.container, [], ['hover']);
        }

        function clickOnLogo(e) {
            e.stopPropagation();
            e.preventDefault();
            window.location = 'https://www.ringid.com';
        }

        $this.init();

        if (!$this.isWebView) {
            $this.initEvent();
            $this.showBigPlay();
            $this.showError();
            $this.showInfo();
            $this.showMusicBar();
            $this.showHD();
            $this.playingState = 'STOPPED';

            $this.provider.autoplay = false;

            if ($this.autoPlay) {
                $this.addRemoveClass($this.dom.playBtn, ['icon-pause-p'], ['icon-play-p', 'icon-pause-p']);
            }

            if ($this.debug) {
                $this.dom.debug.style.display = 'block';
            }

            $this.load(option.source);
            $this.setVolume($this.volume);
        }

        return $this;
    }

    window.Player = Player;
})(window);
