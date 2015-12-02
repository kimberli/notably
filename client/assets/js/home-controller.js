angular.module('notablyApp').controller('homeController', function ($scope, $http, $rootScope) {

    $http.get('/api/user?username=' + $rootScope.user).then(function (response) {
        $scope.user = response.data;

        $scope.user.numSubmitted = 10;
        $scope.user.numSaved = 123;
        $scope.user.numSubscribed = 4;

        $scope.user.recentSessions = [{
            "_id": "5653a2c3643c44825db45ed6",
            "title": "6.170 Lecture 7",
            "createdAt": "2015-11-24T02:18:00.394Z",
            "activeUsers": 5
        }, {
            "_id": "5653a2c3643c44825db45ed6",
            "title": "6.170 Lecture 6",
            "createdAt": "2015-11-24T02:18:00.394Z",
            "activeUsers": 10
        }, {
            "_id": "5653a2c3643c44825db45ed6",
            "title": "6.170 Lecture 5",
            "createdAt": "2015-11-24T02:18:00.394Z",
            "activeUsers": 13
        }, {
            "_id": "5653a2c3643c44825db45ed6",
            "title": "6.170 Lecture 4",
            "createdAt": "2015-11-24T02:18:00.394Z",
            "activeUsers": 7
        }];
    });

});
