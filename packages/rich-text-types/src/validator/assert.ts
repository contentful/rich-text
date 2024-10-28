import isPlainObject from 'is-plain-obj';

import { ValidationError } from '.';
import {
  maxSizeError,
  typeMismatchError,
  enumError,
  unknownPropertyError,
  requiredPropertyError,
  minSizeError,
} from './errors';
import type { Path } from './path';

export class ObjectAssertion {
  private _errors: ValidationError[] = [];

  constructor(
    private readonly obj: Record<string, any>,
    private readonly path: Path,
  ) {}

  catch = (...errors: ValidationError[]): void => {
    this._errors.push(...errors);
  };

  get errors(): ValidationError[] {
    const serializeError = (error: ValidationError): string =>
      JSON.stringify({
        details: error.details,
        path: error.path,
      });

    return this._errors.filter(
      (error, index) =>
        this._errors.findIndex((step) => serializeError(error) === serializeError(step)) === index,
    );
  }

  /**
   * Asserts the key exists in the object. You probably shouldn't call this
   * function directly. Instead, use `$.object`, `$.number`, `$.string`, etc.
   */
  exists = (key: string): boolean => {
    if (key in this.obj) {
      return true;
    }

    this.catch(
      requiredPropertyError({
        property: key,
        path: this.path.of(key),
      }),
    );

    return false;
  };

  /**
   * Asserts the key exists in the object and its value is a plain object. if
   * no key is provided, it asserts the object itself.
   */
  public object = (key?: string): boolean => {
    const value = key ? this.obj[key] : this.obj;

    if (key) {
      if (!this.exists(key)) {
        return false;
      }
    }

    if (isPlainObject(value)) {
      return true;
    }

    const path = key ? this.path.of(key) : this.path;
    const property = key ?? this.path.last() ?? 'value';

    this.catch(
      typeMismatchError({
        typeName: 'Object',
        property,
        path,
        value,
      }),
    );

    return false;
  };

  /**
   * Asserts the key exists in the object and its value is a string.
   */
  public string = (key: string): boolean => {
    const value = this.obj[key];

    if (key && !this.exists(key)) {
      return false;
    }

    if (typeof value === 'string') {
      return true;
    }

    this.catch(
      typeMismatchError({
        typeName: 'String',
        property: key,
        path: this.path.of(key),
        value,
      }),
    );

    return false;
  };

  /**
   * Asserts the key exists in the object and its value is a number.
   */
  public number = (key: string, optional?: boolean): boolean => {
    const value = this.obj[key];

    if (optional && !(key in this.obj)) {
      return true;
    }

    if (!this.exists(key)) {
      return false;
    }

    if (typeof value === 'number' && !Number.isNaN(value)) {
      return true;
    }

    this.catch(
      typeMismatchError({
        typeName: 'Number',
        property: key,
        path: this.path.of(key),
        value,
      }),
    );

    return false;
  };

  /**
   * Asserts the key exists in the object and its value is an array. You don't
   * need to manually call this function before `$.each` or `$.maxLength`.
   */
  public array = (key: string): boolean => {
    const value = this.obj[key];

    if (key && !this.exists(key)) {
      return false;
    }

    if (Array.isArray(value)) {
      return true;
    }

    this.catch(
      typeMismatchError({
        typeName: 'Array',
        property: key,
        path: this.path.of(key),
        value,
      }),
    );

    return false;
  };

  /**
   * Asserts the value of the key is one of the expected values.
   */
  public enum = (key: string, expected: string[]): boolean => {
    const value = this.obj[key];

    if (typeof value === 'string' && expected.includes(value)) {
      return true;
    }

    this.catch(
      enumError({
        expected,
        value,
        path: this.path.of(key),
      }),
    );

    return false;
  };

  /**
   * Asserts the array value of the object key is empty. If the value isn't an
   * array, the function captures a type error and returns false.
   */
  public empty = (key: string): boolean => {
    if (!this.array(key)) {
      return false;
    }

    const value = this.obj[key] as Array<unknown>;

    if (value.length === 0) {
      return true;
    }

    this.catch(
      maxSizeError({
        max: 0,
        value,
        path: this.path.of(key),
      }),
    );

    return false;
  };

  /**
   * Asserts the length of the value of the object key is at least `min`. If the
   * value isn't an array, the function captures a type error and returns false.
   */
  public minLength = (key: string, min: number): boolean => {
    if (!this.array(key)) {
      return false;
    }

    const value = this.obj[key] as Array<unknown>;

    if (value.length >= min) {
      return true;
    }

    this.catch(
      minSizeError({
        min,
        value,
        path: this.path.of(key),
      }),
    );

    return false;
  };

  /**
   * Asserts the object has no additional properties other than the ones
   * specified
   */
  public noAdditionalProperties = (properties: string[]): boolean => {
    const unknowns = Object.keys(this.obj)
      .sort()
      .filter((key) => !properties.includes(key));

    unknowns.forEach((property) =>
      this.catch(
        unknownPropertyError({
          property,
          path: this.path.of(property),
        }),
      ),
    );

    return unknowns.length === 0;
  };

  /**
   * Iterates over the value of the key and assert each item. If the value isn't
   * an array, the function captures a type error and safely exits.
   *
   * To maintain compatibility with previous implementation, we stop early if we
   * find any errors.
   */
  public each = (key: string, assert: (item: any, path: Path) => ValidationError[]): void => {
    if (!this.array(key)) {
      return;
    }

    const value = this.obj[key] as Array<any>;

    let foundErrors = false;
    value.forEach((item, index) => {
      if (foundErrors) {
        return;
      }

      const errors = assert(item, this.path.of(key).of(index));

      if (errors.length > 0) {
        foundErrors = true;
      }

      this.catch(...errors);
    });
  };
}
