const button = document.querySelector("#btMenu");
const sidebar = document.querySelector(".sidebar");
const iconButton = document.querySelector(".bxs-chevron-left")
const bt_sair = document.getElementById('bt_sair')

button.onclick = function () {
    sidebar.classList.toggle("active");

    if(sidebar.classList.length == 2){
        sessionStorage.setItem('navbar', '1')    
    }
    if(sidebar.classList.length == 1){
        sessionStorage.setItem('navbar', '0')
    }
}

if(sessionStorage.getItem('navbar') == '1'){
    sidebar.classList.toggle("active");
}




bt_sair.addEventListener('click', function () {
    window.sessionStorage.clear()
    window.location.reload();
})
