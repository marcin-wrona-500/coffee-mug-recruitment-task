import * as yup from 'yup';

export const databaseId = yup.number().integer().positive();
