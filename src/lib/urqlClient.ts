import { Client, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
    url: 'http://localhost:4001/api/graphql',
    exchanges: [cacheExchange, fetchExchange],
});

export default client;