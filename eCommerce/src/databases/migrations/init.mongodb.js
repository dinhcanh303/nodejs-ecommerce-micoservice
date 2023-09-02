const mongoose = require("mongoose");
const connectString = `mongodb://127.0.0.1:27017/eCommerce`;

mongoose.set("strictQuery", false);
mongoose
  .connect(connectString)
  .then((_) => console.log(`Connected Mongodb Success`))
  .catch((err) => console.log(`Error Connect`));

module.exports = mongoose;
