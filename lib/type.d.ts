export interface SdkConfig {
  baseUrl?: string;
  useSockets?: boolean;
  onStart?({ action, method, path, input, body, config }): void;
  onSuccess?({ data, response, action, method, path, input, body }): void;
  onComplete?({ data, response, error, action, method, path, input, body }): void;
  onFail?({ error, action, method, path, input, body }): void;
}

export function SetSdkConfig(config: SdkConfig): void;
