angular.module('notablyApp').controller('profileController', function ($scope, $routeParams, $http, $rootScope) {

    $http.get('/api/user?username=' + $routeParams.username).then(function (response) {
        $scope.user = response.data;

        $scope.user.courses = [{
            'number': '6.034',
            'name': 'Artificial Intelligence'
        }, {
            'number': '6.170',
            'name': 'Software Studio'
        }, {
            'number': '6.005',
            'name': 'Software Construction'
        }, {
            'number': '14.01',
            'name': 'Microeconomics'
        }];

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
