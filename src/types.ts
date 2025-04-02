export interface VideoMetadata {
  id?: string;
  service?: string;
}

export interface VideoService {
  service: string;
  regex: RegExp;
  callback: (url: string) => string | undefined;
}
