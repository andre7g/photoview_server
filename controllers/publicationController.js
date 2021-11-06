const Publication = require("../models/publication");
const User = require("../models/user");
const Follow = require("../models/follow");
const awsUploadImage = require("../utils/aws-upload-image");
const { v4: uuidv4 } = require("uuid");

async function publish(file,ctx){
    const { id } = ctx.user;
    const { createReadStream,mimetype } = await file;
    const extencion = mimetype.split("/")[1];
    const fileName = `publication/${uuidv4()}.${extencion}`;
    const fileData = createReadStream();
    try {
        const res = await awsUploadImage(fileData,fileName);
        //console.log(res)
        const publication = new Publication({ 
            idUser:id,
            file: res,
            typeFile: mimetype.split("/")[0],
            createAt: Date.now()
         });
         publication.save();
        return{
            status: true,
            urlFile: res,
        };
    } catch (error) {
        return{
            status:false,
            urlFile:"",
        }
    }
}
async function getPublications(username){
    const user = await User.findOne({ username });
    if(!user) throw new Error("Usuario no encontrado");

    const publications = await Publication.find().where({ idUser: user._id }).sort({ createAt:-1 });

    return publications;
}
async function getPublicationsFollows(ctx){
    const follows = await Follow.find({ idUser: ctx.user.id }).populate("follow");
    const followsList = [];

    for await (const data of follows){
        followsList.push(data.follow);
    }

    const publicationFollowsList = [];
    for await ( const data of followsList ){
        const publications = await Publication.find().where({
            idUser: data._id
        })
        .sort({ createAt: -1 })
        .populate("idUser").limit(50);//ultimas 50 publicaciones
        publicationFollowsList.push(...publications);
    }
    
    const res = publicationFollowsList.sort((a,b)=>{
        return new Date(b.createAt) - new Date(a.createAt);
    });
    return res;
}
module.exports = {
    publish,
    getPublications,
    getPublicationsFollows
};