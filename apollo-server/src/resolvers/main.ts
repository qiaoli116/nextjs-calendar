import books from '../dataSource/books.js';
import authors from '../dataSource/authors.js';
import teachers from '../dataSource/teachers.js';
import { TeachersQuery } from './teachers.js';



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

        ...TeachersQuery,
    },
    Book: {
        author: (parent, args, context, info) => {
            console.log("Book author", parent);
            const { author: _author } = parent;
            return authors.find(author => author.id === _author);
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