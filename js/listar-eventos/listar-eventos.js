var token = sessionStorage.getItem("token")
if (token == null) {
    window.location.replace('../login/login.html')
}
const input = document.getElementById("input-busca")
const bt_busca = document.getElementById("bt_buscar")
document.getElementById("input-busca").focus()
input_valor = sessionStorage.getItem("input")
if (input_valor != "") {
    input.value = input_valor
}
function buscar() {
    sessionStorage.setItem("input", input.value);
    window.location.reload()
}
bt_busca.addEventListener('click', buscar)
input.addEventListener('keyup', function (e) {
    var key = e.which || e.keyCode;
    if (key == 13) { // codigo da tecla enter
        // colocas aqui a tua função a rodar
        buscar()
    }
});
//Método que faz o decode do token
function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
const payload = parseJwt(token)
var token = sessionStorage.getItem("token")
if (token == null) {
    window.location.replace('../login/login.html')
}
const paginaAtual = window.location.href
const atributosUrl = paginaAtual.split('?')
// let url = 'http://localhost:8080/api/tarefas';
var url = 'http://10.92.198.38:8080/api/tarefas';
var idd = '';
if (atributosUrl[1] !== undefined) {

    // colocar pagina
    document.getElementById('numPage').textContent = atributosUrl[1];
    // alert(atributosUrl[1])
    url = url + "/page/" + atributosUrl[1]
} else {
    window.location.href = paginaAtual + "?1"
}
let bt_next = document.getElementById('bt_next')
const bt_back = document.getElementById('bt_back')

function listenerNext() {
    atributosUrl[1] = parseInt(atributosUrl[1]) + 1;
    window.location.href = atributosUrl.toString().replace(/,/g, "?")
}

function listenerBack() {
    atributosUrl[1] = parseInt(atributosUrl[1]) - 1;
    window.location.href = atributosUrl.toString().replace(/,/g, "?");
}
if (input.value != "") {
    if (input.value.match(/^\d{2}([./-])\d{2}\1\d{4}$/)) {
        url = 'http://10.92.198.38:8080/api/tarefas/buscar/' + FormataStringData(input.value) + '/' + atributosUrl[1]
    } else {
        url = 'http://10.92.198.38:8080/api/tarefas/buscar/' + input.value + '/' + atributosUrl[1]
    }
}
var idd = '';

document.addEventListener('DOMContentLoaded', function () {
    getOfDatabase();

    var ModalNotBoot = document.getElementById('myModal');
    ModalNotBoot.addEventListener('hidden.bs.modal', function (event) {
        var b = document.getElementById('btnEliminar');
        b.removeEventListener('click', deletaEvento);
        let btnSalvar = document.getElementById('btnSalvarEditar');
        btnSalvar.removeEventListener('click', editarEventoModal);
    });
});

function getOfDatabase() {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let fetchData = {
        method: 'GET',
        headers: myHeaders
    }

    fetch(url, fetchData)
        .then((resp) => {
            resp.json().then((info) => {
                let eventos = info.content;
                console.log(info)
                if (info.length == 0) {
                    document.getElementById("error").style.display = "block";
                }
                if (info.totalPages > atributosUrl[1]) {
                    bt_next.addEventListener('click', listenerNext)
                    bt_back.addEventListener('click', listenerBack)
                    bt_back.style.display = 'block';
                    bt_next.style.display = 'block';
                    // bt_next.classList.remove(".hover")
                } else {
                    bt_next.removeEventListener('click', listenerNext)
                    bt_back.addEventListener('click', listenerBack)
                    bt_back.style.display = 'block';
                }
                if (atributosUrl[1] == 1) {
                    bt_back.removeEventListener('click', listenerBack)

                    bt_back.style.display = 'none';

                }
                if (eventos.length == 0) {
                    document.getElementById('notEvent').style.display = 'block';
                }
                return eventos.map((evento) => {
                    id = evento.id;
                    criarLinha(evento.usuario?.nome, evento.title, evento.description, evento.start, evento.periodo, id);

                })
            })
                .catch((error) => {
                    console.log(error);
                    exibeErro("Falha na Conexão");
                });
        })


}

