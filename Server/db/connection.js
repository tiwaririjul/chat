const mongoose = require("mongoose");

const url =
  "mongodb+srv://admin:admin@chatapp.jknjbsi.mongodb.net/?retryWrites=true&w=majority";

//   "mongodb+srv://admin:<password>@chatapp.jknjbsi.mongodb.net/";

mongoose
  .connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database Connected Sucessfully..");
  })
  .catch(() => {
    console.log("Some Error Occured While Connecting to DB");
  });
