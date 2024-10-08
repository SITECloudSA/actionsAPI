declare module actionapi {
  export interface SdkConfig {
    baseUrl?: string;
    disableSocket?: boolean;
    onSuccess?: (params: { data: any; response: any; action: string; method: string; path: string; input: any; body: any }) => void;
    onFail?: (params: { error: any; action: string; method: string; path: string; input: any; body: any }) => void;
    onComplete?: (params: { data?: any; response?: any; error?: any; action: string; method: string; path: string; input: any; body: any }) => void;
    onStart?: (params: { action: string; method: string; path: string; input: any; body: any }) => void;
    reactHooks?: boolean;
    sdkFolder?: string;
  }

  export type SetSdkConfig = (param: SdkConfig) => void;
}
