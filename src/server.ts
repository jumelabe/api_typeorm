import "reflect-metadata";
import app from "./app";
import { AppDataSource } from "./config/db.config";

const PORT = process.env.PORT || 4000;

// Initialize TypeORM connection
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  }); 