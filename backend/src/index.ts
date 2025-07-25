import express from 'express';
import {loginDefault} from './utils/apiClient.js';
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
app.use(cors({
    origin: 'https://cook.shadowsoft.test',
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


app.listen(config.port, async () => {
    await loginWithRetry();
    console.log(`Proxy listening on port ${config.port}`);
});

async function loginWithRetry(intervalMs = 5000): Promise<void> {
    let loggedIn = false;
    while (!loggedIn) {
        console.log('Attempting default login...');
        loggedIn = await loginDefault();
        if (!loggedIn) {
            console.warn(`Login failed. Retrying in ${intervalMs / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
    }
}
