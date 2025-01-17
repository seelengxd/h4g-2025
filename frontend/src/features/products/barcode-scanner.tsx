import { useZxing } from "react-zxing";

type OwnProps = {
  handleDecodeResult: (result: string) => void;
};
const BarcodeScanner: React.FC<OwnProps> = ({ handleDecodeResult }) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      handleDecodeResult(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} />
    </>
  );
};

export default BarcodeScanner;
