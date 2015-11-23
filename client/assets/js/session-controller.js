angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams) {

    $scope.sessionId = $routeParams.sessionId;
    // var $scope.simplemde = new SimpleMDE({ element: document.getElementById("MyID"), spellChecker: true, hideIcons: ["side-by-side"]});
    $scope.showOption = 'both';
    $scope.snippets = [{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "faz",
      flags : 2,
      saves: 3,
      content : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "faz",
      flags : 2,
      saves: 3,
      content : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "kim",
      flags : 2,
      saves: 3,
      content : "i direct hack",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "aluh",
      flags : 2,
      saves: 3,
      content : "Fresh Fruit in Lounge (EOM)",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    },{
      creator : "faz",
      flags : 2,
      saves: 3,
      content : "what do u mean by chill",
      savedBy : ["ayy", "lmao"],
      flaggedBy : ["lmao","ayy"]
    }];
});
