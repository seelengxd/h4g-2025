import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextareaFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  rows?: number;
  horizontal?: boolean;
  className?: string;
}

function TextareaField({
  name,
  label,
  placeholder,
  description,
  horizontal,
  className,
  rows,
}: TextareaFieldProps) {
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
              <Textarea
                placeholder={placeholder}
                {...field}
                rows={rows}
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

export default TextareaField;
