var module = angular.module('starter.controllers', ['EventCtrl', 'MissionCtrl', 'TeamCtrl', 'starter.controllers.camp', 'starter.controllers.min', 'starter.controllers.rides', 'articles', 'videos', 'ngCordova', 'ionic','PushModule', 'ComGroupCtrl']);

// allows for access of variable across controllers
module.service('allEvents', function() {
	var events = [];

	return {
		getEvents: function() {
			return events;
		},
		setEvents: function(eventList) {
			events = eventList;
		}
	};
});

module.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
	});
});

module.controller('AppCtrl', function(pushService, api, $rootScope, $scope, $ionicModal, $ionicPlatform, $timeout, $cordovaCalendar, $ionicPopup, $localStorage, $cordovaInAppBrowser) {

	// With the new view caching in Ionic, Controllers are only called
	// when they are recreated or on app start, instead of every page change.
	// To listen for when this page is active (for example, to refresh data),
	// listen for the $ionicView.enter event:
	//$scope.$on('$ionicView.enter', function(e) {
	//});

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	// Triggered in the login modal to close it
	$scope.closeLogin = function() {
		$scope.modal.hide();
		$scope.loginData.username = "";
		$scope.loginData.password = "";
	};

	// Open the login modal
	$scope.login = function() {
		if ($localStorage.get("leaderAPIKey")) {
			var alertPopup = $ionicPopup.alert(
			{
				title: '<span class="bold">Error!</span>',
				template: 'You are already logged in. Log out first to log in as another user.'
			});
		}
		else {
			$scope.modal.show();
		}
	};

	$scope.logout = function() {
		if ($localStorage.get("leaderAPIKey")) {
			$localStorage.set("leaderAPIKey", "");
			var alertPopup = $ionicPopup.alert(
			{
				title: '<span class="bold">Success!</span>',
				template: 'You are now logged out.'
			});
		}
		else {
			var alertPopup = $ionicPopup.alert(
			{
				title: '<span class="bold">Error!</span>',
				template: 'You are not logged in.'
			});
		}
	};

	loginSuc = function(response) {
		var data = response.data;
		console.log(response);
		console.log(data);
		if(data.success) {
			var key = data.LeaderAPIKey;
			$localStorage.set("leaderAPIKey", key);

			var alertPopup = $ionicPopup.alert(
			{
				title: '<span class="bold">Success!</span>',
				template: 'You are now logged in.'
			});

			$scope.closeLogin();
		}
		else {
			console.log("invalid");

			var alertPopup = $ionicPopup.alert(
			{
				title: '<span class="bold">Error!</span>',
				template: 'Sorry, those login credentials are not valid.'
			});
		}
	};

	loginFail = function(err) {
		console.log("failure");
		console.log(err);

		var alertPopup = $ionicPopup.alert(
		{
			title: '<span class="bold">Error!</span>',
			template: 'Could not reach login server or a server error occurred.'
		});
	};
	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {
		api.signin($scope.loginData.username, $scope.loginData.password, loginSuc, loginFail);
	};

	/**
	* Set up push notification
	*/
	$rootScope.$on('$cordovaPushV5:notificationReceived', pushService.onNotificationRecieved);//);
	//error happened
	$rootScope.$on('$cordovaPushV5:errorOccurred', pushService.onError);//);



	//set up when the application is ready
	$ionicPlatform.ready(function(){
	// call to register automatically upon device ready

		promise = pushService.push_init();
		if (promise){
			promise.then(function (result) {
			}, function (err) {
				console.log("Init error " + JSON.stringify(err));
			});
		};
	})
});
