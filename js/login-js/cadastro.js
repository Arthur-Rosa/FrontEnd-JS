const user = JSON.parse(sessionStorage.getItem("usuario"));
if (user == null) {
    window.location.replace('../login/login.html')
}
const bt_cadastrar = document.querySelector('#bt_cadastrar');
const input_email = document.getElementById('email')
const input_nome = document.getElementById('nome')
const input_senha = document.getElementById('senha')
const input_repita = document.getElementById('repita_senha')

var url = 'http://10.92.198.38:8080/api/usuarios'

bt_cadastrar.addEventListener("click", function exec(e) {
    e.preventDefault()
    var msg = "Insira uma senha";
    var erro = '';

    if (input_senha.value == '') {
        msg = "Por favor, digite a Senha !";
        erro++;
    } else if (input_repita.value == '') {
        msg = "Por favor, Confirme a senha";
        erro++;
    } else if (!(input_senha.value == input_repita.value)) {
        msg = "Senhas diferentes !";
        erro++;
    }

    if (erro > 0) {
        exibeErro(msg);
        msg = '';
    } else {
        // alert(user.id)
        let usuario1 = {
            id: user.id,
            nome: user.nome,
            email: user.email,
            tipoUsuario: user.tipoUsuario,
            matricula: user.matricula,
            dataNascimento: user.dataNascimento,
            ativo: true,
            senha: input_senha.value
        }

        const fetchData = {
            method: "PUT",
            body: JSON.stringify(usuario1),
            headers: {
                'Content-Type': 'application/json', mode: 'no-cors'
            },
        }

        // console.log(JSON.stringify(usuario1));
        fetch(url, fetchData)
            .then((resp) => {
                resp.json().then((resposta) => {
                    // alert("Conta cadastra com sucesso realize o login")
                    document.querySelector('#bt_cadastrar').disabled = true;
                    document.querySelector('#bt_cadastrar').className = 'colorBotton';
                    exibeSuccess("Salvo com sucesso!")
                    setTimeout(function () {
                        // nome e email
                        let obj = {
                            nome: user.nome,
                            email: user.email
                        }
                        sendMail(obj);
                        
                    }, 1000)
                    
                }).catch((error) => {
                    console.log(error)
                    if (resp.status == 401) {
                        alert("usuario ou senha incorretos")
                    }
                })
            })
    }

})

async function sendMail(obj) {
    let fetchMail = {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    }
    var q = false;
    var url = 'https://emailapi-production.up.railway.app/send';
    await fetch(url, fetchMail).then((resp) => {
        console.log(obj)
        console.log(resp)
        window.location.replace("../../templates/login/login.html");

    }).catch((err) => {
        console.log(err)
        exibeErro(err)
        window.location.replace("../../templates/login/login.html");

    })
}

function exibeErro(msg) {
    document.getElementById("mensagem").textContent = msg;

    document.getElementById("info").className = 'alert show showAlert';
    setTimeout(function () {
        document.getElementById("info").className = 'alert hide showAlert';
    }, 3000);

    var btn = document.querySelector(".close-btn");
    btn.className = 'close-btn';
    btn.addEventListener('click', function () {
        document.getElementById("info").className = 'alert hide showAlert';
    });
}

function exibeSuccess(msg) {
    document.getElementById("mensagemSuccess").textContent = msg;

    document.getElementById("infoSuccess").className = 'alertSuccess showSuccess showAlertSuccess';
    setTimeout(function () {
        document.getElementById("infoSuccess").className = 'alertSuccess hideSuccess showAlertSuccess';
    }, 3000);

    var btn = document.querySelector(".close-btnSuccess");
    btn.className = 'close-btnSuccess';
    btn.addEventListener('click', function () {
        document.getElementById("infoSuccess").className = 'alertSuccess hideSuccess showAlertSuccess';
    });
}