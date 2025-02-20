import { Request } from 'express';
import { AnySchema } from 'yup';

// "keyof Request" ensures that the keys defined here exist on the Request type
export type ValidatorSchemaKeys = keyof Request & ('query' | 'body');
export type ValidatorSchemas = Partial<Record<ValidatorSchemaKeys, AnySchema>>;
