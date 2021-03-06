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

		$http.get($location.path() + 'webservices/getAllPosts', {
		      params: {
			      	searchText: $scope.asyncSelected,
			      	excludingKeywords: $scope.excludingKeywords,
			      	startDate: $scope.dt,
			      	endDate: $scope.endDate,
		          sensor: false
		        }
		      }).
	    success(function(data, status, headers, config) {	
	    	$scope.posts = data;
	    	angular.forEach($scope.posts, function(post, key) {
	    		  post.groupID = post.id.split("_")[0];
	    		  post.fbid = post.id.split("_")[1];
	    		  post.updated_time = new Date(post.updated_time);
	    		});
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
		
	};
	
	$scope.fetchPosts = function () {

		$http.get($location.path() + 'webservices/fetchPostsManually', {
		      params: {
		    	    numberOfDaysOfPostsToBeFetched: $scope.numberOfDaysOfPostsToBeFetched,
			      	fb_access_token_page: $scope.fb_access_token_page,
		            sensor: false
		        }
		      }).
	    success(function(data, status, headers, config) {
	    	
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
		
	};
	
	// datepicker
	
	$scope.today = function() {
	    $scope.dt = new Date();
	    $scope.endDate = new Date();
	  };
	  $scope.today();

	  $scope.clear = function() {
		    $scope.dt = null;
		    $scope.endDate = null;
	  };

	  $scope.inlineOptions = {
	    customClass: getDayClass,
	    minDate: new Date(),
	    showWeeks: true
	  };

	  $scope.dateOptions = {
	    dateDisabled: disabled,
	    formatYear: 'yy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(),
	    startingDay: 1
	  };

	  // Disable weekend selection
	  function disabled(data) {
	    var date = data.date,
	      mode = data.mode;
	    return mode === 'day' && (date.getDay() === 7 || date.getDay() === 7);
	  }

	  $scope.toggleMin = function() {
	    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
	    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
	  };

	  $scope.toggleMin();

	  $scope.open1 = function() {
	    $scope.popup1.opened = true;
	  };
	  
	  $scope.open2 = function() {
		    $scope.popup2.opened = true;
		  };

	  $scope.setDate = function(year, month, day) {
		    $scope.dt = new Date(year, month, day);
		    $scope.endDate = new Date(year, month, day);
	  };

	  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	  $scope.format = $scope.formats[0];
	  $scope.altInputFormats = ['M!/d!/yyyy'];

	  $scope.popup1 = {
	    opened: false
	  };
	  
	  $scope.popup2 = {
			    opened: false
			  };

	  var tomorrow = new Date();
	  tomorrow.setDate(tomorrow.getDate() + 1);
	  var afterTomorrow = new Date();
	  afterTomorrow.setDate(tomorrow.getDate() + 1);
	  $scope.events = [
	    {
	      date: tomorrow,
	      status: 'full'
	    },
	    {
	      date: afterTomorrow,
	      status: 'partially'
	    }
	  ];

	  function getDayClass(data) {
	    var date = data.date,
	      mode = data.mode;
	    if (mode === 'day') {
	      var dayToCheck = new Date(date).setHours(0,0,0,0);

	      for (var i = 0; i < $scope.events.length; i++) {
	        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

	        if (dayToCheck === currentDay) {
	          return $scope.events[i].status;
	        }
	      }
	    }

	    return '';
	  }

});
