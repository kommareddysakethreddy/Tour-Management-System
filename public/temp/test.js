// function checkFileExist(urlToFile) {
//     var xhr = new XMLHttpRequest();
//     xhr.open('HEAD', urlToFile, false);
//     xhr.send();
//     if (xhr.status == '404') {
//         return false;
//     } else {
//         return true;
//     }
// }
// let a;
function imageExists(url) {
    return new Promise((resolve) => {
        var img = new Image();
        img.addEventListener('load', () => resolve(true));
        img.addEventListener('error', () => resolve(false));
        img.src = url;
    });
    console.log(res);
}
const fun = async() => {
    let pic = `img/tours/default`;
    if (await imageExists(pic + '.jpg')) {
        console.log('first');
        pic = pic + '.jpg';
    } else if (await imageExists(pic + '.webp')) {
        console.log('second');
        pic = pic + '.webp';
    } else {
        pic = 'img/default.webp';
    }
    console.log(pic);
};
fun();