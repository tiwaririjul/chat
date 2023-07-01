const express = require("express");
const cors = require("cors");
//Import Files
const Users = require("./models/Users");
const Conversation = require("./models/conversationSchema");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Messages = require("./models/Messages");
const io = require("socket.io")(4000, {
  cors: {
    origin: "http://localhost:3000",
  },
});

//Connection to Database
require("./db/connection");

//app use
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

//Socket.io
let users = [];
io.on("connection", (socket) => {
  console.log(`user connected`, socket.id);
  socket.on("addUser", (userId) => {
    const isUserExist = users.find((user) => user.userId === userId);
    // socket.userId = userId;
    if (!isUserExist) {
      console.log("hmm idhr hu");
      const user = { userId, socketId: socket.id };
      users.push(user);
      io.emit("getUsers", users);
    }
  });

  socket.on(
    "sendMessage",
    async ({ senderId, receiverId, message, conversationId }) => {
      const reciever = users.find((user) => user.userId === receiverId);
      const sender = users.find((user) => user.userId === senderId);
      const user = await Users.findById(senderId);
      if (reciever) {
        io.to(reciever.socketId)
          .to(sender.socketId)
          .emit("getMessage", {
            senderId,
            message,
            conversationId,
            receiverId,
            user: { id: user._id, fullName: user.fullName, email: user.email },
          });
      }
    }
  );

  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});

//Routes
app.get("/", (req, res) => {
  res.write("Welcome..");
});

app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body.data;
    //console.log("server " , fullName,email);
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
        return res.status(200).send("user registered successfully", newUser);
      }
    }
  } catch (error) {}
});

app.post("/api/login", async (req, res, next) => {
  try {
    const { email, password } = req.body.data;
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
            user: { id: user._id, email: user.email, fullName: user.fullName },
            token: user.token,
          });
        }
      }
    }
  } catch (error) {}
});

app.post("/api/conversation", async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    const newConversation = new Conversation({
      members: [senderId, receiverId],
    });
    await newConversation.save();
    res.status(200).send("Conversation Created Succesfully..");
  } catch (error) {
    console.log(error, " While Creating Conversation..");
  }
});
app.get("/api/conversation/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversation = await Conversation.find({
      members: { $in: [userId] },
    });
    //  console.log("conver... " ,conversation);
    const conversationuserData = Promise.all(
      conversation.map(async (conver) => {
        // console.log(" inner ",conver );
        const receiverId = conver.members.find((member) => member !== userId);
        const user = await Users.findById(receiverId);
        // console.log(conver._id);
        return {
          user: {
            receiverId: user._id,
            email: user.email,
            fullName: user.fullName,
          },
          conversationId: conver._id,
        };
      })
    );
    res.status(200).json(await conversationuserData);
  } catch (error) {
    console.log(error, " While Creating Conversation..");
  }
});

app.post("/api/message", async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId = "" } = req.body;
    // console.log(conversationId, senderId, message, receiverId);
    if (!senderId || !message)
      return res.status(400).send("Please fill all required feilds");

    if (conversationId === "new" && receiverId) {
      const newConversation = new Conversation({
        members: [senderId, receiverId],
      });
      await newConversation.save();
      const newMessage = new Messages({
        conversationId: newConversation._id,
        senderId,
        message,
      });
      await newMessage.save();
      return res.status(200).send("Message sent successfully");
    } else if (!conversationId && !receiverId) {
      return res.status(400).send("Please fill all require feilds");
    }

    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();
    res.status(200).send("Message sent successfully");
  } catch (error) {
    console.log(error, "error");
  }
});

app.get("/api/message/:conversationId", async (req, res) => {
  try {
    const checkMessages = async (conversationId) => {
      const messages = await Messages.find({ conversationId });
      //console.log("Helloo" , messages);
      const messageUserData = Promise.all(
        messages.map(async (message) => {
          //console.log(message);
          const user = await Users.findById(message.senderId);
          return {
            user: { id: user._id, email: user.email, fullName: user.fullName },
            message: message.message,
          };
        })
      );

      console.log("message user data ", await messageUserData);
      res.status(200).json(await messageUserData);
    };
    const conversationId = req.params.conversationId;
    // console.log(conversationId);
    if (conversationId === "new") {
      const checkConversation = await Conversation.find({
        members: { $all: [req.query.senderId, req.query.receiverId] },
      });
      if (checkConversation.length > 0) {
        checkMessages(checkConversation[0]._id);
      } else {
        return res.status(200).json({});
      }
    } else {
      checkMessages(conversationId);
    }
  } catch (error) {
    console.log("ERROR", error);
  }
});

app.get("/api/users/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const users = await Users.find({ _id: { $ne: userId } });
    // console.log("users ", users);
    const userData = Promise.all(
      users.map(async (user) => {
        return {
          user: {
            email: user.email,
            fullName: user.fullName,
            receiverId: user._id,
          },
        };
      })
    );
    res.status(200).json(await userData);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log("Server is Listening on port " + port);
});
