const bt_acessar = document.querySelector('#bt_acessar');
const input_email = document.getElementById('email')
const input_senha = document.getElementById('senha')

//Inputs para o primeiro acesso
const input_nascimento = document.getElementById('input_nascimento')
const input_matricula = document.getElementById('input_matricula')
const bt_prosseguir = document.getElementById('bt_prosseguir')

const myHeaders = new Headers();
const url = 'http://10.92.198.38:8080/api/usuarios/login'
const urlPrimeiroAcesso = 'http://10.92.198.38:8080/api/usuarios/acessar'

myHeaders.append("Content-Type", "application/json");
let msg = "OPsss"

bt_acessar?.addEventListener("click", function (e) {
    e.preventDefault()

    const usuario = {
        email: input_email.value,
        senha: input_senha.value
    }

    const fetchData = {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: myHeaders
    }

    fetch(url, fetchData)
        .then((resp) => {
            resp.json().then((resposta) => {
                sessionStorage.setItem("token", resposta.token);
                const token = parseJwt(resposta.token);
                if (token.TipoUser === "professor") {
                    window.location.href = "../prof/index.html";
                } else if (token.TipoUser === "adm") {
                    window.location.href = "../admin/index.html";
                } else if (token.TipoUser === "suporte") {
                    window.location.href = "../suporte/index.html";
                }
            }).catch((error) => {
                console.log(error)
                if (resp.status == 401) {
                    msg = "Usuário ou senha incorretos"
                    exibeErro(msg)
                }
            })
        })

})

bt_prosseguir?.addEventListener("click", function (e) {
    e.preventDefault();

    const usuario = {
        matricula: input_matricula.value,
        dataNascimento: input_nascimento.value
    }

    const fetchData = {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: myHeaders
    }

    fetch(urlPrimeiroAcesso, fetchData).then((resp) => {
        resp.json().then((resposta) => {
            // alert(resposta)
            sessionStorage.setItem("usuario", JSON.stringify(resposta))
            window.location.replace("../../templates/login/cadastro.html");
        }).catch((error) => {

            if (resp.status == 409) {
                msg = "Usuário já cadastrado"
            } else if (resp.status == 422) {
                msg = "Matrícula inválida"
            } else if (resp.status == 400) {
                msg = "Data inválida"
            } else {
                msg = "Contate o suporte"
            }
            exibeErro(msg)
        })
    })
})

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

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};
