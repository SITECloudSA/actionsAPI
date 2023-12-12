declare module actionapi {
  export interface SdkConfig {
    baseUrl?: string;
    useSockets?: boolean;
    onSuccess?: (params: { data: any; response: any; action: string; method: string; path: string; input: any; body: any }) => void;
    onFail?: (params: { error: any; action: string; method: string; path: string; input: any; body: any }) => void;
    onComplete?: (params: { data?: any; response?: any; error?: any; action: string; method: string; path: string; input: any; body: any }) => void;
    onStart?: (params: { action: string; method: string; path: string; input: any; body: any }) => void;
  }

  export type SetSdkConfig = (param: SdkConfig) => void;
}
