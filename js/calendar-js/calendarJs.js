// const url = 'http://api-auditorio.herokuapp.com/api/tarefas';
const url = 'http://10.92.198.38:8080/api/tarefas';
let id = '';

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
    });

    var nav = document.getElementById('bgEvent');
    nav.className = 'modal-header';
    var calendarEl = document.getElementById('calendar');
    setMyModalCreate(myModal);

    var calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'pt-br',
        navLinks: false,

        eventClick: function (info) {
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
            setDescriptionGetOfDatabase(id);

            let btnSalvar = document.getElementById('btnSalvarEditar');
            var data = document.getElementById('start');
            var description = document.getElementById('description');
            var evento = document.getElementById('title');
            nav.className = 'modal-header bg-warning';

            data.value = info.event.startStr;
            evento.value = info.event.title;

            var b = document.getElementById('btnEliminar');
            b.style.display = 'block';

            btnSalvar.addEventListener('click', editaEvento);
            b.addEventListener('click', deletaEvento)

            myModal.show();
        },

        eventDrop: function (info) {

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
                url: url,
                method: 'GET',
                failure: function () {
                    exibeErro("Error", "Não foi possível carregar os Eventos...");
                },
            }
        ],

        dateClick: function (info) {
            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            setToCreateEvent();
            if (info.dateStr >= getDataFormat()) {
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
    }
    if (erro > 0) {
        exibeErro(msg);
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
            color
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
                        exibeErro("Periodo já existente");
                    }
                    if (resp.status == 200) {
                        window.location.replace('index.html');
                    }
                })
                    .catch((error) => {
                        console.log("catch : " + resp.status)
                        if (resp.status == 409) {
                            exibeErro("Periodo já existente");
                        }
                        if (resp.status == 200) {
                            window.location.replace('index.html');
                        }
                        if (resp.status == 226) {
                            exibeErro("Periodo já existente");
                        }
                        if (resp.status == 200) {
                            window.location.replace('index.html');
                        }

                    });
            })
    }
}

const deletaEvento = (e) => {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    myModal.hide();

    exibeErro(`Você deseja mesmo excluir o Evento ?`);

    // decidir

    botaoModalAlert.addEventListener('click', function (e) {
        e.preventDefault();
        const myHeaders = new Headers();
        let fetchData = {
            method: 'DELETE',
            headers: myHeaders
        }
        const newUrl = url + "/" + id;
        fetch(newUrl, fetchData)
            .then((resposta) => {
                // console.log(resposta);
                window.location.replace('index.html');
            })
            .catch((error) => {
                // console.log(error);
                setModalError(modalAlert, "Error", "Não foi possível excluir o Evento");
            });

        console.log("entro aqui so pra ter certeza")
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
            color: color
        }

        myModal.hide();

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
                    console.log(resposta)
                    window.location.replace('index.html');
                })
                    .catch((error) => {
                        fetchDataa.clear
                        console.log(resp)
                        if (resp.status == 226) {
                            setModalErrorAfter(myModal, modalAlert, "Error", "O Período já está sendo utilizado");
                        } else if (resp.status == 409) {
                            setModalErrorAfter(myModal, modalAlert, "Error", "Máximo de eventos no dia");
                        } else if (resp.status == 200) {
                            // limpar();
                            setInterval(window.location.replace('index.html'), 2000);
                        } else if (resp.status == 500) {
                            setModalErrorAfter(myModal, modalAlert, "Error", "Máximo de eventos no dia");
                        } else {
                            setModalError(modalAlert, 'Ocorreu um erro', error);
                        }
                    });
            });
    }
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
        color = '#D99CA7'
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
    // console.log(item.value)
}

function getDataFormat() {
    const date = new Date().toLocaleDateString();
    return dataAtual = date.slice(6, 10) + "-" + date.slice(3, 5) + "-" + date.slice(0, 2);
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
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}


function transformBgColorInNumber(___c) {
    if (___c == '#D99CA7') {
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
}

function setToEditEvent() {
    document.getElementById('btnAction').style.display = 'none';
    document.getElementById('btnSalvarEditar').style.display = 'block';

    var nav = document.getElementById('bgEvent');
    var navText = document.getElementById('titulo');
    navText.textContent = 'Editar Evento'
    navText.style.color = 'black';
    nav.className = 'modal-header bg-warning';
    document.getElementById("start").disabled = false;
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
    setTimeout(function() {
        document.getElementById("info").className = 'alert hide showAlert';
    }, 3000);

    var btn = document.querySelector(".close-btn");
    btn.addEventListener('click', function() {
        document.getElementById("info").className = 'alert hide showAlert';
    });
}