var formulario = document.querySelector("form");
var Iemail = document.getElementById("email");
var Isenha = document.getElementById("senha");

function logar(){

    fetch("http://localhost:8080/adm/login",
    {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({

            email: Iemail.value,
            senha: Isenha.value

        })
    })

    .then(response => {

        console.log(response.status);

        if(response.ok){
            alert("Login realizado com sucesso!");
            window.location.href = "../gerenciamento page/gerenciamento.html";
        }else{
            alert("Email ou senha inválidos!");
        }

    })

    .catch(error => console.log(error));

}


formulario.addEventListener('submit', function(event) {

    event.preventDefault();

    logar();

});