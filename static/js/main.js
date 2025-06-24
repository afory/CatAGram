function mostrarContra() {
    const contraEntrada = document.getElementById('id_password');
    const showContra = document.querySelector('.show-password');
    if (contraEntrada.type === "password") {
        contraEntrada.type = "text";
        showContra.textContent = "Ocultar";
    } else {
        contraEntrada.type = "password";
        showContra.textContent = "Mostrar";
    }
}