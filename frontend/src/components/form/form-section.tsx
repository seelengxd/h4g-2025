import { PropsWithChildren } from "react";

type OwnProps = {
  title: string;
} & PropsWithChildren;

const FormSection: React.FC<OwnProps> = ({ title, children }) => {
  return (
    <div className="flex w-full items-start">
      <div className="sticky top-0">
        <h2 className="min-w-[200px] text-lg font-medium">{title}</h2>
      </div>
      <div className="flex w-full flex-col gap-4">{children}</div>
    </div>
  );
};

export default FormSection;
