const tableDB = "http://localhost:3000/table-data";

var directoryApp = angular.module('directory', ["ngRoute"]);

directoryApp.controller("directory-app", ($scope, $http) => {
    $scope.validation = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    $http.get(tableDB).then(
        (response) => {
            $scope.tableData = response.data;
        },
        (error) => {
            console.log(error)
        }
    );

    $scope.sortField = 'username';
    $scope.sortReverse = false;

    $scope.columns = [
        { name: 'Username', field: 'username', sortable: true },
        { name: 'Phone', field: 'phone', sortable: true },
        { name: 'Email', field: 'email', sortable: true }
    ];

    $scope.sortBy = (field) => {
        if ($scope.sortField === field) {
            $scope.sortReverse = !$scope.sortReverse;
        } else {
            $scope.sortField = field;
            $scope.sortReverse = false;
        }
    };

    $scope.selectedCount = 0;

    $scope.toggleAll = () => {
        angular.forEach($scope.tableData, function(row) {
            row.selected = $scope.selectAll;
        });
        $scope.selectedCount = $scope.tableData.filter(function(row) {
            return row.selected;
        }).length;
    };

    $scope.toggleSelection = () => {
        $scope.selectedCount = $scope.tableData.filter(function(row) {
            return row.selected;
        }).length;
    };

    let deleteType;
    let rowIndex;

    $scope.deleteRow = (row) => {
        const index = $scope.tableData.indexOf(row);
        
        document.getElementById("confirmDelete").classList.remove("hide");

        deleteType = "single";
        rowIndex = index;
    };

    $scope.bulkDelete = () => {
        document.getElementById("confirmDelete").classList.remove("hide");
        deleteType = "bulk";
    };
    
    $scope.deleteContact = () => {
        if(deleteType == "bulk"){
            for (var i = $scope.tableData.length - 1; i >= 0; i--) {
                if ($scope.tableData[i].selected) {
                    $scope.tableData.splice(i, 1);
                }
            }
            document.getElementById("confirmDelete").classList.add("hide");
        }
        else if(deleteType == "single"){
            $scope.tableData.splice(rowIndex, 1);
            document.getElementById("confirmDelete").classList.add("hide");
        }
    };

    $scope.deleteCancel = () => {
        document.getElementById("confirmDelete").classList.add("hide");
    };

});

directoryApp.config(($routeProvider) => {
    $routeProvider
    .when("/", {
    templateUrl : "./components/login.htm"
    })
    .when("/table", {
    templateUrl : "./components/table.htm"
    })
});