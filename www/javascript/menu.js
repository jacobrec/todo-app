window.addEventListener("load", function () {
    document.getElementById("menu-open").onclick = openMenu;
    document.getElementById("menu-close").onclick = closeMenu;
});

function openMenu() {
    let menu = document.getElementById("side-menu");
    menu.style.display = "block";
    let menuOpen = document.getElementById("menu-open");
    menuOpen.style.display = "none";
}

function closeMenu() {
    let menu = document.getElementById("side-menu");
    menu.style.display = "none";
    let menuOpen = document.getElementById("menu-open");
    menuOpen.style.display = "block";
}
