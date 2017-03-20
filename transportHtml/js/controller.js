app.controller('InController', function ($rootScope, $scope, $state, $timeout, $location, HttpService) {
})
    .controller('QueryController', function ($scope, $state, HttpService, Config, Common, $location) {
        $scope.data = {
            orgNum: '',
            oddNum: ''
        };

        $scope.init = function () {
            Common.setWechatTitle('查询页');
        };
        $scope.init();

        $scope.getParams = function () {
            $scope.data.orgNum = $location.search().segNumber;
            $scope.data.oddNum = $location.search().transferNumber;
        };
        $scope.getParams();

        $scope.query = function () {
            if ($scope.data.orgNum == '' || $scope.data.oddNum == '') {
                mui.toast("请完善所有信息");
                return;
            }

            var data = {
                organSegNumber: $scope.data.orgNum,
                transferNumber: $scope.data.oddNum
            };

            HttpService.get("/transferInfo", data,
                function (suc) {
                    if (suc) {
                        Config.baseInfo = suc;
                        if (suc.status == "done") {
                            // 转运结束
                            $state.go('finishDetail');
                        } else {
                            // 转运中
                            $state.go('onway');
                        }
                    }
                }, function (fail) {

                })
        }

    })
    .controller('OnWayController', function ($scope, HttpService, Config, Common, $interval) {
        $scope.init = function () {
            Common.setWechatTitle('转运实时监控信息');
        };
        $scope.init();


        $scope.data = {
            pageState: 1,
            humidity: {},    // 统计湿度max/min
            temperature: {}, // 统计温度max/min
            openData: [],
            collisionData: [],
            crashData: []   //总的crash 数据
        };
        // morris
        $scope.info = {};
        $scope.lineModerationData = [];
        $scope.lineData = [];
        $scope.colors = ["#379DF2", "#F8B513"];
        $scope.initDate = function (x) {
            var date = new Date(x);
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            return m + '-' + d + ' ' + h + ':' + minute;
        };

        // page data
        $scope.getCrashInfo = function () {
            var p1 = {
                transferid: $scope.info.transferid,
                type: "open"
            };

            HttpService.get("/records2", p1, function (suc) {
                $scope.data.openData = suc;
                $scope.getCollisionData();
            }, function (fail) {

            });


        };
        $scope.getCollisionData = function () {
            var p2 = {
                transferid: $scope.info.transferid,
                type: "collision"
            };

            HttpService.get("/records2", p2, function (suc) {
                // init数组
                $scope.data.crashData = [];

                $scope.data.collisionData = suc;
                var oSize = $scope.data.openData.length;
                var cSize = $scope.data.collisionData.length;
                if (oSize > 0 || cSize > 0) {
                    var size = oSize > cSize ? oSize : cSize;
                    for (var i = 0; i < size; i++) {
                        $scope.data.crashData.push({
                            oInfo: $scope.data.openData[i] ? $scope.data.openData[i] : '--',
                            cInfo: $scope.data.collisionData[i] ? $scope.data.collisionData[i] : '--'
                        })
                    }
                } else {
                    $scope.data.crashData.push({
                        oInfo: '--',
                        cInfo: '--'
                    })
                }

            }, function (fail) {

            });
        };
        $scope.initData = function () {
            $scope.info = Config.baseInfo;

            if ($scope.info.records.length < 1) {
                return;
            }

            $scope.getCrashInfo();

            // 湿度
            var data = [];
            var humidity = [];
            for (var i = 0; i < $scope.info.records.length; i++) {
                var temp = $scope.info.records[i];
                if (temp.humidity) {
                    humidity.push(parseInt(temp.humidity));
                    data.push({
                        y: temp.recordAt,
                        a: temp.humidity
                    })
                }
            }
            $scope.lineModerationData = data;
            if (humidity.length > 0) {
                $scope.data.humidity.max = Common.arrMaxNum2(humidity) + "%";
                $scope.data.humidity.min = Common.arrMinNum2(humidity) + "%";
                $scope.data.humidity.avg = Common.arrAverageNum2(humidity) + "%";
            }

            // 温度
            var tData = [];
            var temperature = [];
            for (var j = 0; j < $scope.info.records.length; j++) {
                var item = $scope.info.records[j];
                if (item.temperature) {
                    temperature.push(parseFloat(item.temperature));
                    tData.push({y: item.recordAt, a: item.temperature})
                }
            }
            $scope.lineData = tData;
            if (temperature.length > 0) {
                $scope.data.temperature.max = Common.arrMaxNum2(temperature) + "℃";
                $scope.data.temperature.min = Common.arrMinNum2(temperature) + "℃";
            }

            // 开始时间
            $scope.info.startAtShow = moment($scope.info.startAt).format('MM-DD HH:mm');
            // 获取器官时间
            $scope.info.getOrganAtShow = moment($scope.info.getOrganAt).format('YYYY-MM-DD HH:mm');

        };
        $scope.initData();

        $scope.getShowtime = function (time) {
            if (time == '--') {
                return '--'
            } else {
                return moment(time).format('YYYY-MM-DD HH:mm');
            }
        };

        // fullPage
        $scope.mainOptions = {
            navigation: true,
            navigationPosition: 'right',
            scrollingSpeed: 1000
        };

        // click
        $scope.viewBaseInfo = function () {
            $scope.data.pageState = 1;
            $('#base').addClass('btn-active');
            $('#trans').removeClass('btn-active');
        };

        $scope.viewTransInfo = function () {
            $scope.data.pageState = 2;
            $('#trans').addClass('btn-active');
            $('#base').removeClass('btn-active');
        };


        var timer = $interval(function () {
            var params;
            if (Config.baseInfo.records.length > 0) {
                params = {
                    transferid: Config.baseInfo.transferid,
                    createAt: Config.baseInfo.records[Config.baseInfo.records.length - 1].createAt
                };
            } else {
                params = {
                    transferid: Config.baseInfo.transferid,
                    createAt: "2000-01-01 00:00:00"
                }
            }

            // 更新baseInfo
            HttpService.get("/records", params,
                function (suc) {

                    if (suc) {
                        for (var j in suc) {
                            Config.baseInfo.records.push(suc[j]);
                        }

                        // 更新$scope数据
                        $scope.initData();
                    }

                }, function (fail) {

                });
        }, 150000);   //间隔150秒定时执行
        $scope.$on('destroy', function () {
            $interval.cancel(timer);
        });

    })
    .controller('FinishDetailController', function ($scope, HttpService, Config, Common) {
        $scope.init = function () {
            Common.setWechatTitle('转运历史监控信息');
        };
        $scope.init();

        $scope.data = {
            pageState: 1,
            humidity: {},    // 统计湿度max/min
            temperature: {}, // 统计温度max/min
            openData: [],
            collisionData: [],
            crashData: []   //总的crash 数据
        };
        // morris
        $scope.info = {};
        $scope.lineModerationData = [];
        $scope.lineData = [];
        $scope.colors = ["#379DF2", "#F8B513"];
        $scope.initDate = function (x) {
            var date = new Date(x);
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            return m + '-' + d + ' ' + h + ':' + minute;
        };

        // page data
        $scope.getCrashInfo = function () {
            var p1 = {
                transferid: $scope.info.transferid,
                type: "open"
            };

            HttpService.get("/records2", p1, function (suc) {
                $scope.data.openData = suc;
                $scope.getCollisionData();
            }, function (fail) {

            });


        };
        $scope.getCollisionData = function () {
            var p2 = {
                transferid: $scope.info.transferid,
                type: "collision"
            };

            HttpService.get("/records2", p2, function (suc) {
                // init数组
                $scope.data.crashData = [];

                $scope.data.collisionData = suc;
                var oSize = $scope.data.openData.length;
                var cSize = $scope.data.collisionData.length;
                if (oSize > 0 || cSize > 0) {
                    var size = oSize > cSize ? oSize : cSize;
                    for (var i = 0; i < size; i++) {
                        $scope.data.crashData.push({
                            oInfo: $scope.data.openData[i] ? $scope.data.openData[i] : '--',
                            cInfo: $scope.data.collisionData[i] ? $scope.data.collisionData[i] : '--'
                        })
                    }
                } else {
                    $scope.data.crashData.push({
                        oInfo: '--',
                        cInfo: '--'
                    })
                }

            }, function (fail) {

            });
        };
        $scope.initData = function () {
            $scope.info = Config.baseInfo;

            if ($scope.info.records.length < 1) {
                return;
            }

            $scope.getCrashInfo();

            // 湿度
            var data = [];
            var humidity = [];
            for (var i = 0; i < $scope.info.records.length; i++) {
                var temp = $scope.info.records[i];
                if (temp.humidity) {
                    humidity.push(parseInt(temp.humidity));
                    data.push({
                        y: temp.recordAt,
                        a: temp.humidity
                    })
                }
            }
            $scope.lineModerationData = data;
            if (humidity.length > 0) {
                $scope.data.humidity.max = Common.arrMaxNum2(humidity) + "%";
                $scope.data.humidity.min = Common.arrMinNum2(humidity) + "%";
                $scope.data.humidity.avg = Common.arrAverageNum2(humidity) + "%";
            }

            // 温度
            var tData = [];
            var temperature = [];
            for (var j = 0; j < $scope.info.records.length; j++) {
                var item = $scope.info.records[j];
                if (item.temperature) {
                    temperature.push(parseFloat(item.temperature));
                    tData.push({y: item.recordAt, a: item.temperature})
                }
            }
            $scope.lineData = tData;
            if (temperature.length > 0) {
                $scope.data.temperature.max = Common.arrMaxNum2(temperature) + "℃";
                $scope.data.temperature.min = Common.arrMinNum2(temperature) + "℃";
            }

            // 开始时间
            $scope.info.startAtShow = moment($scope.info.startAt).format('MM-DD HH:mm');
            // 获取器官时间
            $scope.info.getOrganAtShow = moment($scope.info.getOrganAt).format('YYYY-MM-DD HH:mm');

        };
        $scope.initData();

        $scope.getShowtime = function (time) {
            if (time == '--') {
                return '--'
            } else {
                return moment(time).format('YYYY-MM-DD HH:mm');
            }
        };

        // fullPage
        $scope.mainOptions = {
            navigation: true,
            navigationPosition: 'right',
            scrollingSpeed: 1000
        };

        // click
        $scope.viewBaseInfo = function () {
            $scope.data.pageState = 1;
            $('#base').addClass('btn-active');
            $('#trans').removeClass('btn-active');
        };

        $scope.viewTransInfo = function () {
            $scope.data.pageState = 2;
            $('#trans').addClass('btn-active');
            $('#base').removeClass('btn-active');
        };

    });
