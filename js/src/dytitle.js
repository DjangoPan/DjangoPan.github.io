/*
* @Author: Django
* @Date:   2019-08-12 19:27:59
* @Last Modified by:   Django
* @Last Modified time: 2019-08-12 19:28:07
*/
var OriginTitile = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        $('[rel="shortcut icon"]').attr('href', "/TEP.png");
        document.title = '走罢，走罢，外面的世界更精彩...';
        //document.title = 'w(ﾟДﾟ)w 出BUG啦！！！！';
        clearTimeout(titleTime);
    }
    else {
        $('[rel="shortcut icon"]').attr('href', "/favicon.png");
        document.title = '唉，恁又是何苦？' + OriginTitile;
        //document.title = '♪(^∇^*)又好了. . . ' + OriginTitile;
        titleTime = setTimeout(function () {
            document.title = OriginTitile;
        }, 2000);
    }
});