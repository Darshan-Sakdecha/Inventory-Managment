import multer from 'multer';

const storage = multer.diskStorage({
    // Where to store the file (folder path)
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    // How to name the file
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

export const upload = multer({ storage });