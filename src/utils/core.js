import React from 'react';
import assign from 'object-assign';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'

// const { Route, Switch, Redirect } = ReactRouterDOM;

/* eslint-disable */
/**
 * 生成一组路由
 * @param {*} routesConfig
 */
export const createRoutes = (routesConfig) => (
    <Switch>{routesConfig().map((config) => createRoute(() => config))}</Switch>
);

// 路由映射表
window.dva_router_pathMap = {};
window.RouterPathname = ['', ''];

/**
 * 生成单个路由
 * @param {*} app
 * @param {*} routesConfig
 */
export const createRoute = (routesConfig) => {
    const routesResult = routesConfig();
    const {PERMISSIONS} = routesResult;
    const {component: Comp, path, indexRoute, title, ...otherProps} = routesResult;
    if (path && path !== '/') {
        window.dva_router_pathMap[path] = {path, title, ...otherProps};
    }
    const routeProps = assign(
        path && {
            path,
        },
    );

    if (indexRoute) {
        return [
            <Redirect key={`${path}_redirect`} exact from={path} to={indexRoute}/>,
            <Route {...routeProps} />,
        ];
    }
    return <Route {...routeProps} />;
};
