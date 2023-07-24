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

$notify("猫熊机场", "检测到Cookie过期时间", printExpireDate(expireIn));
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
