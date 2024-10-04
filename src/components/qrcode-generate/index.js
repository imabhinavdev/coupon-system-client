// import { useEffect, useRef, useState } from "react";
// import QRCode from "qrcode";
// import { LoadingIcon } from "@/components/icons";
// import { ShareIcon } from "@/components/icons";

// const GenerateQR = ({ coupon }) => {
//   const canvasRef = useRef(null);
//   const [loading, setLoading] = useState(true);
//   const [qrImage, setQrImage] = useState(null); // To store the image URL

//   useEffect(() => {
//     const generateQRCode = async () => {
//       try {
//         const qrData = JSON.stringify({
//           couponId: coupon.id,
//           userId: coupon.userId,
//           couponCategoryId: coupon.couponCategoryId,
//         });

//         const canvas = canvasRef.current;
//         if (canvas) {
//           await QRCode.toCanvas(canvas, qrData, { width: 300 });
//           const dataUrl = canvas.toDataURL("image/png");
//           setQrImage(dataUrl);
//         }
//       } catch (error) {
//         console.error("Error generating QR code: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     generateQRCode();
//   }, [coupon]);

//   const handleShare = async () => {
//     if (!qrImage) {
//       console.error("QR code image not generated");
//       return;
//     }

//     try {
//       // Convert data URL to a Blob
//       const response = await fetch(qrImage);
//       const blob = await response.blob();
//       const file = new File([blob], "qrcode.png", { type: blob.type });

//       // Check if the navigator.share API is supported
//       if (navigator.share) {
//         await navigator.share({
//           files: [file],
//           title: "QR Code",
//           text: "Here is your QR code",
//         });
//       } else {
//         alert("Sharing is not supported on your device");
//       }
//     } catch (error) {
//       console.error("Error sharing QR code:", error);
//     }
//   };

//   return (
//     <>
//       {loading && (
//         <div className="fixed p-2 md:p-0 inset-0 bg-opacity-50 flex justify-center items-center z-50">
//           <LoadingIcon color="#000" className="w-10 h-10" />
//         </div>
//       )}

//       <div className="flex flex-col items-center justify-center">
//         <canvas ref={canvasRef}></canvas>
//         <button
//           onClick={handleShare}
//           className="mt-4 flex items-center space-x-2 p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
//         >
//           <ShareIcon className="w-5 h-5" />
//           <span>Share QR Code</span>
//         </button>
//       </div>
//     </>
//   );
// };

// export default GenerateQR;
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { LoadingIcon } from "@/components/icons";
import { ShareIcon } from "@/components/icons";
import { DownloadIcon } from "@/components/icons"; // Assuming there's a download icon

const GenerateQR = ({ coupon }) => {
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [qrImage, setQrImage] = useState(null); // To store the image URL

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
          await QRCode.toCanvas(canvas, qrData, { width: 300 });
          // Convert the canvas to an image data URL (PNG)
          const dataUrl = canvas.toDataURL("image/png");
          setQrImage(dataUrl);
        }
      } catch (error) {
        console.error("Error generating QR code: ", error);
      } finally {
        setLoading(false);
      }
    };

    generateQRCode();
  }, [coupon]);

  const handleShare = async () => {
    if (!qrImage) {
      console.error("QR code image not generated");
      return;
    }

    try {
      // Convert data URL to a Blob
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const file = new File([blob], "qrcode.png", { type: blob.type });

      // Check if the navigator.share API is supported
      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "QR Code",
          text: "Here is your QR code",
        });
      } else {
        alert("Sharing is not supported on your device");
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
    }
  };

  const handleDownload = () => {
    if (!qrImage) {
      console.error("QR code image not available for download");
      return;
    }

    // Create an anchor element and trigger download
    const link = document.createElement("a");
    link.href = qrImage; // The generated QR code as PNG
    link.download = "qrcode.png"; // File name
    link.click(); // Trigger the download
  };

  return (
    <>
      {loading && (
        <div className="fixed p-2 md:p-0 inset-0 bg-opacity-50 flex justify-center items-center z-50">
          <LoadingIcon color="#000" className="w-10 h-10" />
        </div>
      )}

      <div className="flex flex-col items-center justify-center">
        <canvas ref={canvasRef}></canvas>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleShare}
            className="flex items-center space-x-2 flex-1 py-2 px-3 bg-secondary text-primary  rounded-md"
          >
            <ShareIcon className="w-5 h-5" color="#fff" />
            <span>Share</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 flex-1 py-2 px-3 bg-secondary text-primary  rounded-md"
          >
            <DownloadIcon className="w-5 h-5" color="#fff" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default GenerateQR;
