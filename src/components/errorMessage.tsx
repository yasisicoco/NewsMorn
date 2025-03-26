interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="mt-10 mx-auto max-w-md text-center bg-destructive/10 text-destructive p-4 rounded-lg shadow">
      <p className="text-sm font-sans">{message}</p>
    </div>
  );
}
