import React, { FunctionComponent, ReactNode } from 'react';

type DocumentProps = {
  children: ReactNode;
};

const Document: FunctionComponent<DocumentProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default Document;
