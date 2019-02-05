import React, { FunctionComponent, ReactNode } from 'react';

type ParagraphProps = {
  children: ReactNode;
};

const Paragraph: FunctionComponent<ParagraphProps> = ({ children }) => {
  return <p style={{ color: 'red' }}>{children}</p>;
};

export default Paragraph;
