import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { LoadingIcon } from "@/components/icons";
const GenerateQR = ({ coupon }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrData = JSON.stringify({
          couponId: coupon.id,
          userId: coupon.userId,
          couponCategoryId: coupon.couponCategoryId,
        });

        const canvas = canvasRef.current;
        if (canvas) {
          QRCode.toCanvas(canvas, qrData, { width: 300 });
        }
      } catch (error) {
        console.error("Error generating QR code: ", error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [coupon]);

  return (
    <>
      {loading && (
        <div className="fixed p-2 md:p-0 inset-0  bg-opacity-50 flex justify-center items-center z-50">
          <LoadingIcon color="#000" className="w-10 h-10" />
        </div>
      )}
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default GenerateQR;
