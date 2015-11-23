angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http) {

    $scope.username = $routeParams.username;

    $http.get('/api/user?username=' + $scope.username).then(function (response) {
        if (response.status === 200) {
            $scope.user = response.data;
        } else {
            console.log(response.data);
        }
    })

    $scope.stashes = [{'title': 'stash111'}, {'title': 'hi22'}, {'title': 'heyo'}]

});
