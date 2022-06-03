var token = sessionStorage.getItem("token")
if (token == null) {
    window.location.replace('../login/login.html')
}
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
var url = 'http://10.92.198.38:8080/api/solic/buscar/' + payload.id;
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
    window.location.href = atributosUrl.toString().replace(/,/g, "?")
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
                var eventos = info.content;
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
                    console.log(evento)
                    id = evento.id;
                    criarLinha(evento.usuario?.nome, evento.title, evento.description, evento.start, evento.periodo, evento.status, id);
                })
            })
                .catch((error) => {
                    console.log(error);
                    exibeErro("Falha na Conexão");
                });
        })


}

function formatVerMais(b) {
    b.className = 'success';
    b.innerHTML = '<i class="fas fa-plus-circle"></i>';
    b.style.color = 'white';
    return b;
}

function criarLinha(nome, nomeEvent, desc, data, periodo, status, id) {
    const tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');
    tr.id = id;
    let tdNomeProf = document.createElement('td');
    let tdNomeEvento = document.createElement('td');
    let tdData = document.createElement('td');
    let tdStatus = document.createElement('td');
    let tdDetalhes = document.createElement('td');
    let buttonAdc = document.createElement('button');
    arrumaBtnExibe(buttonAdc);

    if (status == 2) {
        tdStatus.className = 'status andamento';
        tdStatus.textContent = 'Andamento';
    }

    if (status == 1) {
        tdStatus.className = 'status confirmado';
        tdStatus.textContent = 'Confirmado';
    } else if (status == 0) {
        tdStatus.className = 'status reprovado';
        tdStatus.textContent = 'Reprovado';
    }

    if (nomeEvent.length > 40) {
        nomeEvent = nomeEvent.slice(0, -30) + "...";
    } else if(nomeEvent.length > 50){
        nomeEvent = nomeEvent.slice(0, -40) + "...";
    } else if(nomeEvent.length > 80){
        nomeEvent = nomeEvent.slice(0, -60) + "...";
    }
    // let tdBtn = document.createElement('td');
    // let tdBtnDel = document.createElement('td');

    tbody.appendChild(tr);

    tdNomeProf.innerText = nome;
    tdNomeEvento.innerText = nomeEvent;
    tdData.textContent = formatDateOther(data);

    buttonAdc.addEventListener('click', function () {
        if (status == 2) {
            document.getElementById('start').disabled = false;
            document.getElementById('title').disabled = false;
            document.getElementById('description').disabled = false;
            document.getElementById('periodo').disabled = false;
            document.getElementById('btnEliminar').style.display = 'block';
            document.getElementById('btnSalvarEditar').style.display = 'block';
        } else {
            document.getElementById('start').disabled = true;
            document.getElementById('title').disabled = true;
            document.getElementById('description').disabled = true;
            document.getElementById('periodo').disabled = true;
            document.getElementById('btnEliminar').style.display = 'none';
            document.getElementById('btnSalvarEditar').style.display = 'none';
        }

        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        getElementsByEdit(id);
        myModal.show();

        const btnSalvar = document.getElementById('btnSalvarEditar');
        btnSalvar.addEventListener('click', editarEventoModal);

        const btnDeletar = document.getElementById('btnEliminar');
        btnDeletar.addEventListener('click', deletarEventoModal);
    })

    tr.appendChild(tdNomeProf);
    tr.appendChild(tdNomeEvento);
    tr.appendChild(tdData);
    tr.appendChild(tdStatus);
    tr.appendChild(tdDetalhes);
    tdDetalhes.appendChild(buttonAdc);
}

function arrumaBtnExibe(b) {
    b.className = 'info';
    b.innerHTML = "<i class='bx bx-info-circle'></i>";
    return b;
}

function formatDateOther(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return [day, month, year].join('/');
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
            status: 2,
            usuario: payload
        }

        myModal.dispose();
        // url = 'http://localhost:8080/api/tarefas';
        // url = 'http://10.92.198.38:8080/api/tarefas';
        url = 'http://10.92.198.38:8080/api/solic';
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
                        window.location.replace('listaSolicitacoes.html');
                    }
                })
                    .catch((error) => {
                        console.log("catch : " + resp.status)
                        if (resp.status == 409) {
                            closeModal();
                            exibeErro("Periodo já existente");
                        }
                        if (resp.status == 200) {
                            window.location.replace('listaSolicitacoes.html');
                        }
                        if (resp.status == 226) {
                            closeModal();
                            exibeErro("Todo o Periodo está ocupado");
                        }
                        if (resp.status == 200) {
                            window.location.replace('listaSolicitacoes.html');
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
    url = 'http://10.92.198.38:8080/api/solic';
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            // exibeErro("Excluido com sucesso !")
            setTimeout(function () {
                window.location.replace('listaSolicitacoes.html')
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
    url = 'http://10.92.198.38:8080/api/solic';
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            window.location.replace('listaSolicitacoes.html')
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
    url = 'http://10.92.198.38:8080/api/solic';
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

function formatDateOther(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getUTCDate(),
        year = d.getFullYear();

    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return [day, month, year].join('/');
}

function getDataFormatSomOne() {
    const date = new Date().toLocaleDateString();
    return dataAtual = date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2) + 1;
}