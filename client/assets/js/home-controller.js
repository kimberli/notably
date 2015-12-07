angular.module('notablyApp').controller('homeController', function (moment, $scope, $http, $rootScope, sessionSocket) {

    $scope.occupancy = {};
    $scope.loaded = false;
    $http.get('/api/user/auth', {})
    .then(function (response) {
        $scope.username = response.data.username;
        $http.get('/api/user?username=' + $scope.username).then(function (response) {
            $scope.user = response.data;
            $scope.loaded = true;
        });
    });

    sessionSocket.emit("joined home page", {"username" : $scope.username});

    $scope.$on('$locationChangeStart', function () {
        sessionSocket.emit("left home page", {"username" : $scope.username});
    });

    $scope.$on("socket:session data loaded", function(ev, data) {
        $scope.occupancy = data.occupancy;
    });

});
