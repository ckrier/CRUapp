var utils = angular.module('starter.controllers.utils', []);

// creates a list of constants that are accessible anywhere
utils.constant('constants', {
    'BASE_SERVER_URL' : 'http://54.86.175.74:8080/',
    'CAMPUSES_CONFIG' : 'campuses',
    'MY_RIDES_RIDER' : 'myRidesRider',
    'MY_RIDES_DRIVER' : 'myRidesDriver',
    'SELECTED_RIDE' : 'selectedRide'
});

// sets up easy access key value store for local storage on device
utils.factory('$localStorage', ['$window', function($window, constants) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        removeObject: function(key) {
            $window.localStorage.removeItem(key);
        }
    }
}]);


// utitity methods for calling basic ajax
/*<<<<<<< HEAD
utils.factory('req', 'constants',  ['$window', function($window) {
=======*/
utils.factory('req', ['$window', '$http', function($window, $http) {
    return {
        get: function(url, success, err) {
            // Simple GET request
            $http({
                method: 'GET',
                url: url
            }).then(success, err);
        },
        post: function(url, success, err) {
            $http({
                method: 'POST',
                url: url
            }).then(success, err);
        },
        /**
         * url - the url you want to add a query to
         * varName - the name of the variable to be passed to the query
         * values - the array of values to be passed in the query
         */
        buildQueryUrl: function(url, varName, values) {
            
            varName += '[]=';
            
            if (values.length > 0) {
                url += '?' + varName + '' + values[0]._id;
                for (var i = 1; i < values.length; ++i) {
                    url += '&' + varName + '' + values[i]._id; 
                }
            }
            
            return url;
        }
    }
}]);