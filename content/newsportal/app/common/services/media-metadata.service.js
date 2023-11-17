/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* * Copyright : Ipvision
*
* * File Name : video-metadata.service.js
*
* * Creation Date : 01-01-2015
*
* * Last Modified : Tue 03 Nov 2015 14:36:47 BDT
*
* _._._._._._._._._._._._._._._._._._._._._.*/


(function (DataView) {
    'use strict';

    var frameTypes = {
        /*
         * Textual frames
         */
        //'TALB': 'album',
        //'TBPM': 'bpm',
        //'TCOM': 'composer',
        //'TCON': 'genre',
        //'TCOP': 'copyright',
        //'TDEN': 'encoding-time',
        //'TDLY': 'playlist-delay',
        //'TDOR': 'original-release-time',
        //'TDRC': 'recording-time',
        //'TDRL': 'release-time',
        //'TDTG': 'tagging-time',
        //'TENC': 'encoder',
        //'TEXT': 'writer',
        //'TFLT': 'file-type',
        //'TIPL': 'involved-people',
        //'TIT1': 'content-group',
        'TIT2': 'title',
        //'TIT3': 'subtitle',
        //'TKEY': 'initial-key',
        //'TLAN': 'language',
        //'TLEN': 'length',
        //'TMCL': 'credits',
        //'TMED': 'media-type',
        //'TMOO': 'mood',
        //'TOAL': 'original-album',
        //'TOFN': 'original-filename',
        //'TOLY': 'original-writer',
        'TOPE': 'original-artist',
        //'TOWN': 'owner',
        'TPE1': 'artist',
        //'TPE2': 'band',
        //'TPE3': 'conductor',
        //'TPE4': 'remixer',
        //'TPOS': 'set-part',
        //'TPRO': 'produced-notice',
        //'TPUB': 'publisher',
        //'TRCK': 'track',
        //'TRSN': 'radio-name',
        //'TRSO': 'radio-owner',
        //'TSOA': 'album-sort',
        //'TSOP': 'performer-sort',
        //'TSOT': 'title-sort',
        //'TSRC': 'isrc',
        //'TSSE': 'encoder-settings',
        //'TSST': 'set-subtitle',
        /*
         * Textual frames (<=2.2)
         */
        //'TAL': 'album',
        //'TBP': 'bpm',
        //'TCM': 'composer',
        //'TCO': 'genre',
        //'TCR': 'copyright',
        //'TDY': 'playlist-delay',
        //'TEN': 'encoder',
        //'TFT': 'file-type',
        //'TKE': 'initial-key',
        //'TLA': 'language',
        //'TLE': 'length',
        //'TMT': 'media-type',
        'TOA': 'original-artist',
        //'TOF': 'original-filename',
        //'TOL': 'original-writer',
        //'TOT': 'original-album',
        'TP1': 'artist',
        //'TP2': 'band',
        //'TP3': 'conductor',
        //'TP4': 'remixer',
        //'TPA': 'set-part',
        //'TPB': 'publisher',
        //'TRC': 'isrc',
        //'TRK': 'track',
        //'TSS': 'encoder-settings',
        //'TT1': 'content-group',
        'TT2': 'title',
        //'TT3': 'subtitle',
        //'TXT': 'writer',
        /*
         * URL frames
         */
        //'WCOM': 'url-commercial',
        //'WCOP': 'url-legal',
        //'WOAF': 'url-file',
        //'WOAR': 'url-artist',
        //'WOAS': 'url-source',
        //'WORS': 'url-radio',
        //'WPAY': 'url-payment',
        //'WPUB': 'url-publisher',
        /*
         * URL frames (<=2.2)
         */
        //'WAF': 'url-file',
        //'WAR': 'url-artist',
        //'WAS': 'url-source',
        //'WCM': 'url-commercial',
        //'WCP': 'url-copyright',
        //'WPB': 'url-publisher',
        /*
         * Comment frame
         */
        //'COMM': 'comments',
        /*
         * Image frame
         */
        'APIC': 'image',
        'PIC': 'image'
    };

    /*
     * ID3 image types
     */
    var frameImageTypes = [
        'other',
        'file-icon',
        'icon',
        'cover-front',
        'cover-back',
        'leaflet',
        'media',
        'artist-lead',
        'artist',
        'conductor',
        'band',
        'composer',
        'writer',
        'location',
        'during-recording',
        'during-performance',
        'screen',
        'fish',
        'illustration',
        'logo-band',
        'logo-publisher'
    ];

    angular
        .module('ringid.common.media_metadata_service', ['ringid.utils'])
        .service('mediaMetadata', mediaMetadata);

        mediaMetadata.$inject = [ '$$q', 'Ringalert', 'utilsFactory'];
        function mediaMetadata( $q, Ringalert, utilsFactory) { //jshint ignore:line
            var self = this;  //jshint ignore:line

            function fetchVideoMeta(thisVideo) {
                    //var thisVideo = this;
                    var //canvas = document.createElement('canvas'),
                        thumb = {
                            drtn: Math.floor(thisVideo.duration),
                            tiw: thisVideo.videoHeight,
                            tih: thisVideo.videoWidth,
                            artst: '',
                            ttl: thisVideo.nameFromFile.substr(0, thisVideo.nameFromFile.lastIndexOf('.')) || thisVideo.nameFromFile,
                            //uniqueId: thisVideo.uniqueId,
                            //thmbURL: '',
                            //previewUrl: ''
                        };

                    //canvas.height = thumb.ih;
                    //canvas.width = thumb.iw;
                    //ctx = canvas.getContext('2d');

                    //ctx.drawImage(thisVideo, 0, 0, thumb.iw, thumb.ih);
                    //thumb.previewUrl= canvas.toDataURL('image/jpeg');
                    //thumb.file = utilsFactory.dataURLToBlob(thumb.previewUrl);
                    //RingLogger.information('size: ' + thumb.file.size + ' currentTime: ' + thisVideo.currentTime + ' file: ' + thisVideo.nameFromFile, RingLogger.tags.MEDIA);


                    //thumb.file.name = 'video-thumb.jpg';

                    //if (thumb.file.size < 2000 && thisVideo.currentTime > 4) {
                        ////thisVideo.currentTime = thisVideo.currentTime - 0.5;
                        //thumb.previewUrl = '';
                    //}


                    window.URL.revokeObjectURL(thisVideo.src);

                    thisVideo.deferObj.resolve(thumb);

            }


            function parseFrameLegacy(buffer) {
                var dv = new DataView(buffer),
                    result = {tag: null, value: null},
                    encoding,
                    header = {
                        id: dv.getString(0, 3),
                        type: dv.getString(0, 1),
                        size: dv.getUint24(3)
                };
                RingLogger.print( header , RingLogger.tags.UPLOAD);
                /*
                * No support for compressed, unsychronised, etc frames
                **/
               if (!(header.id in frameTypes)) {
                   return false;
               }

               result.tag = frameTypes[header.id];
               if (header.type === 'T') {
                    encoding = dv.getUint8(7);
                    RingLogger.information('encoding: ' + encoding, RingLogger.tags.UPLOAD);

					result.value = dv.getString(7, dv.byteLength-7);
                    //if(header.id === 'TCO' && !!parseInt(result.value)) {
                        //result.value = Genres[parseInt(result.value)];
                    //}
				//} else if (header.type === 'W') {
					//result.value = dv.getString(7, dv.byteLength-7);
                //} else if (header.id === 'COM')	 {
                    //encoding = dv.getUint8(6);
                    //result.value = dv.getString(10, dv.byteLength-10);
                    //if (result.value.indexOf('\x00') !== -1) {
                        //result.value = result.value.substr(result.value.indexOf('\x00') + 1);
                    //}
               } else if (header.id === 'PIC') {
                    encoding = dv.getUint8(6);
                    var image = {
						type: null,
						mime: 'image/' + dv.getString(7, 3).toLowerCase(),
						description: null,
						data: null
                    };
                    image.type = frameImageTypes[dv.getUint8(11)] || 'other';
                    var variableStart = 11, variableLength = 0;
                    for(var i = variableStart;; i++) {
                        if(dv.getUint8(i) === 0x00) {
                            variableLength = i - variableStart;
                            break;
                        }
                    }
                    image.description = (variableLength === 0 ? null : dv.getString(variableStart, variableLength));
                    //image.data = new Uint8Array(buffer.slice(variableStart + 1));
                    result.value = new Blob(new Uint8Array(buffer.slice(variableStart + 1)), {type: image.mime});

                }

                return (result.tag ? result : false);
            }

            function parseFrame(buffer, major, minor) {
                minor = minor || 0;
                major = major || 4;

                if (major < 3) {
                    return parseFrameLegacy(buffer);
                }

				var dv = new DataView(buffer),
                    encoding,
                    result = {tag: null, value: null},
					header = {
						id: dv.getString(0, 4),
						type: dv.getString(0, 1),
						size: dv.getSynch(dv.getUint32(4)), //dv.getSynch(dv.getIntByByte(start+4, 4)),
						flags: [
							dv.getUint8(8),  // dv.getIntByByte(start+8, 1),
							dv.getUint8(9) //dv.getIntByByte(start+9, 1)
						]
					};
				RingLogger.print( header , RingLogger.tags.UPLOAD  );

                //No support for compressed, unsychronised, etc frames
                if (header.flags[0] !== 0 || !(header.id in frameTypes)) {
                    return false;
                }

                result.tag = frameTypes[header.id];
				if(header.type === 'T') {
					encoding = dv.getUint8(10);
					/*
					 * TODO: Implement UTF-8, UTF-16 and UTF-16 with BOM properly?
					 */
					if(encoding === 0 || encoding === 3) {
						result.value = dv.getString(11, dv.byteLength-11);
					} else if(encoding === 1) {
						result.value = dv.getStringUtf16(-11, 11, true);
					} else if(encoding === 2) {
						result.value = dv.getStringUtf16(-11, 11);
					} else {
						return false;
					}
					//if(header.id === 'TCON' && !!parseInt(result.value)) {
						//result.value = Genres[parseInt(result.value)];
					//}
				//} else if(header.type === 'W') {
					//result.value = dv.getString(10, dv.byteLength-10);
				//} else if(header.id === 'COMM') {
					/*
					 * TODO: Implement UTF-8, UTF-16 and UTF-16 with BOM properly?
					 */
					//var variableStart = 14, variableLength = 0;
					//encoding = dv.getUint8(10);
					/*
					 * Skip the comment description and retrieve only the comment its self
					 */
					//for(var i = variableStart;; i++) {
						//if(encoding === 1 || encoding === 2) {
							//if(dv.getUint16(i) === 0x0000) {
								//variableStart = i + 2;
								//break;
							//}
							//i++;
						//} else {
							//if(dv.getUint8(i) === 0x00) {
								//variableStart = i + 1;
								//break;
							//}
						//}
					//}
					//if(encoding === 0 || encoding === 3) {
						//result.value = dv.getString(variableStart, dv.byteLength - variableStart);
					//} else if(encoding === 1) {
						////result.value = dv.getStringUtf16(-1 * variableStart, variableStart, true);
					//} else if(encoding === 2) {
						////result.value = dv.getStringUtf16(-1 * variableStart, variableStart);
					//} else {
                        //return false;
					//}
				} else if(header.id === 'APIC') {
					encoding = dv.getUint8(10);
					var image = {
							type: null,
							mime: null,
							description: null,
							data: null
						};
					var variableStart = 11, variableLength = 0;
					for(var i = variableStart;;i++) {
						if(dv.getUint8(i) === 0x00) {
							variableLength = i - variableStart;
							break;
						}
					}
					image.mime = dv.getString(variableStart, variableLength);
                    image.type = frameImageTypes[dv.getUint8(variableStart + variableLength + 1)] || 'other';
                    variableStart += variableLength + 2;
                    variableLength = 0;
                    for(var i = variableStart;; i++) {
                        if(dv.getUint8(i) === 0x00) {
                            variableLength = i - variableStart;
                            break;
                        }
                    }
                    image.description = (variableLength === 0 ? null : dv.getString(variableStart, variableLength));
                    //image.data = new Uint8Array(buffer.slice(variableStart + 1));
                    result.value = new Blob(new Uint8Array(buffer.slice(variableStart + 1)), {type: image.mime});
				}
				return (result.tag ? result : false);


            }

            function readID3Tags(buffer, meta) {
                var dv = new DataView(buffer),
                    metaV2 = {},
                    tagVersion,
                    tagSize = 0,
                    headerSize = 10,
                    tagFlags,
                    offset = dv.byteLength - 128;


                // id3v1
                if (dv.getString(offset, 3) === 'TAG') {
                    offset += 3;
                    meta.ttl = dv.getString(offset, 30).trim() || null;
                    offset += 30;
                    meta.artst = dv.getString(offset, 30).trim() || null;
                // id3v2
                } else {
                    RingLogger.warning('ID3V1 MISSING', RingLogger.tags.UPLOAD);
                }

                // id3v2
                tagVersion = dv.getUint8(3);
                tagFlags = dv.getUint8(5); //dv.getIntByByte(5, 1);
                tagSize += dv.getSynch(dv.getUint32(6));
                RingLogger.information('tagVersion: ' + tagVersion, RingLogger.tags.UPLOAD);
                RingLogger.information('tagFlags: ' + tagFlags, RingLogger.tags.UPLOAD);
                if (tagSize > dv.byteLength || dv.getString(0, 3) !== 'ID3' || tagVersion > 4 || (tagFlags & 0x80) !== 0) {
                    RingLogger.information('NO ID3V2 TAG', RingLogger.tags.UPLOAD);
                } else {
                    if ((tagFlags & 0x40) !== 0) {
                        headerSize += dv.getSynch(dv.getUint32(11));
                    }

                    // calculate the tag size to be read
                    while(headerSize < tagSize) {
                        RingLogger.information('headerSize: ' + headerSize, RingLogger.tags.UPLOAD);
                        RingLogger.information('tagSize: ' + tagSize, RingLogger.tags.UPLOAD);
                        var frame,
                            slice,
                            frameBit,
                            isFrame = true;

                        for(var i = 0; i < 3; i++) {
                            frameBit = dv.getUint8(headerSize+i);
                            if((frameBit < 0x41 || frameBit > 0x5A) && (frameBit < 0x30 || frameBit > 0x39)) {
                                isFrame = false;
                            }
                        }
                        if(!isFrame)  {
                            RingLogger.warning('NO FRAME FOUND FOR MP3', RingLogger.tags.UPLOAD);
                            break;
                        }
                        /*
                         * < v2.3, frame ID is 3 chars, size is 3 bytes making a total size of 6 bytes
                         * >= v2.3, frame ID is 4 chars, size is 4 bytes, flags are 2 bytes, total 10 bytes
                         */
                        if(tagVersion < 3) {
                            slice = buffer.slice(headerSize, headerSize + 6 + dv.getUint24(headerSize + 3));
                        } else {
                            slice = buffer.slice(headerSize, headerSize + 10 + dv.getSynch( dv.getUint32(headerSize + 4) ));
                        }

                        frame = parseFrame(slice, tagVersion);


                        RingLogger.print(frame, RingLogger.tags.UPLOAD);
                        if(frame) {
                            metaV2[frame.tag] = frame.value;
                        }
                        headerSize += slice.byteLength;
                    }

                }

                // put id3v1 or id3v2 tags
                meta.ttl = metaV2.title ||  meta.ttl || '';
                meta.artst = metaV2.artist || metaV2['original-artist'] || meta.artst || '';
                // TODO FIX AUDIO IMAGE CAPTURE THEN ENABLE BELOW LINE
                //meta.thmbURL = metaV2.image || null;
            }


            function fetchAudioMeta()  {
                    var thisAudio = this, //jshint ignore:line
                        meta = {
                                drtn: Math.floor(thisAudio.duration),
                                tiw: 0,
                                tih: 0,
                                artst: '',
                                ttl: thisAudio.nameFromFile.substr(0, thisAudio.nameFromFile.lastIndexOf('.')) || thisAudio.nameFromFile,
                                thmbURL: '',
                                //uniqueId: thisAudio.uniqueId,
                        };

                    RingLogger.log(meta, RingLogger.tags.MEDIA);


                    var reader = new FileReader();
                    reader.onload = function() {
                        readID3Tags(this.result, meta);
                        RingLogger.print(meta, RingLogger.tags.UPLOAD);
                        thisAudio.deferObj.resolve(meta);
                    };
                    reader.readAsArrayBuffer(thisAudio.fileObj);

            }


            function errorHandler(cause) {
                RingLogger.error(cause, RingLogger.tags.MEDIA);
                this.deferObj.reject(); //jshint ignore:line
            }

            self.generateMeta = function(uploadFile, mediaType) {
                var defer = $q.defer(),
                    mediaElement;


                if(mediaType === 'audio') {
                    mediaElement = document.createElement('audio');
                    mediaElement.addEventListener('loadeddata', fetchAudioMeta);
                    mediaElement.fileObj = uploadFile;
                } else {
                    mediaElement = document.createElement('video');
                    mediaElement.addEventListener('loadeddata', function() {
                        var thisVideo = this;
                        thisVideo.currentTime =  (thisVideo.duration > 20.0) ? 10.0 : thisVideo.duration / 2;

                        function fetchMeta() {
                            mediaElement.removeEventListener('timeupdate', fetchMeta);
                            fetchVideoMeta(thisVideo);
                        }

                        mediaElement.addEventListener('timeupdate', fetchMeta);
                    });

                }

                mediaElement.deferObj = defer;
                mediaElement.nameFromFile = uploadFile.name;
                //mediaElement.uniqueId = uploadFile.getKey();

                mediaElement.addEventListener('onerror', errorHandler);
                mediaElement.src = window.URL.createObjectURL(uploadFile);


                return defer.promise;
            };


        }

})(DataView);
