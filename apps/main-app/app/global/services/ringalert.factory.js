    angular
        .module('ringid.global_services')
        .factory('Ringalert', Ringalert);

        Ringalert.$inject = ['$ringbox','Notification','MESSAGES'];
       function Ringalert($ringbox,Notification,MESSAGES){
           /*
               Notification factory API's
               Notification(), Notification.primary()	Show the message with bootstrap's primary class
               Notification.info()	Show the message with bootstrap's info class
               Notification.success()	Show the message with bootstrap's success class
               Notification.warning()	Show the message with bootstrap's warn class
               Notification.error()	Show the message with bootstrap's danger class
               Notification.clearAll()	Remove all shown messages
           */
           var defaultNotificationOptions = {
                delay : 3000,
                positionX : 'right',
                positionY : 'top',
                replaceMessage : true
           };
           var defaultAlertOptions = {
                title : 'Warning',
                message : 'Click ok to continue',
                showOk : true,
                showCancel : true,
                craac : false, //close ringbox after action
                textOk : 'OK',
                textCancel : 'Cancel',
                okCallback : angular.noop,
                cencelCallback : angular.noop
           };
           return {
               show : function(messageObject,type){//message is either object or string
                    type = type || 'info';//Notification property default we shows info
                    if(angular.isString(messageObject)){
                        messageObject = {
                            message : messageObject
                        };
                    }
                    messageObject.message = messageObject.message || messageObject.mg;
                   if(!messageObject.message){
                       if('success' === type){
                           messageObject.message = MESSAGES.REQUEST_PROCESSED;
                       }else if('error' === type){
                           messageObject.message = MESSAGES.REQUEST_FAILED;
                       }
                   }
                   try{
                        Notification[type](angular.extend({},defaultNotificationOptions,messageObject));
                   }catch(e){
                       console.info(messageObject.message);
                   }

               },
               clear : function(){
                   Notification.clearAll();
               },
               alert  :function(ob){
                  ob = ob || {};
                  ob = angular.extend({},defaultAlertOptions, ob);

                     var boxInstance = $ringbox.open({
                        type : 'remote',
                        scope:false,
                        scopeData : ob,
                        templateUrl : ob.templateUrl || 'templates/popups/ring-alert.html'
                      });

               boxInstance.result.then(function(data){
                  var check = typeof data === "string" ? data : data.sucs;
                  if(check === 'ok' && angular.isFunction(ob.okCallback)){
                      ob.okCallback.call(null,data);
                  }else{
                      ob.cencelCallback.call(null,data);
                  }
               });


               }
           };
       }
