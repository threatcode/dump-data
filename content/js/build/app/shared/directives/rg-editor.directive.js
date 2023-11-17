/*
 * © Ipvision
 */


    angular
            .module('ringid.shared')
            .provider('$editor', EditorProvider)
            .directive('rgEditor', rgEditor);


    function EditorProvider() {

        this.$get = ['$compile', 'StickerEmoticonService', 'StickerEmoticonFactory', '$sniffer','$rootScope', function ($compile, StickerEmoticonService, StickerEmoticonFactory, $sniffer,$rootScope) {

                  var emoMap = StickerEmoticonService.getEmoticonMap();
                  var emoPattern = StickerEmoticonFactory.getEmoticonPattern();
                  var dataBlockPattern = /<a.*?data-link="(.*?)".*?>.*?<\/a>/ig;
                  var prefix = $sniffer.vendorPrefix.toLowerCase();
                  var isIE11 = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));

                  var keys = {
                      '13' : {'fn':'enter', 'action':'enter', 'event':'keydown'},
                      '8'  : {'fn':'backspace', 'action':'backspace', 'event':'keydown'},
                      '32' : {'fn':'space', 'action':'space', 'event':'keydown'},
                      '46' : {'fn':'delete', 'action':'delete', 'event':'keydown'},
                      '27' : {'fn':'escape', 'action':'escape', 'event':'keydown'},
                      '37' : {'fn':'adjust', 'action':'left', 'event':'keyup'},
                      '39' : {'fn':'adjust', 'action':'right', 'event':'keyup'},
                      '38' : {'fn':'adjust', 'action':'up', 'event':'keyup'},
                      '40' : {'fn':'adjust', 'action':'down', 'event':'keyup'},
                      '00' : {'fn':'adjust', 'action':'click', 'event': 'mouseup'},
                  }

                  if(prefix == 'moz') {
                      keys['8'] = {'fn':'backspace', 'action':'backspace', 'event':'both'};
                      keys['46'] = {'fn':'delete', 'action':'delete', 'event':'both'};
                  }

                  /*Editor Modifier based on different action and event*/
                  var Modifiers = {

                            container :   null,
                            event :  null,
                            keyCode: 0,
                            selection : null,
                            range : null,
                            previousSelection : {},

                            init : function (container, keyCode, event, callbacks, processors) {

                                   var boundary, i, callback, processor, isProceed = true, firstChild =null, lastChild = null;

                                   this.container = container;
                                   this.keyCode = keyCode;
                                   this.event = event;
                                   this.selection = Cursor.getSelection();
                                   this.range = Cursor.getCurrentRange();
                                   this.action = '';

                                   firstChild = Utils.getFirstNode(this.container);
                                   lastChild = this.container.lastChild;

                                   boundary = Utils.getCurrentBoundary(this.selection);
                                   boundary = Utils.getSafeBoundary(this.selection, boundary, keyCode, firstChild, lastChild);

                                   /* processor*/
                                   for(i=0;i<processors.length;i++) {
                                      processor = processors[i];
                                      if(processor  && (processor.event == event.type || processor.event =='both') && ((keys[keyCode] && processor.action && processor.action.indexOf(keys[keyCode].action) != -1) ||  processor.action === false)) {
                                         if(processor.fn.call(processor.context, event, keyCode) === false) {
                                           isProceed = false;
                                         }
                                      }
                                   }
                                   processors = [];
                                   /*End of processor*/

                                   if(!isProceed) return;

                                   /* Action on variouos event*/
                                   if (keys[keyCode] && Modifiers[keys[keyCode].fn] && (keys[keyCode].event==event.type || keys[keyCode].event =='both')) {
                                       this.action = keys[keyCode].action;
                                       Modifiers[keys[keyCode].fn](boundary);
                                   }

                                   /* If cursor somehow in the middle of data block node, it will move cursor correct position*/
                                   if(!keys[keyCode] && event.type == 'keydown' && boundary) {
                                     Modifiers.adjust(boundary, false);
                                   }

                                   /* External callback */
                                   for(i=0;i<callbacks.length;i++) {
                                      callback = callbacks[i];
                                      if(callback  && callback.event == event.type && ((keys[keyCode] && callback.action == keys[keyCode].action) ||  callback.action === false)) {
                                        callback.fn.call(callback.context, event, keyCode);
                                      }
                                   }
                                   callbacks = [];
                                   /*End of callback*/

                                  firstChild = lastChild = null;

                            },

                            setContainer : function(container, focus) {
                              this.container = container;

                               if(focus && Cursor.intersectsNode(container) === false) {
                                   Cursor.toElmentEnd(container);
                                   this.container.focus();
                               }

                            },

                            adjust : function(boundary, preventDefault) {

                                  if(!boundary) return;

                                  preventDefault = (typeof preventDefault !== 'undefined') && (preventDefault !== null) ? preventDefault : true;

                                  if(boundary['zws'] && boundary['candidate'].length ==0 && (this.action =='left' || this.action =='right' || this.action =='click')) {
                                    if(preventDefault) {
                                      this.event.preventDefault();
                                    }
                                    return;
                                  }


                                  if(!this.selection.isCollapsed
                                     && this.event.type == 'mouseup' && this.previousSelection
                                     && this.previousSelection.anchorNode == this.selection['anchorNode']
                                     && this.previousSelection['anchorOffset'] == this.selection['anchorOffset']
                                     && this.previousSelection['focusOffset'] == this.selection['focusOffset']) {
                                     this.previousSelection = {};
                                     return;
                                  }




                                  if(!preventDefault && this.selection.isCollapsed === false) {

                                      if(this.event.ctrlKey || this.event.shiftKey || this.event.metaKey) return;

                                      if(boundary && boundary.direction == 'ltr') {
                                        Cursor.deleteContents(boundary['start'],boundary['startPos'],boundary['end'], boundary['endPos']);
                                      }
                                      else if(boundary && boundary.direction == 'rtl') {
                                        Cursor.deleteContents(boundary['end'], boundary['endPos'], boundary['start'],boundary['startPos']);
                                      }
                                      else {
                                        Cursor.deleteContents(this.range.startContainer, this.range.startOffset, this.range.endContainer, this.range.endOffset);
                                      }

                                      return;
                                  }

                                  Utils.adjustCursor(this.selection, boundary);

                                  if(preventDefault) {
                                    this.event.preventDefault();
                                  }

                                 if(this.selection && this.selection['anchorNode']) {
                                   this.previousSelection['anchorNode'] = this.selection['anchorNode'];
                                   this.previousSelection['anchorOffset'] = this.selection['anchorOffset'];
                                   this.previousSelection['focusOffset'] = this.selection['focusOffset'];
                                 }

                            },

                            enter : function (boundary) {

                                  var rgNode, i, tagDropdownOpen = false, brNode, nodeData, exeBR = false, textNode;


                                   if(boundary && !this.selection.isCollapsed) {

                                      if(boundary.direction == 'ltr') {

                                       Cursor.deleteContents(boundary['start'],boundary['startPos'],boundary['end'], boundary['endPos']);
                                      }
                                      else {
                                        Cursor.deleteContents(boundary['end'], boundary['endPos'], boundary['start'],boundary['startPos']);
                                      }
                                     this.range = Cursor.getCurrentRange();
                                   }

                                   /*For gecko*/
                                   try {
                                    exeBR = document.execCommand('insertBrOnReturn', false, true);
                                   }
                                   catch (error) {
                                    exeBR = false;
                                   }

                                   if(exeBR) return;

                                   this.event.preventDefault();

                                   this.range.deleteContents();
                                   brNode = document.createElement('br');
                                   this.range.insertNode(brNode);

                                   if(this.container.style.maxHeight !="") {
                                     this.container.scrollTop = this.container.scrollTop + 18;
                                   }

                                   Cursor.toElmentAfter(brNode);
                                   nodeData = brNode = textNode = null;
                            },

                            escape : function () {

                            },

                            backspace : function (boundary) {

                                   if(!boundary) return;

                                   var text = this.container.innerText || this.container.textContent;

                                   if(text.length ==2) {
                                     this.event.preventDefault();
                                     return;
                                   }

                                   if(boundary['zwsType'] =='last' && boundary['start'] === boundary['end'] && boundary['startPos'] == boundary['endPos'] ) return;

                                   if(boundary['zws'] && boundary['zwsType'] =='first' && boundary['candidate'].length ==0) {
                                    this.event.preventDefault();
                                    return;
                                   }

                                   var nodeData;

                                   if(boundary.direction == 'ltr') {
                                     nodeData =  Utils.getNode(boundary['start'], 'prev', boundary['start'].length-boundary['startPos']);
                                     Cursor.deleteContents(boundary['start'],boundary['startPos'], boundary['end'], boundary['endPos']);
                                   }
                                   else {
                                     nodeData =  Utils.getNode(boundary['end'], 'next', boundary['end'].length-boundary['endPos']);
                                     Cursor.deleteContents(boundary['end'], boundary['endPos'], boundary['start'],boundary['startPos']);
                                   }

                                   /* adjust pos after removing node*/
                                   if(nodeData['parent']) {
                                      nodeData['pos'] = (boundary.direction == 'rtl') ? nodeData['node'].childNodes.length : 0;
                                   }

                                   Cursor.toElementByType(nodeData['node'], nodeData['type'], nodeData['pos']);
                                   this.event.preventDefault();

                                   nodeData = null;
                            },

                            delete : function (boundary) {

                                   if(!boundary) return;

                                   var text = this.container.innerText || this.container.textContent;

                                   if(text.length ==2) {
                                     this.event.preventDefault();
                                     return;
                                   }

                                   if(boundary['zwsType'] =='first' && boundary['start'] === boundary['end'] && boundary['startPos'] == boundary['endPos'] ) return;

                                   if(boundary['zws'] && boundary['zwsType'] =='last' && boundary['candidate'].length ==0) {
                                    this.event.preventDefault();
                                    return;
                                   }

                                   var nodeData;

                                   if(this.selection.isCollapsed || boundary.direction == 'ltr') {
                                     nodeData =  Utils.getNode(boundary['start'], 'next', boundary['start'].length-boundary['startPos']);
                                     Cursor.deleteContents(boundary['start'],boundary['startPos'],boundary['end'], boundary['endPos']);
                                   }
                                   else {
                                     nodeData =  Utils.getNode(boundary['end'], 'prev', boundary['end'].length-boundary['endPos']);
                                     Cursor.deleteContents(boundary['end'], boundary['endPos'], boundary['start'],boundary['startPos']);
                                   }

                                   /* adjust pos after removing mode*/
                                   if(nodeData['parent']) {
                                      nodeData['pos'] = (this.selection.isCollapsed || boundary.direction == 'ltr') ? nodeData['node'].childNodes.length : 0;
                                   }

                                   Cursor.toElementByType(nodeData['node'], nodeData['type'], nodeData['pos']);
                                   this.event.preventDefault();

                                   nodeData = null;
                          },

                          space : function () {

                                var code = '', ieFix;

                                code = Utils.findCurrentWord(null, this.container);

                                if(code) {
                                   code = code.replace(/\u200B|\n/g,'');
                                }

                                if(emoMap[code]) {

                                  var ieFix = (prefix == 'ms' && Utils.isEditorTag(this.range.endContainer) && this.range.endContainer.childNodes[this.range.endOffset].nodeType  == 3 && this.range.endContainer.childNodes[this.range.endOffset].nodeValue.charCodeAt(0) == '8203') ? true : false;

                                  if(ieFix) {

                                    var tempNode = this.range.endContainer.childNodes[this.range.endOffset-1];
                                    this.range.setStart(tempNode,tempNode.length);
                                    this.range.setEnd(tempNode,tempNode.length);
                                    tempNode = null;
                                  }

                                  this.range.setStart(this.range.startContainer, (this.range.endOffset - code.length));
                                  this.range.deleteContents(); /* Manual delete since we don't need undo here*/
                                  this.addEmoticon(code,true);
                                  this.event.preventDefault();
                                }

                           },

                           addEmoticon : function(code, appendSpace) {

                                var nodeData, attrs = {}, html, gotoEl, emoNode;

                                this.range = Cursor.getCurrentRange();

                                html = Utils.parseText(code);

                                if(appendSpace && html.replace(dataBlockPattern,'') == '') {
                                   html += String.fromCharCode(32);
                                }

                                Utils.removeClass(this.container);

                                Cursor.insertHtml(html);

                                emoNode = this.container.querySelectorAll(".caret");
                                emoNode = Array.prototype.slice.call(emoNode);

                                if(this.selection) {
                                  gotoEl = this.selection.focusNode;
                                }


                                 /* InsertHTML bug perhaps!. Sometimes it is inserting unexpected newline*/
                                if(gotoEl && gotoEl.nextSibling
                                   && gotoEl.nextSibling.nodeType ==3
                                   && gotoEl.nextSibling.length ==1
                                   && gotoEl.nextSibling.nodeValue.charCodeAt(0) == 10) {
                                   gotoEl.nextSibling.parentNode.removeChild(gotoEl.nextSibling);
                                }

                                if(gotoEl && gotoEl.nodeType== 3 && gotoEl.nodeValue.charCodeAt(gotoEl.nodeValue.length-1) == 10) {
                                   gotoEl.nodeValue =  gotoEl.nodeValue.replace(/\u200B|\n/g,'');
                                }

                                if(!gotoEl && emoNode.length > 0) {
                                  var tempNode = emoNode[emoNode.length-1].nextSibling.nextSibling;

                                  if(tempNode && tempNode.nodeType== 3 && tempNode.length ==1 && tempNode.nodeValue.charCodeAt(0) == 10) {
                                    tempNode.parentNode.removeChild(tempNode);
                                  }
                                  tempNode = null;
                                }
                                /*Newline issue done*/


                                if(emoNode.length > 0 ) {

                                  gotoEl = emoNode[emoNode.length-1];

                                  if(gotoEl.nextSibling && gotoEl.nextSibling.nodeType ==3) {
                                     Cursor.toElementByType(gotoEl.nextSibling, 'pos', 1);
                                  }
                                  else {
                                    Cursor.toElmentAfter(gotoEl);
                                  }

                                }
                                else if(gotoEl) {
                                  nodeData = Utils.getNode(gotoEl, 'next', 0);
                                  Cursor.toElementByType(nodeData['node'], nodeData['type'], nodeData['pos']);
                                }
                                else {
                                  Cursor.toElmentEnd(this.container);
                                }

                                this.container.focus();
                                nodeData = emoNode = gotoEl=  null;
                           },

                          addTag : function (user, word) {

                              var nodeData, blockData, attrs = {}, html, gotoEl, offset, tagNode;

                              word = '@'+word;

                              if(this.range.startContainer.nodeType !=3) {
                                this.range = Cursor.getCurrentRange();
                              }

                              offset = this.range.collapsed ? this.range.endOffset : this.range.startOffset;

                              var ieFix = (prefix == 'ms' && Utils.isEditorTag(this.range.endContainer) && this.range.endContainer.childNodes[this.range.endOffset].nodeType  == 3 && this.range.endContainer.childNodes[this.range.endOffset].nodeValue.charCodeAt(0) == '8203') ? true : false;

                              if(ieFix) {
                                offset = this.range.endContainer.childNodes[this.range.endOffset-1].nodeValue.length;
                                var tempNode = this.range.endContainer.childNodes[this.range.endOffset-1];
                                this.range.setStart(tempNode,0);
                                this.range.setEnd(tempNode,0);
                                tempNode = null;
                              }

                              if((offset - word.length) < 0) return;

                              this.range.setStart(this.range.startContainer, (offset - word.length));
                              this.range.setEnd(this.range.startContainer, offset);
                              this.range.deleteContents(); /* Manual delete since we don't need undo here*/

                              attrs['class']  = 'tag';
                              attrs['title']  = user.getName().trim();
                              attrs['data-link']  = user.getUtId();
                              attrs['text']  = user.getName().trim();

                              Utils.removeClass(this.container);

                              html = Utils.getBlockHTML(attrs);
                              Cursor.insertHtml(html);

                              tagNode = this.container.querySelectorAll(".caret");
                              tagNode = Array.prototype.slice.call(tagNode);

                              if(this.selection.focusNode !== this.container && this.selection.focusNode.nextSibling && this.selection.focusNode.nextSibling !== this.container.lastChild) {
                                  gotoEl = this.selection.focusNode.nextSibling;
                                }
                              else {
                                  gotoEl = this.selection.focusNode;
                              }

                              blockData = Utils.examineNode(gotoEl,'focus', this.selection);
                              if(blockData.node && blockData.position =='parent') {
                                  gotoEl = blockData.node;
                              }

                               /* InsertHTML bug perhaps!. Chrome inserts unexpected newline*/
                                if(gotoEl && gotoEl.nextSibling
                                   && gotoEl.nextSibling.nodeType ==3
                                   && gotoEl.nextSibling.length ==1
                                   && gotoEl.nextSibling.nodeValue.charCodeAt(0) == 10) {
                                   gotoEl.nextSibling.parentNode.removeChild(gotoEl.nextSibling);
                                }

                                if(gotoEl && gotoEl.nodeType== 3 && gotoEl.nodeValue.charCodeAt(gotoEl.nodeValue.length-1) == 10) {
                                   gotoEl.nodeValue =  gotoEl.nodeValue.replace(/\u200B|\n/g,'');
                                }

                                if(!gotoEl && tagNode.length > 0) {
                                  var tempNode = tagNode[tagNode.length-1].nextSibling;

                                  if(tempNode && tempNode.nodeType== 3 && tempNode.length ==1 && tempNode.nodeValue.charCodeAt(0) == 10) {
                                    tempNode.parentNode.removeChild(tempNode);
                                  }
                                  tempNode = null;
                                }
                                /*Newline issue done*/


                              if(tagNode.length > 0 ) {
                                Cursor.toElmentAfter(tagNode[tagNode.length-1]);
                              }
                              else if(gotoEl) {
                                nodeData = Utils.getNode(gotoEl, 'next', 0);
                                Cursor.toElementByType(nodeData['node'], nodeData['type'], nodeData['pos']);
                              }
                              else {
                                Cursor.toElmentEnd(this.container);
                              }

                              this.container.focus();
                              nodeData = tagNode =gotoEl=  null;
                          },

                          paste : function(text){

                            var html = Utils.parseText(text), gotoEl;
                            Cursor.insertHtml(html);
                            this.container.focus();
                            gotoEl = null;

                          }
                       };


                      /* Dom and other ultity methods*/
                      var Utils = {

                            examineNode : function(node, type, selection) {

                                var result = Object.create(null),
                                    offset = (type == 'focus') ? selection.focusOffset : selection.anchorOffset,
                                    tempNode;

                                result['position'] = false;
                                result['length'] = 0;
                                result['node'] = null;


                                if(!node) {
                                  return result;
                                }

                                if(node.nodeType ==1 && node.getAttribute('data-block')=='true') {
                                    result['node'] = node;
                                    result['position'] = 'self';
                                }

                                tempNode = Utils.getNextNode(node, node.length);

                                if(tempNode && tempNode.nodeType ==1 && tempNode.getAttribute('data-block')=='true' && (node.nodeType ==1 || (node.nodeType == 3 && offset == node.length))) {
                                    result['node'] = tempNode;
                                    result['position'] = 'next';
                                }

                                tempNode = Utils.getPrevNode(node, node.length);
                                if(tempNode && tempNode.nodeType ==1 && tempNode.getAttribute('data-block')=='true' && (node.nodeType ==1 || (node.nodeType == 3 && offset == 0))) {
                                    result['node'] = tempNode;
                                    result['position'] = 'prev';
                                }

                                tempNode = node.parentNode.nodeName.toLowerCase() == 'b' ? node.parentNode.parentNode : node.parentNode;
                                if(tempNode && tempNode.nodeType ==1 && tempNode.getAttribute('data-block')=='true') {
                                    result['node'] = tempNode;
                                    result['position'] = 'parent';
                                }

                                if(result['node']) {
                                  result['length']    =  (result['node'].nodeType ==3) ? result['node'].nodeValue.length : 0;
                                }

                                tempNode= null;
                                return result;
                           },

                           getCurrentBoundary : function (selection) {

                                var direction = Cursor.getDirection();
                                var result = Object.create(null);

                                if(!selection) return result;

                                result['start'] = selection.anchorNode;
                                result['startPos'] = selection.anchorOffset;
                                result['end'] = selection.focusNode;
                                result['endPos'] = selection.focusOffset;
                                result['direction'] = direction;
                                return result;
                           },

                           adjustCursor : function(selection, boundary) {

                                  if(selection.isCollapsed) {
                                      Cursor.toElementByType(boundary['end'], boundary['type'], boundary['endPos']);
                                   }
                                  else if(!selection.isCollapsed && boundary['isAnchorMoved']) {
                                      Cursor.extendSelection(boundary, false);
                                   }
                                   else {
                                       Cursor.extendSelection(boundary);
                                   }

                           },

                           getSafeBoundary : function (selection, boundary, keyCode, firstChild, lastChild) {

                                   var adjust = false, blockData = null, nodeData = null,
                                   action, nodeToBechecked = [], dir, current, length;

                                  /*
                                    - if reverse is true, it will reverse focus and anchor node searching direction
                                      in case of right to left selection (backward selection)
                                    - If both is true, it will consider anchor node also regardless collapsed status
                                  */
                                  var dirRules = {
                                      'enter'     : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': true, 'both':false},
                                      'backspace' : {'focus':'prev', 'anchor':'next', 'dir' : 'rtl', 'reverse': true, 'both':true},
                                      'delete'    : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': true, 'both':true},
                                      'space'     : {'focus':'next', 'anchor':'next', 'dir' : 'ltr', 'reverse': false, 'both':false},
                                      'escape'    : {},
                                      'left'      : {'focus':'prev', 'anchor':'next', 'dir' : 'rtl', 'reverse': false, 'both':false},
                                      'right'     : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': false, 'both':false},
                                      'up'        : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': true, 'both':false},
                                      'down'      : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': true, 'both':false},
                                      'click'     : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': true, 'both':false},
                                      'any'       : {'focus':'next', 'anchor':'prev', 'dir' : 'ltr', 'reverse': true, 'both':false}
                                  };

                                  action = keys[keyCode] ? keys[keyCode].action : 'any';

                                   if(action == '' || !dirRules[action] || !dirRules[action].hasOwnProperty('focus')) return;

                                   boundary['isAnchorMoved'] = false;
                                   boundary['candidate'] = [];

                                   if(!selection.isCollapsed || dirRules[action]['both']) {
                                      nodeToBechecked.push({'node':selection.anchorNode, 'type':'anchor', 'offset': selection.anchorOffset});
                                   }

                                   nodeToBechecked.push({'node':selection.focusNode, 'type':'focus', 'offset': selection.focusOffset});

                                   while(current = nodeToBechecked.pop()) {

                                          if(!current.node) continue;

                                          dir = dirRules[action][current.type];

                                          if(dirRules[action]['reverse'] && boundary.direction != dirRules[action]['dir']) {
                                             dir = (dir == 'next') ? 'prev' : 'next';
                                          }

                                          blockData = Utils.examineNode(current.node, current.type, selection);

                                           /* For any key action, don't need to adjust boundary if cursor in the most right of data-block*/
                                           if(action == 'any' && selection.isCollapsed && ((blockData.length == selection.focusOffset)
                                              || (blockData.position =='next' && selection.focusNode.length == selection.focusOffset))) {
                                              blockData['node'] = null;
                                           }

                                           if((action == 'backspace' || action=='click') && blockData.position =='next' && selection.isCollapsed && selection.focusNode.nodeType ==3 && selection.focusNode.length == selection.focusOffset) {
                                              blockData['node'] = null;
                                           }

                                           if(blockData.node) {

                                                nodeData =  Utils.getNode(blockData.node, dir, 0);

                                                if(current.type == 'focus') {
                                                  boundary['end'] = nodeData['node'];
                                                  boundary['endPos'] = nodeData['pos'];
                                                }
                                                else {
                                                  boundary['start'] = nodeData['node'];
                                                  boundary['startPos'] = nodeData['pos'];
                                                  boundary['isAnchorMoved'] = true;
                                                }

                                                boundary['type'] = nodeData['type'];
                                                adjust = true;

                                                boundary['candidate'].push(blockData.node);
                                           }
                                  }

                               /*We have to protect first and last zero width space chars anyhow*/
                               boundary['zws'] = false;
                               boundary['zwsType'] = '';

                               /*For first zero width space*/
                               if(boundary.direction == 'ltr' && boundary['start'] === firstChild) {

                                  if(boundary['startPos'] ==0) {

                                      if(selection.isCollapsed) {
                                        boundary['endPos'] = boundary['startPos'] = 1;
                                        boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                      }
                                      else {
                                        boundary['startPos'] = 1;
                                        boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                      }
                                      adjust = true;
                                  }
                                  else if(boundary['startPos'] ==1 && action!='any' && boundary['start'].nodeType ==3 &&  boundary['start'].nodeValue.charCodeAt(0)=='8203' && selection.isCollapsed) {
                                      boundary['zws'] = true;
                                      boundary['zwsType'] = 'first';
                                      adjust = true;
                                  }
                               }

                               if( action == 'backspace' && selection.isCollapsed && boundary['startPos']==0 &&  Utils.getPrevNode(boundary['start'],boundary['start'].length) === firstChild) {
                                  boundary['zws'] = true;
                                  boundary['zwsType'] = 'first';
                                  adjust = true;
                               }

                               if(boundary.direction == 'rtl' && boundary['end'] == firstChild && boundary['endPos'] ==0) {
                                  boundary['endPos'] = 1;

                                  boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                  adjust = true;
                               }

                               if(Utils.isEditorTag(boundary['end']) && boundary['endPos'] ==0) {
                                  boundary['end'] = boundary['end'].firstChild;
                                  boundary['endPos'] = 1;
                                  boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                  adjust = true;
                               }

                               if(Utils.isEditorTag(boundary['end'])
                                  && boundary['endPos'] == boundary['end'].childNodes.length
                                  && boundary['end'].lastChild && boundary['end'].lastChild.nodeType == 3
                                  && boundary['end'].lastChild.nodeValue.charCodeAt(0) == '8203' ) {

                                  boundary['end'] = boundary['end'].firstChild;
                                  boundary['endPos'] = 1;
                                  boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                  adjust = true;
                               }

                              /*For last zero width space*/
                              if(boundary.direction == 'ltr' && lastChild && boundary['end'] === lastChild) {

                                  length = boundary['end'].length;

                                  if(length > 0 && boundary['endPos'] == length) {

                                      if(selection.isCollapsed) {
                                        boundary['endPos'] = boundary['startPos'] = length-1;
                                        boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                      }
                                      else {
                                        boundary['endPos'] = length-1;
                                        boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                      }
                                      adjust = true;
                                  }
                                  else if(boundary['endPos'] ==(length-1) && action!='any' && boundary['end'].nodeType ==3 &&  boundary['end'].nodeValue.charCodeAt(length-1)=='8203' && selection.isCollapsed) {
                                      boundary['zws'] = true;
                                      boundary['zwsType'] = 'last';
                                      adjust = true;
                                  }
                               }

                               if( action == 'delete' && selection.isCollapsed && boundary['end'].length == boundary['endPos'] &&  Utils.getNextNode(boundary['end'],boundary['endPos']) === lastChild) {
                                  boundary['zws'] = true;
                                  boundary['zwsType'] = 'last';
                                  adjust = true;
                               }

                               length = boundary['start'].length;
                               if(boundary.direction == 'rtl' && boundary['start'] == lastChild && boundary['startPos'] ==length) {
                                  boundary['startPos'] = length-1;

                                  boundary['type'] = (boundary['type']) ? boundary['type'] : 'pos';
                                  adjust = true;
                               }

                               blockData = nodeData = nodeToBechecked = firstChild = lastChild = current = null;
                               return adjust ? boundary : false;
                           },

                           parseText : function (text) {

                              text =  text.replace(emoPattern, function(match) {
                                  var attrs = [];
                                  attrs['class']  = 'em_list '+emoMap[match].replace(/\.[A-Za-z]{3}/,'');
                                  attrs['title']  = match;
                                  attrs['data-link']  = match;
                                  attrs['text']  = '<b>'+match.replace(/</g, '&lt;').replace(/>/g, '&gt;')+'</b>&nbsp;';
                                  return Utils.getBlockHTML(attrs);
                               });

                              return text;

                           },

                           removeClass : function(node) {

                              if(!node) return;
                              var elmentList = node.querySelectorAll('.caret'), i;

                              for(i=0;i<elmentList.length;i++) {
                                 elmentList[i].className =  elmentList[i].className.replace('caret','').trim();
                              }
                              elmentList = null;
                           },

                           adjustMarkup : function(node) {

                              if(!node) return;
                              var elmentList = node.querySelectorAll('.em_list'), i;

                              for(i=0;i<elmentList.length;i++) {
                                 elmentList[i].innerHTML = '<b>'+elmentList[i].getAttribute('data-link')+'</b>&nbsp;';
                              }
                              elmentList = null;

                           },

                           getBlockHTML : function(attrs) {

                              var html = '<a href="#" onclick="return false" class="'+attrs['class']+' caret" title="'+attrs['title']+'" data-link="'+attrs['data-link']+'" spellcheck="false" data-block="true">'+attrs['text']+'</a>';
                              return html;
                           },

                           getPrevNode : function(node,selfOffset) {

                               selfOffset = (typeof selfOffset !== 'undefined') && (selfOffset !== null) ? selfOffset : 0;

                               if(!node) return node;

                               if(node.length > selfOffset) {
                                  return node;
                               }

                              var prevNode = node.previousSibling;

                              while(prevNode) {

                                if(prevNode.length > 0 || prevNode.nodeType == 1) {
                                   break;
                                }

                                prevNode = prevNode.previousSibling;
                               }

                               return prevNode;
                          },

                          getNextNode : function(node, selfOffset) {

                              selfOffset = (typeof selfOffset !== 'undefined') && (selfOffset !== null) ? selfOffset : 0;

                              if(!node) return node;

                              if(node.length > selfOffset) {
                                  return node;
                              }

                              var nextNode = node.nextSibling;

                              while(nextNode) {

                                if(nextNode.length > 0 || nextNode.nodeType == 1) {
                                   break;
                                }
                                nextNode = nextNode.nextSibling;
                              }

                              return nextNode;

                          },

                          getNode : function(node,type,selfOffset) {

                              var result = Object.create(null), self = false, isEditorNode = this.isEditorTag(node);

                              if(!node) return node;

                              result['node'] = null;

                              type = (typeof type !== 'undefined') && (type !== null) ? type : 'prev';
                              selfOffset = (typeof selfOffset !== 'undefined') && (selfOffset !== null) ? selfOffset : 0;

                              if(node.length > selfOffset) {
                                 self = true;
                              }

                              if(!isEditorNode) {
                                result['node'] = (type == 'prev') ? this.getPrevNode(node,selfOffset) : this.getNextNode(node,selfOffset);
                              }

                              if(result['node']) {

                                  if(type == 'prev') {
                                   result['pos'] = self ? (result['node'].length - selfOffset) : result['node'].length;
                                  }

                                  if(type == 'next') {
                                       result['pos'] = self  ? (result['node'].length - selfOffset) : 0;
                                  }

                                  result['type'] = 'pos';
                              }

                              result['parent'] = false;

                              if(!result['node']) {
                                result['node'] = isEditorNode ? node : node.parentNode;
                                result['pos'] = (type == 'next') ? result['node'].childNodes.length : 0;
                                result['type'] = 'pos';
                                result['parent'] = true;
                              }

                              return result;
                          },

                          isEditorTag : function(node) {

                              return (node && node.nodeType==1 && node.getAttribute('data-editor')=='true') || false;
                          },

                          isEmpty : function(node) {

                              if(node.childNodes.length ==0) return false;

                              var nextNode = node.firstChild;

                              while(nextNode) {

                                if(nextNode.nodeType ==1 || nextNode.length > 0) {
                                   break;
                                }
                                nextNode = nextNode.nextSibling;
                              }

                              return (nextNode) ? false : true;
                          },

                          getFirstNode : function(node, ignoreZWS) {

                              if(node.childNodes.length ==0) return false;

                              var nextNode = node.firstChild;

                              ignoreZWS = (typeof ignoreZWS !== 'undefined') && (ignoreZWS !== null) ? ignoreZWS : false;

                              while(nextNode) {

                                if(nextNode.nodeType ==1 || nextNode.length > 0) {

                                   if(!ignoreZWS || nextNode.nodeType !=3 || nextNode.length > 1 || nextNode.nodeValue.charCodeAt(0) != '8203') {
                                      break;
                                   }

                                }
                                nextNode = nextNode.nextSibling;
                              }

                              return nextNode;
                          },

                          findCurrentWord : function(delimiter, parent) {

                              var sel = Cursor.getSelection(),i,
                                  nodeText = '', delimiterPos = -1, word = '',
                                  spaceFound = false,
                                  firstChild = Utils.getFirstNode(parent, true);

                               delimiter = delimiter ? delimiter : null;

                               var ieFix = (prefix == 'ms' && Utils.isEditorTag(sel.focusNode) && sel.focusNode.childNodes[sel.focusOffset].nodeType  == 3 && sel.focusNode.childNodes[sel.focusOffset].nodeValue.charCodeAt(0) == '8203') ? true : false;

                               if(sel && sel.focusNode.nodeType == 3 || ieFix) {

                                 nodeText = ieFix ? sel.focusNode.childNodes[sel.focusOffset-1].nodeValue : sel.focusNode.nodeValue.substr(0, sel.anchorOffset);
                                 nodeText = nodeText.replace(/\s+$/,'');
                                 delimiterPos = (delimiter) ? nodeText.lastIndexOf(delimiter) : 1;


                                 if(delimiterPos >= 0) {

                                    for(i = nodeText.length -1; i >= 0; i-- ) {

                                      if(/\s/.test(nodeText[i])) {
                                         spaceFound = true;
                                         break;
                                      }

                                      if(nodeText[i] == delimiter) {
                                        word = nodeText[i]+word;
                                        break;
                                      }
                                      word = nodeText[i]+word;
                                    }
                                 }

                              }

                              /* If delimiter is space, we can return*/
                              if(delimiter == null) {

                                if(!spaceFound && !ieFix && firstChild !== sel.anchorNode) {
                                  word = '';
                                }
                                firstChild = null;
                                return word;
                              }

                              if(word[0] != delimiter) word = '';

                              if(word.length > 1 && ((firstChild === sel.anchorNode && sel.anchorNode.nodeValue[0] == delimiter)
                                  || ieFix
                                  || (parent.firstChild === sel.anchorNode && sel.anchorNode.nodeValue[1] == delimiter)
                                  || (sel.anchorNode.previousSibling && sel.anchorNode.previousSibling.nodeType == 3 && sel.anchorNode.previousSibling.nodeValue.charCodeAt(sel.anchorNode.previousSibling.length-1) == 32)
                                  || nodeText.charCodeAt(delimiterPos-1) == 32)
                                  || nodeText.charCodeAt(delimiterPos-1) == 160) {

                                 word = word.replace(delimiter,'');
                              }
                              else {
                                word = '';
                              }

                              firstChild = null;
                              return word;
                          },

                          findPos : function (el) {
                              var x = 0, y = 0;
                              if (el.offsetParent) {
                                  do {
                                      x += el.offsetLeft;
                                      y += el.offsetTop;
                                  } while (el = el.offsetParent);
                              }
                              return {x: x, y: y};
                          }

                      };

                     /*Curor, seleciton and range Utility*/
                     var Cursor = {

                          toPos : function(el, pos) {

                             var sel = this.getSelection(),
                             range =  this.getRange();

                              /* if pos is not defined, consider length for text node and childnode.length for element node*/
                              pos = (typeof pos !== 'undefined') && (pos !== null) ? pos : (el.length || el.childNodes.length);

                              range.setStart(el, pos);
                              range.setEnd(el, pos);
                              range.collapse(true);
                              sel.removeAllRanges();
                              sel.addRange(range);
                              range.detach();
                              sel = null;
                          },

                          toElementStart : function(el, focus) {
                            if(focus) el.focus();
                            this.toPos(el, 0);
                          },

                          toElmentEnd : function(el, focus) {
                            if(focus) el.focus();

                            if(Utils.isEditorTag(el) && el.lastChild
                              && el.lastChild.nodeType ==3
                              && el.lastChild.nodeValue.charCodeAt(el.lastChild.nodeValue.length-1)=='8203') {
                              this.toPos(el.lastChild,el.lastChild.nodeValue.length-1);
                              return;
                            }
                            this.toPos(el);
                          },

                          toElmentBefore : function(el) {
                             var sel = this.getSelection(),
                             range =  this.getRange();
                             range.setStartBefore(el);
                             range.collapse(true);
                             sel.removeAllRanges();
                             sel.addRange(range);
                             range.detach();
                             sel = null;
                          },

                          toElmentAfter : function(el) {
                             var sel = this.getSelection(),
                             range =  this.getRange();
                             range.setStartAfter(el);
                             range.collapse(true);
                             sel.removeAllRanges();
                             sel.addRange(range);
                             range.detach();

                             sel = null;
                          },

                          toElementByType : function (el, type, pos) {

                             type = (typeof type !== 'undefined') ? type : 'end';

                             if (type == 'end') {
                                this.toElmentEnd(el);
                             }

                             if (type == 'start') {
                                this.toElementStart(el);
                             }

                             if(type == 'pos') {
                                this.toPos(el, pos);
                             }

                          },

                          deleteContents : function(startEl, startPos, endEl, endPos) {

                              var sel = this.getSelection(), range =  this.getRange();

                              startPos = (typeof startPos !== 'undefined') && (startPos !== null) ? startPos : (startEl.length || startEl.childNodes.length);
                              endEl = (typeof endEl !== 'undefined') ? endEl : startEl;
                              endPos = (typeof endPos !== 'undefined') && (endPos !== null) ? endPos : (endEl.length || endEl.childNodes.length);

                              if(startEl === endEl && startPos == endPos ) return;

                              if(startEl.nodeType == 1) {
                                  range.setStartBefore(startEl);
                              }
                              else {
                                 range.setStart(startEl, startPos);
                              }

                              if(endEl.nodeType == 1) {
                                  range.setEndAfter(endEl);
                              }
                              else {
                                 range.setEnd(endEl, endPos);
                              }

                              //range.deleteContents();
                              sel.removeAllRanges();
                              sel.addRange(range);
                              document.execCommand('delete', false);
                              range.detach();
                          },

                          insertHtml : function(html) {

                              var sel = this.getSelection(), range =  this.getCurrentRange();

                              if(this.isIE()) {
                                range.pasteHTML(html);
                              }
                              else if(isIE11) {

                                  var el = document.createElement('div'), frag = document.createDocumentFragment(), node;
                                  el.innerHTML = html;

                                  while ( (node = el.firstChild) ) {
                                     frag.appendChild(node);
                                  }
                                  range.insertNode(frag);

                                  el = frag = node = null;
                              }
                              else {

                                  document.execCommand('insertHtml', false, html);
                              }
                          },

                          getSelection : function() {
                            return (this.isIE()) ? document.selection : window.getSelection();
                          },

                          isIE : function () {
                              return document.selection && document.selection.type != "Control";
                          },

                          extendSelection : function(boundary, nativeAPI) {

                              var sel = this.getSelection(),
                              range =  this.getRange();

                              nativeAPI = (nativeAPI != 'undefined') && (nativeAPI != null) ? nativeAPI : true;

                              /*If browser support extend method, then extend natively*/
                              if(sel.extend && nativeAPI) {

                                 sel.extend(boundary['end'], boundary['endPos']);
                                 return;
                              }

                              if(boundary.direction == 'ltr') {
                                range.setStart(boundary['start'], boundary['startPos']);
                                range.setEnd(boundary['end'], boundary['endPos']);
                              }
                              else {
                                range.setStart(boundary['end'], boundary['endPos']);
                                range.setEnd(boundary['start'], boundary['startPos']);
                              }

                              sel.removeAllRanges();
                              sel.addRange(range);
                              range.detach();

                              sel = null;
                          },

                          reset : function () {

                             var sel = this.getSelection(), range = this.getRange(), direction = this.getDirection();

                             if(direction == 'ltr') {
                               range.setStart(sel.focusNode, sel.focusOffset);
                             }
                             else {
                              range.setStart(sel.anchorNode, sel.anchorOffset);
                             }

                             range.collapse(true);
                             sel.removeAllRanges();
                             sel.addRange(range);
                             range.detach();
                             sel = null;
                          },

                          getRange : function() {
                            return document.createRange();
                          },

                          getCurrentRange : function() {
                             var sel = this.getSelection();

                             if(this.isIE()) return sel.createRange();

                             return (sel.rangeCount) ? sel.getRangeAt(0) : false;
                          },

                          getDirection : function() {

                               var sel = this.getSelection(), backwards = false,
                               range = this.getRange();

                               if(sel && !sel.isCollapsed) {

                                  range.setStart(sel.anchorNode, sel.anchorOffset);
                                  range.setEnd(sel.focusNode, sel.focusOffset);
                                  backwards = range.collapsed;
                                  range.detach();
                               }

                               sel = null;
                               return backwards ? 'rtl' : 'ltr';
                          },

                          intersectsNode : function(node) {

                            var range = this.getCurrentRange(), found = null;
                            found = range.commonAncestorContainer;

                             if(range.intersectsNode) {
                                return range.intersectsNode(node);
                             }

                             while(found) {

                                if(found === node) {
                                   break;
                                }
                                found = found.parentNode;
                              }

                              return found ? true : false;
                          }
                  };


                  /* Editor Instance creator*/
                  function Editor(option) {

                            var that = this;
                            this.content = '';
                            this.tagOpen     = false;
                            this.fragment    = null;
                            this.dom         = {};
                            this.processors  = [];
                            this.callback    = [];
                            this.lastDisable = 0;
                            this.maxHeight = 0;

                            this.init = function (option) {

                                this.newLine     = option.newLine === false? false : true;
                                this.maxHeight   = option.maxHeight;
                                this.placeholder = option.placeholder || '';
                                this.isDisabled  = option.isDisabled || false;
                                this.emotion     = option.emotion ? option.emotion : null;

                                this.fragment = document.createDocumentFragment();

                                this.dom.placeholder = document.createElement('span');
                                this.dom.placeholder.setAttribute('data-placeholder', this.placeholder);
                                this.fragment.appendChild(this.dom.placeholder);

                                this.dom.editor = document.createElement('div');
                                this.dom.editor.setAttribute('contenteditable', 'true');
                                this.dom.editor.setAttribute('spellcheck', 'true');
                                this.dom.editor.setAttribute('data-editor', 'true');
                                this.dom.editor.setAttribute('class', 'editor');
                                this.fragment.appendChild(this.dom.editor);

                                if(this.emotion) {
                                   this.fragment.appendChild(this.emotion);
                                }

                               this.addProcessor('keydown', false, this.checkDisability, this);
                               this.addProcessor('keydown', 'enter',  this.checkNewLine, this);
                               this.addProcessor('both', 'enter,up,down', this.checkTag, this);

                               this.addCallback('keyup', 'delete,backspace', this.checkBR, this);
                               this.addCallback('keyup', false, this.addDelimiter, this);
                               this.addCallback('keydown', false, this.setPlaceholderContent, this);
                               this.addCallback('keyup', false, this.updateContent, this);

                              /*add an inital br node for positioning cursor correctly*/
                               this.addDelimiter();
                               this.initEvent();

                               if(this.maxHeight > 0) {
                                 this.dom.editor.style.maxHeight = this.maxHeight+'px';
                               }
                            };

                             this.addDelimiter = function () {

                               var text = this.dom.editor.innerText || this.dom.editor.textContent,
                                   textNode, firstChild;

                               firstChild = Utils.getFirstNode(this.dom.editor);

                               if(text.charCodeAt(0) != '8203') {
                                  textNode = document.createTextNode("\u200B");

                                  if(firstChild) {
                                     this.dom.editor.insertBefore(textNode,firstChild);
                                  }
                                  else {
                                     this.dom.editor.appendChild(textNode);
                                  }
                               }

                               /* add last zws*/
                               text = this.dom.editor.innerText || this.dom.editor.textContent;
                               if(text.length == 1 || text.charCodeAt(text.length-1) != '8203') {
                                  textNode = document.createTextNode("\u200B");
                                  this.dom.editor.appendChild(textNode);
                               }
                               /* append done */

                               firstChild = textNode= null;
                            };

                             this.addProcessor = function(event, action, fn, context) {
                                this.processors.push({'event':event, 'action':action, 'fn':fn, 'context':context});
                             };

                             this.addCallback = function(event, action, fn, context) {
                                this.callback.push({'event':event, 'action':action, 'fn':fn, 'context':context});
                             };

                             this.setFocus = function () {
                                Cursor.toElmentEnd(this.dom.editor, true);
                             };

                             this.showError = function () {
                                this.hideError();
                                this.dom.editor.className =  this.dom.editor.className+' error';
                             };

                             this.hideError = function () {
                                this.dom.editor.className =  this.dom.editor.className.replace('error','').trim();
                             };

                             this.enable = function () {
                                this.isDisabled = false;
                             };

                             this.disable = function () {
                                this.isDisabled = true;
                             };

                             this.set = function (content) {
                                if(!content) return;

                                /*revert to editor mode*/
                                content = content.replace(/\n/g, '<br />');
                                content = content.replace(/href="(.*?)"/g, 'href="#"');
                                content = content.replace(/<span/g, '<a href="#" onclick="return false" data-block="true"');
                                content = content.replace(/<\/span>/g, '</a>');
                                content = content.replace(/class="tag"/g, 'class="tag" onclick="return false" data-block="true"');
                                content = content.replace(/<a.*?class="feedanchor".*?>(.*?)<\/a>/g, '$1');



                                this.dom.editor.innerHTML = content;
                                this.updateContent();

                                this.addDelimiter();
                                Utils.adjustMarkup(this.dom.editor);
                             };

                             this.get = function () {
                                return this.content;
                             };

                             this.clear = function () {
                                this.dom.editor.innerHTML = '';
                                this.dom.placeholder.innerHTML = '';
                                this.updateContent();

                                this.addDelimiter();

                                $rootScope.unloadWarn = false;
                             };

                             this.setNewLineMode = function (mode) {
                                this.newLine = mode;
                             };

                             this.getNode = function () {
                                return this.fragment;
                             };

                             this.addEmoticon = function (code) {
                                Modifiers.setContainer(this.dom.editor, true);
                                Modifiers.addEmoticon(code, true);
                                this.updateContent();
                             };

                             this.addTag = function (user, filterFriend) {
                                Modifiers.setContainer(this.dom.editor, true);
                                Modifiers.addTag(user, filterFriend);
                                this.updateContent();
                             },

                             this.findWord = function (delimiter) {
                                return Utils.findCurrentWord(delimiter, this.dom.editor);
                             };

                             /* Methods for communicating externally*/
                             this.setPlaceholderContent = function(event, keyCode) {

                                if(event.ctrlKey || event.shiftKey || event.metaKey) return;

                                if(!keys[keyCode] && this.dom.placeholder.innerHTML == '') {
                                  this.dom.placeholder.innerHTML = String.fromCharCode(keyCode);
                                }
                             };

                             this.checkDisability = function (event, keyCode) {

                                 if(this.isDisabled) {
                                    event.preventDefault();
                                    this.lastDisable = new Date().getTime() / 1000;

                                    if(new Date().getTime() - this.lastDisable > 2000) {
                                      this.isDisabled = false;
                                    }

                                    return false;
                                 }

                                 return true;
                             };

                             this.checkTag = function (event, keyCode) {

                                  if(this.tagOpen) {
                                    event.preventDefault();
                                    return false;
                                 }

                                 return true;
                             };

                             this.checkNewLine = function (event, keyCode) {

                                 if(!this.newLine && !event.shiftKey && !event.ctrlKey) {
                                   event.preventDefault();
                                   return false;
                                 }

                                 return true;
                             };

                             this.checkBR = function (event, keyCode) {
                                /*Firefox oops! buggy.. inserting extra br if there is no node*/
                                if(this.dom.editor.firstElementChild && this.dom.editor.firstElementChild === this.dom.editor.lastElementChild && this.dom.editor.firstElementChild.nodeName.toLowerCase() =='br') {
                                   this.dom.editor.removeChild(this.dom.editor.firstElementChild);
                                }

                             }


                             this.updateContent = function (event, keyCode) {

                                    var content = this.dom.editor.innerHTML.replace(/<br>/g, '\n');
                                    content = content.replace(/&lt;/g,'<');
                                    content = content.replace(/&gt;/g,'>');
                                    content = content.replace(/&amp;/g,'&');
                                    content = content.replace(/&nbsp;/g, ' ');
                                    content = content.replace(/\u200B/g, '');
                                    content = content.replace(/\n{3,}/g, '\n\n');

                                    content = content.replace(dataBlockPattern,function(match,$1) {
                                        return isNaN($1)? $1 : '##'+$1+'##';
                                    });

                                    this.content = content.trim();

                                    var placeholder = this.dom.editor.innerHTML.replace(/<br>/g, '\n');
                                    placeholder = placeholder.replace(/&nbsp;/g, ' ');
                                    placeholder = placeholder.replace(/\u200B/g, '');
                                    placeholder = placeholder.replace(/\n{3,}/g, '\n\n');
                                    this.dom.placeholder.innerHTML = placeholder;

                                    if(this.onUpdate && typeof this.onUpdate == 'function') {
                                      this.onUpdate.call(null);
                                    }

                                    if(this.content != "") {
                                      $rootScope.unloadWarn = true;
                                    }
                                    else
                                    {
                                      $rootScope.unloadWarn = false;
                                    }

                              };

                             this.initEvent = function () {
                                    this.dom.editor.addEventListener('mouseup', mouseupCallback);
                                    this.dom.editor.addEventListener('keydown', keydownCallback);
                                    this.dom.editor.addEventListener('keyup', keyupCallback);
                                    this.dom.editor.addEventListener('dragover', dragoverCallback);
                                    this.dom.editor.addEventListener('drop', dropCallback);
                                    this.dom.editor.addEventListener('paste',  pasteCallback);
                                    this.dom.editor.addEventListener('cut',cutCallback);
                                    this.dom.editor.addEventListener('blur',blurCallback);
                             };

                            this.getPosition = function () {

                                var  x=0, y=0, rect =  this.dom.editor.getBoundingClientRect(),
                                rangeRect = Cursor.getCurrentRange().getClientRects();

                                x = rect.left;
                                y = rect.top;

                                if(rangeRect.length > 0) {
                                   rangeRect = rangeRect[0];
                                   x = rangeRect.left - x;
                                   y = rangeRect.top - y;
                                }

                                return {'x':x, 'y':y+12};
                            }

                            this.destroy = function () {
                                this.dom.editor.removeEventListener('mouseup', mouseupCallback);
                                this.dom.editor.removeEventListener('keydown', keydownCallback);
                                this.dom.editor.removeEventListener('keyup', keyupCallback);
                                this.dom.editor.removeEventListener('dragover', dragoverCallback);
                                this.dom.editor.removeEventListener('drop', dropCallback);
                                this.dom.editor.removeEventListener('paste', pasteCallback);
                                this.dom.editor.removeEventListener('cut', cutCallback);
                                this.dom.editor.removeEventListener('blur', blurCallback);
                                this.dom = that = null;
                                $rootScope.unloadWarn = false;
                            };

                            this.init(option);

                             /*Callback method*/
                             function mouseupCallback(e){
                                  Modifiers.init(that.dom.editor,'00',e, that.callback, that.processors);
                                  that.dom.placeholder.className = 'active';
                                  e.stopPropagation();
                             }

                             function keydownCallback(e) {
                                  e.stopPropagation();
                                  var keyCode = e.which || e.keyCode || e.key;
                                  Modifiers.init(that.dom.editor, keyCode, e, that.callback, that.processors);
                              }

                             function keyupCallback(e) {
                                  e.stopPropagation();
                                  var keyCode = e.which || e.keyCode || e.key;
                                  Modifiers.init(that.dom.editor, keyCode, e, that.callback, that.processors);
                              }

                              function blurCallback(e) {
                                 e.stopPropagation();
                                 e.preventDefault();
                                 that.dom.placeholder.className = '';
                              }

                              function dragoverCallback(e) {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  return false;
                              }

                              function dropCallback(e) {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  return false;
                              }

                              function pasteCallback(e) {

                                  e.stopPropagation();
                                  e.preventDefault();
                                  var text = '';

                                  if (e.clipboardData) {
                                      text = e.clipboardData.getData('text/plain');
                                    }
                                  else if (window.clipboardData) {
                                    try {
                                       text = window.clipboardData.getData('Text');
                                    } catch (e) {
                                       console.log('clipboard copy error');
                                    }
                                  }

                                  text = text.replace(/\n/g, '<br />');
                                  text = text.replace(/\s\s+/g, ' ');
                                  text = text.replace(/\u200B/g, '');
                                  Modifiers.paste(text);
                                  that.updateContent();
                              }

                             function cutCallback(e) {
                                  e.stopPropagation();
                                  that.updateContent();
                              }
                             /*End of callback*/
                    }


                  /*At last, lets focus on editor Provider actually huh!*/
                  var $editorProvider = {};
                  $editorProvider.create = function (option) {
                        var editor = new Editor(option);
                        return editor;
                    }

                  return $editorProvider;
        }];
    }



    rgEditor.$inject = ['$compile','$editor','SystemEvents'];

    function rgEditor( $compile, $editor,SystemEvents) {


        function link(scope, element, attrs) {


                  var editor, showSticker, option, DropdownFriendElement;

                      scope.filterFriend = "";
                      scope.editorContent = "";

                      showSticker = attrs['showSticker'] == "true" || attrs['showSticker'] === true ? 'true' : 'false';

                      option = {
                        'newLine': attrs['newLine'] == "false" || attrs['newLine'] === false ? false : true,
                        'placeholder': attrs['placeholder'] ? attrs['placeholder'] : '',
                        'isDisabled': attrs['isDisabled'] == "true" || attrs['newLine'] === true ? true : false,
                        'maxHeight': attrs['maxHeight'] ? parseInt(attrs['maxHeight']) : 0
                      };


                      if(attrs['showEmoji']) {
                          option['emotion'] = $compile('<a href="javascript:void(0)"><i class="img_sprite icon-emoticon ico-sty" rg-emoticon="" clicked="insertEmoji" show-sticker="'+showSticker+'"></i></a>')(scope)[0];
                          element.addClass('with_emo');
                      }

                      editor = $editor.create(option);
                      element.append(editor.getNode());
                      editor.onUpdate = updateContent;

                      scope.insertEmoji = function(emoticon) {
                         editor.addEmoticon(emoticon.symbol(),true);
                      }

                      scope.closeDropdownFriend = function() {

                         if(DropdownFriendElement){
                             DropdownFriendElement.remove();
                             DropdownFriendElement = undefined;
                          }

                          editor.tagOpen = false;
                      }

                      scope.chooseFriend = function(user, $event) {

                          if(scope.filterFriend) {
                              editor.addTag(user, scope.filterFriend);
                              scope.closeDropdownFriend();
                          }
                       };


                       function processAtTagFriend(e, keyCode) {

                           scope.filterFriend = editor.findWord('@');

                           if(keyCode == 32) scope.filterFriend = "";

                           if(scope.filterFriend == "" && DropdownFriendElement){
                              scope.closeDropdownFriend();
                           }

                           if(scope.filterFriend && !DropdownFriendElement){
                              DropdownFriendElement = $compile('<rg-friend-dropdown template-url="templates/dropdowns/tag-editor-dropdown.html" tag-items="[]" filter-text="filterFriend" focus-filter="" on-close="closeDropdownFriend" on-select="chooseFriend"></rg-friend-dropdown>')(scope);
                              element.after(DropdownFriendElement);

                              var pos = editor.getPosition();
                              DropdownFriendElement.css({'position':'absolute','left':pos.x+'px', 'top': pos.y+'px'});
                           }

                           if(DropdownFriendElement) {

                               editor.tagOpen = true;

                               /* Close dropdown if click on document*/
                               document.addEventListener('click', function friendDDCallback(e) {
                                  if(DropdownFriendElement && e.target !== DropdownFriendElement[0]) {
                                     scope.closeDropdownFriend();
                                  }
                                  document.removeEventListener('click', friendDDCallback);
                               }, false);
                           }

                        }

                        function tagKeyHander(e, keyCode) {
                           if(DropdownFriendElement) {
                             e.preventDefault();
                             DropdownFriendElement.triggerHandler(e,keyCode);
                           }

                           return true;
                        }

                        function updateContent(e, keyCode) {

                           scope.editorContent = editor.get();

                           if(scope.$parent && scope.$parent.$id !==1){
                                scope.$parent.$rgDigest();
                            } else{
                                scope.$rgDigest();
                            }
                        }

          						if(attrs['onRingbox']){
          								editor.addCallback('keydown', false, function(event, keyCode) {
          										scope.$emit(SystemEvents.RINGBOX.UPDATE);//for Ringbox Hieght Change
          								});
          						 }

        						  if(attrs['tagFriend']) {
        								  editor.addCallback('keyup', false, processAtTagFriend, null);
        								  editor.addCallback('keyup', 'escape', scope.closeDropdownFriend, scope);
        								  editor.addProcessor('keydown', 'up,down,enter', tagKeyHander, null);
                       }

                       if (attrs['onEscape']) {
                           editor.addCallback('keyup', 'escape', scope.onEscape(), scope);
                       }

                       if (attrs['onEnter']) {

                           editor.addProcessor('keydown', 'enter', function(event, keyCode) {
                                if(option.newLine === false && !event.shiftKey && !event.ctrlKey) {
                                   scope.onEnter()(scope.onEnterArg);
                                   return false;
                                }
                                return true;
                            });
                       }


                      /* this is basically making editor empty when post a feed*/
                        scope.$on('cleareditor', function () {
                            editor.clear();
                        });

                        scope.$on('seteditor', function (e,content) {
                            content = content || scope.editorContent;
                            editor.set(content);
                        });

                        /* It is a scope properties. It will make editor disabled from typing */
                        scope.$watch('isDisabled', function (value) {

                             if(!!value) {
                                editor.disable();
                                editor.clear();
                             }
                             else {
                               editor.enable();
                             }
                        });

                        /*on focus*/
                        if (attrs['focus']) {
                            scope.$watch('focus', function (value) {
                                if (value) {
                                    setTimeout(function () {
                                        editor.setFocus();
                                    }, 0);

                                    /*fetch data on edit mode*/
                                    if (attrs['editMode']) {
                                      editor.set(scope.editMode()().toString());
                                    }
                                }
                            });
                        }
						      // ####

                  /*On scope destry, clear resource*/
                  scope.$on("$destroy",function(){
                      editor.destroy();
                      editor = option = DropdownFriendElement = null;
                  });

              }

        return {
            scope: {
                editorContent: '=',
                onEnter: '&',
                onEscape: '&',
                onEnterArg: '=',
                isDisabled: '=',
                focus: '=',
                editMode: '&'
            },
            restrict: 'E',
            link: link
        }
    }
