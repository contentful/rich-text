import Adapter from '../src/contentful-slatejs-adapter';

describe('contentful-slatejs-adapter', () => {
  it('Adapter is instantiable', () => {
    expect(new Adapter()).toBeInstanceOf(Adapter);
  });
});
