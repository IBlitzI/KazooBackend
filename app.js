const express = require("express");
const router = require('./router/index');
const cors = require('cors');
//const ejs = require('ejs');
const bodyParser = require('body-parser');
//const cookieParser = require('cookie-parser')

// const authMiddleware = require('./middlewares/auth.middleware')
const app = express();
app.use(cors())

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
//app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/hello', (req,res) => {
  res.send('Melodine Backend Çalışıyor')
})

// app.use(authMiddleware)
 app.use('/user', router.userRouter.userRouter)
 app.use('/cafe', router.cafeRouter.cafeRouter)
 app.use('/song', router.songRouter.songRouter)
 app.use('/vote', router.voteRouter.voteRouter)

const db = require('./db/mongoose.connection');
db.connectToMongoDb()

require("dotenv").config();


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
