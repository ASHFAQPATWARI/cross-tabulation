app.controller('csvUpload', ['$scope', 'csvParse' ,function ($scope, csvParse) {
    //function to handle upload and call service methods
    $scope.handleUpload = function(evt){
      var files = evt.files;
      var file = files[0];
      csvParse.parsedData(file);
    };
}]);