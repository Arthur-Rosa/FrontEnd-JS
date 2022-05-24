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

bt_cadastrar.addEventListener("click", async function (e) {
    e.preventDefault()
    const msg = "Insira uma senha";


    if (input_senha.value == input_repita.value) {

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
                    alert("Conta cadastra com sucesso realize o login")
                    window.location.replace("../../templates/login/login.html");
                }).catch((error) => {
                    console.log(error)
                    if (resp.status == 401) {
                        alert("usuario ou senha incorretos")
                    }
                })
            })
    } else {
        alert("As senhas não coincidem")
    }

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
