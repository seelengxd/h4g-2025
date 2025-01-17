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
import { MultiSelect } from "@/components/ui/multi-select";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/features/users/queries";

interface MultiUserFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
  horizontal?: boolean;
}

function MultiUserField({
  name,
  label,
  placeholder = "Select users",
  description,
  className,
  horizontal,
}: MultiUserFieldProps) {
  const { control } = useFormContext();
  const { data: users } = useQuery(getUsers());
  const options = users?.map((user) => ({
    value: user.id.toString(),
    label: user.full_name,
  }));

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
              <MultiSelect
                options={options ?? []}
                onValueChange={field.onChange}
                className={cn("col-span-3", className)}
                placeholder={placeholder}
                {...field}
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

export default MultiUserField;
