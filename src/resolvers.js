// Hardcoded data store
const books = [
    {
      title: 'The Awakening',
      author: 'Kate Chopin',
    },
    {
      title: 'City of Glass',
      author: 'Paul Auster',
    },
];

const resolvers = {
    Query: {
        books() {
            return books;
        },
        book(parent, args, context, info) {
            return books.find(books => books.title === args.title);
        }
    },
};

export default resolvers