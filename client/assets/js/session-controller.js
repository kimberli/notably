angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams, $http) {

    $scope.sessionId = $routeParams.sessionId;
    //$scope.simplemde = new SimpleMDE({ element: document.getElementById("MyID"), spellChecker: true, hideIcons: ["side-by-side"]});
    //

  resetSession = function() {
    $http.get('/api/session?sessionId=' + $scope.sessionId).then(function (response) {
        if (response.status === 200) {
            $scope.session = response.data;
            openPage();
        } else {
            Materialize.toast("Error! " + response.data.error, 2000);
        }
    });
  }
    resetSession();

    setInterval(function(){ resetSession(); }, 2000); // this is just for now, lets pretend we have web sockets!!

    $scope.showOption = 'both';
    // author: String,
    // text: String,
    // timestamp: Date,
    // saveCount: Number,
    // hidden: Boolean,
    // savedBy: [String],
    // flaggedBy: [String],
    // sessionId: String
openPage = function() {
  $scope.feed = $scope.session.feed;
  $scope.stash = $scope.session.stash.snippets;

  $scope.addSnippet = function() {
    $http.post('/api/session/newsnippet', {
        'sessionId': $scope.session._id,
        'text': $scope.snippetInput
    }).then(function (response) {
        resetSession();
        Materialize.toast('Your snippet has been posted!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  $scope.flagSnippet = function(id) {
    alert("flag " + id);
    // TODO add http call
  }

  $scope.removeSnippet = function(id) {
    $http.post('/api/stash/remove', {
        'stashId': $scope.session.stash._id,
        'snippetId': id
    }).then(function (response) {
        resetSession();
         Materialize.toast('Your snippet has been removed!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  $scope.saveSnippet = function(id) {
    $http.post('/api/stash/save', {
        'stashId': $scope.session.stash._id,
        'snippetId': id
    }).then(function (response) {
        // TODO increment number
          resetSession();
         Materialize.toast('Your snippet has been saved!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

    // $scope.snippets = [{
    //   author : "kim",
    //   flags : 2,
    //   saveCount : 3,
    //   text : "i direct hack",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "aluh",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "Fresh Fruit in Lounge (EOM)",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "faz",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "what do u mean by chill",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "kim",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "i direct hack",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "aluh",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "Fresh Fruit in Lounge (EOM)",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "faz",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "what do u mean by chill",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "kim",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "i direct hack",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "aluh",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "Fresh Fruit in Lounge (EOM)",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // },{
    //   author : "faz",
    //   flags : 2,
    //   saveCount: 3,
    //   text : "what do u mean by chill",
    //   savedBy : ["ayy", "lmao"],
    //   flaggedBy : ["lmao","ayy"],
    //   id: "aCd21as",
    //   timestamp : Date.now()
    // }];

  }

});
