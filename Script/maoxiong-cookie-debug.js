/*
[rewrite_local]
^https?:\/\/mxwljsq\.top\/user\/checkin url script-response-body maoxiong-cookie.js

[mitm]
hostname = mxwljsq.top
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
const ip = cookieObj.ip;
const expireIn = cookieObj.expire_in;

const cookieVal = "uid=" + uid + ";" +
    "email=" + email + ";" +
    "key=" + key + ";" +
    "ip=" + ip + ";" +
    "expire_in=" + expireIn + ";";

const cookieName = "maoxiong-cookie-" + uid;
const save = $prefs.setValueForKey(cookieVal, cookieName);

$notify("猫熊机场", "保存cookie", cookieVal);
$done();

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
