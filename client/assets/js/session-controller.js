angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams, $location, $http, sessionSocket) {

    $scope.sessionId = $routeParams.sessionId;

    var opts = {
      container: 'epiceditor',
      basePath: '../assets/lib/epiceditor',
      clientSideStorage: false,
      theme: {
        base: '/themes/base/epiceditor.css',
        preview: '/themes/preview/github.css',
        editor: '/themes/editor/epic-light.css'
      },
      button: {
        fullscreen: false,
      },
      autogrow: false
    }

  // initialize the epic editor instance
  var editor = new EpicEditor(opts).load();

  // retrieve data, set scope variables
  $scope.loadPage = function() {
    $http.get('/api/session?sessionId=' + $scope.sessionId).then(function (response) {
        if (response.status === 200) {
            $scope.session = response.data;
            $scope.feed = $scope.session.feed;
            $scope.stash = $scope.session.stash.snippets;

            sessionSocket.emit("joined session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});

            $scope.$on('$locationChangeStart', function () {
              sessionSocket.emit("left session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});
            });

            openPage();
        } else {
            Materialize.toast("Error! " + response.data.error, 2000);
        }
    });
  }

    $scope.loadPage();

    $scope.showOption = 'both';


openPage = function() {

  $scope.addSnippet = function() {
    $http.post('/api/session/newsnippet', {
        'sessionId': $scope.session._id,
        'text': editor.exportFile(null, "html")
    }).then(function (response) {
        $scope.stash.push(response.data); // add snippet to your own stash
        Materialize.toast('Your snippet has been posted!', 2000);
        sessionSocket.emit("added snippet", {"snippet" : response.data, "sessionId" : $scope.sessionId});
        editor.importFile(null,"");
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

          for (i=0;i<$scope.session.stash.snippets.length;i++) {
            if ($scope.session.stash.snippets[i]._id === id) {
                $scope.session.stash.snippets.splice(i,1); // remove snippet from your own stash
                sessionSocket.emit("removed snippet", {"sessionId" : $scope.sessionId, "snippetId" : id});
                break;
            }
          }

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

         for (i=0;i<$scope.feed.length;i++) {
           if ($scope.feed[i]._id === id) {
               $scope.stash.push(jQuery.extend(true, {}, $scope.feed[i])); // copy snippet onto stash
               sessionSocket.emit("saved snippet", {"sessionId" : $scope.sessionId, "snippetId" : id});
               break;
           }
         }

         Materialize.toast('Your snippet has been saved!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }

  // scroll stash and feed to bottom of page
  $scope.scrollDivs = function() {
    var objDiv = document.getElementById("feed-view");
    objDiv.scrollTop = objDiv.scrollHeight;
    objDiv = document.getElementById("stash-view");
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  // add one to a particular snippet's save count
  $scope.incrementSaveCount = function(snippetId) {

    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].saveCount++;
      }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].saveCount++;
      }
    }

  }

  // decrease one from a particular snippet's save count
  $scope.decrementSaveCount = function(snippetId) {
    for (i=0;i<$scope.feed.length;i++) {
      if ($scope.feed[i]._id === snippetId) {
           $scope.feed[i].saveCount--;
      }
    }

    for (i=0;i<$scope.stash.length;i++) {
      if ($scope.stash[i]._id === snippetId) {
           $scope.stash[i].saveCount--;
      }
    }
  }

  // use highlight js to highlight code blocks
  $scope.highlightCode = function() {
    angular.element(document).ready(function () {
      $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
      });
    });
  }

  $scope.highlightCode();

  // on saved snippet, increment save count
  $scope.$on("socket:saved snippet", function(ev, data) {
      $scope.incrementSaveCount(data.snippetId);
  });

  // on removed snippet, decrement save count
  $scope.$on("socket:removed snippet", function(ev, data) {
      $scope.decrementSaveCount(data.snippetId);
  });

  // on added snippet, added snippet to feed
  $scope.$on("socket:added snippet", function(ev, data) {
      $scope.feed.push(data.snippet);
      $scope.highlightCode();
  });

  }

});
