import { useEffect, useRef } from "react";
import QRCode from "qrcode";

const GenerateQR = ({ coupon }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const generateQRCode = async () => {
            try {
                const qrData = JSON.stringify({
                    coupon_id: coupon.id,
                    user_id: coupon.user_id,
                    coupon_category: coupon.coupon_category,
                });

                const canvas = canvasRef.current;
                if (canvas) {
                    await QRCode.toCanvas(canvas, qrData, { width: 300 });
                }
            } catch (error) {
                console.error("Error generating QR code: ", error);
            }
        };

        generateQRCode();
    }, [coupon]);

    return (
        <div>
            <h1>Coupon QR Code</h1>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default GenerateQR;
