import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AuthSessionStatusProps {
  status: string | null;
  className?: string;
}

const AuthSessionStatus = ({
  status,
  className,
  ...props
}: AuthSessionStatusProps) => (
  <>
    {status && (
      <Alert>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>{status}</AlertDescription>
      </Alert>
    )}
  </>
);

AuthSessionStatus.displayName = "AuthSessionStatus";

export { AuthSessionStatus };
