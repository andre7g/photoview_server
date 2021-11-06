const Commet = require("../models/comment");

async function addComment(input,ctx){
    try {
        const comment = new Commet({
            idPublication: input.idPublication,
            idUser: ctx.user.id,
            comment: input.comment
        });
        comment.save();
        return comment;
    } catch (error) {
        console.log(error)
    }
}
async function getComments(idPublication){
    const res = await Commet.find({ idPublication }).populate("idUser");
    return res;
}

module.exports = {
    addComment,
    getComments
}