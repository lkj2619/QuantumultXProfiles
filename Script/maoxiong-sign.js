const uid = "109294";
// const cookieName = "maoxiong-cookie-" + uid;
const cookieName = "maoxiong-cookie";
const cookie = $prefs.valueForKey(cookieName);
if (cookie == undefined) {
    $notify("猫熊机场", "签到失败", "获取不到cookie，请先手动签到一次");
    $done();
}

const url = "https://mxwljsq.com/user/checkin";
const method = "POST";
const headers = { "Cookie": cookie, "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36" };

const request = {
    url: url,
    method: method,
    headers: headers
};

$task.fetch(request).then(response => {
    // cookie失效会自动跳转到登录页面
    const contentType = response.headers["Content-Type"];
    if (contentType != undefined && contentType.indexOf("text/html") != -1) {
        $notify("猫熊机场", "签到失败", cookie);
        $done();
    }

    const rspBody = JSON.parse(response.body);
    if (rspBody.ret == 1) {
        $notify("猫熊机场", "签到成功", rspBody.msg);
    } else {
        $notify("猫熊机场", "签到失败", rspBody.msg);
    }

    $done();
}, reason => {
    // reason.error
    $notify("猫熊机场", "签到失败", reason.error); // Error!
    $done();
});