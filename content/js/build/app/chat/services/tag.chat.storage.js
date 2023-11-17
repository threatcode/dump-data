/*
 * © Ipvision
 * @Ibrahim Rashid
 * Tyring to build an optimized serializer for localstorage
 */


	angular
        .module('ringid.chat')
		.factory('tagChatStorage', tagChatStorage);

		tagChatStorage.$inject = [
			'Storage', 'Auth', 'Utils'

		];

		function tagChatStorage(
			Storage, Auth, Utils

		) {

			var StorageObjectModel = {
				packets : {}
			};

			function _init(){
				var localStorageObjectModel = __readFromLocalStorage();
				if(!localStorageObjectModel){
					__writeToLocalStorage(StorageObjectModel );
				}else{
					StorageObjectModel  = angular.fromJson(localStorageObjectModel);
				}

			}

			function _getStoreKey(){
				return 'tagc-store-' + Auth.currentUser().getKey();
			}

			function __writeToLocalStorage(data){
				Storage.setData(_getStoreKey(), angular.toJson(data));
			}

			function __readFromLocalStorage(){
				return Storage.getData(_getStoreKey());
			}

			function _savePacket(packetId, packetData){
				StorageObjectModel.packets[packetId] = Utils.arrayBuffer2String(packetData.buffer.slice(6));
				__writeToLocalStorage(StorageObjectModel);
			}

			function _getPacket(packetId){
				return Utils.string2ArrayBuffer(StorageObjectModel.packets[packetId]);
			}

			function _getAllPackets(){
				return StorageObjectModel.packets;
			}

			if(Auth.isLoggedIn()){
				//_init();
			}

			return {

				savePacket : _savePacket,
				getPacket  : _getPacket,
				getAllPackets : _getAllPackets
			}



		}
