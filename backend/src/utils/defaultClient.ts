import axios from "axios";
import {config} from "../config.js";

export const defaultClient = axios.create({
    baseURL: config.baseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});