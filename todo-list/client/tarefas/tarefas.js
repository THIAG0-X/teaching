// ===========================
// TAREFAS
// ===========================

const container = document.querySelector('.task_list')
const addBtn = document.querySelector("#add_btn")

let taskList = []

// criar tarefas
function criarTarefa() {

    // classe de tarefas
    const task = {
        id: Date.now(),
        title: document.querySelector("#ititle").value,
        description: document.querySelector("#idescription").value,
        date: document.querySelector("#idate").value
    }
    if (task.title.trim() === '') return

    taskList.push(task)
    rederizarTarefa(task)
    console.log(taskList)

}

// renderizar tarefas
function rederizarTarefa(task) {

    // elementos criados
    const taskBox = document.createElement('div')
    taskBox.className = 'task_box'
    taskBox.dataset.id = task.id

    const ptitle = document.createElement('p')
    ptitle.textContent = task.title
    
    const pdescription = document.createElement('p')
    pdescription.textContent = task.description

    const pdate = document.createElement('p')
    pdate.textContent = task.date


    // criar formulario de edição
    const formEdit = document.createElement('form')
    formEdit.className = 'form_edit'
    formEdit.innerHTML = '<input type="text" class="editTitle"/><input type="text" class="editDescription"/><input type="date" class="editDate"/><button type="button" class="saveBtn">Salvar edição</button>'


    // botões de editar e deletar
    const editBtn = document.createElement('button')
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    editBtn.addEventListener('click', () => mostrarEdicao(formEdit))
    
    const deleteBtn = document.createElement('button')
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>'
    deleteBtn.addEventListener('click', () => excluirTarefa(task.id, taskBox))


    // adicionando elementos
    taskBox.appendChild(ptitle)
    taskBox.appendChild(pdescription)
    taskBox.appendChild(pdate)

    taskBox.appendChild(formEdit)

    taskBox.appendChild(editBtn)
    taskBox.appendChild(deleteBtn)

    container.appendChild(taskBox)

    //salvar edição
    const saveBtn = formEdit.querySelector('.saveBtn')
    saveBtn.addEventListener('click', () => editarTarefa(ptitle,pdescription,pdate, formEdit, task.id))

}

// excluir tarefas
function excluirTarefa(id, taskBox){
    taskList = taskList.filter(t => t.id !== id)
    taskBox.remove()
    console.log(taskList)
}

//editar tarefas
function editarTarefa(ptitle, pdescription, pdate, formEdit, id){

    //valores editados
    const editTitle = formEdit.querySelector('.editTitle').value
    const editDescription = formEdit.querySelector('.editDescription').value
    const editDate = formEdit.querySelector('.editDate').value
    
    //substituindo valores
    const task = taskList.find(t => t.id === id)
    
    task.title = ptitle.textContent = editTitle 
    task.description = pdescription.textContent = editDescription
    task.date = pdate.textContent = editDate
    
}

// mostrar ou esconder formulário de edição
function mostrarEdicao(formEdit) {
    if(formEdit.style.display === 'none') {
        formEdit.style.display = 'flex'
    } else {
        formEdit.style.display = 'none'
    }

}

//botão criar tarefa
addBtn.addEventListener('click', () => criarTarefa())
