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
console.log(payload)
setSolicitacoes(payload.id);
document.getElementById('nameSpt').textContent = "Olá " + payload.name;
const urlTarefas = 'http://10.92.198.38:8080/api/tarefas';
// const url = 'http://10.92.198.38:8080/api/solic';
// const urlTarefas = 'http://10.92.198.38:8080/api/solic';
const urlSolicAllEDT = 'http://10.92.198.38:8080/api/solic/semId/' + payload.id;
// const url = 'http://api-auditorio.herokuapp.com/api/tarefas';
const url = 'http://10.92.198.38:8080/api/tarefas';
let id = '';
var idSolic = '';

document.addEventListener('DOMContentLoaded', function () {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    var modalNotBoot = document.getElementById('myModal');

    modalNotBoot.addEventListener('hidden.bs.modal', function (event) {
        console.log("fecchou hidden")
        var a = bootstrap.Modal.getInstance(document.querySelector("#myModal"))
        a.dispose();
        var b = document.getElementById('btnEliminar');
        b.removeEventListener('click', deletaEvento);
        let btnSalvar = document.getElementById('btnSalvarEditar');
        btnSalvar.removeEventListener('click', editaEvento);
        let btnAction = document.getElementById('btnAction');
        btnAction.removeEventListener('click', criaEvento);
        var aprovar = document.getElementById('btnAprovar');
        aprovar.removeEventListener('click', aprovarSolicit);
    });

    var nav = document.getElementById('bgEvent');
    nav.className = 'modal-header';
    var calendarEl = document.getElementById('calendar');
    setMyModalCreate(myModal);

    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        navLinks: false,
        eventClick: function (info) {
            console.log(info.el.className)

            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            let idd = info.event.id;
            id = idd;
            var data = document.getElementById('start');

            let a = transformBgColorInNumber(info.event.backgroundColor);
            if (a == 1) {
                setOptionSelected(1);
            } else if (a == 2) {
                setOptionSelected(2);
            } else if (a == 3) {
                setOptionSelected(3);
            } else {
                setOptionSelected(4);
            }
            setToEditEvent();


            var b = document.getElementById('btnEliminar');
            b.style.display = 'block';
            document.getElementById('btnReprovar').style.display = 'none';
            document.getElementById('btnAprovar').style.display = 'none';
            document.getElementById('bgProf').style.display = 'none';

            if (info.event.startStr <= getDataFormat()) {
                setDescriptionGetOfDatabase(id);
                document.getElementById('title').disabled = true;
                document.getElementById('description').disabled = true;
                document.getElementById("start").disabled = true;
                document.getElementById('periodo').disabled = true;
                getOnNone(document.getElementById('btnEliminar'));
                getOnNone(document.getElementById('btnSalvarEditar'));
                document.getElementById('btnReprovar').style.display = 'none';
                document.getElementById('btnAprovar').style.display = 'none';
                document.getElementById('bgProf').style.display = 'none';
            } else if (info.el.className == 'fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-start fc-event-end fc-event-future solictAll') {
                document.getElementById('title').disabled = true;
                document.getElementById('description').disabled = true;
                document.getElementById("start").disabled = true;
                document.getElementById('periodo').disabled = true;
                getOnNone(document.getElementById('btnEliminar'));
                clearBtns();

                idSolic = idd;

                setDescriptionGetOfDatabaseOther(idSolic);

                var reprovar = document.getElementById('btnReprovar');
                var aprovar = document.getElementById('btnAprovar');

                reprovar.addEventListener('click', reprovarSolicit);
                aprovar.addEventListener('click', aprovarSolicit);
            } else {
                setDescriptionGetOfDatabase(id);
            }

            let btnSalvar = document.getElementById('btnSalvarEditar');
            var data = document.getElementById('start');
            var description = document.getElementById('description');
            var evento = document.getElementById('title');
            nav.className = 'modal-header bg-warning';

            data.value = info.event.startStr;
            evento.value = info.event.title;

            btnSalvar.addEventListener('click', editaEvento);
            b.addEventListener('click', deletaEvento)

            myModal.show();
        },

        initialView: 'dayGridMonth',
        selectable: false,
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth listWeek',
        },
        buttonText: {
            today: 'Hoje'
        },
        customButtons: {
            exampleButton: {
                ico: 'fa-chevron-left',
                click: function () { }
            },
        },
        initialDate: new Date(),

        eventSources: [
            {
                url: urlTarefas,
                method: 'GET',
                failure: function () {
                    exibeErro("Não foi possível conectar a API");
                },
            },
            {
                url: urlSolicAllEDT,
                method: 'GET',
                failure: function () {
                    exibeErro("Não foi possível conectar a API");
                },
                className: 'solictAll',   // a non-ajax option
                textColor: 'white' // a non-ajax option
            },
        ],
        dateClick: function (info) {
            var checkDay = new Date(formatDate(info.dateStr, 'yyyy-MM-dd'));
            document.getElementById('bgProf').style.display = 'none';
            document.getElementById('btnReprovar').style.display = 'none';
            document.getElementById('btnAprovar').style.display = 'none';
            // checkDay.getDay() == 4
            if (checkDay.getDay() == 5) {
                exibeErro("Indisponivel aos Domingos");
            } else {
                var myModal = new bootstrap.Modal(document.getElementById('myModal'));
                setToCreateEvent();
                if (info.dateStr > getDataFormat()) {
                    limpar();
                    var b = document.getElementById('btnEliminar');
                    getOnNone(b);
                    setOptionSelected(0);
                    var data = document.getElementById('start');
                    data.value = info.dateStr;
                    // data.value = info.dateStr;
                    myModal.show();

                    const btnAction = document.getElementById('btnAction');
                    btnAction.addEventListener('click', criaEvento);
                } else {
                    exibeErro("Data Inválida", "Ooops... a data Selecionada já passou");
                }
            }
        }
    });
    calendar.render();
});

