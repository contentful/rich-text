import React, { FunctionComponent, ReactNode } from 'react';

type StrongProps = {
  children: ReactNode;
};

const Strong: FunctionComponent<StrongProps> = ({ children }) => {
  return <strong>{children}</strong>;
};

export default Strong;
