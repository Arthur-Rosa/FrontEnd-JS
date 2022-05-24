const button = document.querySelector("#btMenu");
const sidebar = document.querySelector(".sidebar");
const iconButton = document.querySelector(".bxs-chevron-left")
const bt_sair = document.getElementById('bt_sair')

button.onclick = function () {
    sidebar.classList.toggle("active");
}

bt_sair.addEventListener('click', function () {
    window.sessionStorage.clear()
    window.location.reload();
})
