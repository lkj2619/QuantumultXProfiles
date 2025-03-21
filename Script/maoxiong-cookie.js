/*
[rewrite_local]
^https?:\/\/mxwljsq\.com\/user\/checkin url script-response-body maoxiong-cookie.js

[mitm]
hostname = mxwljsq.com
*/

const reqHeaderCookie = $request.headers["Cookie"];
if (typeof (reqHeaderCookie) == "undefined" || reqHeaderCookie === null) {
    $notify("猫熊机场", "保存cookie失败", "请求中没有Cookie");
    $done();
}

const cookieObj = extractParamsFromCookie(reqHeaderCookie);
const uid = cookieObj.uid;
const email = cookieObj.email;
const key = cookieObj.key;
// const ip = cookieObj.ip;
const expireIn = cookieObj.expire_in;

const cookieVal = "uid=" + uid + ";" +
    "email=" + email + ";" +
    "key=" + key + ";" +
    // "ip=" + ip + ";" +
    "cnxad_lunbo=yes;" +
    "expire_in=" + expireIn + ";";

console.log(cookieVal);

const cookieName = "maoxiong-cookie-" + uid;
const historyCookie = $prefs.valueForKey(cookieName);
if (typeof (historyCookie) == "undefined" || historyCookie === null) {
    console.log("历史cookie不存在");
    const save = $prefs.setValueForKey(cookieVal, cookieName);
    if (!save) {
        $notify("猫熊机场", "保存cookie失败", "");
    } else {
        $notify("猫熊机场", "保存cookie成功", printExpireDate(expireIn));
    }
    $done();
}

console.log(historyCookie);

if (historyCookie != cookieVal) {
    console.log("历史cookie不一致");
    const historyCookieexpireIn = extractParamsFromCookie(historyCookie).expire_in;
    if (historyCookieexpireIn > expireIn) {
        console.log("已缓存的cookie过期时间比当前cookie晚，无需更新cookie缓存");
        // 已缓存的cookie过期时间比当前cookie晚，无需更新cookie缓存
        $done();
    }
    const save = $prefs.setValueForKey(cookieVal, cookieName);
    if (!save) {
        $notify("猫熊机场", "更新cookie失败", "");
    } else {
        $notify("猫熊机场", "更新cookie成功", printExpireDate(expireIn));
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

function extractParamsFromCookie(cookieString) {
    const regex = /(\b(uid|email|key|ip|expire_in)\b)=([^;]*)/g;
    const matches = [...cookieString.matchAll(regex)];

    const result = {};
    matches.forEach(match => {
        const key = match[2];
        const value = match[3];
        result[key] = value;
    });

    return result;
}
