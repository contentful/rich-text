export class Path {
  constructor(private readonly path: (string | number)[] = []) {}

  of = (element: string | number): Path => {
    return new Path([...this.path, element]);
  };

  isRoot = (): boolean => {
    return this.path.length === 0;
  };

  last = (): string | number | undefined => {
    return this.path[this.path.length - 1];
  };

  toArray = (): (string | number)[] => {
    return this.path;
  };
}
