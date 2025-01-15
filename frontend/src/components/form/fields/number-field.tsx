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

interface NumberFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  horizontal?: boolean;
}

function NumberField({
  name,
  label,
  placeholder,
  description,
  className,
  horizontal,
}: NumberFieldProps) {
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
                type="number"
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                }}
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

export default NumberField;
