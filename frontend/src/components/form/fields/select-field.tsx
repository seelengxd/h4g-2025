import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

interface SelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  options: Option[];
  disabled?: boolean;
  horizontal?: boolean;
}

function SelectField({
  name,
  label,
  placeholder,
  description,
  options,
  disabled = false,
  horizontal,
}: SelectFieldProps) {
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem value={option.value} key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </FormControl>
          <FormMessage />
          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}

export default SelectField;
