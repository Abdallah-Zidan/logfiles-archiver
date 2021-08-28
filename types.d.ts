export interface BasicOpts {
  numberOfSkipped: number;
  basePattern: string;
  suffix: string;
  baseDir: string;
}

export interface IArchiverOpts extends BasicOpts {
  compress: boolean;
}

export interface IGlobObject {
  name: string;
  pattern: string;
}
