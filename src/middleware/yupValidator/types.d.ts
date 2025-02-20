import { Request } from 'express';
import { AnySchema } from 'yup';

// picking the keys from "Request" ensures that the keys defined here actually exist on the Request type
export type ValidatorSchemaKeys = keyof Pick<Request, 'query' | 'body' | 'params'>;
export type ValidatorSchemas = Partial<Record<ValidatorSchemaKeys, AnySchema>>;
