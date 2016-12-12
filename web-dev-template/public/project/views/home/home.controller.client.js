(function(){
    angular
        .module("AuthorAttic")
        .controller("HomePageController",HomePageController);

function HomePageController($http,$routeParams) {
    var vm = this;
    vm.getBookInformation = getBookInformation;
    var books=[];
    function getBookInformation(keyword)
    {
        var url = "https://www.googleapis.com/books/v1/volumes?q=harry+potter&format=json&diagnostics=true";
        url = url.replace("q=harry+potter", "q=" + keyword);
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        var response = JSON.parse(xmlHttp.responseText);
        vm.books=response.items;
        console.log(response.items);

    }}


})();
        // function getJSON(url, callback){
        //     // vm.getJSON = function (url, callback) {
        //         var xhr = new XMLHttpRequest();
        //         xhr.open("get", url, true);
        //         xhr.responseType = "json";
        //         xhr.onload = function () {
        //             var status = xhr.status;
        //             if (status == 200) {
        //                 callback(null, xhr.response);
        //             } else {
        //                 callback(status);
        //             }
        //         };
        //         xhr.send();
        //     }
        // console.log(data);
        // function handleResponse(response) {
        //     for (var i = 0; i < response.items.length; i++) {
        //         var item = response.items[i];
        //         console.log("in handle response");
        //         console.log("item");
        //         // in production code, item.text should have the HTML entities escaped.
        //         document.getElementById("content").innerHTML += "<br>" + item.volumeInfo.title;
        //     }}

       //  getJSON(url,
       //      function (err, data) {
       //          if (err != null) {
       //              alert("Something went wrong: " + err);
       //          } else {
       //              vm.bookinfo=data.items;
       //              console.log(data.items[0].volumeInfo.title);
       //              console.log(data.items[0].volumeInfo.authors[0]);
       //              console.log(data.items[0].volumeInfo.publishedDate);
       //          }
       //      });
       // vm.books=vm.bookinfo;

