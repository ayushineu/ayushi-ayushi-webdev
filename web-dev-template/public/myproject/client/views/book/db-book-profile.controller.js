(function() {
    angular
        .module("bookreads")
        .controller("DbBookDetailsController", DbBookDetailsController);

    function DbBookDetailsController($rootScope,BookService,$routeParams,$location,BookUserService,ReviewService) {
        var vm= this;
        var userReviewExists=false;
        vm.createReview=createReview;
        vm.logout=logout;
        // vm.isInBookList = false;
        vm.createNewUserReview=createNewUserReview;
        vm.createOrUpdateReviewInBook=createOrUpdateReviewInBook;
        vm.updateReviewsInUser=updateReviewsInUser;
        // vm.updateReviewsInUser=updateReviewsInUser;
        vm.updateReview=updateReview;
        vm.deleteReview=deleteReview;
        vm.deleteReviewFromBook=deleteReviewFromBook;
        vm.deleteReviewFromUser=deleteReviewFromUser;
        vm.editReview=editReview;
        vm.cancelReview=cancelReview;
        vm.addBookToBookList=addBookToBookList;
        vm.getUserProfile=getUserProfile;
        vm.removeBookFromBookList=removeBookFromBookList;

        function init() {
            vm.bookTitle=$routeParams.bookId;
            // var url = (window.location).href;
            // vm.bookTitle = url.substring(url.lastIndexOf('/') + 1);
            console.log("found id");
            console.log(vm.bookId);

             var bookPromise= BookService.findBookByTitle(vm.bookTitle);
            bookPromise
                .then(
                    function (response) {
                        vm.book = response.data;
                        console.log("in db book");
                        console.log(response);
                        console.log(response.data);})

                        // BookUserService
                        //     .loggedIn()
                        //     .then(
                        //         function (response) {
                        //             var user = response.data;
                        //             if (user._id) {
                        //                 vm.user = user;
                        //                 for (var i in vm.user.booklist) {
                        //                     if (vm.user.booklist[i].id == vm.book.id) {
                        //                         vm.isInBookList = true;
                        //                         break;
                        //                     }
                        //                     else{vm.isInBookList = false;}
                        //                 }
                        //             }
                        //             else {
                        //                 vm.user = null;
                        //             }});

                                    // ReviewService
                                    //     .findReviewByBookId(vm.book.bookId)
                                    //     .then(
                                    //         function (response) {
                                    //             vm.reviews = response.data;
                                    //             //console.log(vm.reviews);
                                    //             // var reviews = response.data;
                                    //             // if(reviews!=null) {
                                    //             //     vm.reviews = reviews;
                                    //             // }
                                    //             // else {
                                    //             //     vm.error = "Error in finding reviews for book";
                                    //             // }
                                    //         },
                                    //         function (error) {
                                    //             vm.error = "Error in finding reviews for book";
                                    //         });
                        //         },
                        //         function (error) {
                        //             vm.error = "Could not check if user is logged in";
                        //         }
                        //     );
                        // });

            vm.edit = false;
            vm.defReview = {
                title: "",
                comment: ""
            }



        }init();



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





        function createReview(reviewTitle, reviewComment) {
            //console.log(reviewComment);
            if(reviewComment == null || reviewComment == "") {
                vm.error = "Please enter review comment";
            }
            else {
                //Check if user is logged in, if user is logged in, allow to comment
                //console.log(vm.user);
                if(vm.user) {
                    var bookReviewed = vm.user.booksReviewed;
                    for(var i in bookReviewed) {
                        //Check if user has already reviewed the book, if yes then do not allow
                        if(bookReviewed[i].bookId == vm.book.bookId) {
                            userReviewExists = true;
                            break;
                        }
                    }
                    if(userReviewExists) {
                        vm.error = "You have already reviewed this book. Please update posted review";
                        //return;
                    }
                    else {
                        //If this is his first review for the book, create new review and update
                        //user's list of reviewed books

                        // console.log(vm.user);

                        var reviewToCreate = {
                            bookId:vm.book.id,
                            title: reviewTitle,
                            description: reviewComment,
                            ISBN: vm.book.volumeInfo.industryIdentifiers[0].identifier,
                            bookTitle:vm.book.volumeInfo.title,
                            bookCover: vm.book.volumeInfo.imageLinks.smallThumbnail,
                            user: {
                                userId: vm.user._id,
                                username: vm.user.username
                            }
                        };
                        createNewUserReview(reviewToCreate);
                    }
                }
                //If user is not logged in, prompt for login
                else {
                    vm.error = "Please login to review";
                }
            }
        }

        function createNewUserReview(reviewToCreate) {
            //console.log(reviewToCreate);
            ReviewService
                .createReview(reviewToCreate)
                .then(
                    function(response) {
                        var review = response.data;
                        // console.log(review);
                        if(review._id) {
                            createOrUpdateReviewInBook(review);
                            updateReviewsInUser();
                            init();
                        }
                        else {
                            vm.error = "Error in creating review";
                        }
                    },
                    function(error) {
                        vm.error = "Could not create review";
                    }
                );
        }

        function createOrUpdateReviewInBook(review) {

            var newReview = {
                reviewId: review._id
            }

            //Check if book instance is present in DB
            BookService
                .findBookById(vm.book.id)
                .then(
                    function(response) {
                        var bookCheck = response.data;
                        //If book is already in DB, update the reviews field
                        if(bookCheck != null) {
                            bookCheck.reviews.push(newReview);
                            BookService
                                .updateBook(bookCheck.bookId, bookCheck)
                                .then(
                                    function(response) {},
                                    function(error) {
                                        vm.error = "Error in updating review details in book";
                                    }
                                );
                        }
                        //If book is not present in the DB create a new entry for the book
                        else {
                            var newBookEntry ={
                                bookId:vm.book.id,
                                ISBN: vm.book.volumeInfo.industryIdentifiers[0].identifier,
                                bookTitle: vm.book.volumeInfo.title,
                                bookCover: vm.book.volumeInfo.imageLinks.smallThumbnail,
                                author:vm.book.volumeInfo.authors,
                                genre:vm.book.volumeInfo.categories,
                                reviews: newReview
                            }
                            BookService
                                .addBook(newBookEntry)
                                .then(
                                    function(response) {},
                                    function(error) {
                                        vm.error = "Could not create new book entry";
                                    }
                                );
                        }
                    },
                    function(error) {
                        vm.error = "Error in find operation";
                    }
                );
        }

        function updateReviewsInUser(){
            var updatedUser = vm.user;
            var bookReviewed = {
                bookId: vm.book.id,
                bookTitle: vm.book.volumeInfo.title,
                bookCover: vm.book.volumeInfo.imageLinks.smallThumbnail
            };
            updatedUser.booksReviewed.push(bookReviewed);
            //Update user's list of reviewed books
            BookUserService
                .updateUser(updatedUser._id, updatedUser)
                .then(
                    function(response) {
                        var afterReviewedUser = response.data;
                        if(afterReviewedUser) {
                            init();
                        }
                        else {
                            vm.error = "Could not update review for user";
                        }
                    },
                    function(error) {
                        vm.error = "Could not update review for user due to server error";
                    }
                );
        }

        function updateReview(reviewId, reviewTitle, reviewComment) {
            if(reviewComment == null || reviewComment == "") {
                vm.error = "Please enter review comment";
            }
            else {
                var updatedReview = {
                    title: reviewTitle,
                    description: reviewComment,
                    bookId: vm.book.id,
                    bookTitle: vm.book.volumeInfo.title,
                    ISBN:vm.book.volumeInfo.industryIdentifiers[0].identifier,
                    bookCover: vm.book.volumeInfo.imageLinks.smallThumbnail,
                    user: {
                        userId: vm.user._id,
                        username: vm.user.username
                    }
                }
                ReviewService
                    .updateReview(reviewId, updatedReview)
                    .then(
                        function(stat) {
                            init();
                        },
                        function(error) {
                            vm.error = "Error in updating review";
                        }
                    );
                vm.edit = false;
            }
        }

        function deleteReview(reviewId) {
            ReviewService
                .deleteReview(reviewId)
                .then(
                    function(stat) {
                        //Delete from user and book too
                        deleteReviewFromBook(reviewId);
                        //init();
                    },
                    function(error) {
                        vm.error = "Error in deleting review";
                    }
                )
        }

        function deleteReviewFromBook(reviewId) {
            BookService
                .findBookById(vm.book.id)
                .then(
                    function(response){
                        var localBookObj = response.data;
                        if(localBookObj._id) {
                            for(var i in localBookObj.reviews) {
                                if(localBookObj.reviews[i].reviewId == reviewId) {
                                    localBookObj.reviews.splice(i, 1);
                                }
                            }
                            BookService
                                .updateBook(localBookObj.bookId, localBookObj)
                                .then(
                                    function(stat) {
                                        deleteReviewFromUser(localBookObj.ISBN);
                                    },
                                    function(error) {
                                        vm.error = "Error in updating book details";
                                    }
                                );
                        }
                        else {
                            vm.error = "Error in retrieving book";
                        }
                    },
                    function(error) {
                        vm.error = "Error in finding book by API id";
                    }
                );
        }

        function deleteReviewFromUser(bookId) {

            var userForReviewDelete = vm.user;
            for(var i in userForReviewDelete.booksReviewed) {
                if(userForReviewDelete.booksReviewed[i].bookId == bookId) {
                    userForReviewDelete.booksReviewed.splice(i, 1);
                }
            }
            //console.log(userForReviewDelete);

            BookUserService
                .updateUser(userForReviewDelete._id, userForReviewDelete)
                .then(
                    function(stat){
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating book review";
                    }
                );
        }

        function editReview() {
            vm.edit = true;
            return;
        }

        function cancelReview() {
            vm.edit = false;
            return;
        }

        function getUserProfile(userId) {
            if(!vm.user) {
                vm.alertToLogin = "Login to view user profile";
            }
            else if(vm.user._id == userId) {
                $location.url("/user");
            }
            else {
                $location.url("/user/" + userId);
            }
        }

        function addBookToBookList() {
            if(!vm.user) {
                vm.addToBLMessage = "Please login to add to booklist";
            }
            else {
                var newBookEntry ={
                    bookId: vm.book.id,
                    bookTitle: vm.book.volumeInfo.title,
                    bookCover: vm.book.volumeInfo.imageLinks.smallThumbnail
                };
                vm.user.booklist.push(newBookEntry);
                vm.isInBookList=true;

                insertbook();

                BookUserService
                    .updateUser(vm.user._id, vm.user)
                .then(
                        function(stat){
                            alert("in success");

                            init();
                        },
                        function(error) {
                            vm.error = "Error in updating user";
                        }
                    );



            }

        }

        function insertbook(){
            console.log("function called");
            BookService
                .findBookById(vm.book.id)
                .then(
                    function(response) {
                        var bookCheck = response.data;
                        //If book is already in DB, update the reviews field
                        if(bookCheck != null) {

                        }
                        //If book is not present in the DB create a new entry for the book
                        else {
                            console.log("in else part creating new book");
                            var newBookEntry ={
                                bookId:vm.book.id,
                                ISBN: vm.book.volumeInfo.industryIdentifiers[0].identifier,
                                bookTitle: vm.book.volumeInfo.title,
                                bookCover: vm.book.volumeInfo.imageLinks.smallThumbnail,
                                author:vm.book.volumeInfo.authors,
                                genre:vm.book.volumeInfo.categories
                            }
                            BookService
                                .addBook(newBookEntry)
                                .then(
                                    function(response) {},
                                    function(error) {
                                        vm.error = "Could not create new book entry";
                                    }
                                );
                        }
                    },
                    function(error) {
                        vm.error = "Error in find operation";
                    }
                );
        }

        function removeBookFromBookList() {

            for(var i in vm.user.booklist) {
                if(vm.user.booklist[i].bookId == vm.book.id) {
                    vm.user.booklist.splice(i, 1);
                    vm.isInBookList=false;
                }
            }

            BookUserService
                .updateUser(vm.user._id, vm.user)
                .then(
                    function(stat){
                        init();
                    },
                    function(error) {
                        vm.error = "Error in updating user";
                    }
                );

        }
    }
})();

