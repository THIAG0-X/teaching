// ===========================
// TAREFAS
// ===========================

const container = document.querySelector('.task_list')
const addBtn = document.querySelector("#add_btn")

const API_URL = 'http://localhost:8000'

// monta o header de autenticação usado em TODAS as requisições de tarefas
function getAuthHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}


// protege a página: sem token não entra
if (!localStorage.getItem('token')) {
    window.location.href = '../login/index.html'
}

const usuario = JSON.parse(localStorage.getItem('usuario'))

if (usuario) {
    document.querySelector('#user_name').textContent = usuario.name
    document.querySelector('#user_avatar').textContent = usuario.name.charAt(0).toUpperCase()
}

// buscar tarefas (GET) - roda quando a página carrega
async function buscarTarefas() {
    try {
        const response = await fetch(API_URL + '/tasks', {
            method: 'GET',
            headers: getAuthHeaders()
        })

        const data = await response.json()

        if (!response.ok) {
            console.log('Erro ao buscar tarefas:', data.detail)
            return
        }

        container.innerHTML = '' // limpa antes de renderizar, evita duplicar
        data.tasks.forEach(task => renderizarTarefa(task))

    } catch (error) {
        console.log('Erro ao conectar ao servidor:', error)
    }
}

// dispara a busca automaticamente quando a página termina de carregar
document.addEventListener('DOMContentLoaded', buscarTarefas)


// criar tarefa (POST)
async function criarTarefa() {
    const title = document.querySelector("#ititle").value
    const description = document.querySelector("#idescription").value
    const date = document.querySelector("#idate").value

    if (title.trim() === '') return

    try {
        const response = await fetch(API_URL + '/tasks', {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: title,
                description: description || null,
                deadline: date || null
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.log('Erro ao criar tarefa:', data.detail)
            return
        }

        renderizarTarefa(data)

        // limpa o formulário depois de criar
        document.querySelector("#ititle").value = ''
        document.querySelector("#idescription").value = ''
        document.querySelector("#idate").value = ''

    } catch (error) {
        console.log('Erro ao conectar ao servidor:', error)
    }
}


// renderizar - cria o HTML de uma tarefa na tela
function renderizarTarefa(task) {
    const taskBox = document.createElement('div')
    taskBox.className = 'task_box'
    taskBox.dataset.id = task.id

    const ptitle = document.createElement('p')
    ptitle.textContent = task.title

    const pdescription = document.createElement('p')
    pdescription.textContent = task.description

    const pdate = document.createElement('p')
    pdate.textContent = task.deadline

    const formEdit = document.createElement('form')
    formEdit.className = 'form_edit'
    formEdit.innerHTML = '<input type="text" class="editTitle"/><input type="text" class="editDescription"/><input type="date" class="editDate"/><button type="button" class="saveBtn">Salvar edição</button>'

    const editBtn = document.createElement('button')
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    editBtn.addEventListener('click', () => mostrarEdicao(formEdit))

    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'
    deleteBtn.addEventListener('click', () => excluirTarefa(task.id, taskBox))

    taskBox.appendChild(ptitle)
    taskBox.appendChild(pdescription)
    taskBox.appendChild(pdate)
    taskBox.appendChild(formEdit)
    taskBox.appendChild(editBtn)
    taskBox.appendChild(deleteBtn)

    container.appendChild(taskBox)

    const saveBtn = formEdit.querySelector('.saveBtn')
    saveBtn.addEventListener('click', () => editarTarefa(ptitle, pdescription, pdate, formEdit, task.id))
}

// excluir tarefa (DETELE)
async function excluirTarefa(id, taskBox) {
    try {
        const response = await fetch(API_URL + '/tasks/' + id, {
            method: 'DELETE',
            headers: getAuthHeaders()
        })

        if (!response.ok) {
            const data = await response.json()
            console.log('Erro ao excluir tarefa:', data.detail)
            return
        }

        taskBox.remove()

    } catch (error) {
        console.log('Erro ao conectar ao servidor:', error)
    }
}

// editar tarefa (PUT)
async function editarTarefa(ptitle, pdescription, pdate, formEdit, id) {
    const editTitle = formEdit.querySelector('.editTitle').value
    const editDescription = formEdit.querySelector('.editDescription').value
    const editDate = formEdit.querySelector('.editDate').value

    try {
        const response = await fetch(API_URL + '/tasks/' + id, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
                title: editTitle,
                description: editDescription || null,
                deadline: editDate || null
            })
        })

        const data = await response.json()

        if (!response.ok) {
            console.log('Erro ao editar tarefa:', data.detail)
            return
        }

        ptitle.textContent = data.title
        pdescription.textContent = data.description
        pdate.textContent = data.deadline
        formEdit.style.display = 'none'

    } catch (error) {
        console.log('Erro ao conectar ao servidor:', error)
    }
}

function mostrarEdicao(formEdit) {
    if (formEdit.style.display === 'none' || formEdit.style.display === '') {
        formEdit.style.display = 'flex'
    } else {
        formEdit.style.display = 'none'
    }
}

// logout
function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '../login/index.html'
}

window.logout = logout

addBtn.addEventListener('click', () => criarTarefa())
