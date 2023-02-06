// SPIN UP THE SERVER

// load environmental variables
require('dotenv').config()


const app = require("./app");

// Connect to database
const connectDB = require("./configs/db.config");

const port = process.env.PORT || 6000;

const start = async () => {
    try {
      // Connect to database
      await connectDB();
  
      // Start server
      app.listen(port, () =>
        console.log(`${process.env.APP_NAME} Server started on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };


  start();