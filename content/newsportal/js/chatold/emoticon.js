/* 
 * To change this license header, choose License Headers in Project Properties.
 * 
 * 
 */




(function() {
    "use strict";
    var $, EmoticonBox,$_c = [],base,app,i_t={e:1,el:2,s:3};
    $ = jQuery;
    base = base_url;
    app = utils;

    
    var Emoticon = function(){
            var initCat = function(cb,ct){
                   
                $.ajax({
                    url : base + '/GetStickerCategories?mySt=0',
                    cache : true,
                    dataType: 'json',
                    success : function(data){                       
                        if(data){
                            console.dir(data);
                              $_c = data;
                            if(typeof ct === "undefined")ct=null;
                            if(typeof cb === "function")  
                               cb.call(ct,data);
                        }
                    }
                });
                
            
            };
         return {
             init : function(cb,ct){
                  if($_c.length === 0){    
                     initCat(cb,ct);
                  }else{
                     cb.call(ct,$_c);
                  }
             },
             getEmoL: function(type){
               //console.log("hello");
             }
        };
    }();
    
    var setUtilEmoReplace = function(t){
      if(typeof t !== 'object'){
         t = $.parseJSON(_p__);
      }
        var url = t.base, patterns = [],emoticons = t.data,metachars = /[[\]{}()*+?.\\|^$\-,&#\s]/g;
         
        for (var i in emoticons) {
            if (emoticons.hasOwnProperty(i)){ // escape metacharacters
              patterns.push('('+i.replace(metachars, "\\$&")+')');
            }
          }
        
        app.replaceEmoticons = function(text){        
            return text.replace(new RegExp(patterns.join('|'),'g'), function (match) {
                return typeof emoticons[match] != 'undefined' ?
                       '<img src="'+url+emoticons[match]+'"/>' :
                       match;
            });        
        }    
    };
    
    if(_p__ === null){
        
       Emoticon.init(function(d){
           console.dir(d);
           var _d = d.data;           
           var temp = {};
          if(_d.length){
              for(var i=0;i<_d.length;i++){
                 if(_d[i].type === i_t.e){
                     for(var j = 0; j < _d[i].imageList.length;j++){
                       temp[_d[i].imageList[j].symbol] = _d[i].imageList[j].name;                                            
                     }
                     //_p__ = new RegExp(temp.join('|'),'g');                    
                }             
             }
             
             var emoticonBase=base_url+"/emoticon/";
          $.cookie('__p__',JSON.stringify({base:emoticonBase,data:temp}));
          setUtilEmoReplace({base:emoticonBase,data:temp});
          
          }          
       
       },this);
    }else{
       setUtilEmoReplace();
    }

    EmoticonBox = function(element, options) {
        var content,_this = this;
        this.types = {
          emoticon : i_t.e,
          emoticon_large : i_t.el,
          sticker : i_t.s
       }
        this.s_uri = base;
        this.i_uri = base;
        
        this.options = $.extend({
            title: null,
            footer: null,
            remote: null
        }, $.fn.emoticonbox.defaults, options || {});
        
        this.$element = $(element);
       
        if(this.$element.data('key') !== undefined){
           this.options.key = this.$element.data('key');
        }else{
           this.$element.data('key',this.options.key);
        }
        this.box_id = 'ebox-' + this.options.key;
        if(this.options.icon === true){
          this.box_id += 'ic';
        }
        if(this.options.l_icon === true){
          this.box_id += 'il'
        }
        if(this.options.sticker === true){
          this.box_id += 's'
        }
        
        content = '';
       
        if($('#'+ this.box_id).length){
           $('#'+ this.box_id).show();
            this.box = $('#' + this.box_id);
            this.placeit(); // position near the caller
            return;
        }

        content = [
                    '<div id="'+ this.box_id +'" class="emo_div">',
                    '<div class="emo_div_body"></div>',
                    
                    '<div class="emoticon_bottom">',
                       '<div class="emo_stage">',
                           '<a class="prev"><i class="glyphicon glyphicon-chevron-left"></i></a>',
                            '<a class="next"><i class="glyphicon glyphicon-chevron-right"></i></a>',
                                  '<div style="" class="slider_stage">',
                                    '<div class="emo_cats">',
                                    '</div></div>',
                        '</div>',
                    '</div>',
                    
                    '</div>'
        ].join('');

        $(document.body).append(content);
            
            
        
        this.box = $('#' + this.box_id);
        this.box_body = this.box.find('.emo_div_body').first();
        this.box_cat = this.box.find('.emo_cats').first();    
        this.box_bottom = this.box.find('.emoticon_bottom').first();    
        this.placeit(); // position near the caller

    
        $(document.body).mouseup(function(e){if (!_this.box.is(e.target) && _this.box.has(e.target).length === 0){
            if(_this.box.hasClass('smarketopened')){
            }else{
                _this.close();
            }
            
            }});    

        
        Emoticon.init(function(d){
            var bottom_html = '',body_html='',target_div='',temp_html ='',style,_i,opt;
            var imgeList = [];
            var _d = d.data;
            this.s_uri = d.stickerBase;
            this.i_uri = base_url+"/emoticon/";
            d=null;// unsetting d
            if (_d.length) {
                for (var i = 0; i < _d.length; i++) {
                    opt = '';
                    if (_d[i].type === this.types.emoticon && this.options.icon === true) {
                        opt = "_i"

                    } else if (_d[i].type === this.types.emoticon_large && this.options.l_icon === true) {
                        opt = '_il'
                        _d[i].collectionId = 3;
                        _d[i].categoryId = 5;
                        // for large emo its statical

                    } else if (_d[i].type === this.types.sticker && this.options.sticker === true) {
                        opt = '_s';

                    }

                    _i = this.prepare_menu(opt, _d[i].collectionId, _d[i].categoryId);

                    if (opt !== '') {  // load the outer box
                        target_div = 'emo-table' + opt + '_' + _d[i].collectionId + '_' + _d[i].categoryId + '_' + i;
                        bottom_html += '<a data-target="' + target_div + '" class="theme">' + '<img class="changeable" src="' + _i + '" /></a>';
                        //bottom_html += '<a>' + '<img src="'+ _a_i +'"></a>';

                        if (opt === '_i' && _d[i].imageList.length > 0) {
                            body_html += '<div id="' + target_div + '" class="emo_body fade in">';
                            body_html += '<table><tbody><tr>';
                            for (var j = 0; j < _d[i].imageList.length; j++) {
                                body_html += '<td>';
                                style = 'style="background-image:url(' + this.prepare_uri(_d[i].imageList[j].name, opt) + ')"';
                                body_html += '<div title="' + _d[i].imageList[j].symbol + '"  ' + style + ' data-type="' + target_div + '" data-code="' + _d[i].imageList[j].symbol + '" class="emocon"></div>';
                                body_html += '</td>';

                                if ((j + 1) % 8 === 0) {
                                    body_html += '</tr><tr>';
                                }


                            }
                            body_html += '</tr></tbody></table></div>';
                        }


                    }


                }
                if (this.options.sticker === true) {
                    this.box_bottom.find('.next').after('<a class="smarket"><i class="glyphicon glyphicon-plus-sign"></i></a>');
                }
                this.box_cat.html(bottom_html).fadeIn();
                this.box_body.html(body_html).fadeIn();
                this.box_body.mCustomScrollbar({autoHideScrollbar: true});
                this.box_inner_body = this.box_body.find('.mCSB_container').first();

                this.initCarousel();
                this.box.on('click', '.theme', function () {
                    var target = $(this).data('target');
                    var temp_html = '', temp_style = '', temp_part_1 = '', temp_part_2 = '';
                    var temp = target.split('_');
                    var _in = temp[4]; // index
                    var c_type = '_' + temp[1]; // _i,_il,_s custom type
                    var name = '';
                    _this.box.find('.emo_body').hide();
                    if ($('#' + target).length === 0) {


                        temp_html += '<div id="' + target + '" class="emo_body fade in">';
                        //temp_html += '<table><tbody><tr>';
                        temp_part_1 = '<div class="emoblock">';
                        temp_part_2 = '<div class="emoblock">';
                        for (var j = 0; j < _d[_in].imageList.length; j++) {

                            if (c_type === '_il') {
                                name = '3/5/' + _d[_in].imageList[j].name;
                            } else {
                                name = _d[_in].imageList[j].name;
                            }

                            temp_style = 'style="background-image:url(' + _this.prepare_uri(name, c_type, true) + ')"';
                            if (j % 2 === 0) {
                                temp_part_1 += '<div ' + temp_style + ' data-type="' + target + '" data-code="' + _d[_in].imageList[j].name + '" class="emostick"></div>';
                            } else {
                                temp_part_2 += '<div ' + temp_style + ' data-type="' + target + '" data-code="' + _d[_in].imageList[j].name + '" class="emostick"></div>';
                            }

                        }
                        temp_part_1 += '</div>';
                        temp_part_2 += '</div>';
                        //  temp_html += '</tr></tbody></table></div>';
                        temp_html += temp_part_1 + temp_part_2 + '<div class="clear"></div></div>';

                        _this.box_inner_body.append(temp_html);

                    }


                    $('#' + target).show();
                    _this.box_body.mCustomScrollbar("scrollTo", "top", {
                        scrollInertia: 3000
                    });

                    _this.box.find('.changeable').removeClass('active').trigger('mouseout'); // setting current active image to non active & // removing class active
                    $(this).find('.changeable').trigger('mouseover').addClass('active');


                });
                this.box.on('click', ".emocon, .emostick", function () {
                    var target = _this.options.target;
                    var elem = $(this);
                    var code = elem.data('code');
                    if (typeof target === "undefined")return;
                    if (typeof target === "object" && target instanceof $) {

                        target.val(code);

                    } else if (typeof target === "function") {

                        target.call(_this, elem);

                    } else {
                        target = $(target);
                        if (target.length)target.val(code);
                    }

                });
//                 console.dir(this.box.find('.changeable'));
                this.box.find('.changeable').on('mouseover', function () {
                    if (!$(this).hasClass('active')) {
                        var src = $(this).attr("src");
                        src = src.replace('c\.png', 'ca.png');
                        $(this).attr("src", src);
                    }

                }).on('mouseout', function () {
                    if (!$(this).hasClass('active')) {
                        var src = $(this).attr("src");
                        src = src.replace('ca\.png', 'c.png');
                        $(this).attr("src", src);
                    }
                });


            }

            function positionInMyStickerSet(data) {
                var available = null;
                for (var arb = 0; arb < $_c.data.length; arb++) {
                    if (data === $_c.data[arb].categoryId) {
                        available = arb;
                        break;
                    }
                }
                return available;
            }
            function buttonAddRemoveAction(data,_btnthis){
                var ajxData = data;
                var btnthis = _btnthis;
                if ($(btnthis).data("btntype") === "add") {
                    //this is for add button
                    $.ajax({
                        url: base + '/emoticon',
                        cache: true,
                        data: {actn: "addASticker", catId: $(btnthis).data('stickeercatid')},
                        success: function (successdata) {
                            if (successdata) {
                                $(btnthis).html('Remove');
                                $(btnthis).data('btntype', 'remove');

                                var pos = $(btnthis).data("stkitem");
                                $_c.data.push(ajxData.data[pos]);
                                var newStk = [
                                    '<a data-target="' + $(btnthis).data("stkbtnid") + '_' + ($_c.data.length - 1) + '" class="theme">',
                                    '<img class="changeable" src="'+s_uri + ajxData.data[pos].imageList[0].name + '">',
                                    '</a>'
                                ].join("");
                                _this.box_cat.append(newStk);
                                _this.initCarousel();
                            }
                            else {
                                console.log("error : " + successdata);
                            }
                        }});
                } else {
                    //this is for remove button
                    //var btnthis = this;
                    $.ajax({
                        url: base + '/emoticon',
                        cache: true,
                        data: {actn: "removeASticker", catId: $(btnthis).data('stickeercatid')},
                        success: function (successdata) {
                            console.dir(">>>>>"+successdata);
                            if (successdata) {
                                $(btnthis).html('Add');
                                $(btnthis).data('btntype', 'add');
                                var cat_id = $(btnthis).data("stickeercatid");
                                var tempPos = null;
                                tempPos = positionInMyStickerSet(cat_id);
                                if (tempPos !== null) {
                                    $_c.data.splice(tempPos, 1);
                                    $('a[data-target^="' + $(btnthis).data("stkbtnid") + '"]').remove();
                                }
                            } else {
                                console.log("error : " + successdata);
                            }
                        }});
                }

            }

            $('.smarket').click(function(){
                _this.box.addClass('smarketopened');
                if ($('div').hasClass("stickerMarketBackground")) {

                } else {
                    $(document.body).append('<div class="stickerMarketBackground"></div>');

                }
                if($('div').hasClass("stickerContainer")){

                }else{
                    var html ='<div class="stickerContainer"></div>';
                    $(document.body).append(html).show();
                }
                $.ajax({
                    url: base + '/GetStickerCategories',
                    cache: true,
                    dataType: 'json',
                    success: function (data) {
                        var item=[];
                        if (data) {
                            for (var i = 0; i < data.data.length; i++) {
                                if(data.data[i].type === _this.types.emoticon_large || data.data[i].type === _this.types.emoticon){
                                }else{

                                    var btntp = "add"
                                    var btnvl = "Add";
                                    //setting the property of add remove button
                                    if(positionInMyStickerSet(data.data[i].categoryId)!==null){
                                        btntp = "remove";
                                        btnvl = "Remove";
                                    }
           
                                    item.push('<div class="eachItem">',
                                        '<div class="eachItemInner">',
                                        '<div class="eachItemInnertop">',
                                        '<div class="innterItemLeft"><img src=' +data.stickerBase + data.data[i].imageList[0].name+' width="95" height="95" /></div>',
                                        '<div class="innterItemRight">');

                                    for (var j = 0; j < data.data[i].imageList.length; j++) {

                                        item.push("<div class='stickerInd'><img src='"+data.stickerBase + data.data[i].imageList[j].name+"' width='50' height='50' /> </div>");
                                        if(j===7){
                                            break;
                                        }
                                    }
                                    item.push( '</div>',
                                        '</div>',
                                        '<div class="eachItemInnerBot">',
                                        '<div class="infoSection"></div>',
                                        '<div class="optionSection">',
                                        '<div class="buttonPreview" >',
                                        '<button class="btnPreview btn btn-default" data-prevstkitem="'+i+'" data-prevstkbtnid="emo-table_s_'+data.data[i].collectionId+'_'+data.data[i].categoryId+'" data-prevcatid="'+data.data[i].categoryId+'" data-stkprevimgname="'+data.data[i].imageList[0].name+'" style="width: 60px; height: 20px; font-size: 10px; margin: 0px; padding: 0px;" >Preview</button>',
                                        '</div>',
                                        '<div class="buttonAdd" >',
                                        '<button class="btnAdd btn btn-danger" data-stickeercatid="'+data.data[i].categoryId+'" data-btntype="'+btntp+'" data-stkitem="'+i+'" data-stkbtnid="emo-table_s_'+data.data[i].collectionId+'_'+data.data[i].categoryId+'" style="width: 42px; height: 22px; font-size: 10px; margin: 0px; padding: 0px;" >'+btnvl+'</button>',
                                        '</div>',
                                        '</div>',
                                        '</div>',
                                        '</div>',
                                        '</div>');
                                }
                            }
                        }
                        //emo-table_s_1_1_0
                        var html = [
                            '<div class="stickerContainerInner">',
                            '<div class="headSection" style="background: url(../../images/shop-02.png)">',
                            '<div class="pull-right">',
                            '<input type="button" class="close" id="closeStickerMarket" />',
                            '</div>',
                            '</div>',
                            '<div class="midContain">',
                            item.join(""),
                            '</div>',
                            '</div>'
                        ].join("");

                        if($('div').hasClass("stickerMarketBackground")){

                        }else{
                            html +='<div class="stickerMarketBackground"></div>';
                        }

                        $('.stickerContainer').append(html).show();
                        $('#closeStickerMarket, .stickerMarketBackground').click(function () {
                            $('.stickerContainer').remove();
                            $('.stickerMarketBackground').remove();
                            _this.box.removeClass('smarketopened');
                        });
                        $('.btnAdd').click(function () {
                            buttonAddRemoveAction(data,this); //---------------------------------------
                        });
                        $('.btnPreview').click(function () {
                            var myvar = $(this).data("stkprevimgname");
                            //console.log(myvar.length);
                            var imginit = myvar.substring(0,(myvar.lastIndexOf('/')+1));
                            var catIdprev = $(this).data("prevcatid");
                            //for(var mvi=0; mvi<myvar.lenth)

                            $('.stickerContainerInner').remove();
                            //$('.stickerMarketBackground').remove();

                            //-----------------------------------------------------------
                            var btntp = "add"
                            var btnvl = "Add";
                            //setting the property of add remove button
                            if (positionInMyStickerSet(catIdprev) !== null) {
                                btntp = "remove";
                                btnvl = "Remove";
                            }


                            var html = [
                                '<div class="stickerContainerInner">',
                                '<div class="headSection" style="background: url(../../images/shop-02.png)">',
                                '<div class="pull-left" style="padding:20px">',
                                '<input type="button" class="btn btn-info" value="Back" id="goBackStickerMarket" />',
                                '<button class="btnAdd btn btn-primary" data-stickeercatid="'+catIdprev+'" data-btntype="'+btntp+'" data-stkitem="'+$(this).data("prevstkitem")+'" data-stkbtnid="'+$(this).data("prevstkbtnid")+'" >'+btnvl+'</button>',
                                '</div>',
                                '<div class="pull-right" >',
                                '<input type="button" class="close" id="closeStickerMarket" />',
                                '</div>',
                                '<img class="" width="100" height="100" src="'+s_uri+myvar+'">',
                                                    
                                
                                '</div>',
                                '<div class="midContain">',
                                '<img class="" src="'+s_uri+imginit +'details.png">',
                                '</div>',
                                '</div>'
                            ].join("");



                            $('.stickerContainer').append(html).show();
                            $('#goBackStickerMarket').click(function () {
                                $('.stickerContainerInner').remove();
                                //$('.stickerMarketBackground').remove();
                                _this.box.removeClass('smarketopened');
                                _this.box.find('.smarket').click();
                                //alert("works");
                            });

                            $('#closeStickerMarket, .stickerMarketBackground').click(function () {
                                $('.stickerContainer').remove();
                                $('.stickerMarketBackground').remove();
                                _this.box.removeClass('smarketopened');
                            });
                            $('.btnAdd').click(function () {
                                buttonAddRemoveAction(data,this); //---------------------------------------
                            });


                        });
                        $("body").css("overflow", "hidden");
                    }
                });
            });


        },_this);
        

        
        
// console.dir(this.$element);
//        this.modal.on('show.bs.modal', this.options.onShow.bind(this)).on('shown.bs.modal', function() {
//            _this.modal_shown();
//           
//
//            return _this.options.onShown.call(_this);
//        }).on('hide.bs.modal', this.options.onHide.bind(this)).on('hidden.bs.modal', function() {
//            if (_this.gallery) {
//                $(document).off('keydown.ekkoLightbox');
//            }
//            _this.modal.remove();
//            return _this.options.onHidden.call(_this);
//        }).modal('show', options);
        return this.$element;
    };

    EmoticonBox.prototype = {
        emoticon_shown: function() {
            
        },
        placeit : function(){
            this.pos = this.$element.offset();
            var top = this.pos.top - this.box.height() <=0 ?this.pos.top:this.pos.top - this.box.height(),left;
            if(this.pos.left + this.$element.width() + this.box.width() < $(window).width()){//check if its possible to show on element right side
                left = this.pos.left + this.$element.width() + 2;  
            }else{
                left = this.pos.left - this.box.width() + 2;               
            }
            this.box.offset({left:left,top:top}); 
        },
        initCarousel : function(){
            var that = this.box.find('.slider_stage');
            var sliderList = that.children()[0];
            var previous = this.box.find('.prev');
            var next = this.box.find('.next');
            
            //console.dir(sliderList);
            if (sliderList) {
                var increment = 42,//$(sliderList).children()[0].outerWidth("true"),
                elmnts = $(sliderList).children(),
                numElmts = elmnts.length,
                sizeFirstElmnt = increment,
                shownInViewport = Math.round(that.width() / sizeFirstElmnt),
                firstElementOnViewPort = 1,
                preItems = 0,
                postItems = numElmts - shownInViewport,   
                isAnimating = false;

//                for (var i = 0; i < shownInViewport; i++) {
                  $(sliderList).css('width',(numElmts*increment) + "px");
//                  //  $(sliderList).append($(elmnts[i]).clone());
//                }
                if(numElmts > shownInViewport){
                   $(next).show();
                   
                }
                
                     var setThatwidth = function(){
                       if(postItems > 0 && preItems > 0){
                          that.css({"margin-left":$(previous).width() + 'px',"width":( shownInViewport -1 )*increment});
                          if(!$(previous).is(':visible')){
                              $(previous).show();
                          }
                          if(!$(next).is(':visible')){
                              $(next).show();
                          }   
                           
                       }else if(postItems > 0){
                           that.css({"margin-left":'0px',"width":( shownInViewport*increment)});
                           if(!$(next).is(':visible')){
                              $(next).show();
                           }
                           if($(previous).is(':visible')){
                              $(previous).hide();
                           }
                       
                       }else if(preItems > 0){
                         that.css({"margin-left":$(previous).width() + 'px',"width":( shownInViewport*increment)});
                           if(!$(previous).is(':visible')){
                              $(previous).show();
                           }
                           if($(next).is(':visible')){
                              $(next).hide();
                           } 
                       }else{
                         $(previous).hide();
                         $(next).hide();   
                       }
                
                }
                
                $(previous).click(function(event){ 
                     if (!isAnimating) {
                         
                         preItems--;postItems++;
                         
                         setThatwidth();
                
                        $(sliderList).animate({
                            left: "+=" + increment,
                            y: 0,
                            queue: true
                        }, "swing", function(){isAnimating = false;});
                        isAnimating = true;
                    }
                
                
                });
                $(next).click(function(event){
                   if (!isAnimating) {
                       preItems++;postItems--;
                       setThatwidth();
                        $(sliderList).animate({
                            left: "-=" + increment,
                            y: 0,
                            queue: true
                        }, "swing", function(){isAnimating = false;});
                        isAnimating = true;
                    }
                });

            }
        
        
        },
        strip_stops: function(str) {
            return str.replace(/\./g, '');
        },
        strip_spaces: function(str) {
            return str.replace(/\s/g, '');
        },
       
        navigate: function(event) {
            event = event || window.event;
            if (event.keyCode === 39 || event.keyCode === 37) {
                if (event.keyCode === 39) {
                    return this.navigate_right();
                } else if (event.keyCode === 37) {
                    return this.navigate_left();
                }
            }
        },
        navigate_left: function() {
       
        },
        navigate_right: function() {
           
        },
       
        showLoading: function() {
            this.box_body.html('<div class="modal-loading"><img src="/bootstrap/image/progress_bar.gif" /></div>');
            return this;
        },
       
        error: function(message) {
            this.box_body.html(message);
            return this;
        },
        preloadImage: function(src,i,callback) {
            var img=new Image();
            if(typeof callback === "function"){
                var _this = this;
            img.onload = function(){
                 callback.call(_this,i,this.width,this.height);
            }
            
            }
            
             img.src=src;
        },
        prepare_uri: function(img,_t,preload,callback){
            if(typeof preload === "undefined")preload=true;
            var src;
            switch(_t){
                    case '_i' : src = this.i_uri + img;break; // _i for icon
                    case '_il': src = this.s_uri + img;break; // _il for large icon
                    case '_s' : src = this.s_uri + img;break; // _s for stickers
                    default   : src = this.s_uri + img;break;
            };
            
            if(preload === true)this.preloadImage(src,img,callback);
            
            return src;
        },
        prepare_menu : function(type,cl,cg){ // type,collection_id,category_id
            var active = this.options.i_active,inactive = this.options.i_inactive;
            if(typeof cl !== "undefined" && cl !== 0 && typeof cg !== "undefined" && cg !== 0){
               active = cl + "/" + cg + "/" + active;
               inactive = cl + "/" + cg + "/" + inactive;
            }
            this.prepare_uri(active,type);//for inactive image preload the image after make url
            return this.prepare_uri(inactive,type);// preloading the 
        },    
    
        resize: function(width) {
            //var width_total;
            // width_total = width + this.border.left + this.padding.left + this.padding.right + this.border.right;
            this.modal_dialog.css('width', 'auto').css('max-width', '1280px');
            this.lightbox_container.find('a').css('padding-top', function() {
                return $(this).parent().height() / 2;
            });
            return this;
        },
        checkDimensions: function(width) {
            var body_width, width_total;
            width_total = width + this.border.left + this.padding.left + this.padding.right + this.border.right;
            body_width = document.body.clientWidth;
            if (width_total > body_width) {
                width = this.modal_body.width();
            }
            return width;
        },
        close: function() {
            return this.box.remove();
        },
       
    };

    $.fn.emoticonbox = function(options) {
        return this.each(function() {
            var $this;
            //console.dir(this);
            
            $this = $(this);
            options = $.extend({
                 target : $this.closest('textarea, input')
            }, options, $this.data());
            $(this).on("click",function(){
                  
              return new EmoticonBox(this, options);
            });
            
            return this;
        });
    };

    $.fn.emoticonbox.defaults = {
        left_arrow_class: '.glyphicon .glyphicon-chevron-left',
        right_arrow_class: '.glyphicon .glyphicon-chevron-right',
        icon : true,
        l_icon : true,
        sticker : true,
        i_inactive : 'c.png',
        i_active : 'ca.png',
        key : app.getUniqueID(),
        onShow: function() {
        },
        onShown: function() {
        },
        onHide: function() {
        },
        onHidden: function() {
        },
        
        
    };

}).call(this);

// starting delegated event handler for pop image





