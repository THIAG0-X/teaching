// ===========================
// REGISTRO
// ===========================

const register_form = document.querySelector('.register_form')

let enviar = () => {}

if (register_form) {

    // REGEX DE EMAIL
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    // elementos
    const nome = document.querySelector('#inome')
    const email = document.querySelector('#iemail')
    const senha = document.querySelector('#isenha')
    const confirmar = document.querySelector('#iconfirmarsenha')

    // verificar valores de input
    function verificarNome() {
        const nomeMsgVazio = document.querySelector('#nome_empty')
        
        if (nome.value.trim() === '') {
            nome.style.borderColor = 'rgb(216, 0, 0)'
            nomeMsgVazio.style.display = 'block'
            return false
        } else {
            nome.style.borderColor = 'rgb(0, 216, 0)'
            nomeMsgVazio.style.display = 'none'
            return true
        }
    }

    function verificarEmail(){
        const emailMsgVazio = document.querySelector('#email_empty')
        const emailMsgInvalido = document.querySelector('#email_invalid')

        if (email.value.trim() === '') {
            emailMsgVazio.style.display = 'block'
            emailMsgInvalido.style.display = 'none'
            email.style.borderColor = 'rgb(216, 0, 0)'
            return false
        } else if (!regexEmail.test(email.value)) {
            emailMsgInvalido.style.display = 'block'
            emailMsgVazio.style.display = 'none'
            email.style.borderColor = 'rgb(216, 0, 0)'
            return false
        } else {
            emailMsgVazio.style.display = 'none'
            emailMsgInvalido.style.display = 'none'
            email.style.borderColor = 'rgb(0, 216, 0)'
            return true
        }
    }

    function verificarSenha() {
        const senhaMsgVazio = document.querySelector('#senha_empty')

        const temOitoCaracteres = senha.value.length >= 8
        const temMaiuscula = /[A-Z]/.test(senha.value)
        const temMinuscula = /[a-z]/.test(senha.value)
        const temNumero = /[0-9]/.test(senha.value)
        const temSimbolo = /[@#_$]/.test(senha.value)

        atualizarIcone('check_tamanho', 'x_tamanho', temOitoCaracteres)
        atualizarIcone('check_maiuscula', 'x_maiuscula', temMaiuscula)
        atualizarIcone('check_minuscula', 'x_minuscula', temMinuscula)
        atualizarIcone('check_numero', 'x_numero', temNumero)
        atualizarIcone('check_simbolo', 'x_simbolo', temSimbolo)

        const todosValidos = temOitoCaracteres && temMaiuscula && temMinuscula && temNumero && temSimbolo

        if (senha.value.trim() === '') {
            senha.style.borderColor = 'rgb(216, 0, 0)'
            senhaMsgVazio.style.display = 'block'
            return false
        } else if (!todosValidos) {
            senha.style.borderColor = 'rgb(216, 0, 0)'
            senhaMsgVazio.style.display = 'none'
            return false
        } else {
            senha.style.borderColor = 'rgb(0, 216, 0)'
            senhaMsgVazio.style.display = 'none'
            if (confirmar.value !== '') verificarConfirmarSenha()
            return true
        }
    }

    function atualizarIcone(idCheck, idX, valido) {
        const check = document.querySelector('#' + idCheck)
        const x = document.querySelector('#' + idX)

        if (valido) {
            check.style.display = 'inline'
            x.style.display = 'none'
        } else {
            check.style.display = 'none'
            x.style.display = 'inline'
        }
    }

    function verificarConfirmarSenha() {
        const confirmarMsgVazio = document.querySelector('#confirmar_empty')
        const confirmarMsgInvalido = document.querySelector('#confirmar_invalid')

        if (confirmar.value.trim() === '') {
            confirmar.style.borderColor = 'rgb(216, 0, 0)'
            confirmarMsgVazio.style.display = 'block'
            confirmarMsgInvalido.style.display = 'none'
            return false
        } else if (confirmar.value !== senha.value) {
            confirmarMsgInvalido.style.display = 'block'
            confirmarMsgVazio.style.display = 'none'
            confirmar.style.borderColor = 'rgb(216, 0, 0)'
            return false
        } else {
            confirmarMsgVazio.style.display = 'none'
            confirmarMsgInvalido.style.display = 'none'
            confirmar.style.borderColor = 'rgb(0, 216, 0)'
            return true
        }
    }

    enviar = async function() {
        const valido = verificarNome() & verificarEmail() & verificarSenha() & verificarConfirmarSenha()
        if (!valido) return

        try {
            const response = await fetch('http://localhost:8000/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: nome.value,
                    email: email.value,
                    password: senha.value
                })
            })

            const data = await response.json()

            if (!response.ok) {
                const msgErro = document.querySelector('#register_error')
                msgErro.textContent = data.detail
                msgErro.style.display = 'block'
                return
            }

            // salvar token
            localStorage.setItem('token', data.access_token)

            // redirecionar
            window.location.href = '../tarefas/index.html'

        } catch (error) {
            const msgErro = document.querySelector('#register_error')
            msgErro.textContent = 'Erro ao conectar ao servidor!'
            msgErro.style.display = 'block'
        }
    }

    // listeners
    nome.addEventListener('input', verificarNome)
    email.addEventListener('input', verificarEmail)
    senha.addEventListener('input', verificarSenha)
    confirmar.addEventListener('input', verificarConfirmarSenha)
    register_form.addEventListener('submit', function(event) {
        event.preventDefault()
        enviar()
    })

    // olho de senha
    const olhoSenha = document.querySelector('#olho_senha')

    olhoSenha.addEventListener('click', function() {
        if (senha.type === 'password') {
            senha.type = 'text'
            olhoSenha.classList.replace('fa-eye', 'fa-eye-slash')
        } else {
            senha.type = 'password'
            olhoSenha.classList.replace('fa-eye-slash', 'fa-eye')
        }
    })

    const olhoConfirmar = document.querySelector('#olho_confirmar')

    olhoConfirmar.addEventListener('click', function() {
        if (confirmar.type === 'password') {
            confirmar.type = 'text'
            olhoConfirmar.classList.replace('fa-eye', 'fa-eye-slash')
        } else {
            confirmar.type = 'password'
            olhoConfirmar.classList.replace('fa-eye-slash', 'fa-eye')
        }
    })
}

// exporta a função principal
export { enviar }