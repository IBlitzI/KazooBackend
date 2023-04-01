const express = require("express");
const router = require('./router/index');
// const authMiddleware = require('./middlewares/auth.middleware')
const app = express();

app.use(express.json());

// app.use(authMiddleware)
app.use('/user', router.userRouter.userRouter)
app.use('/cafe', router.cafeRouter.cafeRouter)
app.use('/song', router.songRouter.songRouter)
app.use('/vote', router.voteRouter.voteRouter)

const db = require('./db/mongoose.connection');
db.connectToMongoDb()



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});