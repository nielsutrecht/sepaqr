var appModule = angular.module('sepaQr', ['ngRoute']);

var toIban = function(bank, account) {
    account = String('0000000000' + account).slice(-10);

    var control = '00';

    var s = bank + account + 'NL' + control;

    var digitString = '';
    for (var index = 0; index < s.length; index++) {
        var code = s[index].toUpperCase().charCodeAt(0);
        digitString += code < 65 ? s[index] : code - 55;
    }

    var m = 0;
    for (index = 0; index < digitString.length; ++index) {
        m = ((m * 10) + (digitString[index] |0)) % 97;
    }

    control = (98 - m) + '';
    if(control.length === 1) {
        control = '0' + control;
    }

    return 'NL' + control + bank + account;
}

appModule.controller('MainCtrl', ['$scope', '$routeParams', '$http', function($scope, $routeParams, $http) {
    $scope.banks = {};


    $http.get('app/banks.json').then(function(result) {
        $scope.banks = result.data;
    });

    $scope.selectBank = function() {
        $scope.bankName = $scope.banks[$scope.bank].bank_name;
        $scope.bankBic = $scope.banks[$scope.bank].BIC;
        $scope.bankInfo = $scope.bankBic + ' (' + $scope.bankName + ')';

        $scope.changeAccountNumber();
    }

    $scope.changeAccountNumber = function() {
        $scope.iban = null;
        if($scope.bank && $scope.accountNumber) {
            $scope.iban = toIban($scope.bank, $scope.accountNumber);
        }

        $scope.updateQr();
    }

    $scope.updateQr = function() {
        if(!$scope.iban) {
            return;
        }

        var payload = [
        	'BCD',
          '002',
          '1',
          'SCT',
          $scope.bankBic,
          $scope.name,
          $scope.iban,
          'EUR' + $scope.amount,
          'SEPA',
          '',
          $scope.description,
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