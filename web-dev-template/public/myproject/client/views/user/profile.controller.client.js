(function() {
    angular
        .module("bookreads")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, BookUserService, $location, $rootScope) {

        var vm = this;
        vm.updateUser = updateUser;
        vm.unregister = unregister;
        vm.logout = logout;
        vm.isFollowing = isFollowing;
        vm.unfollowUser = unfollowUser;
        vm.followUser = followUser;
        vm.getUserProfile = getUserProfile;
        vm.getBookInfo=getBookInfo;
        vm.getBookDetails=getBookDetails;
        // vm.adminlogin=false;
        vm.getalluser=getalluser;
        vm.deleteUser=deleteUser;
        // vm.userlist=[];

        var id = $rootScope.currentUser._id;


        console.log("Profile Controller");

        function init() {
            if ($rootScope.currentUser.type ==="Admin"){
                vm.adminlogin=true;
            }
            else{
                vm.adminlogin=false;
            }
            BookUserService
                .findUserById(id)
                .then(function(response) {
                    vm.user = response.data;
                });

            getalluser();
        }
        init();

        function getBookDetails(book){
            $rootScope.currentBook=book;
            $location.url("/home/mybookinfo");


        }

        function deleteUser(user){
            console.log("in delete user");
            BookUserService
                .deleteUser(user._id)
                .then(function(stat){
                    init();
                    vm.success = "Success! You have successfully deleted user";
                })
        }
        function getalluser(){
            console.log("calling all users");
            BookUserService
                .getall()
                .then(function(allusers){
                    console.log(allusers);
                    vm.userlist=allusers.data;
                })

        }

        function isFollowing(id) {
            var follows = false;
            for(var i in vm.user.following) {
                if(vm.user.following[i].userId == id) {
                    follows = true;
                    break;
                }
            }
            return follows;
        }

        function logout() {

            BookUserService
                .logout()
                .then(
                    function(response){
                        vm.adminlogin=false;
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    },
                    function(error) {
                        $rootScope.currentUser = null;
                        $location.url("/login");
                    }
                );
        }

        function unregister() {
            BookUserService
                .deleteUser(id)
                .then(function() {
                        $location.url("/login");
                    },
                    function () {
                        vm.error = "Unable to remove user";
                    });

        }

        function updateUser(newUser) {
            BookUserService
                .updateUser(id, newUser)
                .then(function(response) {
                    vm.success = "Success! Your profile was updated successfully";

                }, function(error) {
                    vm.error = "Unable to update user";
                })

        }

        function unfollowUser(userId) {
            for(var i in vm.user.following) {
                if(vm.user.following[i].userId == userId) {
                    vm.user.following.splice(i, 1);
                }
            }

            BookUserService
                .updateUser(vm.user._id, vm.user)
                .then(function(stat) {
                        updateFollowingUser(userId)
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating logged in user details";
                    });
        }

        function updateFollowingUser(userId) {
            BookUserService
                .findUserById(userId)
                .then(
                    function(response) {
                        var userToUpdate = response.data;
                        for(var i in userToUpdate.followers) {
                            if(userToUpdate.followers[i].userId == vm.user._id) {
                                userToUpdate.followers.splice(i, 1);
                            }
                        }
                        console.log(userToUpdate)
                        BookUserService
                            .updateUser(userToUpdate._id, userToUpdate)
                            .then(function(stat) {
                                    init();
                                },
                                function(error) {
                                    vm.error = "Error in updating logged in user details";
                                });
                    }
                );
        }

        function followUser(userId, username) {
            var userObj = {
                userId: userId,
                username: username
            };

            vm.user.following.push(userObj);

            var followUserObj = {
                userId: vm.user._id,
                username: vm.user.username
            };

            BookUserService
                .updateUser(vm.user._id, vm.user)
                .then(function(stat) {
                        updateFollowerUser(userId, followUserObj);
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating logged in user details";
                    });
        }

        function updateFollowerUser(userId, followUserObj) {

            BookUserService
                .findUserById(userId)
                .then(
                    function(response) {
                        var userToUpdate = response.data;
                        userToUpdate.followers.push(followUserObj);
                        BookUserService
                            .updateUser(userToUpdate._id, userToUpdate)
                            .then(function(stat) {
                                    init();
                                },
                                function(error) {
                                    vm.error = "Error in updating logged in user details";
                                });
                    }
                );
        }

        function getUserProfile(userId) {
            $location.url("/user/" + userId);
        }

        function getBookInfo(bookId) {
            console.log("got this id");
            console.log(bookId);
            $location.url("/myproj/dB/book/" + bookId)
        }

        function getBookDetails(bookId) {
            console.log("in profile controller");
            console.log(bookId);
            $location.url("/home/mybookinfo/" + bookId);
        }
    }
})();
//         var vm = this;
//         vm.updateUser = updateUser;
//         vm.unregister = unregister;
//         vm.logout = logout;
//         vm.isFollowing = isFollowing;
//         vm.unfollowUser = unfollowUser;
//         vm.followUser = followUser;
//         vm.getBookInfo = getBookInfo;
//         vm.getUserProfile = getUserProfile;
//
//         // var id = $routeParams.uid;
//
//         var id = $rootScope.currentUser._id;
//         //vm.userId = id;
//
//         console.log("Profile Controller");
//
//         function init() {
//             BookUserService
//                 .findUserById(id)
//                 .then(function(response) {
//                     vm.user = response.data;
//                     // getFollowersAndFollowing();
//                     // vm.dob = new Date("2012-07-14T01:00:00+01:00").getYear("YYYY");
//                     // console.log(vm.dob);
//
//                 });
//         }
//         init();
//
//         function isFollowing(id) {
//             var follows = false;
//             for(var i in vm.user.following) {
//                 if(vm.user.following[i].userId == id) {
//                     follows = true;
//                     break;
//                 }
//             }
//             return follows;
//         }
//
//         function logout() {
//
//             BookUserService
//                 .logout()
//                 .then(
//                     function(response){
//                         $rootScope.currentUser = null;
//                         $location.url("/");
//                     },
//                     function(error) {
//                         $rootScope.currentUser = null;
//                         $location.url("/login");
//                     }
//                 );
//         }
//
//         function unregister() {
//             BookUserService
//                 .deleteUser(id)
//                 .then(function() {
//                         $location.url("/login");
//                     },
//                     function () {
//                         vm.error = "Unable to remove user";
//                     });
//
//         }
//
//         function updateUser(newUser) {
//             console.log("Hello");
//             BookUserService
//                 .updateUser(id, newUser)
//                 .then(function(response) {
//                     vm.success = "Success! Your profile was updated successfully";
//
//                 }, function(error) {
//                     vm.error = "Unable to update user";
//                 })
//
//         }
//
//         function unfollowUser(userId) {
//             for(var i in vm.user.following) {
//                 if(vm.user.following[i].userId == userId) {
//                     vm.user.following.splice(i, 1);
//                 }
//             }
//
//             BookUserService
//                 .updateUser(vm.user._id, vm.user)
//                 .then(function(stat) {
//                     updateFollowingUser(userId)
//                         init();
//                     },
//                     function(error) {
//                         vm.error = "Error in updating logged in user details";
//                     });
//         }
//
//         function updateFollowingUser(userId) {
//             BookUserService
//                 .findUserById(userId)
//                 .then(
//                     function(response) {
//                         var userToUpdate = response.data;
//                         for(var i in userToUpdate.followers) {
//                             if(userToUpdate.followers[i].userId == vm.user_id) {
//                                 userToUpdate.followers.splice(i, 1);
//                             }
//                         }
//                         console.log(userToUpdate)
//                         BookUserService
//                             .updateUser(userToUpdate._id, userToUpdate)
//                             .then(function(stat) {
//                                     init();
//                                 },
//                                 function(error) {
//                                     vm.error = "Error in updating logged in user details";
//                                 });
//                     }
//                 );
//         }
//
//         function followUser(userId, username) {
//             var userObj = {
//                 userId: userId,
//                 username: username
//             };
//
//             vm.user.following.push(userObj);
//
//             var followUserObj = {
//                 userId: vm.user._id,
//                 username: vm.user.username
//             };
//
//             BookUserService
//                 .updateUser(vm.user._id, vm.user)
//                 .then(function(stat) {
//                     updateFollowerUser(userId, followUserObj);
//                         init();
//                     },
//                     function(error) {
//                         vm.error = "Error in updating logged in user details";
//                     });
//         }
//
//         function updateFollowerUser(userId, followUserObj) {
//
//             BookUserService
//                 .findUserById(userId)
//                 .then(
//                     function(response) {
//                         var userToUpdate = response.data;
//                         userToUpdate.followers.push(followUserObj);
//                         BookUserService
//                             .updateUser(userToUpdate._id, userToUpdate)
//                             .then(function(stat) {
//                                     init();
//                                 },
//                                 function(error) {
//                                     vm.error = "Error in updating logged in user details";
//                                 });
//                     }
//                 );
//         }
//
//         function getUserProfile(userId) {
//             $location.url("/user/" + userId);
//         }
//
//         function getBookInfo(bookId) {
//             $location.url("/home/" + bookId)
//         }
//     }
// })();