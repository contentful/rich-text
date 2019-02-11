import { cloneElement, isValidElement, ReactNode } from 'react';

export function appendKeyToValidElement(element: ReactNode, key: number): ReactNode {
  if (isValidElement(element) && element.key === null) {
    return cloneElement(element, { key });
  }
  return element;
}
