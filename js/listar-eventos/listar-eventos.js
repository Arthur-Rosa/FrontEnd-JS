const url = 'http://10.92.198.38:8080/api/tarefas';
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
                let eventos = info;
                return eventos.map((evento) => {
                    id = evento.id;
                    criarLinha('', evento.title, evento.description, evento.start, id);
                });

            })
                .catch((error) => {
                    console.log(error);
                });
        })
}

function criarLinha(nome, nomeEvent, desc, data, id) {
    const tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');
    tr.id = id;
    let tdNomeProf = document.createElement('td');
    let tdNomeEvento = document.createElement('td');
    let tdDesc = document.createElement('td');
    let tdData = document.createElement('td');
    let tdBtn = document.createElement('td');
    let tdBtnDel = document.createElement('td');

    tbody.appendChild(tr);

    tdNomeProf.innerText = nome;
    tdNomeEvento.innerText = nomeEvent;
    tdDesc.innerText = desc;
    tdData.innerText = data;

    const btnEdit = document.createElement('button');
    arrumaEdtBtn(btnEdit);
    btnEdit.addEventListener('click', function (e) {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        getElementsByEdit(id);
        myModal.show();

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


    tr.appendChild(tdNomeProf);
    tr.appendChild(tdNomeEvento);
    tr.appendChild(tdDesc);
    tr.appendChild(tdData);
    tr.appendChild(tdBtn);
    tdBtn.appendChild(btnEdit);
    tr.appendChild(tdBtnDel);
    tdBtnDel.appendChild(btnDel);
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
                        if(resp.status == 400) {
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