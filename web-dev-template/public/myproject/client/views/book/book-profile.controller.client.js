(function() {
    angular
        .module("bookreads")
        .controller("BookDetailsController", BookDetailsController);

    function BookDetailsController($rootScope,BookService,HomeService,$location,BookUserService,ReviewService,$routeParams) {
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
            //vm.book = $rootScope.currentBook;
            vm.bookId= $routeParams.bookId;

            response=HomeService.searchBooks(vm.bookId);
            if(response.items){
                console.log(response.items[0]);
                vm.book=response.items[0];
                console.log("current book");
                console.log( vm.book);



            vm.edit = false;
            vm.defReview = {
                title: "",
                comment: ""
            }


            BookUserService
                .loggedIn()
                .then(
                    function (response) {
                        var user = response.data;
                        if (user._id) {
                            vm.user = user;
                            for (var i in vm.user.booklist) {
                                console.log();
                                if (vm.user.booklist[i].bookTitle == vm.book.volumeInfo.title) {
                                    console.log("found book");
                                    vm.isInBookList = true;
                                    break;
                                }
                                else{vm.isInBookList = false;}
                            }
                        }
                        else {
                            vm.user = null;
                        }
                    },
                    function (error) {
                        vm.error = "Could not check if user is logged in";
                    }
                );


            ReviewService
                .findReviewByBookId(vm.book.id)
                .then(
                    function (response) {
                        vm.reviews = response.data;
                    },
                    function (error) {
                        vm.error = "Error in finding reviews for Book";
                    });
            }

            else{
            vm.hidepage=true;
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
                if(vm.user) {
                    var bookReviewed = vm.user.booksReviewed;
                    for(var i in bookReviewed) {
                        if(bookReviewed[i].bookId == vm.book.bookId) {
                            userReviewExists = true;
                            break;
                        }
                    }
                    if(userReviewExists) {
                        vm.error = "You have already reviewed this book. Please update posted review";

                    }
                    else {


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

            BookService
                .findBookById(vm.book.id)
                .then(
                    function(response) {
                        var bookCheck = response.data;
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

        function deleteReview(bookId) {
            console.log("in delete review");
            console.log(bookId);
            ReviewService
                .deleteReview(bookId)
                .then(
                    function(stat) {
                        deleteReviewFromBook(bookId);
                    },
                    function(error) {
                        vm.error = "Error in deleting review";
                    }
                )
        }

        function deleteReviewFromBook(bookId) {
            console.log("in delete review from book");
            console.log(vm.book);
            BookService
                .findBookById(bookId)
                .then(
                    function(response){
                        var localBookObj = response.data;
                        if(localBookObj._id) {
                            for(var i in localBookObj.booksReviewed) {
                                if(localBookObj.booksReviewed[i].bookId == bookId) {
                                    localBookObj.booksReviewed.splice(i, 1);
                                }
                            }
                            BookService
                                .updateBook(localBookObj.bookId, localBookObj)
                                .then(
                                    function(stat) {
                                        deleteReviewFromUser(localBookObj.bookId);
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
                console.log("adding book to booklist");
                console.log(newBookEntry);
                vm.isInBookList=true;
                insertbook();
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
                if(vm.user.booklist[i].bookTitle == vm.book.volumeInfo.title) {
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

