export interface SdkConfig {
  baseUrl?: string;
  useSockets?: boolean;
  onStart?({ action, method, path, input, body, isHook, config }): void;
  onSuccess?({ data, response, action, method, path, input, body, isHook }): void;
  onComplete?({ data, response, error, action, method, path, input, body, isHook }): void;
  onFail?({ error, action, method, path, input, body, isHook }): void;
  interval?: number;
  indexdbPrefix?: string;
  overrideInterval?: { [action: string]: number };
  authorization?: string;
  headers?: any;
  contentType?: string;
}

export function SetSdkConfig(config: SdkConfig): void;
