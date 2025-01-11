import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FileFieldProps {
  name: string;
  label?: string;
  description?: string;
  className?: string;
  horizontal?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileField({
  name,
  label,
  description,
  className,
  horizontal,
  onChange,
}: FileFieldProps) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && !horizontal && (
            <FormLabel className="!text-current">{label}</FormLabel>
          )}
          <FormControl>
            <div className="grid items-center grid-cols-4 gap-4">
              {label && horizontal && (
                <FormLabel className="!text-current text-right">
                  {label}
                </FormLabel>
              )}
              <Input
                type="file"
                {...field}
                onChange={onChange}
                className={cn("col-span-3", className)}
              />
            </div>
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

export default FileField;
