const mongoose = require('mongoose')
exports.connectToMongoDb = async() => {
    try {
        await mongoose.connect("mongodb+srv://mustafa:gUgzcLquDnibFChV@kazoo.8jqi0r5.mongodb.net/?retryWrites=true&w=majority", {
            compressors: "zlib",
            autoIndex: true,
            connectTimeoutMS: 5000
        })
       console.log("DB Bağlandı")
    } catch (error) {
        console.log('error', error)
        throw new Error(error)
    }
}