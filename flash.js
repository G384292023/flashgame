let counttimer = 3;
let flashcount = 3;
let sum = 0;
let flashstart = false;
const count = document.getElementById("count");
const start = document.getElementById("start");
const box = document.getElementById("box");
function gamestart() {
    flashstart = true;
    start.style.display = "none";
    counttimer = 3;
    countdown(counttimer);
}
function countdown(time) {
    if (time > 0) {
        count.textContent = "ゲーム開始まで:" + time;
        time--;
        setTimeout(countdown, 1000, time);
    } else if (time == 0) {
        count.textContent = "スタート";
        flash();
    }
}
function flash() {
    let now = 0;
    sum = 0;

    function next() {
        if (now < flashcount) {
            const random = Math.floor(Math.random() * 6 + 4);
            boxtext.textContent = random;
            sum += random;
            now++;
            setTimeout(() => {
                boxtext.textContent = "";
            }, 300);
            setTimeout(next, 500);
        } else {
            boxtext.textContent = "?";
            const level = flashcount - 2;
            inputname(level);
            flashstart = false;
        }
    }
    next();
}
function inputname(level) {
    let answer = null;
    while (answer == null || answer == "") {
        answer = window.prompt("答えを入力してください");
    }
    if (answer == sum) {
        count.innerHTML = "おめでとう、レベルアップ<br>レベル" + (flashcount - 2);
        flashcount++;
        start.style.display = "block";
    } else {
        count.textContent = "残念、答えは" + sum + "でした。ゲーム終了";
        setTimeout(() => {
            let name = null;
            while (name == null || name == "") {
                name = window.prompt("名前を入力してください");

            }
            count.textContent = name + "さんの記録はレベル" + (flashcount - 2) + "でした";
            savelevel(name, level);
        }, 2000);
        start.style.display = "block";
        //データの保存
    }
}
function savelevel(name, level) {
    const requestOptions = {
        method: "POST",
        redirect: "follow"
    };

    fetch("https://script.google.com/macros/s/AKfycbztYBiwvm7cZgybT0iQwj3h90LGu8r9hGHd0hptJsPV3rXFUNf8lnQdnVv58XCIXvd7rg/exec?name=" + name + "&level=" + level + "", requestOptions)
        .then((response) => response.text())
        .then((result) => {
            console.log(result);
            ranking();
        })
        .catch((error) => console.error(error));
}
function ranking() {
    let datas = [];
    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    fetch("https://script.google.com/macros/s/AKfycbztYBiwvm7cZgybT0iQwj3h90LGu8r9hGHd0hptJsPV3rXFUNf8lnQdnVv58XCIXvd7rg/exec", requestOptions)
        .then((response) => response.json())
        .then((data) => {
            datas = data;
            data.sort((a, b) => b[1] - a[1]);
            const table = document.getElementById("rankingtable");
            for(let i = 0;i<datas.length;i++){
                let name = table.rows[i].cells[1];
                name.innerHTML = datas[i][0] + "さん";
                let level = table.rows[i].cells[2];
                level.innerHTML =  "level:"+datas[i][1];
            }
        })
        .catch((error) => console.error("取得エラー:", error));
}
window.onload = function () {
    ranking(); // ページ読み込み時にランキング取得
};
