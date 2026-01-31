const {getAll, add, getOne, remove, update} = require('../model/categories_M.js');
const db = require('../config/db_config'); 

async function getAllCategories(req, res) {
    try {
        let categories = await getAll(req.user.id);
        if (categories.length == 0) {
            return res.status(200).json([]);
        }
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

async function addCategory(req, res) {
    try {
        let name = req.body.name;
        let userId = req.user.id;
        let categoryId = await add({ name, userId });
        res.status(201).json({ message: "נוסף בהצלחה" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

async function getCategory(req, res) {
    try {
        let category = await getOne(req.params.id, req.user.id);
        res.status(200).json(category);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}


async function deleteCategory(req, res) {
    const categoryId = req.params.id;
    const userId = req.user.id;

    try {

        const sqlDeleteTasks = "DELETE FROM tasks WHERE category_id = ?";
        await db.execute(sqlDeleteTasks, [categoryId]);


        await remove(categoryId, userId);
        
        res.status(200).json({ message: "הקטגוריה וכל המשימות המשוייכות אליה נמחקו!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "שגיאה במחיקה: ייתכן ויש קשרים נוספים בבסיס הנתונים" });
    }
}

async function updateCategory(req, res) {
    try {
        await update(req.params.id, req.user.id, req.body.name);
        res.status(200).json({ message: "updated!" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
}

module.exports = {
    getAllCategories,
    addCategory,
    getCategory,
    deleteCategory,
    updateCategory
}