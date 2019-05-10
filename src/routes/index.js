import { createRoutes } from 'utils/core'; // eslint-disable-line

import Home from 'module/Home';

const routesConfig = () => [
    {
        path: '/home',
        exact: true,
        component: Home,
    }
];

export default () => createRoutes(routesConfig);
