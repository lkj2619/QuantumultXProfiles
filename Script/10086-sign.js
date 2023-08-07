const cookieName = "10086-cookie";
const cookie = $prefs.valueForKey(cookieName);
if (typeof (cookie) == "undefined" || cookie === null) {
    $notify("中国移动", "签到失败", "获取不到cookie，请先手动签到一次");
    $done();
}

const url = "https://wx.10086.cn/qwhdhub/api/mark/mark31/domark";
const method = "GET";
const headers = { "Cookie": cookie };

const request = {
    url: url,
    method: method,
    headers: headers
};

$task.fetch(request).then(response => {
    const rspBody = JSON.parse(response.body);
    if (rspBody.success == true) {
        $notify("中国移动", "签到成功", "");
    } else {
        $notify("中国移动", "签到失败", rspBody.msg);
    }

    $done();
}, reason => {
    // reason.error
    $notify("中国移动", "签到失败", reason.error); // Error!
    $done();
});