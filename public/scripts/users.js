let allUsers = [];

document.getElementById('greating').innerHTML = "Hello " + localStorage.getItem('name');

async function getUsers() {
    try {
        let response = await fetch('/users');
        if (response.status == 401) {
            window.location.href = '/login';
            return;
        }
        let data = await response.json();
        if (response.status == 400) {
            alert(data.message);
        }
        allUsers = data;
        createUsersTable(data);
    } catch (err) {
        alert(err);
    }
}

function createUsersTable(data) {
    let txt = "";
    for (let u of data) {
        txt += `<tr>`;
        txt += `<td>${u.name}</td>`;

        txt += `<td>${u.userName}</td>`;
        txt += `<td>${u.email}</td>`;
        txt += `<td><button onclick="deleteUser(${u.id})">🗑️</button></td>`;
        txt += `<td><button onclick="userToEdit(${u.id})">✏️</button></td>`;
        txt += `</tr>`;
    }
    document.getElementById('usersTable').innerHTML = txt;
}

async function addUser() {
    let name = document.getElementById('name').value;
    let userName = document.getElementById('username').value; 
    let email = document.getElementById('email').value;
    
    if (!name || !userName || !email) { alert("Fill all fields"); return; }

    await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        body: JSON.stringify({ name, userName, email })
    });
    clearForm();
    getUsers();
}

async function deleteUser(id) {

    if (confirm("האם אתה בטוח שברצונך למחוק את המשתמש?")) {
        await fetch(`/users/${id}`, { method: 'DELETE' });
        getUsers();
    }
}


function addOrEditUser() {
    let id = document.getElementById('id').value;
    if (id) { editUser(id); } else { addUser(); }
}

function clearForm() {
    document.getElementById('id').value = "";
    document.getElementById('name').value = "";
    document.getElementById('username').value = "";
    document.getElementById('email').value = "";
}

getUsers();