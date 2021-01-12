/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('searchPeople', []);

var offset = 0;

app.factory('RestService', ['$http', '$q', function chatServiceFactory($http, $q) {
        return {
            getPeopleAggregators: function () {
                return $http.post('https://search.torre.co/people/_search/?offset=0&size=0&aggregate=true');
            },
            getPeopleList: function (filters) {
                var url = "https://search.torre.co/people/_search/?offset=" + offset + "&size=20&aggregate=true";
                return $http.post(url, filters);
            }
        };
    }
]);

app.controller('PeopleController', ['RestService', '$scope', '$compile', '$timeout', function (RestService, $scope, $compile, $timeout) {
        $scope.resultObtained = false;

        RestService.getPeopleAggregators().then(function (response) {
            $scope.aggregators = response.data.aggregators;
            $scope.totalResult = response.data.total;

            for (var item in $scope.aggregators.remoter) {
                if ($scope.aggregators.remoter[item].value.toLowerCase() == "yes") {
                    $scope.remotePeopleCount = $scope.aggregators.remoter[item].total;
                    break;
                }
            }
            $(".loader").hide();
        });

        $scope.formatNumber = function (num) {
            return numFormatter(num);
        };
        $scope.formatNumberWithComma = function (num) {
            return numberWithCommas(num);
        };

        $scope.searchPrev = function () {
            offset = $scope.offset - $scope.size;
            $scope.searchPeople();
        };
        $scope.searchNext = function () {
            offset = $scope.offset + $scope.size;
            $scope.searchPeople();
        };

        $scope.searchPeople = function () {
            $(".loader").show();

            var and = [];

            if ($scope.openTo) {
                and.push(createSearchJson("opento", $scope.openTo));
            }

            if ($scope.skill) {
                and.push(createSearchJson("skill", $scope.skill));
            }

            if ($scope.compensationrange) {
                and.push(createSearchJson("compensationrange", $scope.compensationrange));
            }

            if ($scope.remoter) {
                and.push(createSearchJson("remoter", $scope.remoter));
            }

            if ($scope.name) {
                and.push(createSearchJson("name", $scope.name));
            }

            $scope.postData = and.length > 1 ? {"and": and} : and[0];

            RestService.getPeopleList($scope.postData).then(function (response) {
                $scope.aggregators = response.data.aggregators;
                $scope.totalResult = response.data.total;

                for (var item in $scope.aggregators.remoter) {
                    if ($scope.aggregators.remoter[item].value.toLowerCase() == "yes") {
                        $scope.remotePeopleCount = $scope.aggregators.remoter[item].total;
                        break;
                    }
                }

                $scope.resultObtained = true;
                $scope.searchPeopleList = response.data.results;
                $scope.offset = response.data.offset;
                $scope.size = response.data.size;
                $scope.totalCount = response.data.total;

                $scope.disableClassOnZeroOffset = ($scope.offset == 0) ? "disabled" : "";

                console.log($scope.isOffsetZero);
                $(".loader").hide();

                $('body').animate({
                    scrollTop: $('#search-content').offset().top
                }, 500, function () {
                    window.location.href = "#search-content";
                });



            });
        };

        $scope.reset = function () {
            $scope.openTo = null;
            $scope.skill = null;
            $scope.compensationrange = null;
            $scope.remoter = null;
            $scope.name = null;
            $scope.resultObtained = false;
        };
    }]);


function createSearchJson(type, value) {

    switch (type) {
        case "remoter":
            return {"remoter": {"term": value}};
        case "opento":
            return {"opento": {"term": value.value}};
        case "name":
            return {"name": {"term": value}};
        case "compensationrange":
            var compensation = value.value.split(" ");
            var range = compensation[1].split("-");
            var time = range[1].split("/");
            return {"compensationrange": {
                    "minAmount": range[0],
                    "maxAmount": time[0],
                    "currency": compensation[0],
                    "periodicity": time[1]
                }}
        case "skill":
            return {"skill": {"term": value.value, "experience": "1-plus-year"}};
    }
}
