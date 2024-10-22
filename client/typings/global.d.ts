export type FallbackComponentProps = {
  isModal?: boolean;
  error?: Error | null;
  resetError: VoidFunction;
};

export interface BasicResponseInterface<T = null, M = null> {
  payload: T;
  metadata: M;
  status: number;
  message: string;
}
