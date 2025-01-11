import { CircleAlert } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";

type OwnProps = {
  message: string;
};

const ErrorAlert: React.FC<OwnProps> = ({ message }) => {
  return (
    <Alert variant="destructive" className="flex gap-2">
      <div>
        <CircleAlert className="h-5 w-5" />
      </div>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default ErrorAlert;
