import { TeachersQuery } from './teachers.js';
import { TASQuery } from './tas.js';
import { SessionsQuery } from './sessions.js';
import { SubjectsQuery } from './subjects.js';
import { RoomsQuery } from './rooms.js';


const resolvers = {
    Query: {
        ...TeachersQuery.Query,
        ...TASQuery.Query,
        ...SessionsQuery.Query,
        ...SubjectsQuery.Query,
        ...RoomsQuery.Query,
    },
    Mutation: {
        ...TeachersQuery.Mutation,
        ...RoomsQuery.Mutation,
    },
    ...TeachersQuery.Children,
    ...TASQuery.Children,
    ...SessionsQuery.Children,
    ...SubjectsQuery.Children,
    ...RoomsQuery.Children,
};

export default resolvers;