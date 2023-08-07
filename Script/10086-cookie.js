/*
[rewrite_local]
^https?:\/\/wx\.10086\.cn\/qwhdhub\/api\/mark\/mark31\/domark url script-response-body 10086-cookie.js


[mitm]
hostname = wx.10086.cn
*/

const reqHeaderCookie = $request.headers["Cookie"];
if (typeof (reqHeaderCookie) == "undefined" || reqHeaderCookie === null) {
    $notify("中国移动", "保存cookie失败", "请求中没有Cookie");
    $done();
}

const save = $prefs.setValueForKey(reqHeaderCookie, "10086-cookie");
if (!save) {
    $notify("中国移动", "保存cookie失败", "");
} else {
    $notify("中国移动", "保存cookie成功", "");
}
$done();