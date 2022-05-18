const button = document.querySelector("#btMenu");
const sidebar = document.querySelector(".sidebar");
const iconButton = document.querySelector(".bxs-chevron-left")

button.onclick = function() {
    sidebar.classList.toggle("active");
}