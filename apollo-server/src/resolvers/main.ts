import books from '../dataSource/books.js';
import authors from '../dataSource/authors.js';
import teachers from '../dataSource/teachers.js';
import { MongoClient } from 'mongodb';

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function readTeachers() {
    let teachers = null;
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('appdb'); // Replace with your database name
        const collection = db.collection('teachers'); // Replace with your collection name

        const docs = await collection.find({}).toArray();
        console.log('Found documents:', docs);
        teachers = docs;
    } catch (err) {
        console.error('Error reading data:', err);
    } finally {
        await client.close();
        console.log('Closed MongoDB connection');
    }
    return teachers;
}

const resolvers = {
    Query: {
        books: () => books,
        book: (parent, args, context, info) => {
            const { id } = args;
            return books.find(book => book.id === id);
        },
        authors: () => authors,
        author: (parent, args, context, info) => {
            const { id } = args;
            return authors.find(author => author.id === id);
        },
        teachers: () => teachers,

    },
    Book: {
        author: (parent, args, context, info) => {
            console.log("Book author", parent);
            const { _author } = parent;
            return authors.find(author => author.id === _author.id);
        }
    },
    Author: {
        books: (parent, args, context, info) => {
            console.log("Book author", parent);
            const { books } = parent;
            return books.filter(book => book.author === parent.id);
        }
    }
};

export default resolvers;