const editaEvento = (e) => {
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
                        window.location.replace('index.html');
                    }
                })
                    .catch((error) => {
                        console.log("catch : " + resp.status)
                        if (resp.status == 409) {
                            closeModal();
                            exibeErro("Periodo já existente");
                        }
                        if (resp.status == 200) {
                            window.location.replace('index.html');
                        }
                        if (resp.status == 226) {
                            closeModal();
                            exibeErro("Todo o Periodo está ocupado");
                        }
                        if (resp.status == 200) {
                            window.location.replace('index.html');
                        }
                        if (resp.status == 400) {
                            closeModal();
                            exibeErro("Todo o periodo já está utilizado");
                        }

                    });
            })
    }
}

const deletaEvento = (e) => {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    myModal.hide();

    e.preventDefault();
    const myHeaders = new Headers();
    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    }
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            // exibeErro("Excluido com sucesso !")
            setTimeout(function () {
                window.location.replace('index.html')
            }, 0);
        })
        .catch((error) => {
            closeModal();
            exibeErro("Não foi possível excluir o Evento");
        });

}

const criaEvento = (e) => {
    e.preventDefault();
    var myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    var data = document.getElementById('start');
    var erro = 0;

    myModal.show();

    const select = document.getElementById('periodo').value;
    let msg = '';
    if (select == 0) {
        msg = "Por favor, selecione um periodo"
        erro++;
    } else if (data.value == '') {
        msg = "Por favor, insira uma Data !";
        erro++;
    } else if (description.value == '') {
        msg = "Por favor, insira uma Descrição !";
        erro++;
    } else if (title.value == '') {
        msg = "Por favor, insira um Título !";
        erro++;
    }
    // erro = 1
    if (erro > 0) {
        exibeErro(msg);
        erro = '';
    } else {
        let select = document.getElementById('periodo');
        var color = getSelectColor(select.value);

        let evento_criar = {
            title: title.value,
            periodo: select.value,
            start: data.value,
            description: description.value,
            color: color,
            usuario: payload
        }

        const myHeaderssS = new Headers();
        myHeaderssS.append("Content-Type", "application/json");

        let fetchDataa = {
            method: 'POST',
            body: JSON.stringify(evento_criar),
            headers: myHeaderssS
        }

        fetch(url, fetchDataa)
            .then((resp) => {
                // console.log(resp.status)
                resp.json().then((resposta) => {
                    // console.log(resposta)
                    window.location.replace('index.html');
                })
                    .catch((error) => {
                        console.log(resp)
                        if (resp.status == 226) {
                            closeModal();
                            exibeErro("O Período já está sendo utilizado");
                        } else if (resp.status == 409) {
                            closeModal();
                            exibeErro("Máximo de eventos no dia");
                        } else if (resp.status == 200) {
                            // limpar();
                            setInterval(window.location.replace('index.html'), 2000);
                        } else if (resp.status == 500) {
                            closeModal();
                            exibeErro("Máximo de eventos no dia");
                        } else {
                            closeModal();
                            exibeErro(error);
                        }
                    });
            });
    }
}

