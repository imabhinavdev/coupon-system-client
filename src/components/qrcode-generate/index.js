import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const GenerateQR = ({ coupon }) => {
  const canvasRef = useRef(null);

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
      }
    };

    generateQRCode();
  }, [coupon]);

  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default GenerateQR;
