angular.module('notablyApp').controller('homeController', function ($scope, $http, $rootScope) {

    $http.get('/api/user?username=' + $rootScope.user).then(function (response) {
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
    });

    $scope.schedule = [
        {time:'9', course:'', location:''},
        {time:'10', course:'6.034', location:'10-250'},
        {time:'11', course:'', location:''},
        {time:'12', course:'', location:''},
        {time:'1', course:'14.01', location:'E25-111'},
        {time:'2', course:'', location:''},
        {time:'3', course:'', location:''},
        {time:'4', course:'', location:''}
    ];
    $scope.stashes = [
        {course:'6.170', session:'Lecture 7'},
        {course:'6.170', session:'Lecture 5'},
        {course:'6.006', session:'Lecture 6'},
        {course:'6.170', session:'Lecture 6'},
        {course:'6.034', session:'Lecture 5'},
        {course:'6.006', session:'Lecture 5'},
        {course:'14.01', session:'Lecture 8'},
        {course:'14.01', session:'Recitation 9'},
        {course:'6.170', session:'Lecture 4'},
        {course:'6.006', session:'Lecture 4'}
    ];

});