function closeModal() {
    var btn = document.getElementById("btn-cancel");
    btn.addEventListener('click', function () {
        window.location.replace('index.html');
    })
    var btn1 = document.getElementById("btn-close");
    btn1.addEventListener("click", function () {
        window.location.replace('index.html');
    });
}

function limpar() {
    var title = document.getElementById('title');
    var description = document.getElementById('description');
    title.value = '';
    description.value = '';
}

function getOnBlock(a) {
    return a.style.display = 'block';
}

function getOnNone(a) {
    a.style.display = 'none';
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

function setModalError(modalAlert, name, description) {
    var tituloInput = document.getElementById('staticBackdropLabel');
    var descricaoInput = document.getElementById('description-alert');
    tituloInput.textContent = name;
    descricaoInput.textContent = description;
    modalAlert.show();
}

function debug() {
    const item = document.getElementById("periodo");
}

function getDataFormat() {
    const date = new Date().toLocaleDateString();
    return dataAtual = date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2);
}

function getDataFormatSomOne() {
    const date = new Date().toLocaleDateString();
    return dataAtual = date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2) + 1;
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

function openModal(z) {
    z.show();
}

function setModalErrorAfter(myModal, modalAlert, name, description) {
    var myModal = bootstrap.Modal.getInstance(document.querySelector('#myModal'));
    console.log(myModal)
    myModal.hide();

    var tituloInput = document.getElementById('staticBackdropLabel');
    var descricaoInput = document.getElementById('description-alert');

    let btnConfirma = document.getElementById('confirmarAcao');
    btnConfirma.textContent = 'Entendi';
    let btnFechar = document.getElementById('fecharBotao');

    btnConfirma.addEventListener('click', function () {
        myModal.show();
    });

    btnFechar.addEventListener('click', function () {
        myModal.show();
    });

    tituloInput.textContent = name;
    descricaoInput.textContent = description;
    modalAlert.show();
}

function setMyModalCreate(m) {
    var btnClose = document.getElementById('btn-close');
    var btnCancel = document.getElementById('btn-cancel');
    btnClose.addEventListener('click', function () {
        m.hide();
    });
    btnCancel.addEventListener('click', function () {
        m.hide();
    });
}

function setToCreateEvent() {
    document.getElementById('btnAction').style.display = 'block';
    document.getElementById('btnSalvarEditar').style.display = 'none';
    var nav = document.getElementById('bgEvent');
    var navText = document.getElementById('titulo');
    navText.textContent = 'Criar Evento'
    navText.style.color = 'white';
    nav.className = 'modal-header bg-success';
    document.getElementById("start").disabled = true;
    document.getElementById("description").value = '';


    document.getElementById('title').disabled = false;
    document.getElementById('description').disabled = false;
    document.getElementById('periodo').disabled = false;
}

function setToEditEvent() {
    document.getElementById('btnAction').style.display = 'none';
    document.getElementById('btnSalvarEditar').style.display = 'block';

    var nav = document.getElementById('bgEvent');
    var navText = document.getElementById('titulo');
    navText.textContent = 'Editar Evento';
    navText.style.color = 'black';
    nav.className = 'modal-header bg-warning';
    document.getElementById("start").disabled = false;
    document.getElementById('title').disabled = false;
    document.getElementById('description').disabled = false;
    document.getElementById('periodo').disabled = false;
}

