import { t } from '@lingui/core/macro';

import type { Path } from './path';
import { ValidationError } from './types';

export const typeMismatchError = ({
  path,
  property,
  typeName,
  value,
}: {
  path: Path;
  property: string | number;
  typeName: string;
  value: any;
}): ValidationError => {
  return {
    details: t({
      id: 'RichText.RichTextTypes.Validator.TypeMismatchErrorMessage',
      message: `The type of "${property}" is incorrect, expected type: ${typeName}`,
    }),
    name: 'type',
    path: path.toArray(),
    type: typeName,
    value,
  };
};

export const minSizeError = ({
  min,
  value,
  path,
}: {
  min: number;
  value: any;
  path: Path;
}): ValidationError => {
  return {
    name: 'size',
    min,
    path: path.toArray(),
    details: t({
      id: 'RichText.RichTextTypes.Validator.MinSizeErrorMessage',
      message: `Size must be at least ${min}`,
    }),
    value,
  };
};

export const maxSizeError = ({
  max,
  value,
  path,
}: {
  max: number;
  value: any;
  path: Path;
}): ValidationError => {
  return {
    name: 'size',
    max,
    path: path.toArray(),
    details: t({
      id: 'RichText.RichTextTypes.Validator.MaxSizeErrorMessage',
      message: `Size must be at most ${max}`,
    }),
    value,
  };
};

export const enumError = ({
  expected,
  value,
  path,
}: {
  expected: string[];
  value: any;
  path: Path;
}): ValidationError => {
  return {
    details: t({
      id: 'RichText.RichTextTypes.Validator.EnumErrorMessage',
      message: `Value must be one of expected values`,
    }),
    name: 'in',
    expected: [...expected].sort(),
    path: path.toArray(),
    value,
  };
};

export const unknownPropertyError = ({
  property,
  path,
}: {
  property: string;
  path: Path;
}): ValidationError => {
  return {
    details: t({
      id: 'RichText.RichTextTypes.Validator.UnknownPropertyErrorMessage',
      message: `The property "${property}" is not expected`,
    }),
    name: 'unexpected',
    path: path.toArray(),
  };
};

export const requiredPropertyError = ({
  property,
  path,
}: {
  property: string;
  path: Path;
}): ValidationError => {
  return {
    details: t({
      id: 'RichText.RichTextTypes.Validator.RequiredPropertyErrorMessage',
      message: `The property "${property}" is required here`,
    }),
    name: 'required',
    path: path.toArray(),
  };
};
