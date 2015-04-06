/**
 * Created by nipuna on 4/4/15.
 */
// create the module and name it loginForm
var loginForm = angular.module('home', ['ngRoute']);

// configure our routes
loginForm.config(function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })
        .when('/status', {
            templateUrl : 'views/status',
            controller : 'mainController'
    });
});

// create the controller and inject Angular's $scope
loginForm.controller('mainController', function($scope, $location) {
    $scope.login = $location.search('login');
});


loginForm.controller('loginController', function($scope, $http, $location) {
    $scope.myForm = {};
    $scope.login = true;
    $scope.processForm = function() {
        $http({
            method: 'POST',
            url: '/login',
            data: $scope.myForm,
            processData: false,
            responseType: "json"
        }).success(function(data) {
            if (!data.sucess) {
                alert("Login error !!");
            } else {
                $scope.login = true;
                $location.url('/status?login=true');
            }
        });
    };
});