import express from 'express';
import recipeRoutes from './endpoints/recipe.js';
import categoryRoutes from './endpoints/category.js';
import sessionRoutes from './endpoints/session.js';
import uomRoutes from './endpoints/uom.js';
import admRolesRoutes from './endpoints/administration/roleManagement.js';
import admUsersRoutes from './endpoints/administration/userManagement.js';
import admCategoriesRoutes from './endpoints/administration/categoryManagement.js';
import admUomRoutes from './endpoints/administration/uomManagement.js';
import {config} from './config.js';
import cors from 'cors';

const app = express();


app.use(express.json());
const isDev = process.env.NODE_ENV !== 'production';

app.use(cors({
    origin: isDev
        ? ['http://localhost:5173', 'http://cook.shadowsoft.test']
        : 'http://cook.shadowsoft.de',
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
}));

app.use('/api', recipeRoutes);
app.use('/api', categoryRoutes);
app.use('/api', sessionRoutes);
app.use('/api', uomRoutes);
app.use('/api', admRolesRoutes);
app.use('/api', admUsersRoutes);
app.use('/api', admCategoriesRoutes);
app.use('/api', admUomRoutes);


app.listen(config.port, () => {
    console.log(`Proxy listening on port ${config.port}`);
});
