angular.module('notablyApp').controller('sessionController', function ($scope, $routeParams, $location, $http) {

    $scope.sessionId = $routeParams.sessionId;

    var opts = {
    container: 'epiceditor',
    basePath: '../assets/lib/epiceditor',
    clientSideStorage: false,
    localStorageName: 'epiceditor',
    useNativeFullscreen: true,
    parser: marked,
    file: {
      name: 'epiceditor',
      defaultContent: '',
      autoSave: 100
    },
    theme: {
      base: '/themes/base/epiceditor.css',
      preview: '/themes/preview/github.css',
      editor: '/themes/editor/epic-light.css'
    },
    button: {
      preview: true,
      fullscreen: false,
      bar: "auto"
    },
    focusOnLoad: false,
    shortcut: {
      modifier: 17,
      fullscreen: 70,
      preview: 80
    },
    string: {
      togglePreview: 'Toggle Preview Mode',
      toggleEdit: 'Toggle Edit Mode',
      toggleFullscreen: 'Enter Fullscreen'
    },
    autogrow: false
  }

  var editor = new EpicEditor(opts).load();

  $scope.resetSession = function() {
    $http.get('/api/session?sessionId=' + $scope.sessionId).then(function (response) {
        if (response.status === 200) {
            $scope.session = response.data;
            $scope.feed = $scope.session.feed;
            $scope.stash = $scope.session.stash.snippets;
            openPage();
        } else {
            Materialize.toast("Error! " + response.data.error, 2000);
        }
    });
  }
    $scope.resetSession();

//  setInterval(function(){ $scope.resetSession(); }, 5000); // this is just for now, lets pretend we have web sockets!!

    $scope.showOption = 'both';


openPage = function() {
    setTimeout(function() {
    $('pre code').each(function(i, block) {
          hljs.highlightBlock(block);
        });
    }, 500);

  $scope.addSnippet = function() {
    $http.post('/api/session/newsnippet', {
        'sessionId': $scope.session._id,
        'text': editor.exportFile(null, "html")
    }).then(function (response) {
        $scope.resetSession();
        Materialize.toast('Your snippet has been posted!', 2000);
        $scope.snippetInput = "";
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
        $scope.resetSession();
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
          $scope.resetSession();
         Materialize.toast('Your snippet has been saved!', 2000);
    }, function(response) {
        Materialize.toast(response.data.error, 2000);
    });
  }



  }

});
