angular.module('serverManageApp').factory('httpService', httpService);

httpService.$inject = ['$http'];

function httpService($http){
	var ajaxObject = {
		ajaxCall:		ajaxCall,
		timeAjaxCall:	timeAjaxCall
	};

	function timeAjaxCall(method, baseUrl, componentUrl){
		
	return $http({
		method:		method,
		url:		baseUrl + componentUrl,
		datatype:	"json",
		headers:	{
			'Content-type': 'application/json'
		}

		})
		.then(fetchDataComplete, fetchDataFailed);

	
	function fetchDataComplete(response){
		return response.data;
	}
	function fetchDataFailed(error){
		return;
	}
	}
	
	function ajaxCall(method, baseUrl, componentUrl, clickVar){
		
	return $http({
		method:		method,
		url:		baseUrl + componentUrl,
		datatype:	"json",
		data:		clickVar,
		headers:	{
			'Content-type': 'application/json'
		}

		})
		.then(fetchDataComplete, fetchDataFailed);
		

	
	function fetchDataComplete(response){
		return response.data;
	}
	function fetchDataFailed(error){
		return;
	}
	}
	
	return ajaxObject;
}