/*
 * © Ipvision
 */


    angular
            .module('ringid.global_directives')
            .provider('$player', Player)
            .directive('rgPlayer', rgPlayer);

    function Player() {
        this.dicts = {
            'maximize': 'Back to normal view',
            'minimize': 'Go to small view',
            'fullScreen': 'Full Screen',
            'playlist': 'Playlist',
            'auto': 'Auto Play',
        };
        this.instances = [];
        this.template = '<div class="rg-player">'
                + '<div class="container">'
                + '<div class="play-info"></div>'
                + '<div class="play-error"></div>'
                + ' <div class="music-bars"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>'
                + '<div class="big-play"><span class="img_sprite icon-player"></span></div>'
                + '<div class="loader">'
                + '<div class="circle1"></div>'
                + '<div class="circle2"></div>'
                + '<div class="circle3"></div>'
                + '</div>'
                + '<div class="player-poster">'
                + '<img class="poster" />'
                + '</div>'
                + '</div>'
                + '<div class="playlist-wrapper"></div>'
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
                + '<button class="img_sprite w-h-13 icon-previous-p control-btn prev-btn"></button>'
                + '<button class="img_sprite w-h-13 icon-play-p control-btn start-btn"></button>'
                + '<button class="img_sprite w-h-13 icon-next-p control-btn next-btn"></button>'
                + '</div>'
                + '<div class="volume-bar">'
                + '<div class="img_sprite w-h-13 icon-speaker-fill volume-icon unmute"></div>'
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
                + '<button class="img_sprite w-h-13 icon-minimize control-btn minimize" tooltip="' + this.dicts['minimize'] + '"></button>'
                + '<button class="img_sprite w-h-13 icon-screen-f control-btn full-screen" tooltip="' + this.dicts['fullScreen'] + '"></button>'
                + '<button class="img_sprite w-h-13 icon-play-list control-btn playlist-btn" tooltip="' + this.dicts['playlist'] + '"></button>'
                + '<button class="control-btn auto" tooltip="' + this.dicts['auto'] + '">AUTO</button>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</div>';

        this.trackTemplate = '<a rel="data-rel" href="#">'
                + '<span class="list-thumb"><img src="data-thumb" /></span>'
                + '<span class="list-title">data-caption<b>data-duration</b></span>'
                + '</a>';

        this.secToTime = function (seconds) {
            seconds = Math.floor(seconds);
            var hours = parseInt(seconds / 3600) % 24;
            var minutes = parseInt(seconds / 60) % 60;
            var seconds = (seconds < 0) ? 0 : seconds % 60;
            var result = '';
            if (hours > 0)
                result += (hours < 10 ? "0" + hours : hours);
            result += (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
            return result;
        };

        this.findPos = function (el) {
            var x = 0, y = 0;
            if (el.offsetParent) {
                do {
                    x += el.offsetLeft;
                    y += el.offsetTop;
                } while (el = el.offsetParent);
            }
            return {x: x, y: y};
        };

        this.destroy = function (instance) {

            try {
                instance.removeEvent();
                instance.provider.pause();
                instance.provider.src = '';
                instance.dom = null;
                delete instance.provider;
                //delete instance;
            } catch (e) {
            }

        };

        this.addRemoveClass = function (el, add, remove) {
            var i;
            for (i = 0; i < remove.length; i++) {
                el.className = el.className.replace(remove[i], '').trim();
            }

            for (i = 0; i < add.length; i++) {
                el.className += ' ' + add[i];
            }
        };

        this.createMediaObject = function (type) {
            return  (type == 'audio') ? document.createElement('audio') : document.createElement('video');
        };

        this.getDefaultThumb = function(thumb) {

            if (!thumb || thumb == 'images/default_audio_image.jpg') {
              thumb = 'images/player-audio.png';
            }

            return thumb;
        }

        this.$get = ['$compile', '$document',
            function ($compile, $document) {

                var $this = this, $playerProvider = {};

                $playerProvider.escapeKey = false;
                $playerProvider.miniPlayer = {dom: {container:null,move:null, resize: null, maximize : null, close : null}, parent: null, player: null};
                $playerProvider.wh = window.innerHeight;

                $playerProvider.destroy = function () {
                    if ($this.instances.length > 0)
                    {
                        $this.destroy($this.instances.pop());
                    }
                };

                $playerProvider.destroyAll = function () {
                    for (var i = $this.instances.length - 1; i >= 0; i--) {
                        $this.destroy($this.instances.pop());
                    }
                };

                $playerProvider.toggleMinMax = function () {
                    var player;
                    for (var i = $this.instances.length - 1; i >= 0; i--) {
                        if (!$this.instances[i].chat) {
                            player = $this.instances[i];
                            break;
                        }
                    }

                   player.minimize();
                }

                $playerProvider.showMiniPlayer = function () {
                    if ($playerProvider.miniPlayer.player) {
                        $playerProvider.miniPlayer.dom.container.appendChild($playerProvider.miniPlayer.player.parent)
                        $playerProvider.miniPlayer.dom.container.style.display = 'block';

                        if ($playerProvider.miniPlayer.player.playingState == 'PLAYING') {
                            setTimeout(function(){
                               $playerProvider.miniPlayer.player.provider.play();
                            });
                        }
                    }
                }

                $playerProvider.closeMiniPlayer = function () {
                    if ($playerProvider.miniPlayer.player) {
                        $playerProvider.ringboxRemove();
                        $playerProvider.destroy();
                        $playerProvider.miniPlayer.dom.container.parentNode.removeChild($playerProvider.miniPlayer.dom.container);
                        $playerProvider.miniPlayer.dom = {container:null,move:null, resize: null, maximize : null, close : null};
                        $playerProvider.miniPlayer.player = null;
                    }
                }


                $playerProvider.addToPlaylist = function (playlist) {

                    for (var i = $this.instances.length - 1; i >= 0; i--) {
                        if (!$this.instances[i].chat) {
                            $this.instances[i].AddToPlaylist(playlist);
                            break;
                        }
                    }
                }

                $playerProvider.player = function (option) {


                    $playerProvider.ringboxRemove = (option.ringboxRemove) ? option.ringboxRemove : function () {};

                    if (!option.chatVersion) {
                        $playerProvider.closeMiniPlayer();
                    }

                    var $player = {};
                    $player.source = option.source || '';
                    $player.autoPlay = option.autoPlay || false;
                    $player.showMinMax = option.showMinMax || false;
                    $player.auto = option.auto || false;
                    $player.parent = document.getElementById(option.parentId);
                    $player.poster = option.poster || '';
                    $player.mediaType = option.type || 'video';
                    $player.dom = {};
                    $player.playingState = (this.autoPlay) ? 'INIT' : 'STOPPED';
                    $player.screenState = 'NORMAL';
                    $player.volumeState = 'UNMUTE';
                    $player.volume = 5;
                    $player.duration = 0;
                    $player.currentTrack = 0;
                    $player.playlist = option.playlist || [];
                    $player.title = option.title || '';
                    $player.playlistState = false;
                    $player.hd = false;
                    $player.isMouseDown = false;
                    $player.isLoading = $player.autoPlay;
                    $player.isFirefox = !!(navigator.userAgent.match(/firefox/i));
                    $player.canPlay = true;
                    $player.chat = !!option.chatVersion;

                    $player.provider = $this.createMediaObject($player.mediaType);

                    $player.parent.innerHTML = $this.template;

                    $player.dom.player = $player.parent.querySelector('.rg-player');
                    $player.dom.container = $player.parent.querySelector('.container');
                    $player.dom.playlistWrap = $player.parent.querySelector('.playlist-wrapper');
                    $player.dom.control = $player.parent.querySelector('.media-control');
                    $player.dom.bigBlay = $player.dom.container.querySelector('.big-play');
                    $player.dom.bigBlayIcon = $player.dom.bigBlay.querySelector('span');
                    $player.dom.playError = $player.dom.container.querySelector('.play-error');
                    $player.dom.playInfo = $player.dom.container.querySelector('.play-info');
                    $player.dom.musicBar = $player.dom.container.querySelector('.music-bars');
                    $player.dom.loader = $player.dom.container.querySelector('.loader');
                    $player.dom.poster = $player.dom.container.querySelector('.player-poster');
                    $player.dom.posterImg = $player.dom.poster.querySelector('.poster');
                    $player.dom.barContainer = $player.dom.control.querySelector('.bar-container');
                    $player.dom.barScrubber = $player.dom.control.querySelector('.bar-scrubber');
                    $player.dom.barLoaded = $player.dom.control.querySelector('.bar-fill-1');
                    $player.dom.barPosition = $player.dom.control.querySelector('.bar-fill-2');
                    $player.dom.barHover = $player.dom.control.querySelector('.bar-hover');
                    $player.dom.controlLayer = $player.dom.control.querySelector('.media-control-layer');
                    $player.dom.controlBG = $player.dom.control.querySelector('.media-control-bg');
                    $player.dom.controlTip = $player.dom.control.querySelector('.media-tip');
                    $player.dom.playBtn = $player.dom.control.querySelector('.start-btn');
                    $player.dom.nextBtn = $player.dom.control.querySelector('.next-btn');
                    $player.dom.prevBtn = $player.dom.control.querySelector('.prev-btn');
                    $player.dom.timeRunning = $player.dom.control.querySelector('.time-running');
                    $player.dom.timeTotal = $player.dom.control.querySelector('.time-total');
                    $player.dom.hd = $player.dom.control.querySelector('.hd');
                    $player.dom.playlistBtn = $player.dom.control.querySelector('.playlist-btn');
                    $player.dom.minimize = $player.dom.control.querySelector('.minimize');
                    $player.dom.auto = $player.dom.control.querySelector('.auto');
                    $player.dom.volumeIcon = $player.dom.control.querySelector('.volume-icon');
                    $player.dom.volumeBarContainer = $player.dom.control.querySelector('.volume-bar-container');
                    $player.dom.volumeBars = $player.dom.volumeBarContainer.querySelectorAll('.bar');
                    $player.dom.fullScreenBtn = $player.dom.control.querySelector('.full-screen');
                    $player.dom.seekTimer = $player.dom.control.querySelector('.seek-time');
                    $player.dom.timer = $player.dom.control.querySelector('.timer');
                    $player.dom.playlist = null;


                    $player.dom.player.style.width = (option.width) ? option.width + 'px' : '100%';
                    $player.dom.player.style.height = (option.height) ? option.height + 'px' : '100%';
                    $player.dom.timeRunning.innerHTML = '00:00';
                    $player.dom.timeTotal.innerHTML = '00:00';

                    if (option.chatVersion || !$player.showMinMax) {
                       $player.dom.minimize.style.display = 'none';
                    }

                    $player.dom.poster.appendChild($player.provider);

                    $playerProvider.miniPlayer.parent = $player.parent.parentNode;


                    /* DOM event methods */
                    function playerFullScreen() {
                        var isFullScreen = document.mozFullScreen || document.webkitIsFullScreen;
                        if (!isFullScreen && $player.screenState == 'FULL') {
                            $player.fullScreen();
                        }
                    };
                    function playerKeyEvt(evt) {
                        var keyCode = evt.which || evt.keyCode || evt.key;
                        if ($playerProvider.miniPlayer.player) return;
                        if (keyCode === 32) {
                            $player.playPause();
                        }
                    };


                    function clickPlayBtnCallback(e) {
                        e.stopPropagation();
                        $player.playPause();
                    }

                    function clickNextBtnCallback(e) {
                        e.stopPropagation();
                        $player.playNext();
                    }

                    function clickPrevBtnCallback(e) {
                       e.stopPropagation();
                       $player.playPrev();
                    }

                    function clickVolumeCallback(e) {
                        e.stopPropagation();
                        $player.muteUnmute();
                    }

                    function clickFullScreenCallback(e) {
                        e.stopPropagation();
                        $player.fullScreen();
                    }

                    function clickMinimizeCallback(e) {
                       e.stopPropagation();
                       $player.minimize();
                    }

                    function mousemoveBarCallback(e) {
                       $player.timeInfo(e);
                       if ($player.isMouseDown) {
                         $player.setPosition(e, false);
                       }
                    }

                    function mousedownBarCallback(e) {
                       $player.isMouseDown = true;
                       $this.addRemoveClass($player.dom.barContainer, ['down'], []);
                    }

                    function mouseupBarCallback(e) {
                       $player.isMouseDown = false;
                       $player.setPosition(e, true);
                       $this.addRemoveClass($player.dom.barContainer, [], ['down']);
                    }

                    function mouseleaveBarCallback(e) {
                        $player.isMouseDown = false;
                        $this.addRemoveClass($player.dom.barContainer, [], ['down']);
                    }

                    function clickContainerCallback(e) {
                        e.stopPropagation();
                        if ($player.playlistState) {
                            $player.showPlaylist(false);
                            return;
                        }
                        $player.playPause();
                    }

                    function mouseoverPlayerCallback(e) {
                         e.stopPropagation();
                         $player.showControl(true);
                    }

                    function mouseleavePlayerCallback(e) {
                        e.stopPropagation();
                        $player.showControl(false);
                    }

                    function clickPlaylistCallback(e) {
                        e.stopPropagation();

                        if ($playerProvider.miniPlayer.player) {
                            $player.maximize();
                        }

                        $player.showPlaylist();
                     }

                     function clickAutoCallback(e) {
                        e.stopPropagation();
                        $player.setAuto();
                     }

                    function mouseoverAutoCallback(e) {
                        e.stopPropagation();
                        $player.showTootip(e,this.getAttribute('tooltip'));
                     }

                    function mouseleaveAutoCallback(e) {
                        e.stopPropagation();
                        $player.dom.controlTip.style.display = 'none';
                     }

                     function mouseoverMinimizeCallback(e) {
                       e.stopPropagation();
                       $player.showTootip(e,this.getAttribute('tooltip'));
                     }

                     function mouseleaveMinimizeCallback(e) {
                        e.stopPropagation();
                        $player.dom.controlTip.style.display = 'none';
                     }

                     function mouseoverFullCallback(e) {
                         e.stopPropagation();
                         $player.showTootip(e,this.getAttribute('tooltip'));
                     }

                     function mouseleaveFullCallback(e) {
                        e.stopPropagation();
                        $player.dom.controlTip.style.display = 'none';
                     }

                     function mouseoverPlaylistCallback(e) {
                        e.stopPropagation();
                        $player.showTootip(e,this.getAttribute('tooltip'));
                     }

                     function mouseleavePlaylistCallback(e) {
                        e.stopPropagation();
                        $player.dom.controlTip.style.display = 'none';
                     }

                     function clickVolumeBarCallback(e) {
                        e.stopPropagation();
                        var volume = parseInt(this.getAttribute('data-rel'));
                        $player.changeVolume(volume);
                      }

                     /* Callback for minimize version*/

                     var mouseMove = false, fromMouseMove=false, mouseResize = false, pw = 350, ph = 120,
                         wh = window.innerHeight, ww = window.innerWidth, ol, ot, py;

                     function moveDOCCallbackMoving(event) {
                            fromMouseMove = true;
                            if (mouseMove) {

                                fastdom.read(function () {
                                    if(!$playerProvider.miniPlayer.dom.resize) return;
                                    document.body.style.cursor = 'move';
                                    $playerProvider.miniPlayer.dom.resize.style.cursor = 'move';
                                    $player.dom.container.style.cursor = 'move';
                                    fastdom.write(function () {
                                        if ((event.clientX + ol) >= 200 && (event.clientX + ol) <= (ww - pw - 210)) {
                                            $playerProvider.miniPlayer.dom.container.style.left = (event.clientX + ol) + 'px';
                                        }

                                        if ((event.clientY + ot) >= 50 && (event.clientY + ot) <= (wh - ph)) {
                                            $playerProvider.miniPlayer.dom.container.style.top = (event.clientY + ot) + 'px';
                                        }
                                    });
                                });
                            }
                     }

                     function upDOCCallbackMoving(event) {
                        event.stopPropagation();
                        mouseMove = false;
                        document.body.style.cursor = 'default';
                        $playerProvider.miniPlayer.dom.resize.style.cursor = 'ns-resize';
                        $player.dom.container.style.cursor = 'pointer';
                        document.removeEventListener('mousemove', moveDOCCallbackMoving);
                        document.removeEventListener('mouseup', upDOCCallbackMoving);
                     }

                     function mousedownMoveCallback(e) {
                            e.preventDefault();
                            e.stopPropagation();

                            mouseMove = true;
                            ww = window.innerWidth,
                            wh = window.innerHeight,
                            ol = $playerProvider.miniPlayer.dom.container.offsetLeft - e.clientX,
                            ot = $playerProvider.miniPlayer.dom.container.offsetTop - e.clientY;

                            document.addEventListener('mousemove', moveDOCCallbackMoving, false);
                            document.addEventListener('mouseup', upDOCCallbackMoving, false);
                     }

                     function clickMoveCallback(e) {

                        if(fromMouseMove) {
                           fromMouseMove = false;
                           return;
                        }
                        $player.playPause();
                     }

                    function moveDOCCallbackResizing(event) {

                         if (mouseResize) {

                            fastdom.read(function () {

                                if(!$playerProvider.miniPlayer.dom.container) return;

                                var height = $playerProvider.miniPlayer.dom.container.offsetHeight;
                                var top = parseInt($playerProvider.miniPlayer.dom.container.style.top.replace('px', ''));

                                fastdom.write(function () {
                                    document.body.style.cursor = 'ns-resize';
                                    $playerProvider.miniPlayer.dom.move.style.cursor = 'ns-resize';
                                    $player.dom.container.style.cursor = 'ns-resize';

                                    if (py >= event.clientY && height < 250) {
                                        height = height + 3;
                                        top = top - 3;
                                        $playerProvider.miniPlayer.dom.container.style.height = height + 'px';
                                        $playerProvider.miniPlayer.dom.container.style.top = top + 'px';
                                        py = event.clientY;
                                    }

                                    if (py < event.clientY && height > 120) {
                                        height = height - 3;
                                        top = top + 3;
                                        $playerProvider.miniPlayer.dom.container.style.height = height + 'px';
                                        $playerProvider.miniPlayer.dom.container.style.top = top + 'px';
                                        py = event.clientY;
                                    }

                                });
                            });
                         }
                     }

                     function upDOCCallbackResizing(event) {
                        event.stopPropagation();
                        mouseResize = false;
                        document.body.style.cursor = 'default';
                        $playerProvider.miniPlayer.dom.move.style.cursor = 'move';
                        $player.dom.container.style.cursor = 'pointer';
                        document.removeEventListener('mousemove', moveDOCCallbackResizing);
                        document.removeEventListener('mouseup', upDOCCallbackResizing);
                    }

                     function mousedownResizeCallback(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            mouseResize = true;
                            ww = window.innerWidth,
                            wh = window.innerHeight,
                            py = e.clientY;

                            document.addEventListener('mousemove', moveDOCCallbackResizing, false);
                            document.addEventListener('mouseup', upDOCCallbackResizing, false);
                     }

                     function clickMiniMaxBtnCallback(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $player.maximize();
                     }

                     function clickMiniCloseBtnCallback(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $playerProvider.closeMiniPlayer();
                     }

                    /* End of dom events */

                    $player.initEvent = function () {

                        $player.dom.playBtn.addEventListener('click', clickPlayBtnCallback, false);
                        $player.dom.nextBtn.addEventListener('click', clickNextBtnCallback , false);
                        $player.dom.prevBtn.addEventListener('click', clickPrevBtnCallback, false);
                        $player.dom.volumeIcon.addEventListener('click', clickVolumeCallback , false);
                        $player.dom.fullScreenBtn.addEventListener('click', clickFullScreenCallback, false);
                        $player.dom.minimize.addEventListener('click', clickMinimizeCallback , false);
                        $player.dom.barContainer.addEventListener('mousemove', mousemoveBarCallback , false);
                        $player.dom.barContainer.addEventListener('mousedown', mousedownBarCallback , false);
                        $player.dom.barContainer.addEventListener('mouseup', mouseupBarCallback , false);
                        $player.dom.barContainer.addEventListener('mouseleave', mouseleaveBarCallback, false);
                        $player.dom.container.addEventListener('click', clickContainerCallback , false);
                        $player.dom.player.addEventListener('mouseover', mouseoverPlayerCallback , false);
                        $player.dom.player.addEventListener('mouseleave', mouseleavePlayerCallback , false);
                        $player.dom.playlistBtn.addEventListener('click', clickPlaylistCallback , false);
                        $player.dom.auto.addEventListener('click', clickAutoCallback , false);

                        for (var i = 0; i < $player.dom.volumeBars.length; i++) {
                            $player.dom.volumeBars[i].addEventListener('click', clickVolumeBarCallback);
                        }

                        /* tooptip event */
                        $player.dom.auto.addEventListener('mouseover', mouseoverAutoCallback , false);
                        $player.dom.auto.addEventListener('mouseleave', mouseleaveAutoCallback , false);
                        /* tooptip event */
                        $player.dom.minimize.addEventListener('mouseover', mouseoverMinimizeCallback , false);
                        $player.dom.minimize.addEventListener('mouseleave', mouseleaveMinimizeCallback , false);
                        /* tooptip event */
                        $player.dom.fullScreenBtn.addEventListener('mouseover', mouseoverFullCallback , false);
                        $player.dom.fullScreenBtn.addEventListener('mouseleave', mouseleaveFullCallback , false);
                        /* tooptip event */
                        $player.dom.playlistBtn.addEventListener('mouseover', mouseoverPlaylistCallback , false);
                        $player.dom.playlistBtn.addEventListener('mouseleave', mouseleavePlaylistCallback , false);



                        // document events
                        document.addEventListener("mozfullscreenchange", playerFullScreen, false);
                        document.addEventListener("webkitfullscreenchange", playerFullScreen, false);
                        document.addEventListener("fullscreenchange", playerFullScreen, false);
                        document.addEventListener("keyup", playerKeyEvt, false);

                        $player.setMediaEvent();
                        $player.createPlaylist();
                        $player.showPoster(true);

                        if ($player.auto) {
                            $player.setAuto(true);
                        }

                    };


                    $player.setMediaEvent = function () {

                        $player.provider.addEventListener('loadedmetadata', function (event, data) {
                            $player.initTime($player.provider.duration);

                            if ($player.autoPlay)
                                $player.play();
                        });

                        $player.provider.addEventListener('progress', function () {

                            var buffered = $player.provider.buffered.length > 0 ? $player.provider.buffered.end($player.provider.buffered.length - 1) : 0;
                            var bufferState = ($player.provider.currentTime + 0.05) >= buffered ? 'BUFFERING' : 'PLAYING_BUFFERING';

                            $player.showBuffered(buffered, $player.provider.duration);
                            $player.stateChanged(bufferState);

                        });

                        $player.provider.addEventListener('timeupdate', function () {
                            if (!$player.provider || $player.isMouseDown)
                                return;
                            $player.showPosition($player.provider.currentTime, $player.provider.duration);
                        });

                        $player.provider.addEventListener('play', function () {
                            $player.stateChanged('PLAYING');

                            if ($player.mediaType == 'video') {
                                $player.showPoster(false);
                            }

                            if (angular.isFunction(option.scope.onStart())) {
                                option.scope.onStart()();
                            }
                        });

                        $player.provider.addEventListener('pause', function () {
                            $player.stateChanged('PAUSED');

                            if ($player.mediaType == 'video') {
                                $player.showPoster(false);
                            }
                        });

                        $player.provider.addEventListener('ended', function () {
                            $player.stateChanged('ENDED');

                            if ($player.mediaType == 'video') {
                                $player.showPoster(false);
                            }

                            if (angular.isFunction(option.scope.onEnded())) {
                                option.scope.onEnded()();
                            }
                        });

                        $player.provider.addEventListener('stalled', function () {
                            if (!$player.provider)
                                return;
                            // $player.error = 'Media not availble';
                            //$player.canPlay = false;
                            // $player.showError();
                        });

                        $player.provider.addEventListener('error', function () {
                            if (!$player.provider)
                                return;
                            $player.error = $player.provider.error.code;
                            $player.canPlay = false;
                            $player.showError();
                        });

                    };

                    $player.removeEvent = function () {

                        $player.dom.playBtn.removeEventListener('click', clickPlayBtnCallback);
                        $player.dom.nextBtn.removeEventListener('click', clickNextBtnCallback);
                        $player.dom.prevBtn.removeEventListener('click', clickPrevBtnCallback);
                        $player.dom.volumeIcon.removeEventListener('click', clickVolumeCallback);
                        $player.dom.fullScreenBtn.removeEventListener('click', clickFullScreenCallback);
                        $player.dom.minimize.removeEventListener('click', clickMinimizeCallback);
                        $player.dom.barContainer.removeEventListener('mousemove', mousemoveBarCallback);
                        $player.dom.barContainer.removeEventListener('mousedown', mousedownBarCallback);
                        $player.dom.barContainer.removeEventListener('mouseup', mouseupBarCallback);
                        $player.dom.barContainer.removeEventListener('mouseleave', mouseleaveBarCallback);
                        $player.dom.container.removeEventListener('click', clickContainerCallback);
                        $player.dom.player.removeEventListener('mouseover', mouseoverPlayerCallback);
                        $player.dom.player.removeEventListener('mouseleave', mouseleavePlayerCallback);
                        $player.dom.playlistBtn.removeEventListener('click', clickPlaylistCallback);
                        $player.dom.auto.removeEventListener('click', clickAutoCallback);

                        for (var i = 0; i < $player.dom.volumeBars.length; i++) {
                          $player.dom.volumeBars[i].removeEventListener('click', clickVolumeBarCallback);
                        }

                        $player.dom.auto.removeEventListener('mouseover', mouseoverAutoCallback);
                        $player.dom.auto.removeEventListener('mouseleave', mouseleaveAutoCallback);
                        $player.dom.minimize.removeEventListener('mouseover', mouseoverMinimizeCallback);
                        $player.dom.minimize.removeEventListener('mouseleave', mouseleaveMinimizeCallback);
                        $player.dom.fullScreenBtn.removeEventListener('mouseover', mouseoverFullCallback);
                        $player.dom.fullScreenBtn.removeEventListener('mouseleave', mouseleaveFullCallback);
                        $player.dom.playlistBtn.removeEventListener('mouseover', mouseoverPlaylistCallback);
                        $player.dom.playlistBtn.removeEventListener('mouseleave', mouseleavePlaylistCallback);

                        document.removeEventListener("mozfullscreenchange", playerFullScreen);
                        document.removeEventListener("webkitfullscreenchange", playerFullScreen);
                        document.removeEventListener("fullscreenchange", playerFullScreen);
                        document.removeEventListener("keyup", playerKeyEvt);
                    };

                    $player.maximize = function () {

                        if ($playerProvider.miniPlayer.player) {
                            option.ringboxMaximize($playerProvider.miniPlayer.parent, $player.parent);

                            if ($player.playingState == 'PLAYING') {
                                setTimeout(function(){
                                   $player.provider.play();
                                });
                            }

                            $playerProvider.miniPlayer.dom.move.removeEventListener('mousedown', mousedownMoveCallback);
                            $playerProvider.miniPlayer.dom.move.removeEventListener('click', clickMoveCallback);
                            $playerProvider.miniPlayer.dom.resize.removeEventListener('mousedown', mousedownResizeCallback);
                            $playerProvider.miniPlayer.dom.close.removeEventListener('click', clickMiniCloseBtnCallback);
                            $playerProvider.miniPlayer.dom.maximize.removeEventListener('click', clickMiniMaxBtnCallback);

                            $playerProvider.miniPlayer.dom.container.parentNode.removeChild($playerProvider.miniPlayer.dom.container);
                            $playerProvider.miniPlayer.dom = {container:null,move:null, resize: null, maximize : null, close : null};
                            $playerProvider.miniPlayer.player = null;
                            $this.addRemoveClass($player.dom.minimize, ['icon-minimize'], ['icon-maximize']);
                            $player.dom.fullScreenBtn.style.display = 'block';
                            $player.dom.minimize.setAttribute('tooltip', $this.dicts['minimize']);
                            return;
                        }
                    };


                    $player.minimize = function () {


                        if ($playerProvider.miniPlayer.player) {
                            $player.maximize();
                            return;
                        }

                        var mini = document.createElement('div'),
                            maxBtn = document.createElement('a'),
                            moveDiv = document.createElement('div'),
                            resizeDiv = document.createElement('div'),
                            closeBtn = document.createElement('a');

                        closeBtn.setAttribute('class', 'mini-close');
                        closeBtn.innerHTML = '<div class="img_sprite w-h-16px icon-close pop-close"></div>';

                        maxBtn.setAttribute('class', 'img_sprite w-h-18px maximize icon-maximize');
                        maxBtn.setAttribute('style', 'position: absolute;right: 22px;top: 5px;color: #fff;');

                        moveDiv.setAttribute('class', 'move-player');
                        moveDiv.appendChild(maxBtn);
                        moveDiv.appendChild(closeBtn);

                        mini.setAttribute('id', 'mini-player');
                        mini.setAttribute('class', 'mini-player');

                        resizeDiv.setAttribute('class', 'resize-player');

                        mini.style.display = 'none';
                        mini.appendChild(moveDiv);
                        mini.appendChild(resizeDiv);
                        document.body.appendChild(mini);

                        $player.showPlaylist(true);
                        $player.showControl(true);

                        $playerProvider.miniPlayer.dom.container = mini;
                        $playerProvider.miniPlayer.dom.resize = resizeDiv;
                        $playerProvider.miniPlayer.dom.move = moveDiv;
                        $playerProvider.miniPlayer.dom.close = closeBtn;
                        $playerProvider.miniPlayer.dom.maximize = maxBtn;
                        $playerProvider.miniPlayer.player = $player;
                        $player.dom.minimize.setAttribute('tooltip', $this.dicts['maximize']);

                        option.ringboxMinimize();

                        wh = ($player.screenState == 'FULL') ? $playerProvider.wh : window.innerHeight;

                        mini.style.top = (wh - ph) + 'px';
                        $this.addRemoveClass($player.dom.minimize, ['icon-maximize'], ['icon-minimize']);
                        $player.dom.fullScreenBtn.style.display = 'none';


                        closeBtn.addEventListener('click', clickMiniCloseBtnCallback, false);
                        maxBtn.addEventListener('click', clickMiniMaxBtnCallback, false);

                        /*Move player*/
                        moveDiv.addEventListener('mousedown', mousedownMoveCallback, false);
                        moveDiv.addEventListener('click', clickMoveCallback, false);
                        /*resize player*/
                        resizeDiv.addEventListener('mousedown', mousedownResizeCallback, false);

                        /*remove reference*/
                        closeBtn = maxBtn = resizeDiv = moveDiv= mini= null;
                    };

                    $player.playPause = function () {

                        if (!$player.canPlay)
                            return;

                        if ($player.playingState == 'PLAYING') {
                            $player.pause();
                            $player.showLoader();
                            $player.showBigPlay();
                            $player.showControl(false);
                            $player.showPlaylist(true);
                            $player.showInfo(true);
                            return;
                        }

                        if ($player.playingState == 'PAUSED') {
                            $player.resume();
                            $player.showLoader();
                            $player.showBigPlay();
                            $player.showInfo();
                            return;
                        }

                        if ($player.playingState == 'STOPPED') {
                            $player.play();
                            $player.showLoader();
                            $player.showBigPlay();
                            $player.showPlaylist(true);
                            $player.showInfo();
                            return;
                        }

                    };

                    $player.muteUnmute = function () {

                        if ($player.volumeState == 'UNMUTE') {
                            $player.setVolume(0);
                            $this.addRemoveClass($player.dom.volumeIcon, ['icon-speaker-m'], ['icon-speaker-fill']);
                            $player.volumeState = 'MUTE';
                            return;
                        }

                        if ($player.volumeState == 'MUTE') {
                            $player.setVolume($player.volume);
                            $this.addRemoveClass($player.dom.volumeIcon, ['icon-speaker-fill'], ['icon-speaker-m']);
                            $player.volumeState = 'UNMUTE';
                            return;
                        }
                    };

                    $player.initTime = function (duration) {
                        $player.dom.timeTotal.innerHTML = $this.secToTime(duration);
                        $player.duration = duration;
                    };

                    $player.showPosition = function (position, duration) {

                        if ($player.duration == 0 && duration > 0) {
                            $player.initTime(duration);
                        }

                        if (position > duration) {
                            $player.initTime(position);
                        }

                        $player.dom.timeRunning.innerHTML = $this.secToTime(position);
                        $player.dom.barScrubber.style.left = ($player.duration == 0) ? '-' + ($player.dom.barScrubber.offsetWidth / 2) + 'px' : 'calc(' + ((position / $player.duration) * 100) + '% - ' + ($player.dom.barScrubber.offsetWidth / 2) + 'px)';
                        $player.dom.barPosition.style.width = ($player.duration == 0) ? '0%' : ((position / $player.duration) * 100) + '%';
                    };

                    $player.showBuffered = function (buffered, duration) {

                        if ($player.duration == 0 && duration > 0) {
                            $player.initTime(duration);
                        }
                        $player.dom.barLoaded.style.width = ($player.duration == 0) ? '0%' : ((buffered / $player.duration) * 100) + '%';
                    };

                    $player.timeInfo = function (event) {

                        var pos = ($player.screenState == 'FULL') ? {'x':0, 'y':0 } : $this.findPos($player.dom.barContainer);
                        var diff = event.pageX - pos.x;
                        var curTime = Math.round((diff * $player.duration) / $player.dom.barContainer.offsetWidth);
                        if (curTime < 0)
                            curTime = 0;
                        $player.dom.timer.innerHTML = $this.secToTime(curTime);
                        $player.dom.seekTimer.style.left = (diff - $player.dom.seekTimer.offsetWidth / 2) + 'px';
                        $player.dom.barHover.style.left = (diff - $player.dom.barHover.offsetWidth / 2) + 'px';
                    };

                     $player.showTootip = function (event, text) {
                        var pos = ($player.screenState == 'FULL') ? {'x':0, 'y':0 } : $this.findPos($player.dom.barContainer);
                        var diff = event.pageX - pos.x;
                        $player.dom.controlTip.innerHTML = text;

                        $player.dom.controlTip.style.display = 'block';
                        var pw = $player.dom.barContainer.offsetWidth, tw = $player.dom.controlTip.offsetWidth;
                        diff =  pw <= (tw/2 + diff) ? (pw - tw/2) : diff;
                        $player.dom.controlTip.style.left = (diff - tw/2) + 'px';
                    };

                    $player.setPosition = function (event, seek) {

                        if ($player.playingState == 'STOPPED' || !$player.canPlay)
                            return;

                        var pos = ($player.screenState == 'FULL') ? {'x':0, 'y':0 } : $this.findPos($player.dom.barContainer);
                        var diff = event.pageX - pos.x;
                        var curTime = Math.round((diff * $player.duration) / $player.dom.barContainer.offsetWidth);
                        if (seek)
                            $player.seek(curTime);
                        $player.showPosition(curTime);
                    };

                    $player.changeVolume = function (volume) {

                        var i;
                        for (i = 0; i < $player.dom.volumeBars.length; i++) {
                            $this.addRemoveClass($player.dom.volumeBars[i], [], ['fill']);
                        }
                        for (i = 0; i <= volume; i++) {
                            $this.addRemoveClass($player.dom.volumeBars[i], ['fill'], []);
                        }

                        $player.volume = volume + 1;

                        /* if mute and try to change volume, then unmute*/
                        if ($player.volumeState == 'MUTE') {
                            $player.muteUnmute();
                            return;
                        }

                        $player.setVolume($player.volume);
                    };

                    $player.showHD = function () {

                        /* keeping it for future
                         var currentLevel = $player.levels[level]
                         if (currentLevel) {
                         $player.hd = (currentLevel.height >= 720 || (currentLevel.bitrate / 1000) >= 2000);
                         }*/

                        if ($player.hd) {
                            $player.dom.hd.style.display = 'inline-block';
                        } else {
                            $player.dom.hd.style.display = 'none';
                        }
                    };


                    $player.showPoster = function (show) {

                        if ($player.poster == '')
                            return;

                        if (show) {
                            $player.dom.posterImg.src = $player.poster;
                            $player.dom.posterImg.style.display = 'inline-block';
                        }
                        else {
                            $player.dom.posterImg.style.display = 'none';
                        }
                    };

                    $player.showInfo = function (force) {

                        if ($player.title == '' || $player.mediaType != 'audio' || force) {
                            $player.dom.playInfo.style.display = 'none';
                        }
                        else {
                            $player.dom.playInfo.innerHTML = $player.title;
                            $player.dom.playInfo.style.display = 'block';
                        }

                        if($player.playlist.length > 0) {

                            var thumb = $player.playlist[$player.currentTrack].value.getThumb();
                            thumb = $this.getDefaultThumb(thumb);

                            $player.poster = thumb;

                            if($player.mediaType == 'audio') {
                              $player.showPoster(true);
                            }
                        }

                    };


                    $player.showLoader = function () {
                        if ($player.isLoading && $player.canPlay)
                            $player.dom.loader.style.display = 'block';
                        else
                            $player.dom.loader.style.display = 'none';

                        $player.showMusicBar();
                        $player.showBigPlay();
                    };

                    $player.showError = function () {

                        $player.dom.playError.innerHTML = 'Sorry, your browser does not support this media format.';
                        $player.showLoader();

                        if (!$player.canPlay) {
                            $player.showPoster(false);
                            $player.dom.playError.style.display = 'block';
                        }
                        else {
                            $player.dom.playError.style.display = 'none';
                        }
                    };

                    $player.showBigPlay = function (replay) {

                        if (!$player.canPlay) {
                            $player.dom.bigBlay.style.display = 'none';
                            return;
                        }

                        if (replay) {
                            $this.addRemoveClass($player.dom.bigBlayIcon, ['icon-reload-p'], []);
                        }
                        else {
                            $this.addRemoveClass($player.dom.bigBlayIcon, [], ['icon-reload-p']);
                        }

                        if (($player.playingState == 'PAUSED' || $player.playingState == 'STOPPED') && !$player.isLoading) {
                            $player.dom.bigBlay.style.display = 'block';
                        }
                        else {
                            $player.dom.bigBlay.style.display = 'none';
                        }

                        $player.showMusicBar();
                    };

                    $player.initPlaylist = function () {

                        if (($player.playlist.length > 1)) {
                            $player.dom.playlistBtn.style.display = 'inline-block';
                            $player.dom.prevBtn.style.display = 'inline-block';
                            $player.dom.nextBtn.style.display = 'inline-block';
                            $player.dom.auto.style.display = 'inline-block';
                        }
                        else {
                            $player.dom.playlistBtn.style.display = 'none';
                            $player.dom.prevBtn.style.display = 'none';
                            $player.dom.nextBtn.style.display = 'none';
                            $player.dom.auto.style.display = 'none';
                        }

                        $player.dom.playlistWrap.style.right = '-250px';
                    };

                    $player.showPlaylist = function (forceHide) {


                        if ($player.playlistState || forceHide) {
                            $player.dom.playlistWrap.style.right = '-250px';
                            $player.dom.playlistWrap.style.zIndex = 999;
                            $player.playlistState = false;
                            return;
                        }

                        if (!$player.playlistState) {
                            $player.dom.playlistWrap.style.right = '0';
                            $player.dom.playlistWrap.style.zIndex = 10000;
                            $player.playlistState = true;
                            return;
                        }

                    };



                    $player.createPlaylist = function () {

                        if ($player.playlist.length < 2)
                            return;

                        var thumb, track,
                                playlist = '<div class="playlist-scrollbar-wrapper">'
                                + '<div rg-scrollbar="true" class="playlist-scrollbar">'
                                + '<ul class="playlist">';

                        for (var i = 0; i < $player.playlist.length; i++) {
                            thumb = $player.playlist[i].value.getThumb();
                            thumb = $this.getDefaultThumb(thumb);

                            track = $this.trackTemplate.replace(/data-rel/g, i);
                            track = track.replace(/data-thumb/g, thumb);
                            track = track.replace(/data-caption/g, $player.playlist[i].value.getCaption());
                            track = track.replace(/data-duration/g, $this.secToTime($player.playlist[i].value.getDuration()));

                            if ($player.source == $player.playlist[i].value.getStreamUrl()) {
                                $player.currentTrack = i;
                            }

                            playlist += '<li>' + track + '</li>';
                        }

                        playlist += '</ul></div></div>';

                        $player.dom.playlistWrap.innerHTML = '';
                        $player.dom.playlistWrap.appendChild($compile(playlist)(option.scope)[0]);
                        $player.dom.playlistUL = $player.dom.playlistWrap.querySelector('.playlist');

                        $player.dom.playlist = $player.dom.playlistWrap.querySelectorAll('ul.playlist > li > a');

                        option.scope.$parent.$rgDigest();

                        for (var i = 0; i < $player.dom.playlist.length; i++) {
                            $player.dom.playlist[i].addEventListener('click', function (e) {
                                e.preventDefault();
                                $player.currentTrack = this.getAttribute('rel');
                                $player.title = $player.playlist[$player.currentTrack].value.getCaption();
                                $player.load($player.playlist[$player.currentTrack].value.getStreamUrl());
                            });
                        }

                    };

                    $player.updatePlaylist = function (playlist) {

                        if (!playlist)
                            return;

                        $player.playlist = playlist;
                        $player.createPlaylist();
                    };

                    $player.AddToPlaylist = function (playlist) {

                        var thumb, track;

                        if (!$player.dom.playlistUL) {
                            $player.updatePlaylist(playlist);
                            return;
                        }

                        if (playlist && $player.dom.playlistUL) {

                            for (var i = 0; i < playlist.length; i++) {

                                var li = document.createElement('li');
                                thumb = playlist[i].value.getThumb();
                                thumb = $this.getDefaultThumb(thumb);

                                track = $this.trackTemplate.replace(/data-rel/g, i);
                                track = track.replace(/data-thumb/g, thumb);
                                track = track.replace(/data-caption/g, playlist[i].value.getCaption());
                                track = track.replace(/data-duration/g, $this.secToTime(playlist[i].value.getDuration()));
                                li.innerHTML = track;
                                $player.dom.playlistUL.appendChild(li);
                            }
                        }
                    };

                    $player.setTrack = function () {

                        if ($player.playlist.length < 2)
                            return;

                        if ($player.currentTrack == 0)
                            $this.addRemoveClass($player.dom.prevBtn, ['disabled'], []);
                        else
                            $this.addRemoveClass($player.dom.prevBtn, [], ['disabled']);

                        if ($player.currentTrack == ($player.playlist.length - 1))
                            $this.addRemoveClass($player.dom.nextBtn, ['disabled'], []);
                        else
                            $this.addRemoveClass($player.dom.nextBtn, [], ['disabled']);

                        for (var i = 0; i < $player.dom.playlist.length; i++) {
                            if (i == $player.currentTrack) {
                                $this.addRemoveClass($player.dom.playlist[i], ['active'], ['active']);
                            }
                            else {
                                $this.addRemoveClass($player.dom.playlist[i], [], ['active']);
                            }
                        }

                        $player.showInfo();

                    };

                    $player.setAuto = function (force) {

                        if (force) {
                            $this.addRemoveClass($player.dom.auto, ['enbled'], []);
                            return;
                        }

                        if ($player.auto) {
                            $player.auto = false;
                            $this.addRemoveClass($player.dom.auto, [], ['enbled']);
                            return;
                        }

                        if (!$player.auto) {
                            $player.auto = true;
                            $this.addRemoveClass($player.dom.auto, ['enbled'], []);
                            return;
                        }

                    };

                    $player.showMusicBar = function () {

                        if ($player.mediaType == 'audio' && $player.playingState == 'PLAYING' && !$player.isLoading) {
                            $player.dom.musicBar.style.display = 'block';
                        }
                        else {
                            $player.dom.musicBar.style.display = 'none';
                        }

                    };

                    $player.showControl = function (show) {

                        if ($playerProvider.miniPlayer.player) {
                           $player.dom.controlLayer.style.bottom = '0px';
                           return;
                        }


                        if ($player.playingState == 'PLAYING' && show) {
                            $player.dom.controlLayer.style.bottom = '0px';
                            $player.dom.controlBG.style.opacity = 1;
                        }
                        else {
                            $player.dom.controlLayer.style.bottom = '-60px';
                            $player.dom.controlBG.style.opacity = 0;
                        }
                    };

                    $player.stateChanged = function (state) {

                        if (state == 'BUFFERING') {
                            $player.isLoading = true;
                        }
                        else {
                            $player.isLoading = false;
                        }
                        $player.showLoader();

                        if (state == 'PLAYING') {
                            $player.playingState = 'PLAYING';
                            $player.showBigPlay();
                            $this.addRemoveClass($player.dom.playBtn, ['icon-pause-p'], ['icon-play-p']);
                        }
                        if (state == 'ENDED' || state == 'IDLE') {
                            $player.playingState = 'STOPPED';
                            $player.showBigPlay(true);
                            $player.showPlaylist(true);

                            $this.addRemoveClass($player.dom.playBtn, ['icon-play-p'], ['icon-pause-p']);
                            $player.initTime(0);
                            $player.showPosition(0);
                            $player.showInfo(true);

                            if ($player.auto && $player.playlist.length > 0) {
                                $player.playNext();
                            }
                        }
                    };

                    $player.reset = function () {
                        $player.isLoading = true;
                        $player.initTime(0);
                        $player.showPosition(0);
                        $player.showBuffered(0);
                        $player.showLoader();
                        $player.showInfo();
                    };

                    $player.fullScreen = function () {

                        if ($player.screenState == 'NORMAL') {

                            if ($player.dom.player.requestFullscreen) {

                                $player.dom.player.requestFullscreen();
                            }
                            else if ($player.dom.player.mozRequestFullScreen) {
                                $player.dom.player.mozRequestFullScreen();
                            }
                            else if ($player.dom.player.webkitRequestFullScreen) {
                                $player.dom.player.webkitRequestFullScreen();
                            } else {
                                return false;
                            }

                            $player.screenState = 'FULL';
                            $player.showControl(true);

                            $this.addRemoveClass($player.dom.player, ['full'], []);
                            $this.addRemoveClass($player.dom.fullScreenBtn, ['icon-screen-fe'], ['icon-screen-f']);

                            if ($playerProvider.miniPlayer.dom.container) {
                                $this.addRemoveClass($playerProvider.miniPlayer.dom.container, ['full'], []);
                            }

                            $player.dom.fullScreenBtn.setAttribute('tooltip', $this.dicts['maximize']);
                            return true;
                        }

                        if ($player.screenState == 'FULL') {

                            if (document.cancelFullscreen) {
                                document.cancelFullscreen();
                            }
                            else if (document.exitFullscreen) {
                                document.exitFullscreen();
                            }
                            else if (document.mozCancelFullScreen) {
                                document.mozCancelFullScreen();
                            }
                            else if (document.webkitCancelFullScreen) {
                                document.webkitCancelFullScreen();
                            }
                            $this.addRemoveClass($player.dom.player, [], ['full']);
                            $this.addRemoveClass($player.dom.fullScreenBtn, ['icon-screen-f'], ['icon-screen-fe']);
                            if ($playerProvider.miniPlayer.dom.container) {
                                $this.addRemoveClass($playerProvider.miniPlayer.dom.container, [], ['full']);
                            }

                            $player.showControl(false);
                            $player.screenState = 'NORMAL';
                            $playerProvider.escapeKey = true;
                            $player.dom.fullScreenBtn.setAttribute('tooltip', $this.dicts['fullScreen']);
                            return true;
                        }

                    };

                    $player.playNext = function () {

                        if ($player.currentTrack == $player.playlist.length - 1) {
                            return;
                        }

                        $player.currentTrack++;
                        $player.title = $player.playlist[$player.currentTrack].value.getCaption();
                        $player.load($player.playlist[$player.currentTrack].value.getStreamUrl());

                        if (option.onNext)
                            option.onNext.apply(option.scope);

                    };

                    $player.playPrev = function () {

                        if ($player.currentTrack == 0) {
                            return;
                        }

                        $player.currentTrack--;
                        $player.title = $player.playlist[$player.currentTrack].value.getCaption();
                        $player.load($player.playlist[$player.currentTrack].value.getStreamUrl());

                        if (option.onNext)
                            option.onNext.apply(option.scope);
                    };

                    /* ui related api*/
                    $player.getPlaylistUI = function () {
                        return $player.dom.playlistWrap;
                    }

                    $player.getNextUI = function () {
                        return $player.dom.nextBtn;
                    };

                    $player.getPrevUI = function () {
                        return $player.dom.prevBtn;
                    };

                    /*  media object related*/
                    $player.load = function (url) {
                        $player.reset();
                        $player.setTrack();

                        $player.provider.pause();
                        $player.seek(0);
                        $player.provider.src = url;

                        $player.source = url;

                        /* fire event on change*/
                        if (angular.isFunction(option.scope.onChange()) && $player.playlist.length > 0) {
                            option.scope.onChange()($player.playlist[$player.currentTrack].value);
                        }
                    };

                    $player.play = function () {
                        $player.provider.play();

                        $player.playingState = 'PLAYING';
                        $this.addRemoveClass($player.dom.playBtn, ['icon-pause-p'], ['icon-play-p']);
                    };

                    $player.pause = function () {
                        $player.provider.pause();

                        $player.playingState = 'PAUSED';
                        $this.addRemoveClass($player.dom.playBtn, ['icon-play-p'], ['icon-pause-p']);
                    };

                    $player.resume = function () {
                        $player.provider.play();

                        $player.playingState = 'PLAYING';
                        $this.addRemoveClass($player.dom.playBtn, ['icon-pause-p'], ['icon-play-p']);
                    };

                    $player.seek = function (offset) {

                        try {
                            $player.provider.currentTime = offset;
                        }
                        catch (e) {
                        }

                    };

                    $player.stop = function () {
                        $player.provider.pause();
                        $player.seek(0);
                        $player.playingState = 'STOPPED';
                        $this.addRemoveClass($player.dom.playBtn, ['icon-play-p'], ['icon-pause-p']);

                    };

                    $player.setVolume = function (volume) {
                        $player.provider.volume = volume / 10;
                    };

                    $player.initEvent();
                    $player.showControl();
                    $player.showLoader();
                    $player.showBigPlay();
                    $player.showError();
                    $player.showInfo();
                    $player.showMusicBar();
                    $player.initPlaylist();
                    $player.showHD();
                    $player.playingState = 'STOPPED';

                    $player.provider.autoplay = false;
                    $player.load(option.source);
                    $player.setVolume($player.volume);

                    $this.instances.push($player);

                    return $player;
                };
                return $playerProvider;
            }];
    }

    rgPlayer.$inject = ['$compile', '$player', '$ringbox'];
    function rgPlayer($compile, $player, $ringbox) {

        function link(scope, element, attrs) {

            var id = (attrs.id) ? attrs.id : 'player_1',
                    width = (attrs.width) ? attrs.width : '100%',
                    height = (attrs.height) ? attrs.height : '100%',
                    auto = (attrs.auto == 'false' || attrs.auto == false) ? false : true,
                    src = (attrs.url) ? attrs.url : '',
                    title = (attrs.title) ? attrs.title : '',
                    type = (attrs.isVideo == 'true' || attrs.isVideo == false) ? 'video' : 'audio',
                    poster = (attrs.poster) ? attrs.poster : (type == 'audio' ? 'images/player-audio.png' : ''),
                    autoPlay = (attrs.autoPlay == 'false' || attrs.autoPlay == false) ? false : true,
                    chat = (attrs.chat == 'true' || attrs.chat == true) ? true : false,
                    current = 0,
                    player = null,
                    playerUI = null,
                    nextBtn = null,
                    prevBtn = null,
                    minMaxDom =  null,
                    fromPlaylist = false;

            if (!poster || poster == 'default_audio_image.jpg')
                poster = 'images/player-audio.png';

            var tpl = '<div title="" id="player_' + id + '" class="player ' + type + '"></div>';
            element.append(tpl);

            setTimeout(function () {
                player = $player.player({
                    source: src,
                    title: title,
                    playlist: scope.playlist,
                    auto: auto,
                    type: type,
                    parentId: "player_" + id,
                    autoPlay: autoPlay,
                    chatVersion: chat,
                    width: width,
                    height: height,
                    poster: poster,
                    ringboxMinimize: $ringbox.minimize,
                    ringboxMaximize: $ringbox.maximize,
                    ringboxRemove: $ringbox.removeMinimize,
                    scope: scope
                });

               /* Min / max option*/
               minMaxDom = element[0].closest('.ringbox-inner').querySelector('.player-size');

               if(minMaxDom) {
                   minMaxDom.addEventListener('click', minMaxPlayerCallback, false);
                }

             });

            function minMaxPlayerCallback(e) {
              e.preventDefault();
              e.stopPropagation();
              player.minimize();
            }

            scope.$on('$destroy', function(){
               if(minMaxDom) {
                 minMaxDom.removeEventListener('click', minMaxPlayerCallback);
               }
               minMaxDom = null;
            });

        }

        return {
            restrict: 'E',
            scope: {
                onChange: '&',
                onStart: '&',
                onEnded: '&',
                playlist: '='
            },
            link: link
        }
    }
