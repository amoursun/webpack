import { createRoutes } from 'utils/core'; // eslint-disable-line

import Home from 'module/Home';

console.log('createRoutes', createRoutes)

const routesConfig = () => [
    {
        path: '/',
        exact: true,
        component: Home,
        indexRoute: '/home',
    }
];

export default () => createRoutes(routesConfig);
