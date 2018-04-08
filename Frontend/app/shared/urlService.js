angular.module('serverManageApp').factory('urlService', urlService);

function urlService(){
	var urlList = {
		getBaseUrl:getBaseUrl(),
		getTrainUrl:getTrainUrl(),
		getTestUrl:getTestUrl()
	}
	
 	 function getBaseUrl(){
		 return 'http://127.0.0.1:5000/';
	 }
	 
	 function getTestUrl(){
		 return 'test';
	 }
	 function getTrainUrl(){
		 return 'train';
	 }
	
	return urlList;
}