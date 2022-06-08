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

bt_busca.addEventListener('click', buscar);

let url = 'http://10.92.198.38:8080/api/usuarios/pageAdms';

input.addEventListener('keyup', function (e) {
    var key = e.which || e.keyCode;
    if (key == 13) { // codigo da tecla enter
        // colocas aqui a tua função a rodar
        buscar()
        input.focus()
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

const paginaAtual = window.location.href
const atributosUrl = paginaAtual.split('?')
// let url = 'http://localhost:8080/api/tarefas';
var idd = '';
if (atributosUrl[1] !== undefined) {
    document.getElementById('numPage').textContent = atributosUrl[1];
    url = url + "/" + atributosUrl[1]
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
if (input.value != "") {
    url = 'http://10.92.198.38:8080/api/usuarios/buscarAdm/' + input.value + '/' + 1
} else {
    let url = 'http://10.92.198.38:8080/api/usuarios/pageAdms/' + atributosUrl[1];
}
var idd = '';
var globalTipo = '';
var globalOn = '';
var mandioca = '';

document.addEventListener('DOMContentLoaded', function () {
    getOfDatabase();

    var ModalNotBoot = document.getElementById('myModal');
    ModalNotBoot.addEventListener('hidden.bs.modal', function (event) {
        var b = document.getElementById('btnEliminar');
        b.removeEventListener('click', deletarProfModal);
        let btnSalvar = document.getElementById('btnSalvarEditar');
        btnSalvar.removeEventListener('click', editarProfModal);
        let btnProf = document.getElementById('btnSalvarProf');
        btnProf.removeEventListener('click',);
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
                let profs = info.content;
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
                } else
                    bt_next.removeEventListener('click', listenerNext)
                bt_back.addEventListener('click', listenerBack)
                bt_back.style.display = 'block';
                if (atributosUrl[1] == 1) {
                    bt_back.removeEventListener('click', listenerBack)
                    bt_back.style.display = 'none';
                }
                if (profs.length == 0) {
                    document.getElementById('notEvent').style.display = 'block';
                }
                return profs.map((prof) => {
                    id = prof.id;
                    globalTipo = prof.tipoUsuario;
                    globalOn = prof.ativo;
                    console.log(prof)
                    criarLinha(prof.nome, prof.matricula, prof.email, prof.ativo, id);
                })
            })
                .catch((error) => {
                    console.log(error);
                    exibeErro("Falha na Conexão");
                });
        })
}

function criarLinha(nome, numMat, email, on, id) {
    const tbody = document.querySelector('tbody');
    let tr = document.createElement('tr');
    tr.id = id;

    let tdNomeProf = document.createElement('td');
    let tdMat = document.createElement('td');
    let tdEmail = document.createElement('td');
    let tdOnOff = document.createElement('td');
    let tdBtn = document.createElement('td');
    let tdBtnDel = document.createElement('td');

    tbody.appendChild(tr);

    if (on === true) {
        on = 'Cadastrado';
    } else {
        on = 'Não Cadastrado';
    }

    tdNomeProf.innerText = nome;
    tdMat.innerText = numMat;
    tdEmail.innerText = email;
    tdOnOff.innerText = on;

    const btnEdit = document.createElement('button');
    arrumaEdtBtn(btnEdit);


    document.getElementById('id').value = id;

    btnEdit.addEventListener('click', function (e) {
        var myModal = new bootstrap.Modal(document.getElementById('myModal'));
        getElementsByEdit(id);
        editNavToEdit();
        document.getElementById('senha1').style.display = 'block';
        document.getElementById('senha2').style.display = 'block';
        document.getElementById('data').style.display = 'none';

        document.getElementById('btnSalvarProf').style.display = 'none';
        mandioca = id;

        if (on == 'Não Cadastrado') {
            exibeErro("Usuário não cadastrado");
            document.getElementById('senha').disabled = true;
            document.getElementById('senha-cnf').disabled = true;

            document.getElementById('btnEliminar').style.display = 'none';
            document.getElementById('btnSalvarEditar').style.display = 'none';
        } else {
            document.getElementById('senha').disabled = false;
            document.getElementById('senha-cnf').disabled = false;

            document.getElementById('btnEliminar').style.display = 'block';
            document.getElementById('btnSalvarEditar').style.display = 'block';
        }
        myModal.show();

        idd = id;

        const btnSalvar = document.getElementById('btnSalvarEditar');
        btnSalvar.addEventListener('click', editarProfModal);

        const btnDeletar = document.getElementById('btnEliminar');
        btnDeletar.addEventListener('click', deletarProfModal);
    });

    const btnDel = document.createElement('button');
    arrumaExclBtn(btnDel);
    btnDel.addEventListener('click', function (e) {
        e.preventDefault();
        deletarProfModalUnique(tr.id);
    });
    console.log(payload)
    tr.appendChild(tdNomeProf);
    tr.appendChild(tdMat);
    tr.appendChild(tdEmail);
    tr.appendChild(tdOnOff);
    tr.appendChild(tdBtn);
    tdBtn.appendChild(btnEdit);
    tr.appendChild(tdBtnDel);
    tdBtnDel.appendChild(btnDel);
}

function getElementsByEdit(id) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // url = 'http://localhost:8080/api/tarefas';
    url = 'http://10.92.198.38:8080/api/usuarios';
    let fetchData = {
        method: 'GET',
        headers: myHeaders
    }

    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resp) => {
            resp.json().then((info) => {
                console.log(info)
                document.getElementById('email').value = info.email;
                document.getElementById('nome').value = info.nome;
                document.getElementById('matricula').value = info.matricula;

                document.getElementById('email').disabled = true;
                document.getElementById('nome').disabled = true;
                document.getElementById('matricula').disabled = true;

            })
                .catch((error) => {
                    exibeErro(error);
                });
        })
}

