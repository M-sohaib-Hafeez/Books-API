import  prisma  from '../config/db.js';

//Create a book
export const createBook = async (req, res) => {
    try {
        const {title, author, isbn} = req.body;
        const newBook = await prisma.book.create({
            data: {title, author, isbn}
        });
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({error:"Failed to create Book", detail: error.message});
    }
};

//Get all books
export const getAllBooks = async (req, res) => {
    try {
        const books = await prisma.book.findMany();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({error:"Failed to get Books", detail: error.message});
    }
};

//Get single book by ID
export const getBookById = async (req , res) => {
    try {
        const id = parseInt(req.params.id);
        const book = await prisma.book.findUnique({where: {id}});
        if (!book) {
            return res.status(404).json({error: "Book not found"});
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({error:"Failed to get Book", detail: error.message});
    }
};

//Update a Book
export const updateBook = async (req , res) => {
    try {
        const id= parseInt(req.params.id);
        const {title , author , isbn , isAvailable} = req.body;
        const updateBook = await prisma.book.update({where: {id}, data: {title, author, isbn, isAvailable}});
        res.status(200).json(updateBook);
    } catch (error) {
        res.status(500).json({error:"Failed to update Book", detail: error.message});
    }
};

//Delete a Book
export const deleteBook = async (req , res) => {
    try {
        const id = parseInt(req.params.id);
        const deleteBook = await prisma.book.delete({where: {id}});
        res.status(200).json(deleteBook);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({error:"Failed to Delete Book", detail: error.message});
    }
};

