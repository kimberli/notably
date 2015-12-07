angular.module('notablyApp').controller('homeController', function (moment, $scope, $http, $rootScope, sessionSocket) {

    $http.get('/api/user?username=' + $rootScope.user).then(function (response) {
        $scope.user = response.data;
    });

    $scope.occupancy = {};

    $http.get('/api/user/auth', {})
    .then(function (response) {
        $scope.username = response.data.username;
        $http.get('/api/user?username=' + $scope.username).then(function (response) {
            $scope.user = response.data;
        });
    });

    sessionSocket.emit("joined home page", {"username" : $scope.username});

    $scope.$on('$locationChangeStart', function () {
        sessionSocket.emit("left home page", {"username" : $scope.username});
    });

    $scope.$on("socket:session data loaded", function(ev, data) {
        $scope.occupancy = data.occupancy;
    });

    //configure moment calendar settings
    moment.locale('en', {
        calendar : {
            lastDay : '[Yesterday]',
            sameDay : '[Today]',
            nextDay : '[Tomorrow]',
            lastWeek : 'ddd',
            nextWeek : '[Next] ddd',
            sameElse : 'M/D/YYYY'
        }
    });

});