function editNavToCreate() {
    document.getElementById('titulo').textContent = 'Criar Professor'
    document.getElementById('titulo').style.color = 'white';
    document.getElementById('bgEvent').className = 'modal-header bg-success';
}

function editNavToEdit() {
    document.getElementById('titulo').textContent = 'Editar Professor'
    document.getElementById('titulo').style.color = 'black';
    document.getElementById('bgEvent').className = 'modal-header bg-warning';
}


document.getElementById('novoProf').addEventListener('click', function () {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    myModal.show();
    editNavToCreate();
    let email = document.getElementById('email').value = '';
    let nome = document.getElementById('nome').value = '';
    let mat = document.getElementById('matricula').value = '';
    let data = document.getElementById('data').value = '';

    document.getElementById('email').disabled = false;
    document.getElementById('nome').disabled = false;
    document.getElementById('matricula').disabled = false;
    document.getElementById('senha1').style.display = 'none';
    document.getElementById('senha2').style.display = 'none';
    document.getElementById('data').style.display = 'block';
    document.getElementById('btnSalvarEditar').style.display = 'none';
    document.getElementById('btnSalvarProf').style.display = 'block';
    document.getElementById('btnSalvarProf').addEventListener('click', criarProfessor);
});

const criarProfessor = (e) => {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));

    let email = document.getElementById('email').value;
    let nome = document.getElementById('nome').value;
    let mat = document.getElementById('matricula').value;
    let data = document.getElementById('data-input').value;

    var erro = '';
    var msg = '';

    if (email.value == '') {
        msg = "Por favor, digite o email !";
        erro++;
    } else if (nome.value == '') {
        msg = "Por favor, digite o Nome";
        erro++;
    } else if (mat.value == '') {
        msg = "Por favor, digite o NIF";
        erro++;
    } else if (data.value == '') {
        msg = "Por favor, digite a Data";
        erro++;
    }
    if (erro > 0) {
        exibeErro(msg);
        closeModal();
        msg = '';

    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let usuario_criar = {
            nome,
            email,
            matricula: mat,
            dataNascimento: data,
            ativo: 0,
            tipoUsuario: 0
        }

        myModal.dispose();
        url = 'http://10.92.198.38:8080/api/usuarios/cadastrar';

        let fetchData = {
            method: 'POST',
            body: JSON.stringify(usuario_criar),
            headers: myHeaders
        }

        fetch(url, fetchData)
            .then((resp) => {
                resp.json().then((resposta) => {
                    if (resp.status == 409) {
                        closeModal();
                        exibeErro("");
                    }
                    if (resp.status == 200) {
                        window.location.replace('listaProf.html');
                    }
                })
                    .catch((error) => {
                        console.log("catch : " + resp.status)
                        if (resp.status == 201) {
                            window.location.replace('listaProf.html');
                        }
                        if (resp.status == 409) {
                            exibeErro("Matricula ja utilizada");
                        }
                        if (resp.status == 422) {
                            exibeErro("E-mail ja utilizado");
                        }
                        if (resp.status == 200) {
                            window.location.replace('listaProf.html');
                        }
                        if (resp.status == 226) {
                            closeModal();
                            exibeErro("");
                        }
                        if (resp.status == 400) {
                            closeModal();
                            exibeErro("");
                        }

                    });
            })
    }
}

