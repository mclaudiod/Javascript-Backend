import express from "express";

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});