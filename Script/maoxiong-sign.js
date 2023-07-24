const uid = "109294";
const cookieName = "maoxiong-cookie-" + uid;
const cookie = $prefs.valueForKey(cookieName);
if (cookie == undefined) {
    $notify("猫熊机场", "签到失败", "获取不到cookie，请先手动签到一次");
    $done();
}

const url = "https://mxwljsq.top/user/checkin";
const method = "POST";
const headers = { "Cookie": cookie };

const request = {
    url: url,
    method: method,
    headers: headers
};

$task.fetch(request).then(response => {
    // cookie失效会自动跳转到登录页面
    const contentType = response.headers["Content-Type"];
    if (contentType != undefined && contentType.indexOf("text/html") != -1) {
        $notify("猫熊机场", "签到失败", "cookie失效，请重新获取");
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