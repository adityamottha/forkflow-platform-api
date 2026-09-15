import "./config/config.env.js";
import app from "./app.js";

const PORT = process.env.PORT;

const server = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error starting server:", err);
  }
};

server();
