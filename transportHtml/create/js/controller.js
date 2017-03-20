app.controller('InController', function ($scope, $state, $location, Config) {

})
    .controller('CreateController', function ($scope, $state, Config, HttpService, Common, $location) {
        $scope.init = function () {
            Common.setWechatTitle('新建转运');
        };
        $scope.init();

        $scope.data = {
            pageState: 1,
            keyData: '',
            opoData: '',
            transPersonData: '',
            pwd1: '',
            pwd2: '',

            CreateOrganInfo: {
                segNumber: '',
                type: '',
                bloodType: '',
                bloodSampleCount: '1',
                organizationSampleType: '',
                organizationSampleCount: '1',
                dataType: ''
            },
            CreateBaseInfo: {
                box_id: '',
                boxPin: '',
                getOrganAt: '',
                organCount: '1',
                fromCity: '',
                tracfficType: '',
                tracfficNumber: '',
                deviceType: ''
            },
            CreateOpoInfo: {
                name: '',
                contactPerson: '',
                contactPhone: '',
                opoid: '',
                dataType: ''
            },
            CreateTransToInfo: {
                toHospName: '',
                dataType: ''
            },
            CreateTransPersonInfo: {
                name: '',
                phone: '',
                dataType: '',
                transferPersonid: ''
            }
        };
        $scope.initData = function () {
            var data = {
                deviceId: Config.deviceId
            };
            HttpService.get("/boxInfo", data,
                function (suc) {
                    if (suc) {
                        Config.boxid = suc.boxid;
                        Config.hospitalid = suc.hospital.hospitalid;
                        Config.name = suc.hospital.name;
                        $scope.getTransPerson(suc.hospital.hospitalid);
                    }
                }, function (fail) {

                });

            HttpService.get('/kwds', {},
                function (suc) {
                    if (suc) {
                        $scope.data.keyData = suc;
                        $scope.data.keyData.organ.push("其他(可填写)");
                        $scope.data.keyData.bloodType.push("其他(可填写)");
                        $scope.data.keyData.organisationSample.push("其他(可填写)");
                        $scope.data.keyData.tracfficType.push("其他(可填写)");
                    }
                }, function (fail) {
                });

        };

        $scope.getParams = function () {
            if (!$location.search().deviceId) {
                alert("获取箱子信息失败，请重新尝试!");
                return;
            }
            Config.deviceId = $location.search().deviceId;
            $scope.initData();
        };
        $scope.getParams();

        $scope.getTransPerson = function (hosId) {
            var data = {
                hospitalid: hosId
            };
            HttpService.get("/transferPersons", data,
                function (suc) {
                    if (suc) {
                        $scope.data.transPersonData = suc;
                        $scope.initDataType();
                    }
                }, function (fail) {

                });
        };
        $scope.initDataType = function () {
            /**
             * 初始化需要的的数据
             */
            $scope.data.CreateBaseInfo.deviceType = "web";
            $scope.data.CreateOrganInfo.dataType = "new";
            $scope.data.CreateTransPersonInfo.dataType = "new";
            $scope.data.CreateTransPersonInfo.transferPersonid = "";

            $scope.data.CreateBaseInfo.box_id = Config.boxid;
            $scope.data.CreateTransToInfo.toHospName = Config.name;
        };

        $scope.initTime = function () {
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;

            $('#time').text(y + '-' + m + '-' + d + ' ' + h + ':' + minute);

            $scope.data.CreateBaseInfo.getOrganAt = y + '-' + m + '-' + d + ' ' + h + ':' + minute + ":00";
        };
        $scope.initTime();

        $scope.choiceOrgType = function (pos) {
            mui('#pop_orgType').popover('hide');
            if (pos == $scope.data.keyData.organ.length - 1) {
                Common.removeAttr("id_orgType");
                $scope.data.CreateOrganInfo.type = '';
                return;
            }
            Common.attr("id_orgType");
            $scope.data.CreateOrganInfo.type = $scope.data.keyData.organ[pos];
            if ($scope.data.keyData.organ[pos] == '肾') {
                $scope.data.CreateBaseInfo.organCount = 2;
            }

        };

        $scope.choiceBloodType = function (pos) {
            mui('#pop_bloodType').popover('hide');
            if (pos == $scope.data.keyData.bloodType.length - 1) {
                Common.removeAttr("id_bloodType");
                $scope.data.CreateOrganInfo.bloodType = '';
                return;
            }
            Common.attr("id_bloodType");
            $scope.data.CreateOrganInfo.bloodType = $scope.data.keyData.bloodType[pos];
        };

        $scope.choiceOrgSmapleType = function (pos) {
            mui('#pop_orgSmapleType').popover('hide');
            if (pos == $scope.data.keyData.organisationSample.length - 1) {
                Common.removeAttr("id_orgSmapleType");
                $scope.data.CreateOrganInfo.organizationSampleType = '';
                return;
            }
            Common.attr("id_orgSmapleType");
            $scope.data.CreateOrganInfo.organizationSampleType = $scope.data.keyData.organisationSample[pos];
        };

        $scope.choiceOpo = function (pos) {
            mui('#pop_opoInfo').popover('hide');
            var item = $scope.data.opoData[pos];

            $scope.data.CreateOpoInfo.name = item.name;
            $scope.data.CreateOpoInfo.contactPerson = item.contactPerson;
            $scope.data.CreateOpoInfo.contactPhone = item.contactPhone;
            $scope.data.CreateOpoInfo.opoid = item.opoid;
            $scope.data.CreateOpoInfo.dataType = "db";
        };

        $scope.choiceTracfficType = function (pos) {
            mui('#pop_tracfficType').popover('hide');
            if (pos == $scope.data.keyData.tracfficType.length - 1) {
                Common.removeAttr("id_tracfficType");
                $scope.data.CreateBaseInfo.tracfficType = '';
                return;
            }
            Common.attr("id_tracfficType");
            $scope.data.CreateBaseInfo.tracfficType = $scope.data.keyData.tracfficType[pos];
        };

        $scope.choiceTransPerson = function (pos) {
            mui('#pop_transPerson').popover('hide');
            var item = $scope.data.transPersonData[pos];
            $scope.data.CreateTransPersonInfo.name = item.name;
            $scope.data.CreateTransPersonInfo.phone = item.phone;
            $scope.data.CreateTransPersonInfo.transferPersonid = item.transferPersonid;
            $scope.data.CreateTransPersonInfo.dataType = "db";
        };

        $scope.next = function () {
            if ($scope.data.CreateOrganInfo.segNumber == '' || $scope.data.CreateBaseInfo.getOrganAt == '' ||
                $scope.data.CreateOrganInfo.type == '' || $scope.data.CreateBaseInfo.organCount == '' ||
                $scope.data.CreateOrganInfo.bloodType == '' || $scope.data.CreateOrganInfo.bloodSampleCount == '' ||
                $scope.data.CreateOrganInfo.organizationSampleType == '' || $scope.data.CreateOrganInfo.organizationSampleCount == '') {
                mui.toast("请完善所有信息");
                return;
            }

            // console.log($scope.data.CreateOrganInfo.segNumber + " / " + $scope.data.CreateBaseInfo.getOrganAt + " / " +
            //     $scope.data.CreateOrganInfo.type + " / " + $scope.data.CreateBaseInfo.organCount + " / " +
            //     $scope.data.CreateOrganInfo.bloodType + " / " + $scope.data.CreateOrganInfo.bloodSampleCount + "/" +
            //     $scope.data.CreateOrganInfo.organizationSampleType + " / " + $scope.data.CreateOrganInfo.organizationSampleCount);

            $scope.getOpoInfo();
            $scope.data.pageState = 2;
        };

        $scope.getOpoInfo = function () {

            HttpService.get("/opos2", {},
                function (suc) {
                    if (suc) {
                        $scope.data.opoData = suc;
                    }
                }, function (fail) {

                })
        };

        $scope.tvDown = function (state) {
            switch (state) {
                case 0:
                    var orgNum = parseInt($scope.data.CreateBaseInfo.organCount);
                    if (orgNum > 1) {
                        $scope.data.CreateBaseInfo.organCount = --orgNum;
                    }
                    break;
                case 1:
                    var bloodNum = parseInt($scope.data.CreateOrganInfo.bloodSampleCount);
                    if (bloodNum > 1) {
                        $scope.data.CreateOrganInfo.bloodSampleCount = --bloodNum;
                    }
                    break;
                case 2:
                    var orgSampleNum = parseInt($scope.data.CreateOrganInfo.organizationSampleCount);
                    if (orgSampleNum > 1) {
                        $scope.data.CreateOrganInfo.organizationSampleCount = --orgSampleNum;
                    }
                    break;
            }
        };

        $scope.tvUp = function (state) {
            switch (state) {
                case 0:
                    var orgNum = parseInt($scope.data.CreateBaseInfo.organCount);
                    $scope.data.CreateBaseInfo.organCount = ++orgNum;
                    break;
                case 1:
                    var bloodNum = parseInt($scope.data.CreateOrganInfo.bloodSampleCount);
                    $scope.data.CreateOrganInfo.bloodSampleCount = ++bloodNum;
                    break;
                case 2:
                    var orgSampleNum = parseInt($scope.data.CreateOrganInfo.organizationSampleCount);
                    $scope.data.CreateOrganInfo.organizationSampleCount = ++orgSampleNum;
                    break;
            }
        };

        $scope.back = function () {
            $scope.data.pageState = 1;
        };

        $scope.preView = function () {
            if ($scope.data.CreateBaseInfo.fromCity == '' || $scope.data.CreateTransToInfo.toHospName == '' ||
                $scope.data.CreateBaseInfo.tracfficType == '' ||
                $scope.data.CreateTransPersonInfo.name == '' || $scope.data.CreateTransPersonInfo.phone == '' ||
                $scope.data.CreateOpoInfo.name == '' || $scope.data.CreateOpoInfo.contactPerson == '' ||
                $scope.data.CreateOpoInfo.contactPhone == '' || $scope.data.pwd1 == '' || $scope.data.pwd2 == '') {
                mui.toast("请完善所有信息");
                return;
            }

            if (!Common.Validate_checkphone($scope.data.CreateTransPersonInfo.phone)) {
                mui.toast("手机号格式不正确");
                return;
            }

            if ($scope.data.pwd1 != $scope.data.pwd2) {
                mui.toast("两次输入的密码不一致");
                return;
            }

            // 开箱密码
            $scope.data.CreateBaseInfo.boxPin = $scope.data.pwd1;

            // 目的地状态
            if (Config.name == $scope.data.CreateTransToInfo.toHospName) {
                $scope.data.CreateTransToInfo.dataType = "db";
            } else {
                $scope.data.CreateTransToInfo.dataType = "new";
            }

            $scope.data.pageState = 3;
        };

        $scope.editTrans = function () {
            $scope.data.pageState = 2;
        };

        /**
         * 新建转运 提交请求
         */
        $scope.commitTrans = function () {
            var data = {
                baseInfo: $scope.data.CreateBaseInfo,
                organ: $scope.data.CreateOrganInfo,
                person: $scope.data.CreateTransPersonInfo,
                to: $scope.data.CreateTransToInfo,
                opo: $scope.data.CreateOpoInfo
            };
            HttpService.post("/transfer", data,
                function (suc) {

                    $scope.data = '';
                    $state.go('createSuccess');
                }, function (fail) {

                })
        }

    })
    .controller('CreateSuccessController', function ($scope, Common) {
        $scope.init = function () {
            Common.setWechatTitle('新建成功');
        };
        $scope.init();

        $scope.data = {
            bg: "img/suc.png"
        }

    });