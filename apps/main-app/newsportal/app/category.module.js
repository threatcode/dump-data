
   window.catModule = function(utils){
    function getTypeCategory(actn) {
        console.log('Action : ',actn);
        // return false;
        var catData = {};
        catData.actn = actn;
        catData.lmt = 100;
        catData.pckId = utils.getUniqueId();
        catData.utId = StorageFactory.getCookie('utId');

        console.log('category type list::::::::::::::',catData);

        return $$connector.send(catData,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.REQUEST);
    }
       function saveDataToLocalStorage(json,tr,key) {
           var data = utils.StorageFactory.getData(key);
           if(data) {
               if(data.length<tr){
                   for (var i=0;i<json.length; i++){
                       data.push(json[i]);
                   }
                   utils.StorageFactory.setData(key,data);
               }

           } else {
               utils.StorageFactory.setData(key,json);
           }
           //This portion will be changed later and it's too much coupled now. And it need to fixed with pubsub model
           if(key == 'catList') {

               var categoryPost = $('#categoryPost');
               var categorySearch = $('#categorySearch');
               categoryPost.html(generateCategoryListSelectBox('catList'));
               categorySearch.html(generateCategoryListSelectBox('catList'));
           }
           if(key == 'portalCatList') {
               $('#portalCategory').html(generateCategoryListSelectBox('portalCatList'));
           }
       }

       function generateCategoryListSelectBox (type,id) {
           var list = utils.StorageFactory.getData(type);

           if(!list) {
               console.log('No category found');
               return '';
           }
           var name = '';
           var optionText = '';
           if(type == 'catList') {
               name = 'catName';
               optionText = 'Select category';
           } else if(type == 'portalCatList') {
               name = 'name';
               optionText = 'N/A';
           }

           var catid = '';
           if(id) {
               catid = id;
           }
           var listLength = list.length;
           var option = '<option value="">'+optionText+'</option>';
           for (var i=0;i<listLength; i++){
               if(list[i].id == catid) {
                   option+='<option selected value="'+list[i].id+'">'+list[i][name]+'</option>>';
               } else {
                   option+='<option value="'+list[i].id+'">'+list[i][name]+'</option>>';
               }
           }
         return option;
       }

       function categoryWarningModal() {
           // return false;// for testing purposes
           swal({
               type:'info',
               title:'No category created',
               text:'Please insert category through manage category section, otherwise you can\'t post news'
           }).then(function () {
               window.location.href = '/category.html';
           });
       }

       function manageCategory(json) {

           // alert(json.sucs);
           if(!json.sucs) {
               categoryWarningModal();
               return false;
           }
           var catList = json.nCatList;

           if (typeof catList == "undefined") {
               categoryWarningModal();
               return false;
           }
           if(catList.length) {
               var totalRow = json.tr;
               saveDataToLocalStorage(catList,totalRow,'catList');
           }
       }
       function manageType(json) {
           if(!json.sucs) return;
           var typeList = json.nTypeList;
           if(!typeList) return;
           var typeLength = typeList.length;
           if(typeLength>0){
               var totalRow = json.tr;
               saveDataToLocalStorage(typeList,totalRow,'typeList');
           }
       }

       function managePortalCategory(json) {
           console.log('manage portal category response::::');
           if(!json.sucs) return;
           var portalCatList = json.nPortalCatList;
           if(!portalCatList) return;
           var portalCatListLength = portalCatList.length;
           if(portalCatListLength>0){
               var totalRow = json.tr;
               saveDataToLocalStorage(portalCatList,totalRow,'portalCatList');
           }
       }
       
       function populateTypeList() {
           var typeList = utils.StorageFactory.getData('typeList');
           if(!typeList) return false;
           var typeSelect = $('#typeSelect');
           var typeLength = typeList.length;
           var option = '<option value="" disabled selected>Select Type</option>';
            for(var i=0;i<typeLength;i++){
                option += ' <option value="'+typeList[i].id+'">'+typeList[i].name+'</option>';
            }
           typeSelect.html(option);
       }
       function getTypeNameFromId(id){
           var typeList = utils.StorageFactory.getData('typeList');
           if(!typeList) {
               console.log('No type found');
               return;
           }
           var typeLength = typeList.length;
           for(var i=0;i<typeLength;i++){
              if(typeList[i].id == id) {
                  return typeList[i].name;
              }
           }
           return '';
       }
       function populateCategoryList() {
           // console.warn('populating cat list');
           var noCategoryCreatedYet = $('#noCategoryCreatedYet');
           var catList = utils.StorageFactory.getData('catList');
           if(!catList) {
               console.log('No category found');
               noCategoryCreatedYet.show();
               return;
           }
           var catListLength = catList.length;
           var categoryTable = $('#categoryTable > tbody');
           var tr = '';
           for (var i=0;i<catListLength; i++){
               tr += '<tr><td>'+catList[i].catName+'</td>' +
                   '<td>'+getTypeNameFromId(catList[i].type)+'</td>' +
                   '<td><a href=""><a data-type-id="'+catList[i].type+'" data-cat-name="'+catList[i].catName+'" data-cat-id="'+catList[i].id+'"  data-tool="Edit" class="editCategory top-r"><img src="images/edit.png"/></a>' +
                   '<a data-cat-id="'+catList[i].id+'"  data-tool="Delete" class="deleteCategory top-r"><img src="images/delete.png"/></a></td></tr>'
           }
           noCategoryCreatedYet.hide();
           categoryTable.html('');
           categoryTable.html(tr);
       }
       
       function addDeleteCategory(payload) {

           payload.actn = 292;
           payload.pckId = utils.getUniqueId();

           console.log(payload);
           return $$connector.request(payload,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE);
       }
       $$connector.keepAlive();
       return {
           getCategoryList: function (actn) {
             return  getTypeCategory(actn);
           },
           getTypeList: function (actn) {
               return getTypeCategory(actn)
           },
           getCatListFormStorage:function () {
               var catList = utils.StorageFactory.getData('catList');
               if(!catList) {
                   console.log('No category found');
                   return '';
               }
               var catListLength = catList.length;

               return {list:catList,len:catListLength};
           },
           getCategoryNameById:function(catId){
               var catObj = this.getCatListFormStorage();
               for (var i=0;i<catObj.len; i++){
                   if(catObj.list[i].id == catId) {
                       return catObj.list[i].catName;
                   }
               }
               return '';
           },
           addCatToStorage:function (itemName,itemId,typeId) {
               var catObj = this.getCatListFormStorage();
               var itemToAdd = [{id:itemId,catName:itemName,type:typeId}];
               var totalRow = catObj.len+1;
               saveDataToLocalStorage(itemToAdd,totalRow,'catList');
           },
           updateCatToStorage:function (itemName,itemId,typeId) {
               // var catObj = this.getCatListFormStorage();
               //First remove it from local storage, then insert it
               this.removeCatFromStorage(itemId);
               this.addCatToStorage(itemName,itemId,typeId);
           },
           removeCatFromStorage:function (itemId) {
               var catObj = this.getCatListFormStorage();
               for (var i=0;i<catObj.len; i++){
                   if(catObj.list[i].id == itemId) {
                       catObj.list.splice(i,1);
                       break;
                   }
               }
               console.log('catList after splice:::::::::::',catObj.list);
               // utils.StorageFactory.deleteData('catList');
               utils.StorageFactory.setData('catList', catObj.list);
           },
           // manageCategory:manageCategory,
           // manageType:manageType,
           addCategory:function(name,typeId){
               var payload = {
                   nCatDTO:{
                       catName:name.utf8Encode(),
                       type:typeId
                   },
                   optn: 1
               };
              return addDeleteCategory(payload);
           },
           deleteCategory:function (id) {
               var payload = {
                   nCatDTO:{
                       id:id
                   },
                   optn: 3
               };
               return addDeleteCategory(payload);
           },
           populateCategoryList:populateCategoryList,
           populateTypeList:populateTypeList,
           callTypeCategoryList:function() {


               // News category list:::::::::::::::::::::::::
                if(!utils.StorageFactory.getData('catList')){
                    this.getCategoryList(NEWS_PORTAL.CATEGORY.LIST);
                    $$connector.subscribe(manageCategory, {
                        action: NEWS_PORTAL.CATEGORY.LIST
                    });

                }
               //News type list:::::::::::::::::::::::::::::
               if(!utils.StorageFactory.getData('typeList')) {
                   this.getTypeList(NEWS_PORTAL.TYPE.LIST);
                   $$connector.subscribe(manageType, {
                       action: NEWS_PORTAL.TYPE.LIST
                   });
               }
                // Portal category list:::::::::::::::::
               if(!utils.StorageFactory.getData('portalCatList')) {
                   this.getTypeList(301);
                   $$connector.subscribe(managePortalCategory, {
                       action: 301
                   });
               }
           },
           updateCategory:function (name, catId, typeId) {
               var catData = {};
               catData.nCatDTO = {
                   id:catId,
                   catName:name.utf8Encode(),
                   type:typeId
               };
               catData.actn = NEWS_PORTAL.CATEGORY.UPDATE;
               catData.pckId = utils.getUniqueId();

               return $$connector.request(catData,OPERATION_TYPES.SYSTEM.REQUEST_TYPE.UPDATE);
           },
           getTypeNameFromId:getTypeNameFromId,
           generateCategoryListSelectBox: generateCategoryListSelectBox

       }
   }(portalUtils);
   $$connector.keepAlive();

