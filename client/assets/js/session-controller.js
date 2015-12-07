angular.module('notablyApp').controller('sessionController', function (sessionSocket, hotkeys, $scope, $routeParams, $location, $http, $timeout) {

    // init important view variables
    $scope.sessionId = '';
    $scope.showOption = 'both';
    $scope.snippetInput = '';
    $scope.showEditor = true;
    $scope.showFlags = true;
    $scope.shortcutModalEnabled = true;
    $scope.loaded = false;

    // retrieve data, set scope variables
    $scope.$on('$routeChangeSuccess', function() {

        $scope.sessionId = $routeParams.sessionId;

        // register user's visit
        $http.post('/api/session/visit', {
            'sessionId': $scope.sessionId
        });
        $http.get('/api/user/auth').then(function(response) {
            $scope.currentUser = response.data.username;
            $http.get('/api/session?sessionId=' + $scope.sessionId)
            .then(function (response) {
                var firstLoad = false;
                if (response.status === 200) {
                    $scope.session = response.data;
                    // true for a snippet id if the current user has saved the snippet
                    $scope.alreadySaved = {};
                    // true for a snippet id if the current user has flagged the snippet
                    $scope.alreadyFlagged = {};
                    //angular.element(document).ready(function () {
                    if ($scope.session.feed.length === 0) {
                        $scope.feed = $scope.session.feed;
                        $scope.stash = $scope.session.stash.snippets;
                        $http.get('/api/user/auth', {})
                        .then(function (response) {
                            $scope.currentUser = response.data.username;
                            openPage();
                        });
                    }
                    else {
                        $scope.session.feed.forEach(function(snippet, index) {
                            $scope.alreadySaved[snippet._id] = snippet.savedBy.indexOf($scope.currentUser) > -1 ? true : false;
                            $scope.alreadyFlagged[snippet._id] = snippet.flaggedBy.indexOf($scope.currentUser) > -1 ? true : false;

                            if (index === $scope.session.feed.length - 1) {
                                $scope.feed = $scope.session.feed;
                                $scope.stash = $scope.session.stash.snippets;
                                $scope.$on('lastElementLoaded', function(){
                                    if (!firstLoad) {
                                        $http.get('/api/user/auth', {})
                                        .then(function (response) {
                                            $scope.currentUser = response.data.username;
                                            firstLoad = true;
                                            openPage();
                                        });
                                    }
                                });
                            }
                        });
                    }
                    //});
                    // snippets have loaded, can load page now
                } else {
                    $location.path('/home');
                }
            }, function(response) {
                $location.path('/home');
            });
        });
    });


openPage = function() {
    // $('.dropdown-button').dropdown();

    // let the server know you've joined to update view counts, join the room
    sessionSocket.emit("joined session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});

    $scope.$on('$locationChangeStart', function () {
        // remove tooltips (weird for print view)
        $('.tooltipped').tooltip('remove');
        // leave session room on location start (socket disconnect on leave page is handled separately)
        sessionSocket.emit("left session", {"sessionId" : $scope.sessionId, "courseNumber" : $scope.session.meta.number});
    });

  // start out in editor mode, not preview mode
    $scope.preview = false;

    // showdown.js markdown parser
    var converter = new showdown.Converter();
    converter.setOption("headerLevelStart", 3);
    converter.setOption("simplifiedAutoLink", true);
    converter.setOption("literalMidWordUnderscores", true);
    converter.setOption("strikethrough", true);
    converter.setOption("tables", true);

    $scope.addSnippet = function() {
        // check if input is blank
        if (!$scope.snippetInput || $scope.snippetInput.length === 0) {Materialize.toast('You cannot submit an empty snippet!', 2000); return;}

        sessionSocket.emit("added snippet", {
            "content" : converter.makeHtml($scope.snippetInput),
            "sessionId" : $scope.sessionId,
            "username" :  $scope.currentUser
        });
    }

  // flag a snippet
    $scope.flagSnippet = function(id) {

        setTimeout(function(){$("#feed-flag-" + id + ",#stash-flag-" + id).prop('disabled', false);}, 5000);

        sessionSocket.emit("flagged snippet", {
            "snippetId" : id,
            "username" :  $scope.currentUser,
            "sessionId" : $scope.sessionId,
        });

        $("#feed-flag-" + id + ",#stash-flag-" + id).prop('disabled', true);

    }


  // save a snippet, color the button, add to stash, highlight new code
    $scope.saveOrRemoveSnippet = function(id) {
        if ($scope.alreadySaved[id]) {
            sessionSocket.emit("removed snippet", {
                "snippetId" : id,
                "username" :  $scope.currentUser,
                "sessionId" : $scope.sessionId,
                "stashId"  : $scope.session.stash._id,
            });
            $("#feed-save-" + id + ",#stash-save-" + id).prop('disabled', true);
        } else {
            sessionSocket.emit("saved snippet", {
                "snippetId" : id,
                "username" :  $scope.currentUser,
                "sessionId" : $scope.sessionId,
                "stashId" : $scope.session.stash._id,
            });
            $("#feed-save-" + id + ",#stash-save-" + id).prop('disabled', true);
        }
    }

  // add one to a particular snippet's save count
    $scope.incrementSaveCount = function(snippetId, username) {

        // but first lets add a cute animation!
        $("#feed-save-" + snippetId + ",#stash-save-" + snippetId).addClass('animated tada save-button-animate').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass('animated tada save-button-animate');
        });

        // increment savecount, add to savedBy if it isn't already there (just in case)
        // do this for stash and feed

        $scope.feed.forEach(function(snippet) {
            if (snippet._id === snippetId) {
                snippet.saveCount++;
                if (snippet.savedBy.indexOf(username) === -1) snippet.savedBy.push(username);
            }
        });

        $scope.stash.forEach(function(snippet) {
            if (snippet._id === snippetId) {
                snippet.saveCount++;
                if (snippet.savedBy.indexOf(username) === -1) snippet.savedBy.push(username);
            }
        });
    }

    // decrease one from a particular snippet's save count
    $scope.decrementSaveCount = function(snippetId, username) {
        // decrement savecount, delete from savedBy
        // do this for stash and feed
        $scope.feed.forEach(function(snippet) {
            if (snippet._id === snippetId) {
                snippet.saveCount--;
                snippet.savedBy.splice(snippet.savedBy.indexOf(username), 1);
            }
        });

        $scope.stash.forEach(function(snippet) {
            if (snippet._id === snippetId) {
                snippet.saveCount--;
                snippet.savedBy.splice(snippet.savedBy.indexOf(username), 1);
            }
        });
    }

    // add one to a particular snippet's flag count
    $scope.incrementFlagCount = function(snippetId, username) {
        // increment flagcount, add to flaggedBy if it isn't already there (just in case)
        // do this for stash and feed
        // but first lets add a cute animation!
        $("#feed-flag-" + snippetId + ",#stash-flag-" + snippetId).addClass('animated tada flag-button-animate').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
            $(this).removeClass('animated tada flag-button-animate');
        });

        $scope.feed.forEach(function(snippet) {
            if (snippet._id === snippetId) {
                snippet.flagCount++;
                if (snippet.flaggedBy.indexOf(username) === -1) snippet.flaggedBy.push(username);
            }
        });

        $scope.stash.forEach(function(snippet) {
            if (snippet._id === snippetId) {
                snippet.flagCount++;
                if (snippet.flaggedBy.indexOf(username) === -1) snippet.flaggedBy.push(username);
            }
        });
    }

  // use highlight js to highlight code blocks, also render mathjax
    $scope.typesetElement = function(id) {
        angular.element(document).ready(function () {
        // mathjax and code highlighting for new snippet
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.getElementById(id)]);
            $('#' + id + ' pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        });
    }

    // typeset the entire page on load
    $scope.typesetElement("session-container");

  // on saved snippet, increment save count
    $scope.$on("socket:saved snippet", function(ev, data) {
        $scope.incrementSaveCount(data.snippetId, data.username);
        if (data.username === $scope.currentUser) {
            // reenable button
            $("#feed-save-" + data.snippetId + ",#stash-save-" + data.snippetId).prop('disabled', false);
            $scope.feed.forEach(function(snippet) {
                if (snippet._id === data.snippetId) {
                    $scope.alreadySaved[data.snippetId] = true; // its saved by you!
                    $scope.stash.push(jQuery.extend(true, {}, snippet)); // copy snippet onto stash
                    $scope.typesetElement('stash-snippet-' + data.snippetId)
                    Materialize.toast('Snippet has been saved!', 2000);
                }
            });
        }
    });

  // on flagged snippet, increment flag count
    $scope.$on("socket:flagged snippet", function(ev, data) {
        $scope.incrementFlagCount(data.snippetId, data.username);
        if (data.username === $scope.currentUser) {
            $scope.alreadyFlagged[data.snippetId] = true;
            Materialize.toast('Snippet has been flagged!', 1000);
        }
    });

  // on removed snippet, decrement save count
    $scope.$on("socket:removed snippet", function(ev, data) {
        $scope.decrementSaveCount(data.snippetId, data.username);
        if (data.username === $scope.currentUser) {
            // reenable button
            $("#feed-save-" + data.snippetId + ",#stash-save-" + data.snippetId).prop('disabled', false);
            $scope.alreadySaved[data.snippetId] = false;
            $scope.stash.forEach(function(snippet, index) {
                if (snippet._id === data.snippetId) { // found it!
                    // isnt saved anymore, set to false
                    $scope.stash.splice(index,1); // remove snippet from your own stash
                }
            });
            Materialize.toast('Snippet has been removed!', 1000);
        }
    });

    // on added snippet, added snippet to feed
    $scope.$on("socket:added snippet", function(ev, data) {
        // add to feed
        $scope.feed.push(jQuery.extend(true, {}, data.snippet));
        $scope.typesetElement('feed-snippet-' + data.snippet._id);

        // if you were the one that posted it, handle it specially
        if (data.snippet.author === $scope.currentUser) {
            $scope.alreadySaved[data.snippet._id] = true;
            $scope.stash.push(jQuery.extend(true, {}, data.snippet)); // add snippet to your own stash
            // save it automatically
            $scope.typesetElement('stash-snippet-' + data.snippet._id);
            Materialize.toast('Your snippet has been posted!', 1000);
            // reset editor
            $scope.snippetInput = "";
            $scope.preview = false;
            $scope.previewText = "";
            $("#feed-view").animate({ scrollTop: $('#feed-view').prop("scrollHeight")}, 1000);
        }
    });

    $scope.$on("socket:error", function(ev, data) {
        Materialize.toast(data.message, 1000);
        if ('snippetId' in data) {
            $("#feed-save-" + data.snippetId + ",#stash-save-" + data.snippetId).prop('disabled', false);
        }
    });

  // changes the editor to preview mode, making sure to highlight code and parse markdown
    $scope.togglePreview = function() {

        if($scope.preview) {
            $scope.preview = false;
            angular.element(document).ready(function () {
                $("#snippet-input-area").focus();
            });
        }  else {
        // use showdown to convert
            $scope.previewText = converter.makeHtml($scope.snippetInput);
            $scope.typesetElement('snippet-preview');
            $scope.preview = true;
        }
    }


    // check if a stash snippet has overflow
    $scope.isOverflowingStash = function(id) {
        return $("#stash-snippet-" + id).prop('scrollHeight') > $("#stash-snippet-" + id).height();
    }

    // check if a feed snippet has overflow
    $scope.isOverflowingFeed = function(id) {
        return $("#feed-snippet-" + id).prop('scrollHeight') > $("#feed-snippet-" + id).height();
    }

    // check if a stash snippet has been expanded
    $scope.hasOverflownStash = function(id) {
        return $("#stash-snippet-" + id).hasClass('expanded-snippet');
    }

    // check if a feed snippet has been expanded
    $scope.hasOverflownFeed = function(id) {
        return $("#feed-snippet-" + id).hasClass('expanded-snippet');
    }

    // removes the max-height on a stash snippet
    $scope.toggleSnippetStash = function(id) {
        $("#stash-snippet-" + id).toggleClass("collapsed-snippet expanded-snippet");
    }

    // removes the max-height on a feed snippet
    $scope.toggleSnippetFeed = function(id) {
        $("#feed-snippet-" + id).toggleClass("collapsed-snippet expanded-snippet");
    }

    $scope.getClassSave = function(id) {
        return $scope.alreadySaved[id] ? 'save-button-active' : '';
    }

    $scope.getClassFlag = function(id) {
        return $scope.alreadyFlagged[id] ? 'flag-button-active' : '';
    }

    $scope.enableShortcutModal = function () {
        $scope.shortcutModalEnabled = true;
    }

    $scope.disableShortcutModal = function () {
        $scope.shortcutModalEnabled = false;
    }

    $scope.toggleShortcutModal = function() {
        if ($scope.shortcutModalEnabled === true) {
            $scope.disableShortcutModal();
            $('#keyboard-shortcut-modal').openModal();
        } else {
            $scope.enableShortcutModal();
            $('#keyboard-shortcut-modal').closeModal();
        }
    }

    // using angular hotkeys to add functionality
    hotkeys.add({
        combo: 'ctrl+p',
        callback: function() {
            $scope.togglePreview();
        },
        allowIn : ['textarea']
    });
    hotkeys.add({
        combo: 'ctrl+e',
        callback: function() {
            $scope.showEditor = !$scope.showEditor;
        },
        allowIn : ['textarea']
    });
    hotkeys.add({
        combo: 'ctrl+enter',
        callback: function() {
            $scope.addSnippet();
        },
        allowIn : ['textarea']
    });
    hotkeys.add({
        combo: 'command+enter',
        callback: function() {
            $scope.addSnippet();
        },
        allowIn : ['textarea']
    });
    hotkeys.add({
        combo: 'shift+/',
        callback: function() {
            $scope.toggleShortcutModal();
        }
    });
    hotkeys.add({
        combo: 'command+/',
        callback: function() {
            $scope.toggleShortcutModal();
        }
    });

    $scope.loaded = true;


    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        // initialize Materialize tooltips
        $('.tooltipped').tooltip({delay: 50});
    });


} // end

});
