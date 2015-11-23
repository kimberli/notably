angular.module('notablyApp').controller('classController', function ($scope, $routeParams) {

    $scope.classNumber = $routeParams.classNumber;
    $scope.sessions = [{title: "lol", date:"lol"},{title: "lol", date:"lol"},{title: "lol", date:"lol"},{title: "lol", date:"lol"}]

});
