import path from 'path'
import multer from 'multer'

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = ''

    if (req.baseUrl.includes('users')) {
      folder = 'users'
    } else if (req.baseUrl.includes('pets')) {
      folder = 'pets'
    }

    cb(null, `images/${folder}`)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        Math.floor(Math.random() * 100) +
        path.extname(file.originalname)
    )
  },
})

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error('Please upload only PNG or JPG files.'))
    }
    cb(undefined, true)
  },
})

export default imageUpload
