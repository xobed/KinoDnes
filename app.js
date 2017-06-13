var app = angular.module('kino', []);
app.controller('kinoCtrl',
    function ($scope, $http) {
        $scope.loading = true;
        $scope.listings = false;
        $scope.noMoviesMessage = false;
        $scope.districtButtons = false;

        $scope.addDaysToDate = function (date, daysToAdd) {
            var addedDate = new Date(date);
            addedDate.setDate(addedDate.getDate() + daysToAdd);
            return addedDate;
        }

        $scope.getDateString = function (date) {
            return date.toISOString().substr(0, 10);
        }

        $scope.getDateFromUrl = function (urlDate) {
            if (typeof urlDate === "undefined") {
                return new Date();
            }
            if (urlDate.toLowerCase() === "zitra") {
                return $scope.addDaysToDate(new Date(), 1);
            }
            return new Date(urlDate);
        }

        $scope.displayCinemas = function (cityName, urlDate) {
            $scope.city = cityName;
            $url = "https://kinodnesapi.azurewebsites.net/api/kino/" + cityName;
            var date = $scope.getDateFromUrl(urlDate);
            // Today
            if ($scope.getDateString(date) == $scope.getDateString(new Date())) {
                $scope.previous = "";
                $scope.current = $scope.getDateString(date);
                $scope.next = $scope.getDateString($scope.addDaysToDate(date, 1));
                var todayLocation = location.origin + "/" + cityName;
                history.pushState(todayLocation, "", todayLocation);
            } else {
                $scope.current = $scope.getDateString(date);
                $scope.previous = $scope.getDateString($scope.addDaysToDate(date, -1));
                $scope.next = $scope.getDateString($scope.addDaysToDate(date, 1));
                $url += "/" + $scope.current;
                var newLocation = location.origin + "/" + cityName + "/" + $scope.current;
                history.pushState(newLocation, "", newLocation);
            }

            $http.get($url)
                .then(function (response) {
                    $scope.loading = false;
                    if (response.data.length === 0) {                        
                        $scope.noMoviesMessage = true;
                    } else {
                        $scope.cinemaListings = response.data;
                        $scope.listings = true;                        
                        $scope.noMoviesMessage = false;
                    }
                });
        };

        $scope.selectCity = function (cityName) {
            $scope.loading = true;
            $scope.city = cityName;
            $scope.districtButtons = false;
            $scope.displayCinemas(cityName);
        };

        $scope.hideCityName = function (cityAndCinema) {
            return cityAndCinema.replace(/.*?- /, "");
        };

        $scope.displayCityList = function () {
            $scope.listings = false;
            $http.get("https://kinodnesapi.azurewebsites.net/api/kino/Cities")
                .then(function (response) {
                    $scope.cityList = response.data;
                    $scope.districtButtons = true;
                    $scope.loading = false;
                });
        }

        window.onpopstate = function (e) {
            if (e.state) {
                location.href = e.state;
            } else {
                $scope.loading = true;
                $scope.cinemaListings = [];
                $scope.displayCityList();
            }
        };

        if (location.pathname === "/") {
            $scope.displayCityList();
        } else {
            var arguments = location.pathname.split("/");
            var city = arguments[1];
            $scope.date = arguments[2];
            $scope.displayCinemas(city, $scope.date);
        }
    });
