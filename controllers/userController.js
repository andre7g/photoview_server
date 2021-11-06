const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const awsUploadImage = require("../utils/aws-upload-image");
const user = require("../models/user");

function createToken(user,SECRET_KEY,expiresIn) {
    const {id,name,email,username} = user;
    const payload = {
        id,
        name,
        email,
        username,
    };
    return jwt.sign(payload,SECRET_KEY,{expiresIn});
}

async function register(input){
    const newUser = input;
    newUser.email =  newUser.email.toLowerCase();
    newUser.username =  newUser.username.toLowerCase();
    const { email, username, password } = newUser;

    //Revisamos si el email existe 
    const foundEmail = await User.findOne({ email });
    if(foundEmail) throw new Error("El email ya está en uso");
    
    //Revisamos si el username existe 
    const foundUsername = await User.findOne({ username });
    if(foundUsername) throw new Error("El username ya está en uso");
    
    //Encriptar contraseña
    const salt = await bcryptjs.genSaltSync(10);
    newUser.password = await bcryptjs.hash(password,salt);
    try{
        const user = new User(newUser);
        user.save();
        return user;
    }catch(erro){
        console.log(error);
    }
}

async function login(input){
    const {email,password} = input;
    const userFound = await User.findOne({ email: email.toLowerCase() });
    if(!userFound) throw new Error("Error en el email o contraseña");

    const passwordSucces = await bcryptjs.compare(password,userFound.password);
    if(!passwordSucces) throw new Error("Error en el email o contraseña");


    return {
        token: createToken(userFound,process.env.SECRET_KEY,"24h")
    };
}

async function getUser(id,username){
    let user = null;
    if(id) user = await User.findById(id);
    if(username) user = await User.findOne({username});
    if(!user) throw new Error("El usuario no existe.");
    return user;
}
async function updateAvatar(file,ctx){
    const { id } = ctx.user;
    const { createReadStream,mimetype } = await file;
    const extencion = mimetype.split("/")[1];
    const imageName = `avatar/${id}.${extencion}`;
    const fileData = createReadStream();
    try {
        const res = await awsUploadImage(fileData,imageName);
        await User.findByIdAndUpdate(id,{ avatar:res });
        return{
            status: true,
            urlAvatar: res,
        };
    } catch (error) {
        return{
            status:false,
            urlAvatar:null
        }
    }
}
async function deleteAvatar(ctx){
    const { id } = ctx.user;
    try {
        await User.findByIdAndUpdate(id,{ avatar: "" });
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
async function updateUser(input,ctx){
    const { id } = ctx.user;
    try {
        if(input.currentPass && input.newPass){
            //cambiar contraseña
            const userFound = await User.findById(id);
            const passSuccess =  await bcryptjs.compare(
                input.currentPass,
                userFound.password
            );
            
            if(!passSuccess){
                throw new Error("Contraseña incorrecta");
            }else{
                const salt = await bcryptjs.genSaltSync(10);
                const newPassCrypt = await bcryptjs.hash(input.newPass,salt);
                await User.findByIdAndUpdate(id,{ password: newPassCrypt });
            }
        }else{
            await User.findByIdAndUpdate(id,input);
        }
        return true;
        await User.findByIdAndUpdate(id,{ avatar: "" });
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
async function search(search){
    const  users  = await User.find({
        name: { $regex: search, $options: "i" },
    });
    return users;
}

module.exports = {
    register,
    login,
    getUser,
    updateAvatar,
    deleteAvatar,
    updateUser,
    search
}