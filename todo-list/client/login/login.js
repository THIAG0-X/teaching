// ===========================
// LOGIN
// ===========================

const login_form = document.querySelector('.login_form')

let entrar = () => {}

if (login_form) {

    // elementos
    const emailLogin = document.querySelector('#iemail')
    const senhaLogin = document.querySelector('#isenha')
    const msgErro = document.querySelector('#login_error')

    // REGEX DE EMAIL
    const regexEmailLogin = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    function verificarEmailLogin() {
        const emailMsgVazio = document.querySelector('#email_empty')
        const emailMsgInvalido = document.querySelector('#email_invalid')

        if (emailLogin.value.trim() === '') {
            emailLogin.style.borderColor = 'rgb(216, 0, 0)'
            emailMsgVazio.style.display = 'block'
            emailMsgInvalido.style.display = 'none'
            return false
        } else if (!regexEmailLogin.test(emailLogin.value)) {
            emailLogin.style.borderColor = 'rgb(216, 0, 0)'
            emailMsgInvalido.style.display = 'block'
            emailMsgVazio.style.display = 'none'
            return false
        } else {
            emailLogin.style.borderColor = 'rgb(0, 216, 0)'
            emailMsgVazio.style.display = 'none'
            emailMsgInvalido.style.display = 'none'
            return true
        }
    }

    function verificarSenhaLogin() {
        const senhaMsgVazio = document.querySelector('#senha_empty')

        if (senhaLogin.value.trim() === '') {
            senhaLogin.style.borderColor = 'rgb(216, 0, 0)'
            senhaMsgVazio.style.display = 'block'
            return false
        } else {
            senhaLogin.style.borderColor = 'rgb(0, 216, 0)'
            senhaMsgVazio.style.display = 'none'
            return true
        }
    }

    entrar = async function() {
        const valido = verificarEmailLogin() & verificarSenhaLogin()

        if (!valido) return

        try {
            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailLogin.value,
                    password: senhaLogin.value
                })
            })

            const data = await response.json()

            if (!response.ok) {
                msgErro.style.display = 'block'
                msgErro.textContent = data.detail || 'Credenciais inválidas!'
                return
            }

            // salva o token para usar nas requisições de tarefas
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('usuario', JSON.stringify(data.user))

            // redireciona para a página de tarefas
            window.location.href = '../tarefas/tarefas.html'

        } catch (error) {
            msgErro.style.display = 'block'
            msgErro.textContent = 'Erro ao conectar ao servidor!'
        }
    }

    // listeners
    emailLogin.addEventListener('input', verificarEmailLogin)
    senhaLogin.addEventListener('input', verificarSenhaLogin)
    login_form.addEventListener('submit', function(event) {
        event.preventDefault()
        entrar()
    })

    // olho de senha
    const olhoSenhaLogin = document.querySelector('#olho_senha')

    olhoSenhaLogin.addEventListener('click', function() {
        if (senhaLogin.type === 'password') {
            senhaLogin.type = 'text'
            olhoSenhaLogin.classList.replace('fa-eye', 'fa-eye-slash')
        } else {
            senhaLogin.type = 'password'
            olhoSenhaLogin.classList.replace('fa-eye-slash', 'fa-eye')
        }
    })
}

// exportar a função principal
export { entrar }