import express from 'express'; // Correct import statement
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

app.use(express.json());

app.use(cors());
/*app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
})
);
*/
app.get('/', (request, response) => {
    console.log(request); // Fix typo here
    return response.status(234).send('Hello World');
});

app.use('/books', booksRoute);

app.post('/books', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({ message: 'Je potřeba zadat všechna pole. title, author a publishYear' });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        const book = await Book.create(newBook);

        return response.status(201).send(book);

    } catch (error) {
        console.error('Error creating book:', error.message); // Use console.error for errors
        response.status(500).send({ message: error.message }); // Use standard status code 500 for server errors
    }
});

app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({}); // Use Book instead of book
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Error fetching books:', error.message); // Use console.error for errors
        response.status(500).send({ message: error.message }); // Use standard status code 500 for server errors
    }
});

app.get('/books/:id', async (request, response) => {
    try {

        const { id } = request.params;
        const book = await Book.findById(id); // Use Book instead of book
        return response.status(200).json(book);
    } catch (error) {
        console.error('Error fetching books:', error.message); // Use console.error for errors
        response.status(500).send({ message: error.message }); // Use standard status code 500 for server errors
    }
});

app.put('/books/:id', async (request, response) => {
    try {
        const { id } = request.params;

        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({ message: 'Je potřeba zadat všechna pole. title, author a publishYear' });
        }

        const updatedBook = await Book.findByIdAndUpdate(id, request.body, { new: true });

        if (!updatedBook) {
            return response.status(404).json({ message: 'Book not found' });
        }

        return response.status(200).send({ message: 'Book updated', book: updatedBook });
    } catch (error) {
        console.error('Error updating book:', error.message); // Use console.error for errors
        response.status(404).send({ message: error.message }); // Use standard status code 500 for server errors
    }
});

app.delete('/books/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Book.findByIdAndDelete(id);
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        return response.status(200).send({ message: 'Book deleted' });

    } catch (error) {
        console.log(error.message)
        response.status(500).send({ message: error.message })
    }
})

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error); // Use console.error for errors
    });