function setDescriptionGetOfDatabase(id) {
    var urlFindObject = 'http://10.92.198.38:8080/api/tarefas' + "/" + id;

    const bsq = new Headers();
    bsq.append("Content-Type", "application/json");
    let fetchData = {
        method: 'GET',
        headers: bsq
    }
    return fetch(urlFindObject, fetchData)
        .then((resp) => resp.json())
        .then((resposta) => {
            // console.log(resposta)
            document.getElementById('description').value = resposta.description;
        })
        .catch((error) => {
            setModalError(modalAlert, 'Ooops ... ocorreu um erro', error);
        });
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

var o = 0;
function setSolicitacoes(id) {
    var urlFindObject = 'http://10.92.198.38:8080/api/solic/status/2';

    const bsq = new Headers();
    bsq.append("Content-Type", "application/json");
    let fetchData = {
        method: 'GET',
        headers: bsq
    }
    return fetch(urlFindObject, fetchData)
        .then((resp) => resp.json())
        .then((resposta) => {
            console.log(resposta);
            return resposta.map((solicitacao) => {
                
                const solic = document.querySelector('.solicitacoes');
                const bloco = document.createElement('div');
                bloco.className = 'blocos';
                bloco.id = solicitacao.id;
                bloco.addEventListener('click', function () {
                    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
                    let idd = solicitacao.id;
                    id = idd;
                    var data = document.getElementById('start');

                    setToEditEvent();
                    setDescriptionGetOfDatabaseOther(id);

                    var b = document.getElementById('btnEliminar');
                    b.style.display = 'block';

                    if (solicitacao.start <= getDataFormat()) {
                        document.getElementById('title').disabled = true;
                        document.getElementById('description').disabled = true;
                        document.getElementById("start").disabled = true;
                        document.getElementById('periodo').disabled = true;
                        getOnNone(document.getElementById('btnEliminar'));
                        getOnNone(document.getElementById('btnSalvarEditar'));
                    }

                    let btnSalvar = document.getElementById('btnSalvarEditar');
                    var data = document.getElementById('start');
                    var description = document.getElementById('description');
                    var evento = document.getElementById('title');
                    var nav = document.getElementById('bgEvent');
                    nav.className = 'modal-header bg-warning';

                    data.value = solicitacao.start;
                    evento.value = solicitacao.title;

                    btnSalvar.addEventListener('click', editaEvento);
                    b.addEventListener('click', deletaEvento)

                    myModal.show();
                });
                const linha = document.createElement('div');
                linha.className = 'linha';
                const divClose = document.createElement('div');
                const ul = document.createElement('ul');
                const liNome = document.createElement('li');
                liNome.textContent = solicitacao.title;
                const liData = document.createElement('li');
                liData.className = 'data';
                liData.textContent = formatDateOther(solicitacao.start);

                solic.appendChild(bloco);
                bloco.appendChild(linha);
                linha.appendChild(divClose);
                linha.appendChild(ul);
                ul.appendChild(liNome);
                ul.appendChild(liData);
            })
        })
        .catch((error) => {

        });
}

let idd = '';
var o = 0;

function setSolicitacoes(id) {
    // buscar where andamento = 2
    var urlFindObject = 'http://10.92.198.38:8080/api/solic/status/2';

    const bsq = new Headers();
    bsq.append("Content-Type", "application/json");
    let fetchData = {
        method: 'GET',
        headers: bsq
    }
    return fetch(urlFindObject, fetchData)
        .then((resp) => resp.json())
        .then((resposta) => {
            if(resposta.length == 0){
                document.getElementById('ErrorH6').style.display = 'block';
            }
            return resposta.map((solicitacao) => {
                if (solicitacao.status == 2) {
                    const solic = document.querySelector('.solicitacoes');
                    const bloco = document.createElement('div');
                    bloco.className = 'blocos';
                    bloco.id = solicitacao.id;
                    bloco.addEventListener('click', function () {
                        setToEditEvent();
                        clearBtns();

                        var reprovar = document.getElementById('btnReprovar');
                        var aprovar = document.getElementById('btnAprovar');

                        idSolic = bloco.id;
                        reprovar.addEventListener('click', reprovarSolicit);
                        aprovar.addEventListener('click', aprovarSolicit);

                        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
                        idd = solicitacao.id;
                        id = idd;
                        var data = document.getElementById('start');

                        /* if (a == 1) {
                            setOptionSelected(1);
                        } else if (a == 2) {
                            setOptionSelected(2);
                        } else if (a == 3) {
                            setOptionSelected(3);
                        } else {
                            setOptionSelected(4);
                        } */

                        setDescriptionGetOfDatabaseOther(id);
                        setOptionSelected(solicitacao.periodo);

                        // var b = document.getElementById('btnEliminar');
                        // b.style.display = 'block';

                        if (true) {
                            document.getElementById('title').disabled = true;
                            document.getElementById('description').disabled = true;
                            document.getElementById("start").disabled = true;
                            document.getElementById('periodo').disabled = true;
                            getOnNone(document.getElementById('btnEliminar'));
                            getOnNone(document.getElementById('btnSalvarEditar'));
                        }

                        let btnSalvar = document.getElementById('btnSalvarEditar');
                        var data = document.getElementById('start');
                        var description = document.getElementById('description');
                        var evento = document.getElementById('title');
                        var nav = document.getElementById('bgEvent');
                        nav.className = 'modal-header bg-warning';

                        data.value = solicitacao.start;
                        evento.value = solicitacao.title;

                        btnSalvar.addEventListener('click', editaEvento);
                        // b.addEventListener('click', deletaEvento)

                        myModal.show();
                    });
                    const linha = document.createElement('div');
                    linha.className = 'linha';
                    const divClose = document.createElement('div');
                    const ul = document.createElement('ul');
                    const liNome = document.createElement('li');
                    liNome.textContent = solicitacao.title;
                    const liData = document.createElement('li');
                    liData.className = 'data';
                    liData.textContent = formatDateOther(solicitacao.start);

                    solic.appendChild(bloco);
                    bloco.appendChild(linha);
                    linha.appendChild(divClose);
                    linha.appendChild(ul);
                    ul.appendChild(liNome);
                    ul.appendChild(liData);
                }
            })
        })
        .catch((error) => {
            document.getElementById('ErrorH6').style.display = 'block';
        });
}

const reprovarSolicit = (e) => {
    if (!(idSolic == null)) {
        idd = idSolic
    }
    e.preventDefault();
    var urlFindObject = 'http://10.92.198.38:8080/api/solic/reprovar' + "/" + idd;
    let fetchData = {
        method: 'PUT'
    }
    // alert(urlFindObject)
    // alert(idd)
    return fetch(urlFindObject, fetchData)
        .then((resp) => resp.json())
        .then((resposta) => {
            window.location.replace('index.html');
        })
        .catch((error) => {
            console.log(error)
            exibeErro('Ooops ... ocorreu um erro');
        });
}

const aprovarSolicit = (e) => {
    if (!(idSolic == null)) {
        idd = idSolic
    }
    e.preventDefault();
    var urlFindObject = 'http://10.92.198.38:8080/api/solic/aprovar' + "/" + idd;
    let fetchData = {
        method: 'POST'
    }
    return fetch(urlFindObject, fetchData)
        .then((resp) => resp.json())
        .then((resposta) => {
            window.location.replace('index.html');
        })
        .catch((error) => {
            setModalError(modalAlert, 'Ooops ... ocorreu um erro', error);
        });
}

function setDescriptionGetOfDatabaseOther(id) {
    var urlFindObject = 'http://10.92.198.38:8080/api/solic' + "/" + id;

    const bsq = new Headers();
    bsq.append("Content-Type", "application/json");
    let fetchData = {
        method: 'GET',
        headers: bsq
    }
    return fetch(urlFindObject, fetchData)
        .then((resp) => resp.json())
        .then((resposta) => {
            console.log(resposta.usuario.nome)
            document.getElementById('description').value = resposta.description;
            document.getElementById('bgProf').style.display = 'block';
            document.getElementById('professor').value = resposta.usuario.nome;
        })
        .catch((error) => {
            setModalError(modalAlert, 'Ooops ... ocorreu um erro', error);
        });
}

function clearBtns() {
    var nav = document.getElementById('bgEvent');
    var navText = document.getElementById('titulo');
    navText.textContent = 'Aprovar Solicitação';
    navText.style.color = 'black';
    nav.className = 'modal-header bg-warning';

    document.getElementById('btnEliminar').style.display = 'none';
    document.getElementById('btnSalvarEditar').style.display = 'none';

    document.getElementById('btnReprovar').style.display = 'block';
    document.getElementById('btnAprovar').style.display = 'block';
}
