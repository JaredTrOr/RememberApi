//SPANS
var spanPassword = document.getElementById('spanPassword');
var spanUsuario = document.getElementById('spanUsuario');
var spanMensaje = document.getElementById('spanMensaje');
//INPUTS
var usuario = document.getElementById('usuario');
var password = document.getElementById('password');

/*EVENTOS CLICK*/
password.addEventListener('click', () => {
    if (spanPassword.className === 'siVisible') {
        spanPassword.classList.remove('siVisible');
        spanPassword.classList.add('noVisible');
    }
});

usuario.addEventListener('click', () => {
    if (spanUsuario.className === 'siVisible') {
        spanUsuario.classList.remove('siVisible');
        spanUsuario.classList.add('noVisible');
    }
});

function validate() {
    validator = 0;
    if (usuario.value === "") {
        validator++;
        spanUsuario.classList.remove("noVisible");
        spanUsuario.classList.add("siVisible");
    }
    if (password.value === "") {
        validator++;
        spanPassword.classList.remove("noVisible");
        spanPassword.classList.add("siVisible");
    }
    return(validator === 0);
}
