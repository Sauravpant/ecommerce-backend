import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("Darabase connected Connection host :" + connectionInstance.connection.host);

  } catch (err) {
    console.error("Database connection failed... Error: " + err)
  }
}

export { connectDB }