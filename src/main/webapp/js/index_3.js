var app = angular.module('ui.bootstrap.demo', ['ui.bootstrap', 'ngCookies']);

app.controller('TabsDemoCtrl', function ($scope, $cookieStore, $location, $window, $modal, $http) {
	// TODO - user var for now for searchView property, since primitive has problem with tabset scope
	$scope.user = $cookieStore.get("user");
	$scope.fbAppID = '1383045038690359'; //TODO - this is repeating, there in fbAsync init. also have global variable something
	$scope.fbAppSecret = 'a16edc7d8f94f3239046c018ea529816';
	$scope.init = function () {
		if($scope.user) {
			$scope.getCategories();
			// TODO - remove following
			$scope.user.selectedFeedForTrends = {};
			$scope.user.selectedFeedIntervalForTrends = 0;
		}
	};
	  
	// TEMP
	$scope.searchArticlesResult = [];
	// NOTE - earlier, this scope var was not working, until declared here
	$scope.searchText = null;
	
	$scope.oneAtATime = true;
	
	// for Sign up collapse
	$scope.isCollapsed = true;

	$scope.status = {
	    isFirstOpen: true,
	    isFirstDisabled: false
	};
	
	$scope.intervalsListForTrends = [("1", "day"), ("2", "month"), ("3", "year")];
	
	// TEMP, check
	$scope.opmlFileToBeUploaded = {};
	$scope.opmlFileToBeUploaded.src = "";
	
	$scope.signup = function () {
		// TODO - password var.s from scope remove after this, for security reasons obv.
		if ($scope.signuppassword == $scope.confirmsignuppassword) {
			$http.get($location.path() + 'webservices/createUser?email=' + $scope.signupemail + "&password=" + $scope.signuppassword + "&firstName=" + $scope.signupfirstname + "&lastName=" + $scope.signuplastname).
		    success(function(data, status, headers, config) {	
		    	$scope.user = data;
		    	$cookieStore.put("user", $scope.user);
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		    });
		}		
	};
	
	$scope.submit = function () {
		// TODO - email, password should not be in model, in form etc, maybe, rectify
		$http.get($location.path() + 'webservices/getUser?email=' + $scope.email + "&password=" + $scope.password).
	    success(function(data, status, headers, config) {	
	    	$scope.user = angular.copy(data);
	    	$cookieStore.put("user", $scope.user);
	    	$scope.updateArticlesList(-1, null);
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
	};
	
	// TODO - temp
	$scope.loginWithFB = function (accountVO) {
		
		$http.post($location.path() + 'webservices/loginWithFB', accountVO.sessionToken).success(function(data, status) {
        });
	};
	
	$scope.logout = function () {
		// TODO - proper logout, think how, cookie, session etc, rectify
		$http.get($location.path() + 'webservices/logout?email=' + $scope.email + "&sessionToken=" + $scope.user.sessionToken).
	    success(function(data, status, headers, config) {
	      $scope.user = null;
	      $cookieStore.put("user", null);
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
	};
	
	$scope.getCategories = function () {
		$http.get($location.path() + 'webservices/getCategories?sessionToken=' + $scope.user.sessionToken).
	    success(function(data, status, headers, config) {	
	    	$scope.user.categories = data;	
	    	$scope.updateArticlesList(-1, null);
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
	};
	
	$scope.deleteCategory = function () {
	  	var categoryTBD = $scope.user.categories[$scope.selectedCategoryIndex];
		$http.get($location.path() + 'webservices/deleteCategory?categoryID=' + categoryTBD.id + "&sessionToken=" + $scope.user.sessionToken).
	    success(function(data, status, headers, config) {
			  if(data == 1) {						
				  $scope.user.categories.splice($scope.selectedCategoryIndex, 1);
				  $scope.updateArticlesList(-1, null);
			  }
		  }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
	};
	
	// TODO - try, move to feeds.js. Also, clean, remove items var etc, know functionality
	  $scope.addFeed = function (size) {

	    var modalInstance = $modal.open({
	      templateUrl: 'myModalContent.html',
	      controller: 'ModalInstanceCtrl',
	      size: size,
	      resolve: {
	    	  editId: function () {
	              return '';
	            }
	      }
	    });
	    
	    modalInstance.result.then(function (feed) {
	    	// TODO - right way to set category
	    	// TODO - merge this and editFeed method's contents
	    	var feedCategory = null;
	    	angular.forEach($scope.user.categories, function(category, key) {
	    		  if (category.name == feed.category) {
	    			  feedCategory = category;
	    			  // TODO - break from loop after this
	    		  };
	    		});
	    	if(!feedCategory) {
	    		$http.get($location.path() + 'webservices/createCategory?name=' + feed.category + "&sessionToken=" + $scope.user.sessionToken).
		        success(function(data, status, headers, config) {
		        	feedCategory = data;
		        	$scope.user.categories.push(feedCategory);
		        	
		        	// TODO - repeating this code from the else condition. correct way later. same for editFeed
		        	$http.get($location.path() + 'webservices/createFeed?feedURL=' + feed.fURL + "&feedName=" + feed.name + "&categoryID=" + feedCategory.id + "&sessionToken=" + $scope.user.sessionToken).
			        success(function(data, status, headers, config) {
			        	feedCategory.feeds.push(data);
			        	var categoryIndex = $scope.user.categories.indexOf(feedCategory);
			    	    var feedIndex = feedCategory.feeds.length - 1;
			    		$scope.updateArticlesList(categoryIndex, feedIndex);
			        }).
			        error(function(data, status, headers, config) {
			          // log error
			        });
		        	//
		        }).
		        error(function(data, status, headers, config) {
		          // log error
		        });
	    	} else {
	    		$http.get($location.path() + 'webservices/createFeed?feedURL=' + feed.fURL + "&feedName=" + feed.name + "&categoryID=" + feedCategory.id + "&sessionToken=" + $scope.user.sessionToken).
		        success(function(data, status, headers, config) {
		        	feedCategory.feeds.push(data);
		        	var categoryIndex = $scope.user.categories.indexOf(feedCategory);
		    	    var feedIndex = feedCategory.feeds.length - 1;
		    		$scope.updateArticlesList(categoryIndex, feedIndex);
		        }).
		        error(function(data, status, headers, config) {
		          // log error
		        });
	    	}
	    	
	    	
	    	
	      }, function () {
	      });
	  };

	  $scope.editFeed = function (feedIndex, categoryIndex, size) {
		  // TOTO - proper way to retain or change category of the edited feed
		  var currentCategory = $scope.user.categories[categoryIndex];
		  var feedTBE = currentCategory.feeds[feedIndex];
		    var modalInstance = $modal.open({
		      templateUrl: 'myModalContent.html',
		      controller: 'ModalInstanceCtrl',
		      size: size,
		      feed: feedTBE,
		      resolve: {
		    	  editId: function () {
		              return feedTBE;
		            }
		      }
		    });
		    
		    modalInstance.result.then(function (editedFeed) {
		    	var feedCategory = null;
		    	angular.forEach($scope.user.categories, function(category, key) {
		    		// TODO - do later with autocomplete and category ID
		    		  if (category.name == editedFeed.category) {
		    			  feedCategory = category;
		    			  // TODO - break from loop after this
		    		  };
		    		});
		    	if(!feedCategory) {
		    		$http.get($location.path() + 'webservices/createCategory?name=' + editedFeed.category + "&sessionToken=" + $scope.user.sessionToken).
			        success(function(data, status, headers, config) {
			        	feedCategory = data;
			        	$scope.user.categories.push(feedCategory);
			        	
			        	$http.get($location.path() + 'webservices/editFeed?feedURL=' + editedFeed.fURL + "&feedName=" + editedFeed.name + "&feedID=" + feedTBE.id + "&categoryID=" + feedCategory.id + "&sessionToken=" + $scope.user.sessionToken).
				        success(function(data, status, headers, config) {
				        	if (currentCategory.name == feedCategory.name) {
				        		currentCategory.feeds[feedIndex] = data;
				        	} else {
				        		currentCategory.feeds.splice(feedIndex, 1);
				        		feedCategory.feeds.push(data);
				        		feedIndex = feedCategory.feeds.length - 1;
				        	}
				        	var categoryIndex = $scope.user.categories.indexOf(feedCategory);
				    		$scope.updateArticlesList(categoryIndex, feedIndex);
				        }).
				        error(function(data, status, headers, config) {
				          // log error
				        });
			        }).
			        error(function(data, status, headers, config) {
			          // log error
			        });
		    	} else {
		    		$http.get($location.path() + 'webservices/editFeed?feedURL=' + editedFeed.fURL + "&feedName=" + editedFeed.name + "&feedID=" + feedTBE.id + "&categoryID=" + feedCategory.id + "&sessionToken=" + $scope.user.sessionToken).
			        success(function(data, status, headers, config) {
			        	if (currentCategory.name == feedCategory.name) {
			        		currentCategory.feeds[feedIndex] = data;
			        	} else {
			        		currentCategory.feeds.splice(feedIndex, 1);
			        		feedCategory.feeds.push(data);
			        		feedIndex = feedCategory.feeds.length - 1;
			        	}
			        	var categoryIndex = $scope.user.categories.indexOf(feedCategory);
			    		$scope.updateArticlesList(categoryIndex, feedIndex);
			        }).
			        error(function(data, status, headers, config) {
			          // log error
			        });
		    	}
		        

		      }, function () {
		      });
		    
		  };
		
	$scope.deleteFeed = function (selectedFeedIndex, selectedCategoryIndex) {
		  	  var feedTBD = $scope.user.categories[selectedCategoryIndex].feeds[selectedFeedIndex];
			  $http.get($location.path() + 'webservices/deleteFeed?feedID=' + feedTBD.id + "&sessionToken=" + $scope.user.sessionToken).
			  success(function(data, status, headers, config) {
				  if(data == 1) {						
					  $scope.user.categories[selectedCategoryIndex].feeds.splice(selectedFeedIndex, 1);
					  // TODO - feed list tab updated, but articles accordion not updated, check why
					  // TODO - check behavior, selected tab on delete feed
					  $scope.updateArticlesList(-1, null);
				  }
			  }).
			  error(function(data, status, headers, config) {
				  // log error
			  });
	};
	
	$scope.categorySelected = function (categoryIndex) {
		$scope.selectedCategoryIndex = categoryIndex;
		$scope.selectedFeedIndex = null;
    	var category = $scope.user.categories[categoryIndex];
		$http.get($location.path() + 'webservices/getCategoryArticles?sessionToken=' + $scope.user.sessionToken + "&categoryID=" + category.id).
	    success(function(data, status, headers, config) {	
	    	$scope.user.selectedFeedsArticles = data;	
	    }).
	    error(function(data, status, headers, config) {
	      // log error
	    });
	};
	
	// TODO - remove this method
	$scope.updateArticlesList = function (categoryIndex, feedIndex) {
		// TODO - check whether alternative way
		$scope.selectedCategoryIndex = categoryIndex;
		$scope.selectedFeedIndex = feedIndex;
	    if (categoryIndex >= 0) {
	    	var category = $scope.user.categories[categoryIndex];
	    	var feed = category.feeds[feedIndex];
		    
		    $http.get($location.path() + 'webservices/getArticles?sessionToken=' + $scope.user.sessionToken + "&feedID=" + feed.id).
		    success(function(data, status, headers, config) {	
		    	$scope.user.selectedFeedsArticles = data;	
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		    });
	    } else if (categoryIndex == -1) {
	    	$http.get($location.path() + 'webservices/getAllArticlesForUser?sessionToken=' + $scope.user.sessionToken).
		    success(function(data, status, headers, config) {	
		    	$scope.user.selectedFeedsArticles = data;	
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		    });
	    } else if (categoryIndex == -2) {
			// TODO - currently, implementation will be show all read articles. Understand Feedly, correct later
	    	$http.get($location.path() + 'webservices/getAllReadArticlesForUser?sessionToken=' + $scope.user.sessionToken).
		    success(function(data, status, headers, config) {	
		    	$scope.user.selectedFeedsArticles = data;	
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		    });
	    }	    	    
	};
		
	$scope.articleOpened = function (article, i) {
	    if (!article.isRead) {
	    	article.isRead = 1;
	    	// TODO - create single method saveArticle for these purposes
	    	$http.get($location.path() + 'webservices/setArticleRead?articleID=' + article.id + "&sessionToken=" + $scope.user.sessionToken).
		    success(function(data, status, headers, config) {
		    	var category = $scope.user.categories[$scope.selectedCategoryIndex];
		    	category.feeds[$scope.selectedFeedIndex].numberOfUnreadArticles = category.feeds[$scope.selectedFeedIndex].numberOfUnreadArticles - 1;
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		    });
	    }
	  };
	  
	  $scope.showTrendsPage = function () {
		  $scope.selectedCategoryIndex = -4;
		  $scope.selectedFeedIndex = null;
		  $scope.user.feedsListForTrends = [];
			
		  angular.forEach($scope.user.categories, function(category, key) {
			  angular.forEach(category.feeds, function(feed, key) {
				  $scope.user.feedsListForTrends.push(feed);
			  });
		  });
	  };
	  
	  $scope.showOrganizeFeedsPage = function () {
		  $scope.selectedCategoryIndex = -5;
		  $scope.selectedFeedIndex = null;			
	  };

	  $scope.showFeedTrends = function () {
		  
		  $http.get($location.path() + 'webservices/getFeedTrends?feedID=' + $scope.user.selectedFeedForTrends
				   + "&selectedFeedIntervalForTrends=" + $scope.user.selectedFeedIntervalForTrends+ "&sessionToken=" + $scope.user.sessionToken).
		    success(function(data, status, headers, config) {
		    	// TODO earlier, it was user.trends.feedTrends
		    	$scope.user.feedTrends = data;
		    }).
		    error(function(data, status, headers, config) {
		      // log error
		    });
		  
	  };
	  
	  $scope.importOPML = function () {
		  $http({
		        method: 'POST',
		        url: $location.path() + 'webservices/importOPML?' + "&sessionToken=" + $scope.user.sessionToken,
		        data: $scope.opmlFileToBeUploaded.src,
		        headers: {'Content-Type': 'multipart/form-data'}
		}).then(function successCallback(response) {
			$scope.user.categories.push(response.data);
		  }, function errorCallback(response) {
		    
		  });;
		  
		  
	  };
	
	  $scope.searchArticles = function(searchText) {
		  $scope.selectedCategoryIndex = -3;
		  $scope.selectedFeedIndex = null;

		  $http.get($location.path() + 'webservices/searchArticles?searchText=' + searchText + "&sessionToken=" + $scope.user.sessionToken).
		  success(function(data, status, headers, config) {
			  $scope.searchArticlesResult = data;
		  }).
		  error(function(data, status, headers, config) {
			  // log error
		  });
	  };
	  
	  $scope.formatDate = function(date){
		  	var publishDate = new Date(date);
		    var todayDate = new Date();
		    
		    var diffMs = (todayDate - publishDate); // milliseconds between now & Christmas
		    var diffDays = Math.round(diffMs / 86400000); // days
		    var diffHrs = Math.round(diffMs / 3600000); // hours
		    var diffMins = Math.round(diffMs / 60000); // minutes
		    
		    if (diffMins < 60) return diffMins+"m";
		    else if (diffHrs < 24) return diffHrs+"h";
		    else return diffDays+"d";
		};
		
		$scope.headerText = function(){
			if ($scope.selectedCategoryIndex >= 0) {
				var category = $scope.user.categories[$scope.selectedCategoryIndex];
				if(( angular.isUndefined($scope.selectedFeedIndex)) || $scope.selectedFeedIndex == null) {
					return category.name;
				} else {
					var feed = category.feeds[$scope.selectedFeedIndex];
					return feed.name;
				}
			}  
		  	else if ($scope.selectedCategoryIndex == -1) return "All";
		  	else if ($scope.selectedCategoryIndex == -2) return "Recently Read";		  	
		  	else if ($scope.selectedCategoryIndex == -3) return "Searching for " + $scope.searchText;
			//		  	else if ($scope.selectedCategoryIndex == -3) return "Searching for " + "<font color='blue'>" + $scope.searchText + "</font>";		  	
		  	else if ($scope.selectedCategoryIndex == -4) return "Trends";		  	
		};
	  
})
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                };
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    };
}]);

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, editId) {
	$scope.addFeedURL = editId.url;
	$scope.addFeedName = editId.name;
	$scope.addFeedCategory = editId.categoryName;
	$scope.ok = function (feedURL, feedName, feedCategory) {
	  // TODO - check whether var name feedURL works
	  var feed = { name:feedName, fURL:feedURL, category:feedCategory};
	  $modalInstance.close(feed);
	};

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});