const editarProfModal = (e) => {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    e.preventDefault();

    id = mandioca;


    var erro = 0;
    var senha = document.getElementById('senha');
    var senhacf = document.getElementById('senha-cnf');

    if (senha.value == '') {
        msg = "Por favor, digite a Senha !";
        erro++;
    } else if (senhacf.value == '') {
        msg = "Por favor, Confirme a senha";
        erro++;
    } else if (!(senha.value == senhacf.value)) {
        msg = "Senhas diferentes !";
        erro++;
    }
    if (erro > 0) {
        exibeErro(msg);
        closeModal();
        msg = '';

    } else {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        let usuario_editar = {
            id,
            senha: senha.value
        }

        myModal.dispose();
        url = 'http://10.92.198.38:8080/api/usuarios';

        let fetchData = {
            method: 'PUT',
            body: JSON.stringify(usuario_editar),
            headers: myHeaders
        }
        const newUrl = url + "/" + id;

        fetch(newUrl, fetchData)
            .then((resp) => {
                resp.json().then((resposta) => {
                    if (resp.status == 409) {
                        closeModal();
                        exibeErro("");
                    }
                    if (resp.status == 200) {
                        window.location.replace('listaProf.html');
                    }
                })
                    .catch((error) => {
                        console.log("catch : " + resp.status)
                        if (resp.status == 409) {
                            closeModal();
                            exibeErro("");
                        }
                        if (resp.status == 200) {
                            window.location.replace('listaProf.html');
                        }
                        if (resp.status == 226) {
                            closeModal();
                            exibeErro("");
                        }
                        if (resp.status == 400) {
                            closeModal();
                            exibeErro("");
                        }

                    });
            })
    }
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

function deletarProfModalUnique(id) {
    const myHeaders = new Headers();
    let fetchData = {
        method: 'PUT',
        headers: myHeaders
    }

    // url = 'http://localhost:8080/api/tarefas';
    url = 'http://10.92.198.38:8080/api/usuarios';
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            // exibeErro("Excluido com sucesso !")
            setTimeout(function () {
                window.location.replace('listaProf.html');
            }, 0);
        })
        .catch((error) => {
            closeModal();
            exibeErro("Não foi possível excluir");
        });
}

const deletarProfModal = (e) => {
    var myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
    myModal.hide();
    console.log('entroooooou')
    id = document.getElementById('id').value;
    // alert(id);
    e.preventDefault();
    const myHeaders = new Headers();
    let fetchData = {
        method: 'DELETE',
        headers: myHeaders
    }

    // url = 'http://localhost:8080/api/tarefas';
    url = 'http://10.92.198.38:8080/api/usuarios';
    const newUrl = url + "/" + id;
    fetch(newUrl, fetchData)
        .then((resposta) => {
            // exibeErro("Excluido com sucesso !")
            setTimeout(function () {
                window.location.replace('listaProf.html')
            }, 0);
        })
        .catch((error) => {
            closeModal();
            exibeErro("Não foi possível excluir");
        });
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
        window.location.replace('listaProf.html');
    })
    var btn1 = document.getElementById("btn-close");
    btn1.addEventListener("click", function () {
        window.location.replace('listaProf.html');
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


//Buscar e autocomplete
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

fetch('http://10.92.198.38:8080/api/usuarios/autocompleteAdm')
    .then((resp) => {
        console.log(array)
        resp.json().then((resposta) => {
            var arr = resposta.map(function (obj) {
                return Object.keys(obj).map(function (key) {
                    array.push(obj[key])
                    sessionStorage.setItem("input", "");
                    return obj[key];

                });
            });

        })
    })
console.log(array)
/*An array containing all the country names in the world:*/

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("input-busca"), array);

window.onbeforeunload = function () {
    // sessionStorage.setItem("input-prof", "");
};