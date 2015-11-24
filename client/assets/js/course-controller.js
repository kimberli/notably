angular.module('notablyApp').controller('courseController', function ($scope, $routeParams) {


    $http.get('/course?number=' + $routeParams.courseNumber).then(function (response) {
        $scope.course = response.data;
        $scope.course.sessions = [{
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
