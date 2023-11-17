/**
 * © Ipvision
 *public static final int ACTION_SPAM_REASON_LIST = 1001;
Sending data for action 1001

{"pckId":"14633967158912110000087","actn":1001,"sId":"426416336646596312110000087","spmt":1}
Received data for action 1001

{"seq":"1/1","rsnLst":[{"id":2,"rsn":"It is for harresment"},{"id":1,"rsn":"Uncensored content"}],"sucs":true,"tr":2}
public static final int ACTION_REPORT_SPAM = 1002;
Sending data for action 1002

{"pckId":"14633967710002110000087","spmt":2,"actn":1002,"sId":"426416336646596312110000087","spmid":698765,"rsnid":1}
Received data for action 1002

{"sucs":true,"rc":0,"spmid":698765,"spmt":2}
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *  spmt= SpamType (SPAM_USER:1/SPAM_FEED:2/SPAM_IMAGE:3/SPAM_MEDIA_CONTENT:4)

    rsnLst=Reason List

    rsn=Reason

    spmid=SpamID (userid/newsfeed/image/mediacontent ID)

    rsnid=ReasonID (got from reason list [action 1001])
 */


    angular
        .module('ringid.directives')
        .factory('ReportHttpService',ReportHttpService)
        .controller('ReportController',ReportController)
        .directive('rgReport', rgReport)
        ReportHttpService.$inject = ['$$connector','$$q','OPERATION_TYPES','SPAM_TYPES'];
        function ReportHttpService($$connector,$q,OPERATION_TYPES,SPAM_TYPES){
                  var OTYPES = OPERATION_TYPES.SYSTEM.REPORT,ob;
                      var SPAM_REASON_LIST = {};
                    ob = {
                        getSpamReasonList : getSpamReasonList,
                        reportSpam : reportSpam
                    };


                function getSpamReasonList(stringSpamType){
                    var defer = $q.defer();
                    if(!stringSpamType || typeof stringSpamType !== "string"){
                      throw new Error("PARAMS_ERROR SPAM_TYPE Must be string");
                    }
                    var spam_type = SPAM_TYPES[stringSpamType.toUpperCase()];
                    if(SPAM_REASON_LIST[spam_type]){
                      setTimeout(function(){
                          defer.resolve(SPAM_REASON_LIST[spam_type]);
                      });
                    }else{
                        $$connector.pull({
                            actn : OTYPES.ACTION_SPAM_REASON_LIST,
                            spmt : spam_type
                        },OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST).then(function(json){
                            if(json.sucs){
                               SPAM_REASON_LIST[spam_type] = json.rsnLst;
                               defer.resolve(SPAM_REASON_LIST[spam_type]);
                            }else{
                              defer.reject(json);
                            }
                        },function(json){
                          defer.reject(json);
                        });
                    }
                    return defer.promise;
                }

                function reportSpam(ob){
                    if(!ob.spmt || !ob.spmid || !ob.rsnid){
                      throw new Error("PARAMS_ERROR");
                    }
                    var payload = {
                      actn : OTYPES.ACTION_REPORT_SPAM,
                      spmt : SPAM_TYPES[ob.spmt],
                      spmid : ob.spmid,
                      rsnid : ob.rsnid
                    };
                    return $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE);
                 }


          return ob;
        }



ReportController.$inject = ['$scope','remoteData','ReportHttpService','Ringalert'];
function ReportController($scope,remoteData,ReportHttpService,Ringalert){
    $scope.title = 'Let us know why that\'s bothers you !';
    $scope.spamList = remoteData;
    $scope.reason = $scope.spamList[0].id;
     
    // ####
   $scope.report = function(){
     
     if(!$scope.reason){
        $scope.error = "Please choose one reason";
        return;
     }

     ReportHttpService.reportSpam({
          spmt : $scope.spamType.toUpperCase(),
          spmid : $scope.spamId,
          rsnid : $scope.reason
     }).then(function(json){
           
            $scope.$close();
           if(json.sucs){
               var ob = {
					   title : 'Done!',
					   message : json.mg,
					   showCancel : false
			   };
               Ringalert.alert(ob);
           }else{
               Ringalert.show(json,"error");
              // $scope.error =
           }
     });
   }

}





        rgReport.$inject = ['$ringbox',"ReportHttpService","rgDropdownService","SPAM_TYPES"];
        function rgReport($ringbox,ReportHttpService,rgDropdownService,SPAM_TYPES) {



            return {
                restrict: 'EA',
                scope : {
                    spamId : '=',
                    spamType : '@'
                },
                link : function(scope,element,attr){

                    function MainFunction(e){
                       
                       rgDropdownService.close(e);

                         var boxInstance = $ringbox.open({
                                  type : 'remote',
                                  scope:scope,
                                  controller: 'ReportController',
                                  resolve : {
                                      remoteData : ReportHttpService.getSpamReasonList(scope.spamType)
                                  },
                                  templateUrl : 'templates/popups/rg-report.html'
                          });

                          boxInstance.result.then(function(confirmed){
                              // if(confirmed){
                              //     feedFactory.deleteFeed($scope.currentUser, key).then(function (json) {
                              //         $scope.setFeed(true);
                              //         Ringalert.show(json,'success');
                              //     }, function(errJson){
                              //         $scope.setFeed(true);
                              //         Ringalert.show(errJson,'error');
                              //     });
                              // }
                          });
                    }

                    element.on("click",MainFunction);

                    // ####
                }
            };
        }

