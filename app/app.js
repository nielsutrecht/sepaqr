var appModule = angular.module('sepaQr', ['ngRoute']);

appModule.controller('MainCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.banks = {};


    $http.get('app/banks.json').then(function(result) {
        $scope.banks = result.data;
    });

    $scope.selectBank = function() {
        $scope.bankName = $scope.banks[$scope.bank].bank_name;
        $scope.bankBic = $scope.banks[$scope.bank].BIC;
        $scope.updateQr();
    }


    $scope.updateQr = function() {
        var iban = 'NL' + $scope.ibanControl + $scope.bank + $scope.ibanAccount;
        var payload = [
        	'BCD',
          '002',
          '1',
          'SCT',
          $scope.bankBic,
          $scope.name,
          iban,
          'EUR' + $scope.amount,
          'SEPA',
          '',
          '',
          ''].join('\n');
        if(!$scope.qrcode) {
            $scope.qrcode = new QRCode(document.getElementById("qrcode"), {
                                            text: payload,
                                            width: 256,
                                            height: 256,
                                            colorDark : "#000000",
                                            colorLight : "#ffffff",
                                            correctLevel : QRCode.CorrectLevel.H
                                        });
        }
        else {
            $scope.qrcode.makeCode(payload);
        }
    }
}]);

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