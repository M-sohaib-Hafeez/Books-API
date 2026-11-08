import express from 'express';
import cors from 'cors';
import bookRoutes from "./routes/bookRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/books', bookRoutes);

app.get('/', (req, res) => {
    res.json({message: "Welcome to the Book Store API"});
});

app.use((req, res) => {
    res.status(404).json({error: "Route not found"});
});

app.use((err , req , res , next) => {
    console.error(err.stack);
    res.status(500).json({error: "Something went wrong!"});
});

export default app;