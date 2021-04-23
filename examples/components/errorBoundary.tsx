import { ErrorBoundary as _ErrorBoundary } from 'react-error-boundary';
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: any;
  resetErrorBoundary: () => any;
}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export const ErrorBoundary: React.FunctionComponent<{}> = ({ children }) => {
  return (
    <_ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </_ErrorBoundary>
  );
};
