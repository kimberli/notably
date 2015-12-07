angular.module('notablyApp').controller('homeController', function (moment, $scope, $http, $rootScope) {

    $http.get('/api/user?username=' + $rootScope.user).then(function (response) {
        $scope.user = response.data;
        console.log($scope.user);
    });

    //configure moment calendar settings
    moment.locale('en', {
        calendar : {
            lastDay : '[Yesterday]',
            sameDay : '[Today]',
            nextDay : '[Tomorrow]',
            lastWeek : 'ddd',
            nextWeek : '[Next] ddd [at] LT',
            sameElse : 'L'
        }
    });

});
