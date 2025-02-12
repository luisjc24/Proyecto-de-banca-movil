// Funcionalidad de los botones del Navbar
document.getElementById("cerrarSesion").addEventListener("click", () => {
    window.location.href = "index.html";
});

// Toggle para el panel de Notificaciones
const notificacionesBtn = document.getElementById("notificaciones");
const notificationsPanel = document.getElementById("notificationsPanel");
notificacionesBtn.addEventListener("click", () => {
    notificationsPanel.classList.toggle("active");
});

// Abrir modal de Perfil
const verPerfilBtn = document.getElementById("verPerfil");
const perfilModal = document.getElementById("perfilModal");
const closePerfil = document.getElementById("closePerfil");

verPerfilBtn.addEventListener("click", () => {
    perfilModal.classList.add("active");
});

// Cerrar modal de Perfil
closePerfil.addEventListener("click", () => {
    perfilModal.classList.remove("active");
});

// Cerrar el modal al hacer clic fuera de la ventana de contenido
window.addEventListener("click", (event) => {
    if (event.target === perfilModal) {
        perfilModal.classList.remove("active");
    }
});

// Actualizar el mensaje de bienvenida con el nombre real del usuario.
document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName") || "Usuario";
    const welcomeHeader = document.querySelector(".welcome h1");
    welcomeHeader.textContent = `Bienvenido a tu banca, ${userName}`;
});