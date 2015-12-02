angular.module('notablyApp').controller('courseController', function ($scope, $http, $routeParams, sessionSocket, $rootScope, $location) {

    $scope.currentUser = $rootScope.user;

    $http.get('/api/course?number=' + $routeParams.courseNumber).then(function (response) {
        $scope.course = response.data;
        $http.get('/api/user?username=' + $scope.currentUser).then(function (response) {
            $scope.user = response.data;
            $scope.subscribed = false;
            if ($scope.user.courses.length !== 0) {
                for (var i = 0; i < $scope.user.courses.length; i++) {
                    if ($scope.user.courses[i].number === $scope.course.meta.number) {
                        $scope.subscribed = true;
                    }
                }
            }
            $scope.loadPage();
        });
    });


    $scope.loadPage = function() {

        sessionSocket.emit("joined course page", {"courseNumber" : $routeParams.courseNumber, "sessions" : $scope.course.sessions});

        $scope.$on('$locationChangeStart', function () {
            sessionSocket.emit("left course page", {"courseNumber" : $routeParams.courseNumber});
        });

        $scope.createSession = function () {
            if ($scope.course.sessions.length > 0)  {
                $scope.latestSession = $scope.course.sessions[$scope.course.sessions.length - 1];
                $scope.latestSessionTime = new Date($scope.latestSession.createdAt);
                if (Date.now() - $scope.latestSessionTime.getTime() < 15*60*1000) {
                    $('#newTitle').blur();
                    $('#new-session-modal').openModal();
                } else {
                    $scope.createNewSession();
                }
            } else {
                $scope.createNewSession();
            }
        }

        // subscribe to a course
        $scope.subscribe = function(courseNumber) {
            $http.post('/api/user/subscribe', {
                'course': courseNumber
            }).then(function (response) {
                Materialize.toast('You have subscribed to this course', 2000);
                $scope.subscribed = true;
            }, function(response) {
                Materialize.toast(response.data.error, 2000);
            });
        }

        // unsubscribe from a course
        $scope.unsubscribe = function(courseNumber) {
            $http.post('/api/user/unsubscribe', {
                'course': courseNumber
            }).then(function (response) {
                Materialize.toast('You have unsubscribed from this course', 2000);
                $scope.subscribed = false;
            }, function(response) {
                Materialize.toast(response.data.error, 2000);
            });
        }

        $scope.createNewSession = function() {
            $http.post('/api/course/newsession', {
                'number': $scope.course.meta.number,
                'title': $scope.newTitle
            }).then(function (response) {
                Materialize.toast('Your session has been created!', 2000);
                sessionSocket.emit("new session", {"session" : response.data, "courseNumber" : $routeParams.courseNumber});
                $scope.newTitle = "";
            }, function(response) {
                Materialize.toast(response.data.error, 2000);
            });
        }

        $scope.$on("socket:new session", function(ev, data) {
            $scope.course.sessions.push(data.session);
        });

        $scope.$on("socket:session data loaded", function(ev, data) {
            $scope.occupancy = data.occupancy;
        });
    }
});
