angular.module('notablyApp').controller('homeController', function ($scope, $http, $rootScope) {

    $http.get('/api/user?username=' + $rootScope.user).then(function (response) {
        $scope.user = response.data;
        console.log($scope.user);
    });

});
