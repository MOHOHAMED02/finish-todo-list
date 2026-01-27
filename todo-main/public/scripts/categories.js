let greating = "Hello " + localStorage.getItem('name');
document.getElementById('greating').innerHTML = greating;
let allCategories = [];

async function getCategories() {
    let res = await fetch('/category');
    if(res.status == 401){ window.location.href='/login'; return; }
    let data = await res.json();
    allCategories = data;
    createCategoriesTable(data);
}

function createCategoriesTable(data){
    let txt = "";
    for(let c of data){
        txt += `<tr>
            <td>${c.Name}</td>
            <td><button onclick="deleteCategory(${c.id})">🗑️</button></td>
            <td><button onclick="categoryToEdit(${c.id})">✏️</button></td>
        </tr>`;
    }
    document.getElementById('categoriesTable').innerHTML = txt;
}

async function addCategory(){
    let Name = document.getElementById('name').value;
    if(!Name){ alert("Enter name"); return; }
    await fetch('/category',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ Name })
    });
    clearForm();
    getCategories();
}

async function categoryToEdit(id){
    let res = await fetch(`/category/${id}`);
    let data = await res.json();
    document.getElementById('id').value = data.id;
    document.getElementById('name').value = data.Name;
}

async function editCategory(id){
    let Name = document.getElementById('name').value;
    if(!Name){ alert("Enter name"); return; }
    await fetch(`/category/${id}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ Name })
    });
    clearForm();
    getCategories();
}

async function deleteCategory(id) {
    const ok = confirm(
        "אם תמחק קטגוריה זו, כל המשימות המשויכות אליה יימחקו.\nהאם ברצונך להמשיך?"
    );
    if (!ok) return;

    try {
        const relatedTasks = allTasks.filter(task => task && task.CategoryID == id);
        for (let task of relatedTasks) {
            await fetch(`/tasks/${task.id}`, { method: 'DELETE' });
        }

        await fetch(`/categories/${id}`, { method: 'DELETE' });

        getCategories();
        getTasks();

    } catch (err) {
        alert("שגיאה במהלך מחיקת הקטגוריה או המשימות");
        console.error(err);
    }
}


function addOrEditCategory(){
    let id = document.getElementById('id').value;
    if(id){ editCategory(id); }else{ addCategory(); }
}

function clearForm(){
    document.getElementById('id').value="";
    document.getElementById('name').value="";
}

getCategories();