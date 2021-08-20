import classNames from "classnames";

// here we are defining an interface and explicitly defining the types for the props this
// component will receive
interface InputGroupProps {
  className?: string;
  type: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  setValue: (str: string) => void;
}

const InputGroup: React.FC<InputGroupProps> = ({
  className,
  type,
  error,
  placeholder,
  setValue,
  value,
}) => {
  return (
    <div className={className}>
      <input
        type={type}
        className={classNames(
          "w-full px-3 py-3 transition duration-200 border border-gray-300 outline-none bg-gray-50 rouded focus:bg-white hover:bg-white",
          { "border-red-500": error }
        )}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <small className="font-medium text-red-600">{error}</small>
    </div>
  );
};

export default InputGroup;
