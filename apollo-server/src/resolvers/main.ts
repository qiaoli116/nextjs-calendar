import { TeachersQuery } from './teachers.js';
import { TASQuery } from './tas.js';
import { SessionsQuery } from './sessions.js';
import { SubjectsQuery } from './subjects.js';


const resolvers = {
    Query: {
        ...TeachersQuery.Query,
        ...TASQuery.Query,
        ...SessionsQuery.Query,
        ...SubjectsQuery.Query,
    },
    ...TeachersQuery.Children,
    ...TASQuery.Children,
    ...SessionsQuery.Children,
    ...SubjectsQuery.Children,
};

export default resolvers;