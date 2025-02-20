import yup from 'yup';

export const getProductsCommand = yup.mixed().oneOf([undefined]);
export type GetProductsCommand = yup.InferType<typeof getProductsCommand>;
