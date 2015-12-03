angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http, $rootScope) {

    $http.get('/api/user?username=' + $routeParams.username).then(function (response) {
        $scope.user = response.data;

        $scope.user.numSubmitted = 10;
        $scope.user.numSaved = 123;
    });

});
