
const AWS = require("aws-sdk");
require('dotenv').config({path: '.env'});

const ID = process.env.AWS_ID;
const SECRET = process.env.AWS_SECRET;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const s3 = new AWS.S3({
    accessKeyId:ID,
    secretAccessKey: SECRET,
});

async function awsUploadImage(file, filePath){
    console.log(BUCKET_NAME)
    const params = {
        Bucket: BUCKET_NAME,
        Key: `${filePath}`,
        Body: file,
        ContentType: file.type,
    }
    try {
        const res = await s3.upload(params).promise();
        return res.Location;
    } catch (error) {
        console.log(error);
        throw new Error()
    }
}

module.exports = awsUploadImage;