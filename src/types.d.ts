export interface BasicOpts {
  numberOfSkipped: number;
  basePattern: string;
  suffix: string;
  baseDir: string;
  rotatePattern: string;
}

export interface IArchiverOpts extends BasicOpts {
  compress: boolean;
}

export interface IGlobObject {
  name: string;
  pattern: string;
}

export type ArchivingJob = "archive" | "rotate";

export interface InstallJob {
  name: string;
  cronPattern: string;
  job: ArchivingJob;
  config: IArchiverOpts;
  output?: string;
  error?: string;
}
