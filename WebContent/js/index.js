var app = angular.module('ui.bootstrap.demo', ['ngAnimate', 'ui.bootstrap', 'ngCookies']);
app.controller('TypeaheadCtrl', function($scope, $cookieStore, $location, $window, $http) {

  var _selected;

  $scope.selected = undefined;
  // Any function returning a promise object can be used to load values asynchronously
  $scope.getLocation = function(val) {
    return $http.get($location.path() + 'webservices/getAllSearchTexts', {
      params: {
    	searchText: val,
        sensor: false
      }
    }).then(function(response){
        return response.data.map(function(item){
            return item.text;
          });
        });
  };
	
	$scope.init = function () {
		
	};
	
	$scope.getPosts = function () {

		$http.get($location.path() + 'webservices/getAllPosts?searchText=' + $scope.asyncSelected).
	    success(function(data, status, headers, config) {	
	    	$scope.posts = data;
	    	angular.forEach($scope.posts, function(post, key) {
	    		  post.groupID = post.id.split("_")[0];
	    		  post.fbid = post.id.split("_")[1];	
	    		  
	    		});
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
		
	};

});
