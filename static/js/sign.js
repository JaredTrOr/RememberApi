//SPANS
var spanPassword = document.getElementById('spanPassword');
var spanUsuario = document.getElementById('spanUsuario');
var spanNombre = document.getElementById('spanNombre');
var spanEmail = document.getElementById('spanEmail');

//INPUTS
var nombre = document.getElementById('Nombre');
var usuario = document.getElementById('Usuario');
var password = document.getElementById('Password');
var email = document.getElementById('Email');

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

email.addEventListener('click', () => {
    if (spanEmail.className === 'siVisible') {
        spanEmail.classList.remove('siVisible');
        spanEmail.classList.add('noVisible');
    }
});

nombre.addEventListener('click', () => {
    if (spanNombre.className === 'siVisible') {
        spanNombre.classList.remove('siVisible');
        spanNombre.classList.add('noVisible');
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
    if (nombre.value === "") {
        validator++;
        spanNombre.classList.remove("noVisible");
        spanNombre.classList.add("siVisible");
    }
    if (email.value === "") {
        validator++;
        spanEmail.classList.remove("noVisible");
        spanEmail.classList.add("siVisible");
    }
    return(validator === 0);
}
