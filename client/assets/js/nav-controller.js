angular.module('notablyApp').controller('navController', function (moment, $scope, $http, $rootScope, $location, $window) {

    $http.get('/api/user/auth').then(function(response) {
        $scope.navuser = response.data.username;
    }, function() {
        $location.path('/');
    });

    $scope.logout = function () {
        $http.post('/api/user/logout', {})
        .then(function (response) {
            $rootScope.user = null;
            $window.location.href = '/';
        }, function(response) {
            console.log(response.data.error);
        });
    }

    $scope.selectedCourse = function(selected) {
        if (selected) {
            $location.path('/course/'+selected.originalObject.number);
        }
    }

    if (!$rootScope.courses) {
        $http.get('/api/course/all').then(function (response) {
            $rootScope.courses = response.data.courses;
            $scope.courses = $rootScope.courses;
            $(".button-collapse").sideNav();
        });
    } else {
        $scope.courses = $rootScope.courses;
        $(".button-collapse").sideNav();
    }

    //configure moment calendar settings
    moment.locale('en', {
        calendar : {
            lastDay : 'ddd',
            sameDay : '[Today]',
            nextDay : '[Tomorrow]',
            lastWeek : 'ddd',
            nextWeek : '[Next] ddd',
            sameElse : 'M/D/YY'
        }
    });

});
