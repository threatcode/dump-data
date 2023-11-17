var base_url="/";
var socketOn =true;
var Text = {
    en: {
        me: 'Me',
        is_typing: '',
        now : 'Now',
        time: 'Time'
    }
};

$(document).mouseup(function (e) {
    var emoticons_changed = $("#emoticons_changed");
    if (!emoticons_changed.is(e.target) // if the target of the click isn't the container...
            && emoticons_changed.has(e.target).length === 0) // ... nor a descendant of the container
    {
        emoticons_changed.hide();
    }
});

$(document).ready(function () {
    //tab.init();
    //chatSocket.init();
    var originalTitle = document.title;
   // messenger.startChatSession();
    $([window, document]).blur(function () {
        windowFocus = false;
    }).focus(function () {
        windowFocus = true;
        document.title = originalTitle;
    });
});


var messenger = function () {
    var windowFocus = true;
    var username;
    var chatHeartbeatCount = 0;
    var chatHeartbeatTime_initial = 4000;
    var minChatHeartbeat = 1000;
    var maxChatHeartbeat = 33000;
    var chatHeartbeatTime = minChatHeartbeat;
    var blinkOrder = 0;
    var prefix = '#'+ "chatbox_";


    var chatboxFocus = [];
    var newMessages = [];
    var newMessagesWin = [];
    var chatBoxes = [];
    var typingSentTime = {};
    var SClasses = ['status_pending','status_delivered','status_seen','status_sent'];

    var window_width = $(window).width();
    var left_panel = false;// $('#' + LEFT_BAR_ID);
    var right_panel = false;// $('#' + RIGHT_BAR_ID);
    var active_box = "";
    var hidden_part_width = 124;
    var z_index = 2000;
    var box_width = 262;

    var lang = Text.en;

    var chatSocket  = {
            wsocket: {},
            init : function(){
               var url = window.location.href;
               var arr = url.split("/");
               var api = "ws://" + arr[2] + base_url + "/socket/chat";
               this.wsocket = new WebSocket(api);
               this.wsocket.onopen = this.onOpen;
               this.wsocket.onclose = this.onClose;
               this.wsocket.onmessage = this.onMessage;
               this.wsocket.onerror = this.onError; 
            },
            onOpen : function (evt){ try { console.log("chat on open called");   } catch (e) { console.dir(e); } },
            onClose : function (evt){ try { console.log("chat on clolse called"); } catch (e) { console.dir(e); } },
            onError : function (evt){  try { console.dir(evt); } catch (e) { console.dir(e); } },
            doSend : function (m) { try {  this.wsocket.send(m); } catch (e) { console.dir(e); } },
            onMessage : function(evt){
                try {
                    
                    var data = evt.data;
console.log(data);
                 //   console.log("got data on chat socket >>" + data)
                   // messenger.agent(data);


                } catch (e) {
                   // console.dir(e);
                }
            }

        };

    //chatSocket.init();

    var prepareMessage = function (msg) {
        if (utils != 'undefined')
            return utils.nl2br(msg);
        else
            return msg.replace(/(?:\r\n|\r|\n)/g, '<br />');
    };

    var _r_pos = function () { // re positioning the whole chat boxes
        var align = 0, width = 0, active = '', z_i = 0;
        var right_margin = (right_panel.length) ? right_panel.width() : 0;
        //var left_panel = (left_panel.length)?left_panel.width():0;
        var right = right_margin + 10;

        var left_point = left_panel.length ? left_panel.width() : 0;
        var left = left_point;
        var available_width = window_width - left - right;
        var popboxes = [];
        var drawnboxes = [];

        var $Boxes = chatBoxes;
        var pushboxTemplate = ['<a id="dLabel" role="button" data-toggle="dropdown" data-target="#">',
            'More <span class="caret"></span>',
            '</a>',
            '<ul class="dropdown-menu" id="chatPushbox" role="menu" aria-labelledby="dLabel">',
            '</ul>'].join('');
        var z_i = z_index - 1;

        var length = $Boxes.length;


//        $Boxes.sort(function(a,b){
//            var min_a = is_min_box(a.title);
//            var min_b = is_min_box(b.title);
//          if(min_a == false && min_b == true )return -1;
//          if(min_a == true && min_b == false)return 1;
//             return 0;
//        });


        var get_ratio = function getPullRatio(len) {
            for (var i = 0; i <= hidden_part_width; i++) {
                if (((box_width * len) - (len * i)) < available_width) {
                    return i;
                }
            }
            len--;
            return getPullRatio(len);
        };
        //var t_min = total_min_box();
        var pull_ratio = get_ratio(length);
        var total = 0;
        //console.log("left point: ");console.log(window_width-(left));
        for (var x = length - 1; x >= 0; x--) {
            var chatboxtitle = $Boxes[x].title;
            //alert($("#chatbox_" + chatboxtitle).css('display'));

           // active = $.cookie('active_box');
            if (active == chatboxtitle) {
                //$("#chatbox_" + chatboxtitle).focus();
                $(prefix + chatboxtitle).css('z-index', z_index);
                $(prefix + chatboxtitle + ' .chatboxhead').removeClass('chatboxblink');
                $('#chatbox_' + chatboxtitle + ' .chatboxhead').addClass('active');
                $(prefix + chatboxtitle + " .chatboxtextarea").addClass('chatboxtextareaselected');
                $(prefix + chatboxtitle + " .chatboxcontent").removeClass('border-inactive').addClass('border-active');
                $(prefix + chatboxtitle + " .chatboxinput").removeClass('border-inactive').addClass('border-active');

            } else {
                //$(prefix + chatboxtitle).blur();
                $(prefix + chatboxtitle).css('z-index', z_i);
                z_i -= 5;
                $(prefix + chatboxtitle + ' .chatboxhead').removeClass('active');
                $(prefix + chatboxtitle + " .chatboxtextarea").removeClass('chatboxtextareaselected');
                $(prefix + chatboxtitle + " .chatboxcontent").removeClass('border-active').addClass('border-inactive');
                $(prefix + chatboxtitle + " .chatboxinput").removeClass('border-active').addClass('border-inactive');
            }


            if (popboxes.length) {
                left = left + $('#chatBoxMore').width();
            }

            if (align == 0) {

                $(prefix + chatboxtitle).css('right', right + 'px');
                drawnboxes.push(x);
            } else {
                width = right;
                tempx = x + 1;
                var temp_box = $(prefix + $Boxes[drawnboxes[drawnboxes.length - 1]].title);
                if (temp_box.length) {
//                        if(is_min_box(chatboxtitle) == true){
//                           width = parseInt(temp_box.css('right'))+ parseInt(temp_box.width()) - hidden_part_width;
//                        }else{
//                          width = parseInt(temp_box.css('right'))+ parseInt(temp_box.width()) - pull_ratio;
//                        }
//                       
                    width = parseInt(temp_box.css('right')) + box_width - pull_ratio;

                    //console.log("width for :" + $Boxes[x].title + " x=> "+ x );

                    //alert(width);

                    // console.log("width + box_sidth");console.log(width + box_width);


                    if (width + box_width > (window_width - (left))) {
                        $(prefix + chatboxtitle).hide();
                        popboxes.push(x);
                    } else {

                        drawnboxes.push(x);
                        $(prefix + chatboxtitle).css('right', width + 'px');
                        $(prefix + chatboxtitle).show();

                    }

                } else {
                    popboxes.push(x);

                }

//                    $(prefix + chatboxtitle +" .chatboxtitle .bottomclick").click(function(event) {
//                        event.stopPropagation();
//                        
//                        $.cookie('active_box',chatBoxes[x+1]);
//                        _r_pos();
//                       
//                    });

            }

//                 $(prefix + chatboxtitle + " .chatboxcontent").enscroll({showOnHover: false,
//                    verticalTrackClass: 'customScrollBar',
//                    verticalHandleClass: 'customBarHandle'});
            align++;
        }

        if (popboxes.length) {
            if ($('#chatBoxMore').length) {
                $('#chatPushbox').html('');
            } else {
                $('<div/>').attr("id", 'chatBoxMore').addClass("dropdown dropup btn btn-warning").css("left", left_point + 'px').css("bottom", '0px').css("position", "fixed")
                        .html(pushboxTemplate).appendTo('body');
            }

            for (var k = 0; k < popboxes.length; k++) {
                var text = '<li role="presentation"><a role="menuitem" onclick="messenger.show(\'' + $Boxes[popboxes[k]].info.join(',') + '\');return false;" >' + $Boxes[popboxes[k]].display_name + '</a></li>';
                $('#chatPushbox').append(text);
                // console.log(text);console.dir($('#chatPushbox'));
            }
        } else {
            $('#chatBoxMore').remove();
        }
    };

    var fb_event_handler = function (title) { //blur focus hanlder
        $(prefix + title + " .chatboxtextarea").blur(function (event) {
            //event.stopPropagation();
            chatboxFocus[title] = false;

        }).focus(function (event) {
            //event.stopPropagation();
            chatboxFocus[title] = true;
            newMessages[title] = false;
           // $.cookie('active_box', title);
            _r_pos();
        }).click(function (event) {
            //event.stopPropagation();
            $(this).focus();
        });

        $(prefix + title).blur(function (event) {
           // event.stopPropagation();
            $(prefix + title + " .chatboxtextarea").blur();
        }).focus(function (event) {
            //event.stopPropagation();
            //_this_is_seen(title);
            $(prefix + title + " .chatboxtextarea").focus();

        });

        $(prefix + title + ' .chatboxhead').click(function (event) {
            event.stopPropagation();
            _t_box(title);
        });

        $(prefix + title).on("click", function (event) {
           // event.stopPropagation();
            $(prefix + title + " .chatboxtextarea").focus();//re zenerate z index and set active
        });

        $(prefix + title).delegate('.status_seen, .status_delivered, .status_sent','mouseenter',function(){
                   $(this).find('.icondelete').show();
        });
        $(prefix + title).delegate('.status_seen, .status_delivered, .status_sent','mouseleave',function(){
                   $(this).find('.icondelete').hide();
        });
        $(prefix + title).delegate('.deletem','click',function(e){
            e.stopPropagation();
            var jObj = JSON.stringify({tag_chat: $(prefix + $(this).data('fr')).data('tag_chat'),key: $(this).data('react'), friendName: $(this).data('fr'),type:0});

            var $this = $(this);
            _r_m($(this).data('react'));_s_c_s(jObj);
        });

        $(prefix + title +" .chatboxcontent").scroll(function(){
           if(chatboxFocus.hasOwnProperty(title) && chatboxFocus[title] === true) {
               var $this = $(this);
               var docViewTop = $this.offset().top;
               var docViewBottom = docViewTop + $this.height();
               var pids = [];
               $this.find('.status_received').each(function (index, elem) {
                   //console.log($index+ " = >" +$item);
                   // console.dir($(elem));
                   var $elem = $(elem);
                   var elemTop = $elem.offset().top;
                   var elemBottom = elemTop + $elem.height();

                   if ((elemBottom <= docViewBottom) && (elemTop >= docViewTop)) {
                       pids.push($elem.data('react'));
                   }
                   $elem.removeClass('status_received');

               });
               if (pids.length === 0)return;// if no status delivered found the no more work
               var jObj = JSON.stringify({
                   tag_chat: $(prefix + $(this).data('fr')).data('tag_chat'),
                   pids: pids,
                   friendName: $(this).data('fr'),
                   status: 2
               });
               //console.dir(jObj);
               _s_c_s(jObj);
                //$elem.removeClass('status_received');
               //var elemTop = $(elem).offset().top;
               //var elemBottom = elemTop + $(elem).height();
               //
           }else{

           }
        });
        $(prefix + title +" .timeout").click(function(event){
            
            event.stopPropagation();
            var $chatbox =  $(prefix + title);
            
            
            if($chatbox.find(".timeout").hasClass("active")){
                $chatbox.find(".timeout").addClass("inactive");
                $chatbox.find(".timeout").removeClass("active");
                return;
            }
           
            
            var html = [
                '<div id="timerget" class="select_time_chooser_host" style="position: absolute; background: green; padding: 10px; z-index="99999999999">',
                '<div class="select_time_chooser" style="background-color: white;">',
                '<table class="tab_select_time_chooser" border="1px solid black">',
                '<tr>',
                '<td class="min__up">^</td><td class="sec_up">^</td>',
                '</tr>',
                '<tr>',
                '<td>',
                '<input style="width: 20px;" type="text" class="minute" value="0">',
                '</td>',
                '<td>',
                '<input style="width: 20px;" type="text" class="second" value="0">',
                '</td>',
                '</tr>',
                '<tr>',
                '<td class="min_down">*</td><td class="sec_down">*</td>',
                '</tr>',
                '<tr>',
                '<td colspan="3"><button class="close_timer" style="background-color:red; width:100%;">Close</button></td>',
                '</tr>',
                '</table>',
                '</div>',
                '</div>'

            ].join('');

            $("#timerget").remove();
            $(document.body).append(html).show();
            var $el = $('#timerget');
            
            $('body').click(function(e){    
                //console.log(evt.target);
                if (!$el.is(e.target) && $el.has(e.target).length === 0){
                    $el.remove();
                }else{
                    return;
                }
              
             });
           
             
            //console.log($chatbox.find(".chatboxoptions").offset());
            var top_pos = parseInt( $chatbox.find(".chatboxoptions").offset().top);
            var left_pos = parseInt( $chatbox.find(".chatboxoptions").offset().left);
            $el.css({
                top : (top_pos-150),
                left : (left_pos-50)
            });

            $el.find(".close_timer").click(function (){
                $el.remove();
            });


            function calculate_total_second(minute,second,chatbox1){
                var result = ((minute*60)+second);
                if(result==0){
                    chatbox1.find(".timeout").addClass("inactive");
                    chatbox1.find(".timeout").removeClass("active");
                }else{
                    chatbox1.find(".timeout").addClass("active");
                    chatbox1.find(".timeout").removeClass("inactive");
                }


                return result;
            }



            $(".minute").keyup(function () {
                var resultSec=0;

                var minute = parseInt($(".minute").val());
                var second = parseInt($(".second").val());
                if (minute >= 0 && minute < 60) {
                    resultSec = calculate_total_second(minute,second,$chatbox);
                    $chatbox.find(".timeout").data("m",resultSec);
                console.log($chatbox.find(".timeout").data("m"));
                } else {
                    $(".minute").val("0");
                    minute = 0;
                    resultSec = calculate_total_second(minute,second,$chatbox);
                    $chatbox.find(".timeout").data("m",resultSec);
                    console.log($chatbox.find(".timeout").data("m"));
                }
            });

            $(".second").keyup(function () {
                var resultSec=0;

                var minute = parseInt($(".minute").val());
                var second = parseInt($(".second").val());
                if (second >= 0 && second < 60) {
                    resultSec = calculate_total_second(minute,second,$chatbox);
                   $chatbox.find(".timeout").data("m",resultSec);
                    console.log($chatbox.find(".timeout").data("m"));
                } else {
                    $(".second").val("0");
                    second = 0;
                    resultSec = calculate_total_second(minute,second,$chatbox);
                    $chatbox.find(".timeout").data("m",resultSec);
                    console.log($chatbox.find(".timeout").data("m"));
                }
            });
            $(".min__up").click(function () {
                var resultSec=0;

                var minute = parseInt($(".minute").val());
                var second = parseInt($(".second").val());

                if(minute===59){
                    minute = 0;
                }else{
                    minute = minute + 1;
                }
                $(".minute").val(minute);

                resultSec = calculate_total_second(minute,second,$chatbox);
                $chatbox.find(".timeout").data("m",resultSec);
                console.log($chatbox.find(".timeout").data("m"));
                

            });

            $(".min_down").click(function () {
                var resultSec=0;

                var minute = parseInt($(".minute").val());
                var second = parseInt($(".second").val());


                if(minute===0){
                    minute = 59;
                }else{
                    minute = minute - 1;
                }
                $(".minute").val(minute);

                resultSec = calculate_total_second(minute,second,$chatbox);
                $chatbox.find(".timeout").data("m",resultSec);
                console.log($chatbox.find(".timeout").data("m"));

            });
            $(".sec_up").click(function () {
                var resultSec=0;

                var minute = parseInt($(".minute").val());
                var second = parseInt($(".second").val());


                if(second===59){
                    second = 1;
                }else{
                    second = second + 1;
                }
                $(".second").val(second);

                resultSec = calculate_total_second(minute,second,$chatbox);
                $chatbox.find(".timeout").data("m",resultSec);
                console.log($chatbox.find(".timeout").data("m"));

            });
            $(".sec_down").click(function () {
                var resultSec=0;

                var minute = parseInt($(".minute").val());
                var second = parseInt($(".second").val());


                if(second===0){
                    second = 59;
                }else{
                    second = second - 1;
                }
                $(".second").val(second);

                resultSec = calculate_total_second(minute,second,$chatbox);
                $chatbox.find(".timeout").data("m",resultSec);
                console.log($chatbox.find(".timeout").data("m"));

            });

        });




    };
    var _ccb = function (chatboxtitle, minimizeChatBox, tag_chat) {  //create chat box
        if(chatboxtitle == '' || !chatboxtitle)return;
        var userInfo = chatboxtitle.toString().split(',');
        chatboxtitle = userInfo[0];
        if (userInfo.length == 1) {
            chatboxtitle = chatboxtitle.replace(/ /g, "");
            chatboxtitle = chatboxtitle.replace(/:/g, "vhhslter");
        }
        if ($(prefix + chatboxtitle).length > 0) {
            if ($(prefix + chatboxtitle).css('display') == 'none') {
                $(prefix + chatboxtitle).css('display', 'block');
                _r_pos();
            }
            if(minimizeChatBox !==1)
              $(prefix + chatboxtitle + " .chatboxtextarea").focus();
            return;
        }
        if (tag_chat == undefined) {
            tag_chat = true;
        }
        var friendName = userInfo[0];

        var displayName;

        if (userInfo.length == 1) {
            displayName = userInfo[0];
        } else {
            displayName = utils.prepareName(userInfo[1], userInfo[2], userInfo[0]);
        }

        var istypingimg =  "<img style=\"width:20px;height:20px;\" src=\"" + base_url + "/images/friend_writing.gif\" />";
        var istyping = ["<div class=\"typing\">",
            "<div class=\"istyping\">",
            istypingimg + "<span style=\"padding-left: 5px;\">"+ lang.is_typing + "</span></div>",
            "</div>"].join('');

        var html = ['<div  class="chatboxhead active">',
            '<div class="chatboxtitle"><span class=title>' + displayName + '</span>',
            '<span class="iconclose">',
            '<a href="javascript:void(0)" onclick="javascript:messenger.closeChatBox(\'' + friendName + '\')">',
            '<span class="glyphicon glyphicon-remove-circle"></span></a></span>',
            '<div class="bottomclick">&nbsp;</div></div>',
            '<div class="chatboxoptions">',
            '<a class="timeout inactive" data-m="0">',
            '<span></span></a>',
            '<a href="javascript:void(0)" onclick="javascript:messenger.toggleChatBoxGrowth(\'' + chatboxtitle + '\')">',
            '<span class="glyphicon glyphicon-minus"></span></a>',

            '</div><br clear="all"/>',
            '</div>',
            '<div class="chatboxcontent" data-fr="'+chatboxtitle+'">',
            '</div>',
            istyping,
            '<div class="chatboxinput"><div class="jstatusValue"></div>',
            '<textarea  class="chatboxtextarea"  onkeydown="javascript:return messenger.checkChatBoxInputKey(event,this,\'' + chatboxtitle + '\',\'' + friendName + '\');"></textarea>',
            '<a class="emoticonBtn emoticon_icon"  title="EMO"></a><div class="clear"></div>', '</div>'].join('');

        $("<div/>").attr("id", "chatbox_" + chatboxtitle)
                .addClass("chatbox")
                .data('tag', friendName)
                .data('tag_chat', tag_chat)
                .html(html)
                .appendTo($("body"));


        $(prefix + chatboxtitle).show();
//        $(prefix + chatboxtitle).find('.emoticonBtn').emoticonbox({
//            target: function (_el) { //_el is jquery object running on the context of emoticon box
//                var _c = _el.data('type').split('_')[1];
//                var v = $('.chatboxtextarea', $(prefix + chatboxtitle));
//                switch (_c) {
//                    case 'i':
//                        v.val(v.val() + " " + _el.data('code'));
//                        break;
//                    case 'il' :
//                        messenger.send(chatboxtitle, _el.data('code'), 4);
//                        this.close();
//                        break;
//                    case 's' :
//                        messenger.send(chatboxtitle, _el.data('code'), 6);
//                        this.close();
//                        break;
//                }
//
//            }
//        });
        chatBoxes.push({
            title: chatboxtitle,
            display_name: displayName,
            info: userInfo
        });
        


        if (minimizeChatBox == 1) {
            _min_box(chatboxtitle);
        } else {
            //$.cookie('active_box', chatboxtitle);
        }

        _r_pos();

        fb_event_handler(chatboxtitle);
        chatboxFocus[chatboxtitle] = false;
        if (minimizeChatBox != 1) {
            $.post(base_url + "/secure/APISessionAdd", {
                friendName: friendName,
                tag_chat: tag_chat
            },
            function (html) {
                if (html) {
                    var data = eval('(' + html + ')');
                    if (data.success) {
                        var messageList = eval('(' + data.message + ')');
                        if (messageList != null && messageList.length > 0) {
                            $.each(messageList, function (i, msg) {
                                _a_m({uid: chatboxtitle, m: msg, type: msg.type});
                            });
                        }
                    }
                }
            });
        }
    };
    var _blinker = function(){
        try {

            if (windowFocus == false) {
                var blinkNumber = 0;
                var titleChanged = 0;
                for (x in newMessagesWin) {
                    if (newMessagesWin[x] == true) {
                        ++blinkNumber;
                        if (blinkNumber >= blinkOrder) {
                            document.title = x + ' says...';
                            titleChanged = 1;
                            break;
                        }
                    }
                }

                if (titleChanged == 0) {
                    document.title = originalTitle;
                    blinkOrder = 0;
                } else {
                    ++blinkOrder;
                }

            } else {
                for (x in newMessagesWin) {
                    newMessagesWin[x] = false;
                }
            }

            for (x in newMessages) {
                //console.log(x);
                if (newMessages[x] == true) {
                    if (chatboxFocus[x] == false) {
                        $(prefix + x + ' .chatboxhead').toggleClass('chatboxblink');
                    }
                }
            }

            //  h();
            chatHeartbeatCount++;
        }catch (exception) {
//                    alert('ex in im:' + exception)
        }finally {
            //  setTimeout('messenger.chatHeartbeat();', chatHeartbeatTime);
        }
    };

    var is_min_box = function (t) {
        var minimizedChatBoxes = new Array();

//        if ($.cookie('chatbox_minimized')) {
//            minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
//        }

        for (var j = 0; j < minimizedChatBoxes.length; j++) {
            if (minimizedChatBoxes[j] == t) {
                return true;
            }
        }

        return false;
    };

    //var total_min_box = function () {
    //    return $.cookie('chatbox_minimized') ? $.cookie('chatbox_minimized').split(/\|/).length : 0;
    //};

    var _min_box = function (chatboxtitle) { // initial minimize all after a redirect
        if (is_min_box(chatboxtitle)) {
            $(prefix + chatboxtitle + ' .chatboxhead').removeClass('active');
            $(prefix + chatboxtitle + ' .chatboxcontent').css('display', 'none');
            $(prefix + chatboxtitle + ' .chatboxinput').css('display', 'none');
        }
    };
    var _x_box = function (t) {
        t = t.replace(/ /g, '');
        t = t.replace(/:/g, "vhhslter");

        // Event.stopPropagation();
        $(prefix + t).remove();

        for (var i = chatBoxes.length - 1; i >= 0; i--) {  // index of does not support in ie so loop through all element as an templorary solution
            if (chatBoxes[i].title === t) {
                chatBoxes.splice(i, 1);
            }
        }
        //console.dir(chatBoxes);
        _r_pos();
        $.post(base_url + "/SessionClose", {
            friendName: t
        }, function (data) {
        });
    };
    var _t_box = function (chatboxtitle) {
        if (is_min_box(chatboxtitle)) {

            var minimizedChatBoxes = new Array();

//            if ($.cookie('chatbox_minimized')) {
//                minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
//            }

//            var newCookie = '';
//
//            for (i = 0; i < minimizedChatBoxes.length; i++) {
//                if (minimizedChatBoxes[i] != chatboxtitle) {
//                    newCookie += chatboxtitle + '|';
//                }
//            }
//
//            newCookie = newCookie.slice(0, -1)


          //  $.cookie('chatbox_minimized', newCookie);
           // $.cookie('active_box', chatboxtitle);
            $(prefix + chatboxtitle + ' .chatboxcontent').css('display', 'block');
            $(prefix + chatboxtitle + ' .chatboxinput').css('display', 'block');
            $(prefix + chatboxtitle + " .chatboxtextarea").focus();
            //$(prefix + chatboxtitle + " .chatboxcontent").scrollTop($(prefix + chatboxtitle + " .chatboxcontent")[0].scrollHeight);
            _r_pos();
        } else {
//            var newCookie = chatboxtitle;
//            if ($.cookie('chatbox_minimized')) {
//                newCookie += '|' + $.cookie('chatbox_minimized');
//            }
//            $.cookie('chatbox_minimized', newCookie);
//            $.cookie('active_box', '');
            $(prefix + chatboxtitle + ' .chatboxcontent').css('display', 'none');
            $(prefix + chatboxtitle + ' .chatboxinput').css('display', 'none');
            _r_pos();
        }
    };

    var _s_c_s = function(ob,options){
        if(socketOn){ chatSocket.doSend(ob);return;}
        var _de  = {url: base_url + "/SendMessage",type: 'post',data:{data:ob},success: function (data) {}}
            _de = $.extend(true,_de,options || {});
            $.ajax(_de);
    };
    var fire_m = function (chatboxtitle, message, type) {
        var key = Math.floor(Math.random() * (new Date()).getTime());
        var timeout_el = $(prefix + chatboxtitle).find('.timeout');
        var timeout = 0;
        if(timeout_el && timeout_el.hasClass('active')){
            timeout = timeout || timeout_el.data('m');
            timeout_el.removeClass('active').addClass('inactive');
        }
        var jObj = JSON.stringify({tag_chat: $(prefix + chatboxtitle).data('tag_chat'), friendName: $(prefix + chatboxtitle).data('tag'), message: message, type: type,key:key,timeOut: timeout});
        _a_m({uid:chatboxtitle,m:{uId:userIdentity,mg:message,key:key,status:0,timeout:timeout},type:type});
            _s_c_s(jObj,{success: function (json) {
                _a_m({uid: chatboxtitle, m: json, type: json.type});
            }});
       // console.dir(jObj);

    };
    var _s_m = function (event, chatboxtextarea, chatboxtitle, friendName) { // send message on keycode 13

        var n = new Date().getTime();
        var jObj = JSON.stringify({tag_chat: $(prefix + chatboxtitle).data('tag_chat'), friendName: $(prefix + chatboxtitle).data('tag'),typing:'imkey4536'});
        if (friendName in typingSentTime) {
            var lastTypingSent = typingSentTime[friendName];
            if (n - lastTypingSent > 5000) {
                typingSentTime[friendName] = n;
                 _s_c_s(jObj);
            }
        } else {
            typingSentTime[friendName] = n;
                _s_c_s(jObj);
        }

        if (event.keyCode == 13 && event.shiftKey == 0) {
            message = $(chatboxtextarea).val();
            message = message.replace(/^\s+|\s+$/g, "");
            $(chatboxtextarea).val('');
            $(chatboxtextarea).focus();
            $(chatboxtextarea).css('height', '37px');
            if (message !== '') {
                fire_m(chatboxtitle, message, 3);
            }
            chatHeartbeatTime = minChatHeartbeat;
            chatHeartbeatCount = 1;
            return false;
        }

        /*   var adjustedHeight = chatboxtextarea.clientHeight;
         var maxHeight = 94;
         if (maxHeight > adjustedHeight) {
         adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
         if (maxHeight)
         adjustedHeight = Math.min(maxHeight, adjustedHeight);
         if (adjustedHeight > chatboxtextarea.clientHeight)
         $(chatboxtextarea).css('height', adjustedHeight + 8 + 'px');
         } else {
         $(chatboxtextarea).css('overflow', 'auto');
         }*/

    };
    var _r_m = function(key){
        $('#'+key).find('.me, .you, .timer').remove();
        for(var i=0;i<SClasses.length;i++)
            $('#'+key).removeClass(SClasses[i]);
        $('#'+key).html('<span class="me text_deleted">This message was removed</span>');
    };
    var _t_r_m = function(pid,time,remove){ // timeout function remove/time in second
          var init = time;
          var dosec = setInterval(function(){
                if(init === 0){
                    clearInterval(dosec);
                    if(remove === true){_r_m(pid);return;};
                    $('#'+pid).find('.timeoutspan').html(lang.time +' : '+ time + 's');
                }
                if($('#'+pid).length){
                    $('#'+pid).find('.timeoutspan').html(lang.time +' : '+ init + 's');
                    init--;
                }
            },1000);

    };
    var _a_m = function (ob) { //append message | take message object parameter
        ob = ob || {};
        var m = ob.m;
        ob.uid = ob.uid.replace(/ /g, "");
        ob.uid = ob.uid.replace(/:/g, "vhhslter");
        var d_name = m.uId; // display name

        if (ob.hasOwnProperty('type') && ob.type == 101) { //rewrite it from begininig
           if($(prefix + ob.uid + " .chatboxmessage").length > 0){
               $(prefix + ob.uid + " .chatboxcontent").css('margin-bottom',"40px");
               $(prefix + ob.uid + " .typing").show();
               setTimeout(function(){
                   $(prefix + ob.uid + " .chatboxcontent").css('margin-bottom',"0px");
                   $(prefix + ob.uid + " .typing").hide();
               },3000);
           }
            return;
        }else if (ob.hasOwnProperty('type') && ob.type == 0 && m.hasOwnProperty('status') && m.status == 0) {
            if($('#'+ m.packetID).length){
                $('#'+ m.packetID).html('<span class="you text_deleted">This message was removed</span>');
            }
            return
        }

        var text = '';
        var md = '';
        var packetID = '',reactid='';

        //if (m.hasOwnProperty('packetID') === false) {packetID = m.packetID;    reactid = m.packetID; }
        //if (m.hasOwnProperty('key')) {
        //    if(SClasses.hasOwnProperty(m.status) && m.status !== 0 && packetID !== ''){
        //         if($('#'+ m.key).length)$('#'+ m.key).attr('id',packetID);
        //    }else{
        //         packetID = m.key;
        //    }
        //}
        m.packetID = m.packetID || "";
        m.key = m.key || "";
        m.timeout = m.timeout || 0;
        switch (true){
            case (m.key !== "" && m.packetID !==""):
            case (m.key === "" && m.packetID !== ""):
                packetID = m.packetID;    reactid = m.packetID;
                if(m.key !== "" && $('#'+ m.key).length)$('#'+ m.key).attr('id',packetID);
                if(m.timeout > 0){
                    if(d_name == userIdentity){
                        _t_r_m(packetID, m.timeout,false);
                    }else{
                        if(document.hasFocus())
                            _t_r_m(packetID, m.timeout,true);
                        else $([window, document]).focus(function(){
                            _t_r_m(packetID, m.timeout,true);
                        });
                    }


                }
                break;
            case ( m.key !== "" && m.packetID === "" ):
                packetID = m.key;
                break;
        }

        if(packetID === '')return;

        var status_class = '',mtime='',timerclass="timerme";
        if (m.hasOwnProperty('mgDate')) {
            mtime = new Date(m.mgDate);
            mtime = mtime.customFormat("#MMM# #DD# #hh#:#mm# #AMPM#");
             // message date
        }
        if(SClasses.hasOwnProperty(m.status)){
            status_class=SClasses[m.status];
            $('.'+status_class).addClass('old');
        };
        if($('#'+packetID).length){
            if(reactid !== ''){ $('#'+packetID).data('react',reactid);
                $('#'+packetID).find('.deletem').data('react',reactid);
                $('#'+packetID).attr('id',reactid);packetID = reactid;}
            for(var i=0;i<SClasses.length;i++)
                $('#'+packetID).removeClass(SClasses[i]);

            $('#'+packetID).addClass(status_class);
            if(mtime !== '')
              $('#'+packetID).find('.timer').html(mtime);

            return;
        }


        var youme='';
        if(d_name === userIdentity){
           // d_name = lang.me; //future use
            youme='me';
            mtime = mtime == '' ? lang.now:mtime;

        }else{
           // d_name = utils.prepareName(m.fn, m.ln, m.uId); // future use
            youme = 'you';
            status_class = 'status_received';
            timerclass = 'timeryou';
        }



        if(m.hasOwnProperty('mg') === false)return;
        var datas = 'data-react="'+ reactid +'" data-fr="'+ ob.uid +'"';
        text = '<div id="' + packetID + '" '+ datas +' title="' + md + '" class="chatboxmessage '+ status_class +'">';

        //if (ob.hasOwnProperty('type') && ob.type == 0) {
        //    //new to delete message
        //    //alert('need to delete');
        //}else
        if (ob.hasOwnProperty('type') && ob.type == 2) {
            text += '<div class="chatboxmessagecontent '+ youme +' textcontent">' +m.mg + '</div>';
        }
        else if (ob.hasOwnProperty('type') && ob.type == 3) {
            text += '<div class="'+ youme +' textcontent">' + m.mg + '</div>';;
        } else if (ob.hasOwnProperty('type') && ob.type == 4) {
            text += '<div class="'+ youme +' sticker">' + "<img class=\"emoticons\" src=\"" + sticker_base + "3/" + "5/" + m.mg + "\" alt=\"..\" title=\"{AL}\" width='100' height='100' /></div>";
        } else if (ob.hasOwnProperty('type') && ob.type == 6) {
            text += '<div class="'+ youme +' sticker">' + "<img class=\"emoticons\" src=\"" + sticker_base + m.mg + "\" alt=\"..\" title=\"{AL}\" width='100' height='100' /></div>";
        }
        if(youme === 'me')
          text += '<span class="icondelete"><a class="deletem" href="javascript:void(0)" '+ datas +'><span class="glyphicon glyphicon-remove-circle"></span></a></span>';
        text += '<br class="clear" />';
        if(mtime !== ''){
            text += '<span class="timer '+ timerclass +'">'+ mtime +'</span>';
        }
        if(m.timeout > 0)text +='<span class="timeoutspan '+ timerclass +'" >'+lang.time +' : '+ m.timeout + 's</span>';

        text += '<div class="clear"></div>';
        text += '</div>';


            $(prefix + ob.uid + " .typing").remove();
            $(prefix + ob.uid + " .chatboxcontent").css('margin-bottom',"0px");
            if ($("#" + packetID).length) {
                if (($("#" + packetID).hasClass('status_sent')) || $("#" + packetID).hasClass('status_seen')) {

                } else {
                    $("#" + packetID).replaceWith(text);

                }
            } else {
                $(prefix + ob.uid + " .chatboxcontent").append(text)
                        .animate({scrollTop: $(prefix + ob.uid + ' .chatboxcontent').prop("scrollHeight")}, 100);
            }


    };

    var _i_sess = function () { // initiate active session on page reload/redirect

        $.ajax({
            url: base_url + "/SessionStart",
            cache: false,
            dataType: "json",
            success: function (data) {
                username = data.uId;
                var friends = eval('(' + data.friends + ')');
//                console.dir(friends);
                $.each(friends, function (i, item) {
                    //console.dir(item);
                    if (item) { // fix strange ie bug
                        var chatboxtitle = item.friendName;
                        var userId = chatboxtitle.split(',')[0];
                        //   if ($(prefix + userId).length <= 0) {
                        _ccb(chatboxtitle, 1, item.tag_chat);
                        //  }
                        if (item.messageList != null && item.messageList.length > 0) {
                            $.each(item.messageList, function (i, msg) {
                                _a_m({uid: userId, m: msg, type: msg.type});

                            });
                        }
                    }
                });
            }
        });

    };
    var _distribute = function(data){
        var friends = eval('(' + data + ')');
        $.each(friends, function (i, item) {
            if (item) { // fix strange ie bug
                var chatboxtitle = item.friendName;
                var fndId = chatboxtitle.split(',')[0];
                fndId = fndId.replace(/ /g, "");
                fndId = fndId.replace(/:/g, "vhhslter");

                _ccb(chatboxtitle, 1, item.tag_chat);

                newMessages[fndId] = true;
                newMessagesWin[fndId] = true;
                if (item.messageList != null && item.messageList.length > 0) {
                    $.each(item.messageList, function (i, msg) {
                        //console.dir(msg);
                        _a_m({uid: fndId, m: msg, type: msg.type});
                    });
                }
            }
            //  itemsfound++;
        });
      _blinker();
    };
    var h = function () { //chat heartbeat
        if (socketOn) {
            return;
        }
        //    var itemsfound = 0;
        $.ajax({
            url: base_url + "/SessionHeartBeat",
            cache: false,
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    _distribute(data.message);
                }
            },
            complete: function (jqXHR, textStatus) {
                setTimeout(h, chatHeartbeatTime);
            }
        });

    };


    return {
        restructureChatBoxes: function () {
            _r_pos();
        },
        chatWith: function (chatuser, tag_chat) {

            var rm_cls_name = ("msg_unread_count"+chatuser).split(",");
            if($("#rightNavBar1").has($("."+rm_cls_name[0]))){
                $("."+rm_cls_name[0]).remove();
            }
            //console.log(chatuser);

            _ccb(chatuser, 0, tag_chat);
        },
        createChatBox: function (chatboxtitle, minimizeChatBox) {
            _ccb(chatboxtitle, minimizeChatBox);
        },
        show: function (title) {
            var userInfo = title.toString().split(',');
            _x_box(userInfo[0]);
            _ccb(title, 0);
        },
        startChatSession: function () {
            try {
                _i_sess();
            } catch (exception) {
                console.warn("cannot initiate chat session");
            }finally {
                setTimeout(h, chatHeartbeatTime_initial);
            }
        },
        agent: function (data) {
            _distribute(data);
        },
        closeChatBox: function (chatboxtitle) {
            _x_box(chatboxtitle);
        },
        toggleChatBoxGrowth: function (event, chatboxtitle) {
           // event.stopPropagation();
            _t_box(chatboxtitle);
        },
        checkChatBoxInputKey: function (event, chatboxtextarea, chatboxtitle, friendName) {
            _s_m(event, chatboxtextarea, chatboxtitle, friendName);
        },
        send: function (c, m, type) {
            fire_m(c, m, type);
        },
        chatSocket: chatSocket
    };
}();


var tab = {
    init: function () {
        $('.tab_nav_1').click(function () {
            tab.reset('1');
        });
        $('.tab_nav_2').click(function () {
            tab.reset('2');
        });
        $('.tab_nav_3').click(function () {
            tab.reset('3');
        });
    },
    reset: function (sel) {
        $('.tab_body').css('display', 'none');
        $('.tab_body_' + sel).css('display', 'block');
        $('.tab_nav').removeClass('sel');
        $('.tab_nav_' + sel).addClass('sel');
    }
};
