angular.module('serverManageApp').factory('fetchDataService', fetchDataService);

fetchDataService.$inject = ['httpService','$http','urlService','$rootScope'];

function fetchDataService(httpService, $http, urlService, $rootScope){
	var fetchDataMethods = {};
	
	fetchDataMethods = {
		getData:getData
	};
	
	
	function getData(method, baseUrl, componentUrl, clickVar){
		return(httpService.ajaxCall(method, baseUrl, componentUrl, clickVar));
	}
	
	return fetchDataMethods;
}