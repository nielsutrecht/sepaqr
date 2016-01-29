var appModule = angular.module('sepaQr', ['ngRoute']);

appModule.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('httpInterceptor');
}]);

appModule.controller('MainCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
    $scope.bank = $routeParams.bank

]);

appModule.config(['$routeProvider',
    function($routeProvider, config) {
        $routeProvider.
            when('/error/:errormessage?', {
                templateUrl: 'app/partials/error.html'
            }).
            when('/:bank?/:iban?/:bene?/:amount?/', {
                templateUrl: 'app/partials/main.html',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: function(param, search, path) {
                    return '/error/404';
                }
            });
    }]);