interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="text-center mt-10 text-red-500">
      <p>{message}</p>
    </div>
  );
}
