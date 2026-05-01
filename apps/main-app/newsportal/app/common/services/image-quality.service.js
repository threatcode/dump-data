/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* * Copyright : Ipvision
*
* * File Name : image-quality.service.js
*
* * Creation Date : 01-01-2015
*
* * Last Modified : Tue 03 Nov 2015 17:13:48 BDT
*
* _._._._._._._._._._._._._._._._._._._._._.*/



       var imageQuality = function ( APP_CONSTANTS) { // jshint ignore:line
           var self = this, // jshint ignore:line
               coverMinW = APP_CONSTANTS.COVER_PIC_UPLOAD_MINIMUM_WIDTH,
               coverMinH = APP_CONSTANTS.COVER_PIC_UPLOAD_MINIMUM_HEIGHT,
               coverMaxW = APP_CONSTANTS.COVER_PIC_UPLOAD_MAXIMUM_WIDTH,
               coverMaxH = APP_CONSTANTS.COVER_PIC_UPLOAD_MAXIMUM_HEIGHT,
               profileMinW = APP_CONSTANTS.PROFILE_PIC_UPLOAD_MINIMUM_WIDTH,
               profileMinH = APP_CONSTANTS.PROFILE_PIC_UPLOAD_MINIMUM_HEIGHT,
               imageMinH = APP_CONSTANTS.IMAGE_UPLOAD_MIN_HEIGHT,
               imageMinW = APP_CONSTANTS.IMAGE_UPLOAD_MIN_WIDTH;


           self.resizeImage = function (imageFile, uploadType) {
               // imageFile can be image source path or imageMap object

               var image = new Image(),
                   limitCross = false,
                   defer = Q.defer(),
                   meta = {
                       ih: 0,
                       iw: 0,
                       previewUrl: '',
                       file: ''
                   },
                   URL = window.URL || window.webkitURL;


               function imageLoaded() {
                   var imgObj = this; // jshint ignore:line
                   var canvas,
                       scale = 1,
                       ctx,
                       imageWidth = imgObj.width,
                       imageHeight = imgObj.height;

                   function dataURLToBlob(dataURL) {
                       var BASE64_MARKER = ';base64,',
                           parts,
                           contentType,
                           binary;

                       if (dataURL.indexOf(BASE64_MARKER) == -1) {
                           parts = dataURL.split(',');
                           contentType = parts[0].split(':')[1];
                           binary = decodeURIComponent(parts[1]);

                           return new Blob([binary], {type: contentType});
                       }

                       parts = dataURL.split(BASE64_MARKER);
                       contentType = parts[0].split(':')[1];
                       binary = window.atob(parts[1]);

                       var uInt8Array = new Uint8Array(binary.length);

                       for (var i = 0; i < binary.length; ++i) {
                           uInt8Array[i] = binary.charCodeAt(i);
                       }

                       return new Blob([uInt8Array], {type: contentType});

                   }

                   function resizeInCanvas(imgQuality) {

                       canvas = document.createElement('canvas');
                       canvas.width = meta.iw;
                       canvas.height = meta.ih;
                       ctx = canvas.getContext('2d');

                       ctx.drawImage(imgObj, 0, 0, meta.iw, meta.ih);

                       if (imgQuality) {
                           meta.imQ = imgQuality.qualityIM.quality;
                       }

                       meta.previewUrl = canvas.toDataURL('image/jpeg');
                       meta.file = dataURLToBlob(meta.previewUrl);

                       // meta.file.name = imageFile.name || uploadType + '.jpg';
                       meta.file.name = imageFile.name || portalUtils.getUniqueId() + '.jpg';

                       defer.resolve(meta);

                       //RingLogger.print('img: ' + imageFile.name + ' Quality: ' + meta.imQ, RingLogger.tags.UPLOAD);

                       // queue in upload service for actual upload later
                       //fileUploadService.queueFile(uploadType, meta);

                       // only for chat images retain objectURL otherwise remoke it
                       //if (uploadType  && (uploadType === 'chatimage' || uploadType === 'tagchatimage')) {
                       //defer.resolve(image.src, meta.boxValue);
                       //} else {
                       //RingLogger.information('revoking ObjectURL: ' + uploadType, RingLogger.tags.UPLOAD);
                       //URL.revokeObjectURL(image.src);
                       //defer.resolve(meta.previewUrl, meta.boxValue);
                       //}

                   }

                   // meature actual resize dimensions
                   if (imageWidth > coverMaxW || imageHeight > coverMaxH) {
                       // set width = maximum allowed Width and adjust Height
                       if ((imageWidth / coverMaxW) > (imageHeight / coverMaxH)) {
                           scale = coverMaxW / imageWidth;
                           meta.iw = coverMaxW;
                           meta.ih = Math.floor(scale * imageHeight);
                       } else { // set height = maximum allowed and adjust width
                           scale = coverMaxH / imageHeight;
                           meta.ih = coverMaxH;
                           meta.iw = Math.floor(scale * imageWidth);
                       }
                   } else {
                       // no need to resize
                       meta.iw = imageWidth;
                       meta.ih = imageHeight;
                   }

                   RingLogger.print('Resize scale: ' + scale, RingLogger.tags.UPLOAD);
                   RingLogger.print('image.Width: ' + imageWidth + ' image.Height: ' + imageHeight, RingLogger.tags.UPLOAD);
                   RingLogger.print('resized.Width: ' + meta.iw + ' resized.Height: ' + meta.ih, RingLogger.tags.UPLOAD);
                   var minimumH = imageMinH,
                       minimumW = imageMinW;

                   switch (uploadType) {
                       case 'profilephoto':
                           if (meta.iw < profileMinW || meta.ih < profileMinH) {
                               minimumH = profileMinH;
                               minimumW = profileMinW;
                               limitCross = true;
                           }
                           break;
                       case 'coverphoto':
                           if (meta.iw < coverMinW || meta.ih < coverMinH) {
                               minimumH = coverMinH;
                               minimumW = coverMinW;
                               limitCross = true;
                           }
                           break;
                       case 'image':
                       case 'status':
                       case 'chatimage':
                       case 'tagchatimage':
                           if (meta.iw < imageMinW || meta.ih < imageMinH) {
                               limitCross = true;
                           }
                           break;
                       default:
                           RingLogger.warn(': ' + uploadType, RingLogger.tags.UPLOAD);
                   }


                   if (limitCross) {
                       defer.reject('Image Size below Minimum(' + minimumW + 'px by ' + minimumH + 'px) :' + imageFile.name);
                   } else {
                       // get quality and then resize and queue for uploading
                       // ignore
                       //if(imageFile.type === 'image/jpeg') {
                       //// calculate quality only for jpeg
                       //self.calculate(imgObj, resizeInCanvas);
                       //} else {
                       resizeInCanvas(false);
                       //}

                   }


               }

               function imageError() {
                   RingLogger.warning('invalid image error: ' + imageFile.name, RingLogger.tags.UPLOAD);
                   defer.reject('Image invalid: ' + imageFile.name);
               }

               if (typeof imageFile === 'string') {
                   image.setAttribute('crossOrigin', 'anonymous');
                   image.src = imageFile;
               } else {
                   image.src = URL.createObjectURL(imageFile); // new file upload
               }

               image.onload = imageLoaded;
               image.onerror = imageError;

               return defer.promise;
           }
            return self;
       }(APP_CONSTANTS);
