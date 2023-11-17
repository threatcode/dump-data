    angular.module('ringid.feed')
    .directive('feedImage',feedImage);
    // feedApp.directive("feedImageStyle",function(){
    //     return function (scope,element,attr){
    //         var image = scope.feedimages[attr.feedImageStyle].value;
    //         var styles = {backgroundImage: 'url(' + image.src(600) + ')'};
    //          element.css(styles);
    //     }
    // });
    feedImage.$inject = ['Utils','SystemEvents','$compile'];
    function feedImage(Utils,SystemEvents,$compile) {
            function getHeightByWidth(ob,width){ //ob is image image map offset() api return value
                return (width * ob.height)/ob.width;
            }
            function getImageTemplate(index,template){
                return '<div class="img'+(index+1)+'" style="background-image:url(\'{{::feedimages['+index+'].value.src(600)}}\')" rg-ringbox="true"'
                        +'ringbox-controller="RingBoxImageController" ringbox-type="remote" ringbox-animation="true" '
                        +'ringbox-target="templates/partials/notification/'+(template || 'image-popup.html')+'"'
                        +' ringbox-data="getImageData(feedimages['+index+'].value, feed)"></div>';
            }
            var layoutHtmls = {
                        layout_0 : '<div class="grid">'+getImageTemplate(0)+'</div>'
                                          +'<div class="grid">'+getImageTemplate(1) + getImageTemplate(2)+'</div>',
                        layout_2 : '<div class="grid">'+getImageTemplate(0) + getImageTemplate(1)+'</div>'
                                          +'<div class="grid">'+getImageTemplate(2)+'</div>',
                        layout_4 : '<div class="grid">'+getImageTemplate(0) + getImageTemplate(1)+'</div>',
                        layout_5 : getImageTemplate(0)
                    };
                    layoutHtmls.layout_1 = layoutHtmls.layout_0;
                    layoutHtmls.layout_3 = layoutHtmls.layout_2;
                    layoutHtmls.layout_6 = layoutHtmls.layout_5;
                var layoutHtmls2 = {
                    layout_0 : '<div class="grid">'+getImageTemplate(0,"image-popup-special.html")+'</div>'
                                          +'<div class="grid">'+getImageTemplate(1,"image-popup-special.html") + getImageTemplate(2,"image-popup-special.html")+'</div>',
                        layout_2 : '<div class="grid">'+getImageTemplate(0,"image-popup-special.html") + getImageTemplate(1,'image-popup-special.html')+'</div>'
                                          +'<div class="grid">'+getImageTemplate(2,"image-popup-special.html")+'</div>',
                        layout_4 : '<div class="grid">'+getImageTemplate(0,"image-popup-special.html") + getImageTemplate(1,"image-popup-special.html")+'</div>',
                        layout_5 : getImageTemplate(0,"image-popup-special.html")
                    };
                    layoutHtmls2.layout_1 = layoutHtmls2.layout_0;
                    layoutHtmls2.layout_3 = layoutHtmls2.layout_2;
                    layoutHtmls2.layout_6 = layoutHtmls2.layout_5;


            return {
                restrict: 'A',
                scope : true,
                link: function (scope, element, attr) {
                        var layouts;
                        if(attr.feedImage === 'shared'){
                            scope.feed = scope.feed.getOrginalFeed();
                        }
                        //scope.divHeight = element[0].offsetHeight;
                        //scope.divWidth = element[0].offsetWidth;
                        scope.layout_id = scope.feed.getImageLayout();

                        scope.feedimages = scope.feed.getImages();
                       // scope.layout_styles = layoutHtmls['layout_'+scope.layout_id].styles;
                        if(scope.layout_id === 5){
                            if(scope.feedimages[0].value.offset().width < 600 && scope.feedimages[0].value.offset().height < 400){
                                scope.layout_id = 6;
                            }else{
                                if(getHeightByWidth(scope.feedimages[0].value.offset(),600) < 400){
                                    scope.layout_id = 6;
                                }
                            }
                            // element.css({
                            //     height : scope.feedimages[0].value.offset().height +'px'
                            // });
                        }

                        element.addClass('img-layout-'+scope.layout_id);
                        if(scope.feedimages.length){
                            if(attr.popupTemplate){
                                layouts = layoutHtmls2;
                            }else{
                                layouts = layoutHtmls;
                            }
                            var html = $compile(layouts['layout_'+scope.layout_id])(scope);
                            if(scope.feed.getTotalImage() > 3){
                                html[1].lastChild.innerHTML = '<div class="img-bg-opa"></div>\
    <div class="img-bg-counter">+'+(scope.feed.getTotalImage() - 3)+'</div>';
                            }
                            element.html("");
                            element.append(html);

                        }




                        // if(!angular.isDefined(scope.imageslength)){
                        //     scope.imageslength = 1;
                        // }

                        // element.removeClass('floader');

                        // var imageOffset = scope.image.offset();

                        // function setWidthHeight(withClass){
                        //     var classname;
                        //     if(((scope.imageslength >= 3 && scope.$index === 0 )) || scope.imageslength == 1){
                        //         classname = 'full';
                        //         if(Utils.feedCellWidth > imageOffset.width){
                        //             element.css({
                        //                 width : imageOffset.width +'px',
                        //                 height : imageOffset.height +'px'
                        //             });
                        //         }else{
                        //             element.css({
                        //                 width : Utils.feedCellWidth +'px',
                        //                 height : getHeightByWidth(imageOffset,Utils.feedCellWidth) + 'px'
                        //             });

                        //         }
                        //         if(scope.imageslength == 1){
                        //             classname = 'single';
                        //         }
                        //     }else if ((scope.imageslength == 2 || scope.$index > 0 )) {
                        //         classname = 'half';
                        //     }

                        //     if(withClass){
                        //         element.addClass(classname);
                        //     }

                        // }
                        // scope.$on(SystemEvents.COMMON.WINDOW_RESIZED,function ($event) {
                        //     if(!attr['feedImageResponsive']) {
                        //         setWidthHeight()
                        //     }
                        // });

                        // scope.$on(SystemEvents.COMMON.COLUMN_CHANGED,function ($event) {
                        //     if(!attr['feedImageResponsive']) {
                        //         setWidthHeight()
                        //     }
                        // });

                        // if(!attr['feedImageResponsive']){
                        //     setWidthHeight(true);
                        // }

                       // element.css({backgroundImage: 'url(' + scope.image.src(600) + ')'});
                        //  console.dir(scope.image.offset());
                        //if (img.complete) { // sometimes when browser load the image from cache // onload not fired
                        //    loadHandler();
                        //}

                    }
            };
    }

    /**
     * directive not in use
     */
    // feedApp.directive('feedVideo',feedVideoDirective);

    // feedVideoDirective.$inject = ['Utils','SystemEvents'];
    //  function feedVideoDirective(Utils,SystemEvents) {
    //         function getHeightByWidth(ob,width){ //ob is image image map offset() api return value
    //             return (width * ob.height)/ob.width;
    //         }

    //     return {
    //         restrict: 'A',
    //         link:  function (scope, element, attr) {

    //                 if(!angular.isDefined(scope.medialength)){
    //                     scope.medialength = 1;
    //                 }

    //                // element.removeClass('floader');

    //                 var imageOffset = scope.media.thumbOffset();

    //                 function setWidthHeight(withClass){
    //                     var classname;
    //                     if(((scope.medialength >= 3 && scope.$index === 0 )) || scope.medialength == 1){
    //                         classname = 'full';
    //                             if(scope.media.isVideo()){
    //                                if(Utils.feedCellWidth > imageOffset.width){
    //                                     element.css({
    //                                         width : imageOffset.width +'px',
    //                                         height : imageOffset.height +'px'
    //                                     });
    //                                 }else{
    //                                     element.css({
    //                                         width : Utils.feedCellWidth +'px',
    //                                         height : getHeightByWidth(imageOffset,Utils.feedCellWidth) + 'px'
    //                                     });
    //                                }
    //                             }

    //                         if(scope.medialength == 1){
    //                             classname = 'single';
    //                         }
    //                     }else if ((scope.medialength == 2 || scope.$index > 0 )) {
    //                         classname = 'half';
    //                     }

    //                     if(withClass){
    //                         element.addClass(classname);
    //                     }

    //                 }
    //                 scope.$on(SystemEvents.COMMON.WINDOW_RESIZED,function ($event) {
    //                     if(!attr['feedImageResponsive']) {
    //                         setWidthHeight()
    //                     }
    //                 });

    //                 if(!attr['feedImageResponsive']){
    //                     setWidthHeight(true);
    //                 }

    //                 element.css({backgroundImage: 'url(' + scope.media.feedThumb() + ')'});
    //                 //  console.dir(scope.image.offset());
    //                 //if (img.complete) { // sometimes when browser load the image from cache // onload not fired
    //                 //    loadHandler();
    //                 //}

    //             }


    //     }

    // }
