import "dotenv/config"
import { connectDB } from "./db/index.js"
import { app } from "./app.js"
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server listening on port ${process.env.PORT}`)
    })
  })
  .catch(() => {
    console.log("Database connection failed")
  })
