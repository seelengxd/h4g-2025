import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  horizontal?: boolean;
}

function TextField({
  name,
  label,
  placeholder,
  description,
  className,
  horizontal,
}: TextFieldProps) {
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
                placeholder={placeholder}
                {...field}
                className={cn(
                  {
                    "col-span-3": label && horizontal,
                    "col-span-4": !(label && horizontal),
                  },
                  className
                )}
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

export default TextField;
