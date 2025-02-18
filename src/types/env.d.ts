// We need an interface defined to use and/or extend it elsewhere
/* eslint-disable @typescript-eslint/no-empty-object-type */

// This defines some environment variables as non-optional.
// Make sure this is in sync with the base ".env" file!
type RequiredVariables = 'PORT';
type RequiredEnvironmentConfig = Record<RequiredVariables, string>;

// Non-mandatory config options to be populated here
type OptionalVariables = '';
type OptionalEnvironmentConfig = Partial<Record<OptionalVariables, string>>;

interface EnvironmentConfig extends Record<string, string | undefined> {}
interface EnvironmentConfig extends RequiredEnvironmentConfig {}
interface EnvironmentConfig extends RequiredEnvironmentConfig {}

export interface EnvironmentConfig {}