// TODO - maybe move to angular controller, check proper way to do on Enter
function searchKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('btnSearch').click();
    }
}

function loginKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('loginSubmit').click();
    }
}

function addFeedKeyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
    {
        document.getElementById('addFeedSubmit').click();
    }
}

//TODO - try move to fbauthjs file
function login() {
    FB.login(function(response) {
    	  // TODO - check what if user alters response and sends request to my server 
    	  // with that resp., token
    	  if (response.status === 'connected') {
    	    // Logged into your app and Facebook.
    		var accountVO = {};
    		accountVO.sessionToken = response.authResponse.accessToken;
    		accountVO.id = response.authResponse.userID;
    	    FB.api('/me', function(response) {
    	        console.log('Successful login for: ' + response.name);
    	        accountVO.name = response.name;
    	        accountVO.email = response.email;
    	        angular.element(document.getElementById('TabsDemoCtrl')).scope().loginWithFB(accountVO);
    	        document.getElementById('fbDiv').style.display = "block";
    	        document.getElementById('fbDiv').innerHTML = '<img src="http://graph.facebook.com/' + response.id + '/picture" />';
    	      });
    	  } else if (response.status === 'not_authorized') {
    	    // The person is logged into Facebook, but not your app.
    	    document.getElementById('status').innerHTML = 'Please log ' +
    	      'into this app.';
    	  } else {
    	    // The person is not logged into Facebook, so we're not sure if
    	    // they are logged into this app or not.
    	    document.getElementById('status').innerHTML = 'Please log ' +
    	      'into Facebook.';
    	  }


    }, {scope: 'public_profile,email,user_groups'});            
}

window.fbAsyncInit = function() {
FB.init({
  appId      : '1383045038690359',
  cookie     : true,  // enable cookies to allow the server to access 
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.3' // use version 2.2
});

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
