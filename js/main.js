function onLoad() {
    setClientHeight();
    window.addEventListener('resize', setClientHeight);
}
function setClientHeight() {
    let logo = document.getElementById("logo");
    let size = window.innerHeight*2/25+"";
    logo.setAttribute("width", size);
    logo.setAttribute("height", size);
}