export declare type PrimitiveType = number | boolean | string | null;
export declare type Definition = {
  $ref?: string;
  $schema?: string;
  $id?: string;
  description?: string;
  allOf?: Definition[];
  oneOf?: Definition[];
  anyOf?: Definition[];
  title?: string;
  type?: string | string[];
  definitions?: {
    // tslint:disable-next-line:no-any
    [key: string]: any;
  };
  format?: string;
  items?: Definition | Definition[];
  minItems?: number;
  additionalItems?:
    | {
        anyOf: Definition[];
      }
    | Definition;
  enum?: PrimitiveType[] | Definition[];
  default?: PrimitiveType | Object;
  additionalProperties?: Definition | boolean;
  required?: string[];
  propertyOrder?: string[];
  properties?: {
    // tslint:disable-next-line:no-any
    [key: string]: any;
  };
  defaultProperties?: string[];
  patternProperties?: {
    [pattern: string]: Definition;
  };
  typeof?: 'function';
};

export function getSchemaWithNodeType(nodeType: string): Definition {
  try {
    return require(`./generated/${nodeType}.json`);
  } catch (error) {
    throw new Error(`Schema for nodeType "${nodeType}" was not found.`);
  }
}
