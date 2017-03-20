 var host = "http://192.168.31.231:1337/transbox/api";
 //var host = "http://www.lifeperfusor.com/transbox/api";

app.factory("HttpService", function ($http, $rootScope) {

    return {
        get: function (path, params, successCallBack, failureCallBack) {
            if (!params) {
                params = {};
            }

            $http({
                method: 'GET',
                url: host + path,
                params: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (response) {
                if (response.data.status === 'OK') {
                    successCallBack(response.data.data);
                } else if (response.data.status === 'NOT FOUND' && response.data.msg) {
                    mui.toast(response.data.msg);
                    failureCallBack(response.data.msg);
                }

            }, function (error) {
                var err = "很抱歉，无法从服务器获取数据。";
                mui.toast(err);
                failureCallBack(error);
            });
        },
        post: function (path, params, successCallBack, failureCallBack) {
            if (!params) {
                params = {};
            }

            $http({
                method: 'POST',
                url: host + path,
                data: $.param(params),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            }).then(function (response) {
                if (response.data.status === 'OK') {
                    successCallBack(response.data.data);
                } else if (response.data.status === 'NOT FOUND' && response.data.msg) {
                    mui.toast(response.data.msg);
                    failureCallBack(response.data.msg);
                }

            }, function (error) {
                var err = "很抱歉，无法从服务器获取数据。";
                mui.toast(err);
                failureCallBack(error);
            });

        },

        rsa: function (content) {
            var encrypt = new JSEncrypt();
            var pub_key = '-----BEGIN PUBLIC KEY-----\n' +
                'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdYEqbGkvcysdvqnOdIsKbHddc\n' +
                'TTX0hpKp1JqI7MT3V4Miltglp00fQwMV1f+OK09kAnDwkgbM6qkU5fNXFp2o+bgi\n' +
                'aBqKMCYpxP9MktVTg2zV3vyhoFsJq03tuRQ/IWMbgzhOrXB/LcMTWUzXvQdvnMbZ\n' +
                'v7ii7Bo2pC8a1YdZRwIDAQAB\n' +
                '-----END PUBLIC KEY-----';
            encrypt.setPublicKey(pub_key);

            return encrypt.encrypt(content);
        },

        sign: function (obj) {
            // sort
            var myObj = obj,
                keys = Object.keys(myObj),
                i, len = keys.length;

            keys.sort();

            var msg = "";
            for (i = 0; i < len; i++) {
                k = keys[i];

                if (i == len - 1) {
                    msg += (k + '=' + myObj[k]);
                } else {
                    msg += (k + '=' + myObj[k] + "&");
                }

            }
            ;

            var key = CryptoJS.SHA256($rootScope.upwd).toString();
            var hash = CryptoJS.HmacSHA256(msg, key);
            var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

            return hashInBase64;
        },

        getDate: function (times) {
            var date = new Date(parseInt(times));
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            var minute = date.getMinutes();
            minute = minute < 10 ? ('0' + minute) : minute;
            return y + '-' + m + '-' + d;
        },

        getHost: function () {
            return host;
        }

    }

}).factory("Common", function () {

    return {
        attr: function (id) {
            $('#' + id).attr("readonly", "readonly");
            $('#' + id).attr("disabled", "disabled");
        },
        removeAttr: function (id) {
            $('#' + id).removeAttr("readonly", "readonly");
            $('#' + id).removeAttr("disabled", "disabled");
        },
        Validate_checkphone: function (phone) {
            var reg = /^(1)[\d]{10}$/;
            if (!reg.test(phone)) {
                return false;
            } else {
                return true;
            }
        },
        arrMaxNum2: function arrMaxNum2(arr) {
            return Math.max.apply(null, arr);
        },
        arrMinNum2: function arrMinNum2(arr) {
            return Math.min.apply(null, arr);
        },
        arrAverageNum2: function arrAverageNum2(arr) {
            var sum = eval(arr.join("+"));
            // return ~~(sum / arr.length * 100) / 100;
            return (~~(sum / arr.length * 100) / 100).toFixed(2);
        },
        setWechatTitle: function setWechatTitle(title) {
            document.title = title;
            // hack在微信等webview中无法修改document.title的情况
            $body = $('body');
            var $iframe = $('<iframe></iframe>').on('load', function () {
                setTimeout(function () {
                    $iframe.off('load').remove()
                }, 0)
            }).appendTo($body)
        }

    }
});