function criarLinha(nome, nomeEvent, desc, data, periodo, id) {
    const tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');
    tr.id = id;
    let tdNomeProf = document.createElement('td');
    let tdNomeEvento = document.createElement('td');
    let tdData = document.createElement('td');
    let tdPeriodo = document.createElement('td');
    let tdBtn = document.createElement('td');
    let tdBtnDel = document.createElement('td');

    if (nomeEvent.length > 40) {
        nomeEvent = nomeEvent.slice(0, -20) + "...";
    }

    tbody.appendChild(tr);

    if (periodo == 1) {
        tdPeriodo.className = 'mat';
        periodo = 'Matutino';
    } else if (periodo == 2) {
        tdPeriodo.className = 'ves';
        periodo = 'Vespertino';
    } else if (periodo == 3) {
        tdPeriodo.className = 'not';
        periodo = 'Noturno';
    } else {
        tdPeriodo.className = 'diaT';
        periodo = 'O Dia Todo';
    }

    tdNomeProf.innerText = nome;
    tdNomeEvento.innerText = nomeEvent;
    tdData.innerText = formatDateOther(data);
    tdPeriodo.innerText = periodo;

    const btnEdit = document.createElement('button');
    arrumaEdtBtn(btnEdit);

    const btnExibir = document.createElement('button');
    arrumaBtnExibe(btnExibir);

    btnExibir.addEventListener('click', function (e) {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        myModal.show();
        getElementsByEdit(id);
        document.getElementById('start').disabled = true;
        document.getElementById('title').disabled = true;
        document.getElementById('description').disabled = true;
        document.getElementById('periodo').disabled = true;
        document.getElementById('btnEliminar').style.display = 'none';
        document.getElementById('btnSalvarEditar').style.display = 'none';
    })

    btnEdit.addEventListener('click', function (e) {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        getElementsByEdit(id);
        if (data > getDataFormat()) {
            myModal.show();
        }

        idd = id;

        const btnSalvar = document.getElementById('btnSalvarEditar');
        btnSalvar.addEventListener('click', editarEventoModal);

        const btnDeletar = document.getElementById('btnEliminar');
        btnDeletar.addEventListener('click', deletarEventoModal);
    });

    const btnDel = document.createElement('button');
    arrumaExclBtn(btnDel);
    btnDel.addEventListener('click', function (e) {
        e.preventDefault();
        if (data > getDataFormat()) {
            deletaEvento(id);
        } else {
            exibeErro('Evento Antigo');
        }
    });

    if (data > getDataFormat()) {

    } else {
        btnEdit.disabled = true;
        btnEdit.className = "editt";
        btnDel.disabled = true;
        btnDel.className = "deletee";
    }

    if (!(nome == payload.name)) {
        btnEdit.disabled = true;
        btnEdit.className = "editt";
        btnDel.disabled = true;
        btnDel.className = "deletee";
    }

    tr.appendChild(tdNomeProf);
    tr.appendChild(tdNomeEvento);
    tr.appendChild(tdData);
    tr.appendChild(tdPeriodo);/* 
    tr.appendChild(tdBtn);
    tdBtn.appendChild(btnEdit); */
    tr.appendChild(tdBtnDel);
    tdBtnDel.appendChild(btnExibir);
}

function arrumaBtnExibe(b) {
    b.className = 'info';
    b.innerHTML = "<i class='bx bx-info-circle'></i>";
    return b;
}

const editarEventoModal = (e) => {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    e.preventDefault();
    var data = document.getElementById('start');
    var title = document.getElementById('title');
    var description = document.getElementById('description');
    var erro = 0;
    var checkDay = new Date(formatDate(data.value, 'yyyy-MM-dd'));

    const select = document.getElementById('periodo').value;
    if (select == 0) {
        msg = "Por favor, selecione um periodo"
        erro++;
    } else if (description.value == '') {
        msg = "Por favor, insira uma Descrição !";
        erro++;
    } else if (title.value == '') {
        msg = "Por favor, insira um Título !";
        erro++;
    } else if (getDataFormatSomOne() > data.value) {
        msg = "Data inserida inválida";
        erro++;
    } else if (checkDay.getDay() == 5) {
        msg = "Indisponivel aos Domingos";
        erro++;
    }
    if (erro > 0) {
        exibeErro(msg);
        closeModal();
        msg = '';

    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const select = document.getElementById('periodo').value;
        var color = getSelectColor(select);

        let evento_editar = {
            id,
            title: title.value,
            periodo: select,
            start: data.value,
            description: description.value,
            color,
            usuario: payload
        }

        myModal.dispose();
        // url = 'http://localhost:8080/api/tarefas';
        // url = 'http://10.92.198.38:8080/api/tarefas';
        url = 'http://10.92.198.38:8080/api/tarefas';
        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(evento_editar),
            headers: myHeaders
        }
        const newUrl = url + "/" + id;

        fetch(newUrl, fetchData)
            .then((resp) => {
                resp.json().then((resposta) => {
                    if (resp.status == 409) {
                        closeModal();
                        exibeErro("Periodo já existente");
                    }
                    if (resp.status == 200) {
                        window.location.replace('listaEventos.html');
                    }
                })
                    .catch((error) => {
                        console.log("catch : " + resp.status)
                        if (resp.status == 409) {
                            closeModal();
                            exibeErro("Periodo já existente");
                        }
                        if (resp.status == 200) {
                            window.location.replace('listaEventos.html');
                        }
                        if (resp.status == 226) {
                            closeModal();
                            exibeErro("Todo o Periodo está ocupado");
                        }
                        if (resp.status == 200) {
                            window.location.replace('listaEventos.html');
                        }
                        if (resp.status == 400) {
                            closeModal();
                            exibeErro("Todo o periodo já está utilizado");
                        }

                    });
            })
    }
}

