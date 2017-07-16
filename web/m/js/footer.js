/**
 * Created by lekuai on 2017/4/13.
 */
function mineClick() {
    if (isLogin()) {
        location.href = 'mine.html'
    } else {
        location.href = 'login.html'
    }

}

function releaseClick() {
    if (isLogin()) {
        location.href = 'release.html'
    } else {
        location.href = 'login.html'
    }
}
