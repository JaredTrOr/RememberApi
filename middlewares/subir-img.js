let multer = require('multer');
function uploadFiles(){
    let storage = multer.diskStorage({
        destination: './web/img',
        filename: function (req, file, cb) {
            let fileName = file.originalname;
            cb(null, fileName)
        }
        })
      
        const upload = multer({ storage }).single('foto');
        return upload;
}

module.exports = uploadFiles;