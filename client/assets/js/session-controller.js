angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams) {

    $scope.sessionId = $routeParams.sessionId;
    var simplemde = new SimpleMDE({ element: document.getElementById("MyID"), spellChecker: true, hideIcons: ["side-by-side"]});

});
