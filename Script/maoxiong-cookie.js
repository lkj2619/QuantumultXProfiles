/*
[rewrite_local]
^https?:\/\/mxwljsq\.top\/user\/checkin url script-response-body maoxiong-cookie.js

[mitm]
hostname = mxwljsq.top
*/

const uidRegex = /uid=(\d+);/;
const emailRegex = /email=([^;]+);/;
const keyRegex = /key=([^;]+);/;
const ipRegex = /ip=([^;]+);/;
const expireInRegex = /expire_in=(\d+);/;

const reqHeaderCookie = $request.headers["Cookie"];
if (typeof(reqHeaderCookie) == "undefined" || reqHeaderCookie === null) {
    $notify("猫熊机场", "保存cookie失败", "请求中没有Cookie");
    $done();
}

const uidParam = reqHeaderCookie.match(uidRegex)[0];
const emailParam = reqHeaderCookie.match(emailRegex)[0];
const keyParam = reqHeaderCookie.match(keyRegex)[0];
const ipParam = reqHeaderCookie.match(ipRegex)[0];
const expireInParam = reqHeaderCookie.match(expireInRegex)[0];

const cookieVal = uidParam + emailParam + keyParam + ipParam + expireInParam;

const expireTimestampInSec = expireInParam.substring(10, expireInParam.length - 1);
const uid = uidParam.substring(4, uidParam.length - 1);

const cookieName = "maoxiong-cookie-" + uid;
const historyCookie = $prefs.valueForKey(cookieName);

if (historyCookie == undefined) {
    const save = $prefs.setValueForKey(cookieVal, cookieName);
    if (!save) {
        $notify("猫熊机场", "保存cookie失败", "");
    } else {
        $notify("猫熊机场", "保存cookie成功", printExpireDate(expireTimestampInSec));
    }
    $done();
}

if (historyCookie != cookieVal) {
    const historyCookieExpireInParam = historyCookie.match(expireInRegex)[0];
    const historyCookieExpireTimestamp = historyCookieExpireInParam.substring(10, historyCookieExpireInParam.length - 1);
    if (historyCookieExpireTimestamp > expireTimestampInSec) {
        // 已缓存的cookie过期时间比当前cookie晚，无需更新cookie缓存
        $done();
    }
    const save = $prefs.setValueForKey(cookieVal, cookieName);
    if (!save) {
        $notify("猫熊机场", "更新cookie失败", "");
    } else {
        $notify("猫熊机场", "更新cookie成功", printExpireDate(expireTimestampInSec));
    }
    $done();
}

$done();

function printExpireDate(timestampInSec) {
    const date = new Date(timestampInSec * 1000); // 参数需要毫秒数，所以这里将秒数乘于 1000
    return "有效至 " +
        date.getFullYear() + '-' +
        zeroPadding(date.getMonth() + 1) + '-' +
        zeroPadding(date.getDate()) + ' ' +
        zeroPadding(date.getHours()) + ':' +
        zeroPadding(date.getMinutes()) + ':' +
        zeroPadding(date.getSeconds());
}

function zeroPadding(num) {
    return num < 10 ? "0" + num : num;
}
