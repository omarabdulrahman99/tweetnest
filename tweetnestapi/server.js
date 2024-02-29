const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
const port = 5000;


app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/sharedPosts", require("./routes/sharedRoutes"));
app.use(errorHandler);

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
});