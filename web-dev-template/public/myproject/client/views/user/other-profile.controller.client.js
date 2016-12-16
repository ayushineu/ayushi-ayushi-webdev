(function() {
    angular
        .module("bookreads")
        .controller("OtherProfileController", OtherProfileController);

    function OtherProfileController($routeParams, BookUserService, $location, $rootScope) {

        var vm = this;

        // vm.updateUser = updateUser;
        // vm.unregister = unregister;
        vm.logout = logout;
        //vm.isFollowing = false;
        vm.unfollowUser = unfollowUser;
        vm.followUser = followUser;
        vm.getUserProfile = getUserProfile;
        vm.getBookDetails=getBookDetails;

        var id = $routeParams.uid;
        console.log("user id in other profile");
        console.log(id);
        // vm.currentUser = $rootScope.currentUser;
        // console.log($rootScope.currentUser);
        //var id = $rootScope.currentUser._id;
        //vm.userId = id;

        console.log("Other Profile Controller");

        function init() {
            vm.isFollowing = false;
            BookUserService
                .findUserById(id)
                .then(function(response) {
                    console.log("in other profile success");
                        vm.user = response.data;
                        BookUserService
                            .loggedIn()
                            .then(
                                function(response) {
                                    var user = response.data;
                                    if(user._id) {
                                        vm.currentUser = user;
                                        for(var i in vm.currentUser.following) {
                                            if(vm.currentUser.following[i].userId == vm.user._id) {
                                                vm.isFollowing=true;
                                                break;
                                            }
                                        }
                                    }
                                    else {
                                        vm.currentUser = null;
                                    }
                                },
                                function(error) {
                                    vm.error = "Could not check if user is logged in";
                                }
                            );
                    },
                    function(error) {
                        vm.error = "Error in retrieving user details";
                    }
                );
        }
        init();

        function logout() {

            BookUserService
                .logout()
                .then(
                    function(response){
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }

        function unfollowUser() {
            for(var i in vm.currentUser.following) {
                if(vm.currentUser.following[i].userId == vm.user._id) {
                    vm.currentUser.following.splice(i, 1);
                }
            }

            BookUserService
                .updateUser(vm.currentUser._id, vm.currentUser)
                .then(function(stat) {
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating logged in user details";
                    });

            for(var i in vm.user.followers) {
                if(vm.user.followers[i].userId == vm.currentUser._id) {
                    vm.user.followers.splice(i, 1);
                }
            }

            BookUserService
                .updateUser(vm.user._id, vm.user)
                .then(function(stat) {
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating logged in user details";
                    })

        }

        function followUser() {
            var userObj = {
                userId: vm.user._id,
                username: vm.user.username
            };

            vm.currentUser.following.push(userObj);

            BookUserService
                .updateUser(vm.currentUser._id, vm.currentUser)
                .then(function(stat) {
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating logged in user details";
                    });
            var currentUserObj = {
                userId: vm.currentUser._id,
                username: vm.currentUser.username
            };

            vm.user.followers.push(currentUserObj);

            BookUserService
                .updateUser(vm.user._id, vm.user)
                .then(function(stat) {
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating logged in user details";
                    });
        }

        function getBookDetails(bookId) {
            console.log("in lang controller");
            console.log(bookId);
            $location.url("/home/mybookinfo/" + bookId);
        }


        function getUserProfile(userId) {
            if(vm.currentUser._id == userId) {
                $location.url("/user");
            }
            else {
                $location.url("/user/" + userId);
            }
        }
    }
})();
//         var vm = this;
//
//         // vm.updateUser = updateUser;
//         // vm.unregister = unregister;
//         vm.logout = logout;
//         //vm.isFollowing = false;
//         vm.unfollowUser = unfollowUser;
//         vm.followUser = followUser;
//         vm.getBookInfo = getBookInfo;
//         vm.getUserProfile = getUserProfile;
//
//         var id = $routeParams.uid;
//         // vm.currentUser = $rootScope.currentUser;
//         // console.log($rootScope.currentUser);
//         //var id = $rootScope.currentUser._id;
//         //vm.userId = id;
//
//         console.log("Other Profile Controller");
//
//         function init() {
//             vm.isFollowing = false;
//             BookUserService
//                 .findUserById(id)
//                 .then(function(response) {
//                     vm.user = response.data;
//                         BookUserService
//                         .loggedIn()
//                         .then(
//                             function(response) {
//                                 var user = response.data;
//                                 if(user._id) {
//                                     vm.currentUser = user;
//                                     for(var i in vm.currentUser.following) {
//                                         if(vm.currentUser.following[i].userId == vm.user._id) {
//                                             vm.isFollowing=true;
//                                             break;
//                                         }
//                                     }
//                                 }
//                                 else {
//                                     vm.currentUser = null;
//                                 }
//                             },
//                             function(error) {
//                                 vm.error = "Could not check if user is logged in";
//                             }
//                         );
//                 },
//                 function(error) {
//                     vm.error = "Error in retrieving user details";
//                 }
//                 );
//         }
//         init();
//
//         function logout() {
//
//             BookUserService
//                 .logout()
//                 .then(
//                     function(response){
//                         $rootScope.currentUser = null;
//                         $location.url("/login");
//                     },
//                     function(error) {
//                         $rootScope.currentUser = null;
//                         $location.url("/login");
//                     }
//                 );
//         }
//
//         function unfollowUser() {
//             for(var i in vm.currentUser.following) {
//                 if(vm.currentUser.following[i].userId == vm.user._id) {
//                     vm.currentUser.following.splice(i, 1);
//                 }
//             }
//
//             BookUserService
//                 .updateUser(vm.currentUser._id, vm.currentUser)
//                 .then(function(stat) {
//                         init();
//                     },
//                     function(error) {
//                         vm.error = "Error in updating logged in user details";
//                     });
//
//             for(var i in vm.user.followers) {
//                 if(vm.user.followers[i].userId == vm.currentUser._id) {
//                     vm.user.followers.splice(i, 1);
//                 }
//             }
//
//             BookUserService
//                 .updateUser(vm.user._id, vm.user)
//                 .then(function(stat) {
//                         init();
//                     },
//                     function(error) {
//                         vm.error = "Error in updating logged in user details";
//                     })
//
//         }
//
//         function followUser() {
//             var userObj = {
//                 userId: vm.user._id,
//                 username: vm.user.username
//             };
//
//             vm.currentUser.following.push(userObj);
//
//             BookUserService
//                 .updateUser(vm.currentUser._id, vm.currentUser)
//                 .then(function(stat) {
//                         init();
//                     },
//                     function(error) {
//                         vm.error = "Error in updating logged in user details";
//                     });
//             var currentUserObj = {
//                 userId: vm.currentUser._id,
//                 username: vm.currentUser.username
//             };
//
//             vm.user.followers.push(currentUserObj);
//
//             BookUserService
//                 .updateUser(vm.user._id, vm.user)
//                 .then(function(stat) {
//                         init();
//                     },
//                     function(error) {
//                         vm.error = "Error in updating logged in user details";
//                     });
//         }
//
//         function getBookInfo(bookId) {
//             $location.url("/home/" + bookId);
//         }
//
//         function getUserProfile(userId) {
//             if(vm.currentUser._id == userId) {
//                 $location.url("/user");
//             }
//             else {
//                 $location.url("/user/" + userId);
//             }
//         }
//     }
// })();