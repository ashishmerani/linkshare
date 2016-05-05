// Client-side code
/* jshint browser: true, jquery: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */

// Server-side code
/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */


/*globals angular */
"use strict";
angular.module("linkShare", ["ui.router", "ngMessages", "ngStorage"])


.config([
        "$stateProvider",
        "$urlRouterProvider",
        function($stateProvider, $urlRouterProvider) {

            $stateProvider
                .state("home", {
                    url: "/home",
                    templateUrl: "/home.html",
                    controller: "MainCtrl",
                    resolve: {
                        postPromise: ["posts", function(posts) {
                            return posts.getAll();
                        }]
                    }
                })
                .state("posts", {
                    url: "/posts/{id}",
                    templateUrl: "/posts.html",
                    controller: "PostsCtrl",
                    resolve: {
                        post: ["$stateParams", "posts", function($stateParams, posts) {
                            return posts.get($stateParams.id);
                        }]
                    }
                });

            $urlRouterProvider.otherwise("home");
        }
    ])
    .factory("posts", ["$http", function($http) {
        var o = {
            posts: []
        };
        o.getAll = function() {
            return $http.get("/posts").success(function(data) {
                angular.copy(data, o.posts);
            });
        };
        o.create = function(post) {
            return $http.post("/posts", post).success(function(data) {
                o.posts.push(data);
            });
        };
        o.upvote = function(post) {
            return $http.put("/posts/" + post._id + "/upvote")
                .success(function(data) {
                    post.upvotes += 1;
                });
        };

        o.downvote = function(post) {
            return $http.put("/posts/" + post._id + "/downvote")
                .success(function(data) {
                    post.downvotes += 1;
                });
        };
        o.get = function(id) {
            return $http.get("/posts/" + id).then(function(res) {
                return res.data;
            });
        };
        o.addComment = function(id, comment) {
            return $http.post("/posts/" + id + "/comments", comment);
        };
        o.upvoteComment = function(post, comment) {
            return $http.put("/posts/" + post._id + "/comments/" + comment._id + "/upvote")
                .success(function(data) {
                    comment.upvotes += 1;
                });
        };
        return o;
    }])
    .controller("MainCtrl", [
        "$scope",
        "posts",
        function($scope, posts) {
            $scope.posts = posts.posts;
            console.log($scope.postlink);
            $scope.addPost = function() {

                if (!$scope.title || $scope.title === "") {
                    return;
                }
                posts.create({
                    title: $scope.title,
                    link: $scope.postlink
                });
                $scope.title = "";
                $scope.postlink = "";
            };
            $scope.incrementUpvotes = function(post) {
                posts.upvote(post);
            };
            $scope.decrementdownvotes = function(post) {
                posts.downvote(post);
            };
        }
    ])
    .controller("PostsCtrl", [
        "$scope",
        "posts",
        "post",
        function($scope, posts, post) {
            $scope.post = post;
            $scope.addComment = function() {
                if ($scope.body === "") {
                    return;
                }
                posts.addComment(post._id, {
                    body: $scope.body,
                    author: "user",
                }).success(function(comment) {
                    $scope.post.comments.push(comment);
                });
                $scope.body = "";
            };
            $scope.incrementUpvotes = function(comment) {
                posts.upvoteComment(post, comment);
            };
            $scope.decrementdownvotes = function(comment) {
                posts.downvoteComment(post, comment);
            };
        }
    ])
    .controller("modalController", [
        "$scope",
        "$http",
        "$localStorage",
        function($scope, $http, $localStorage) {

            $scope.$storage = $localStorage.$default({
                user: "",
                logedin: false
            });


            $scope.currentusr = $localStorage.user;
            $scope.logged = $localStorage.logedin;
            $scope.lsusernamesgn = "";
            $scope.lspasswrdsgn = "";


            $scope.usersgn = function() {
                $http.get("/signup/" + $scope.lsusernamesgn + "/" + $scope.lspasswrdsgn)
                    .success(function(data, status) {
                        if (status === 200) {
                            $localStorage.user = $scope.lsusernamesgn;
                            $localStorage.logedin = true;
                            $scope.currentusr = $scope.lsusernamesgn;
                            console.log("signed up");
                            angular.element("#signupModalFoot").removeClass("showDiv");
                            $scope.signupModalFoot = "You are logged in ! Kindly refresh the page to continue..";
                            $scope.lsusernamesgn = "";
                            $scope.lspasswrdsgn = "";
                            angular.element("#signupclose").trigger("click");
                        } else if (status === 201) {
                            angular.element("#signupModalFoot").removeClass("showDiv");
                            $scope.signupModalFoot = "Same username exists";
                            $scope.lsusernamesgn = "";
                            $scope.lspasswrdsgn = "";
                            console.log("201");
                        }
                    })
                    .error(function(err, status) {
                        angular.element("#signupModalFoot").removeClass("showDiv");
                        $scope.signupModalFoot = "Error in processing request.";
                        $scope.lsusernamesgn = "";
                        $scope.lspasswrdsgn = "";
                        console.log(err);

                    });
            };

            $scope.userlogin = function() {

                $http.get("/login/" + $scope.lsusernamelgn + "/" + $scope.lspasswrdlgn)
                    .success(function(data, status) {
                        console.log(status);
                        if (status === 200) {
                            //angular.element("#loginfooter").addClass("toggleDiv");

                            $localStorage.user = $scope.lsusernamelgn;
                            $localStorage.logedin = true;
                            $scope.currentusr = $localStorage.user;
                            console.log("logged in");
                            angular.element("#loginModalFoot").removeClass("showDiv");
                            $scope.loginModalFoot = "You are logged in ! Kindly refresh the page to continue..";
                            $scope.lsusernamelgn = "";
                            $scope.lspasswrdlgn = "";
                            angular.element("#loginclose").trigger("click");
                        } else if (status === 201) {
                            angular.element("#loginModalFoot").removeClass("showDiv");
                            $scope.loginModalFoot = "Username or password in incorrect";
                            $scope.lsusernamesgn = "";
                            $scope.lspasswrdsgn = "";
                            console.log("201");
                        }
                    })
                    .error(function(err) {
                        angular.element("#signupModalFoot").removeClass("showDiv");
                        $scope.loginModalFoot = "Error in processing request.";
                        $scope.lsusernamesgn = "";
                        $scope.lspasswrdsgn = "";
                        console.log(err);
                    });
            };

            $scope.logout = function() {
                $scope.logged = false;
                $scope.currentusr = "";
                $localStorage.$reset({
                    user: "",
                    logedin: false
                });
            };

        }

    ]);
