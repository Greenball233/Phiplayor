function uploaded(e) {
    const file = e.files[0];
    if (!file) {
        console.error("未选择任何文件");
        return;
    }
    console.log(file);
}
function awa() {
    onLoad();
    qwq();
    window.addEventListener('resize', qwq);
}
function qwq() {
    let logo = document.getElementById("search-logo");
    let size = window.innerHeight*2/25+"";
    logo.setAttribute("width", size);
    logo.setAttribute("height", size);
}