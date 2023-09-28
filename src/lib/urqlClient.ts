import { Client, cacheExchange, fetchExchange } from 'urql';

const client = new Client({
    url: 'http://192.168.0.25:4001/graphql',
    exchanges: [cacheExchange, fetchExchange],
});

export default client;