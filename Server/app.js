const express = require("express");
//Import Files
const Users = require("./models/Users");
const Conversation = require("./models/conversationSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
//Connection to Database
require("./db/connection");

//app use
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 8000;
//Routes
app.get("/", (req, res) => {
  res.write("Welcome..");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(400).send("Please fill all require detail");
    } else {
      const isAlreadyExist = await Users.findOne({ email });
      if (isAlreadyExist) {
        res.status(400).send("user already exist");
      } else {
        const newUser = new Users({ fullName, email });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("user registered successfully");
      }
    }
  } catch (error) { }
});

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Please fill all required fields");
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).send("User email or password is incorrect");
      } else {
        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).send("User email or password is incorrect");
        } else {
          const payload = {
            userId: user.id,
            email: user.email,
          };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 84600 },
            async (err, token) => {
              await Users.updateOne(
                { _id: user._id },
                {
                  $set: { token },
                }
              );
              user.save();
              next();
            }
          );
          res.status(200).json({
            user,
          });
        }
      }
    }
  } catch (error) { }
});

app.post('/api/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversation({ members: [senderId, receiverId] });
    await newConversation.save();
    res.status(200).send('Conversation Created Succesfully..')
  } catch (error) {
    console.log(error, " While Creating Conversation..");
  }
})
app.get('/api/conversation/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversation = await Conversation.find({ members: { $in: [userId]  } })
    console.log(conversation);
    const conversationuserData = Promise.all(conversation.map(async (conver) => {
      const receiverId = conver.members.find((member) => member != userId);
      const user = await Users.findById(receiverId);
      return { user: { email: user.email, fullName: user.fullName }, conversation: conver._id }
    }))
    res.status(200).json(await conversationuserData)
  } catch (error) {
    console.log(error, " While Creating Conversation..");
  }
})
app.listen(port, () => {
  console.log("Server is Listening on port " + port);
});
