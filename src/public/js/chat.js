const socket = io()
let user

const chatbox = document.getElementById("chatbox")
const messageLogs = document.getElementById("messageLogs")

Swal.fire({
    title: 'Login to Mafty Shop chat',
    html: `<input type="text" id="email" class="swal2-input" placeholder="Username">`,
    confirmButtonText: 'Sign in',
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
        const email = Swal.getPopup().querySelector('#email').value
        let isValid = validateEmail(email)
        if (!isValid) {
            Swal.showValidationMessage(`Please enter a valid email`)
        }
        return { email: email }
    }
}).then((result) => {
    console.log(result.value.email)
    user = result.value.email;
    socket.emit("authenticatedUser", user);
})

chatbox.addEventListener("keyup", (evt) => {
    if (evt.key === "Enter") {
        socket.emit("message", { user: user, message: chatbox.value })
        chatbox.value == ""
    }
})

socket.on("imprimir", (data) => {
    let mensajes = ""
    data.forEach((msj) => {
        mensajes += `${msj.user} escribio: ${msj.message} <br/>`
    })
    messageLogs.innerHTML = mensajes
})

socket.on('newUserAlert', (data) => {
    if (!user) return
    Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000,
        title: data + ' se ha unido al chat',
        icon: 'success'
    })

})

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};