const deletarEventoModal = (e) => {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    myModal.hide();

    e.preventDefault();
    const myHeaders = new Headers();
    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    }
    // url = 'http://localhost:8080/api/tarefas';
    url = 'http://10.92.198.38:8080/api/tarefas';
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            // exibeErro("Excluido com sucesso !")
            setTimeout(function () {
                window.location.replace('listaEventos.html')
            }, 0);
        })
        .catch((error) => {
            closeModal();
            exibeErro("Não foi possível excluir o Evento");
        });
}

function arrumaEdtBtn(b) {
    b.className = 'edit';
    b.innerHTML = '<i class="bx bx-edit"></i>';
    return b;
}

function arrumaExclBtn(b) {
    b.className = 'delete';
    b.innerHTML = '<i class="bx bx-trash"></i>';
    return b;
}

function deletaEvento(id) {

    const myHeaders = new Headers();
    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    }
    // url = 'http://localhost:8080/api/tarefas';
    url = 'http://10.92.198.38:8080/api/tarefas';
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            window.location.replace('listaEventos.html')
        })
        .catch((error) => {
            closeModal();
            exibeErro("Não foi possível excluir o Evento");
        });
}

function getDataFormat() {
    const date = new Date().toLocaleDateString();
    return dataAtual = date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2);
}

function exibeErro(msg) {
    document.getElementById("mensagem").textContent = msg;

    document.getElementById("info").className = 'alert show showAlert';
    setTimeout(function () {
        document.getElementById("info").className = 'alert hide showAlert';
    }, 3000);

    var btn = document.querySelector(".close-btn");
    btn.addEventListener('click', function () {
        document.getElementById("info").className = 'alert hide showAlert';
    });
}

function getElementsByEdit(id) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // url = 'http://localhost:8080/api/tarefas';
    url = 'http://10.92.198.38:8080/api/tarefas';
    let fetchData = {
        method: 'GET',
        headers: myHeaders
    }

    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resp) => {
            resp.json().then((info) => {
                console.log(info.title)
                document.getElementById('title').value = info.title;
                document.getElementById('description').value = info.description;
                var data = document.getElementById('start');
                data.value = info.start;
                let a = transformBgColorInNumber(info.color);
                if (a == 1) {
                    setOptionSelected(1);
                } else if (a == 2) {
                    setOptionSelected(2);
                } else if (a == 3) {
                    setOptionSelected(3);
                } else {
                    setOptionSelected(4);
                }
            })
                .catch((error) => {
                    exibeErro(error);
                });
        })
}

function transformBgColorInNumber(___c) {
    if (___c == '#FF4F4C') {
        return 1;
    } else if (___c == '#DE0F00') {
        return 2;
    } else if (___c == '#A60A27') {
        return 3;
    } else {
        return 0;
    }
}

function setOptionSelected(z) {
    var opt = "#opt" + z;
    const $select = document.querySelector("#periodo");
    const $option = $select.querySelector(opt);
    $select.value = $option.value;
}

function closeModal() {
    var btn = document.getElementById("btn-cancel");
    btn.addEventListener('click', function () {
        window.location.replace('listaEventos.html');
    })
    var btn1 = document.getElementById("btn-close");
    btn1.addEventListener("click", function () {
        window.location.replace('listaEventos.html');
    });
}

function getSelectColor(z) {
    if (z == 1) {
        color = '#FF4F4C'
    } else if (z == 2) {
        color = '#DE0F00'
    } else if (z == 3) {
        color = '#A60A27';
    } else {
        color = '#83818C'
    }
    return color;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function getDataFormatSomOne() {
    const date = new Date().toLocaleDateString();
    return dataAtual = date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2) + 1;
}

function formatDateOther(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getUTCDay(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day, month, year].join('/');
}

function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}
let array = []
let array1 = []

fetch('http://10.92.198.38:8080/api/tarefas/autocomplete')
    .then((resp) => {
        resp.json().then((resposta) => {
            console.log(resposta)
            var arr = resposta.map(function (obj) {
                return Object.keys(obj).map(function (key) {
                    if (!array.includes(obj[key])) {
                        array.push(obj[key])
                    }
                    sessionStorage.setItem("input", "");
                    return obj[key];

                });
            });

            for (let i = 1; i <= array.length; i++) {
                if (array[i].match(/^\d{4}([./-])\d{2}\1\d{2}$/))
                    array[i] = formatDateOther(array[i])

            }

        })

    })



console.log(array)
/*An array containing all the country names in the world:*/

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("input-busca"), array);

function formatDateOther(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + (d.getDate() + 1),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day, month, year].join('/');
}

function FormataStringData(data) {
    var dia = data.split("/")[0];
    var mes = data.split("/")[1];
    var ano = data.split("/")[2];

    return ano + '-' + ("0" + mes).slice(-2) + '-' + ("0" + dia).slice(-2);
    // Utilizo o .slice(-2) para garantir o formato com 2 digitos.
}