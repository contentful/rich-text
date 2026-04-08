export type ValidationError = {
  name: string;
  type?: string;
  value?: Record<string, any> | string | number | boolean | null;
  min?: number | string;
  max?: number | string;
  details?: string | null;
  path?: (string | number)[];
  contentTypeId?: string | string[];
  nodeType?: string;
  customMessage?: string;
  expected?: string[];
};
