import { Text } from '../types';
import { ObjectAssertion } from './assert';
import type { Path } from './path';
import { ValidationError } from './types';

export function assertText(text: Text, path: Path): ValidationError[] {
  const $ = new ObjectAssertion(text, path);

  if (!$.object()) {
    return $.errors;
  }

  $.noAdditionalProperties(['nodeType', 'data', 'value', 'marks']);

  $.object('data');
  $.each('marks', (mark, path) => {
    const mark$ = new ObjectAssertion(mark, path);

    if (!mark$.object()) {
      return mark$.errors;
    }

    // For historical reasons, we don't explicitly check for supported marks
    // e.g. bold, italic ..etc. This makes it possible for a customer to add
    // custom marks
    mark$.string('type');

    return mark$.errors;
  });

  $.string('value');

  return $.errors;
}
