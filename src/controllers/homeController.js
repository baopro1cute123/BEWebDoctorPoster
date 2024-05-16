import db from "../models/index";
import CRUDServices from "../services/CRUDServices";
let getHomePage =async (req, res) => {
    try {
        let data = await db.User.findAll()
        
        return res.render('homepage.ejs', {
            data : JSON.stringify(data)
        });

    } catch (error) {
        console.log(error)
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

// object: {
//     key: '',
//     value: ''
// }

let getCRUDPage = (req, res) => {
    return res.render('crud.ejs');
}
let postCRUD = async(req, res) => {
    let message = await CRUDServices.createNewUser(req.body);
    return res.send('Thêm mới người dùng thành công');
}

let displayGetCRUD = async(req, res) => {
    let data = await CRUDServices.getAllUser();
    return res.render("display-crud.ejs",
    {
        dataTable: data
    }
)}

let getEditCRUD = async(req, res) => {
    let userId = req.query.id;
    if(userId) {
        let userData = await CRUDServices.getUserInfoById(userId)
        return res.render('editCRUD.ejs',{
            userData : userData
        })
    }
    else{
        return res.send("USER NOT FOUND!")
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDServices.updateUserData(data);
    return res.render('display-crud.ejs',{
        dataTable : allUser
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;

    if(id) {
        await CRUDServices.deleteUserById(id);
        return res.send("Đã xóa thành công")

    }
    else {
        return res.send("User not Found")
    }
   
}
module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUDPage : getCRUDPage,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
}