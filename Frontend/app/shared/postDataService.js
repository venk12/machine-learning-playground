angular.module('serverManageApp').factory('postDataService', postDataService);

function postDataService(){
	var postParamMethods = {};
	
		postParamMethods = {
			getPostData 		: getPostData,
			setPostData 		: setPostData
		}
	
		var postData = [{
				x:0,
				y:0,
				dx:0,
				dy:0,
				paddleX:0,
				flag:0,
				trainOrTest:0
		 }]; 

	function getPostData(){
		return postData;
	}
	
	function setPostData(value){
		postData = value;
	}
	
	return postParamMethods;
}