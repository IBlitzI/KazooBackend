// const express = require("express");
// const qr = require("qr-image");
// const Cafe = require("../models/cafe.model");

// const router = express.Router();

// router.get("/read-qr-code", async (req, res) => {
//   try {
//     const qrData = req.query.qr;

//     const cafe = await Cafe.findOne({ qrCode: qrData }).populate("user");

//     if (!cafe) {
//       return res.status(404).json({ message: "QR code not found" });
//     }

//     return res.redirect(`/cafe/${cafe._id}/playlist`);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error reading QR code" });
//   }
// });

// router.post("/generate-qr-code", async (req, res) => {
//     try {
//       const cafeId = req.body.cafeId;
//       const cafe = await Cafe.findById(cafeId);
  
//       if (!cafe) {
//         return res.status(404).json({ message: "Cafe not found" });
//       }
  
//       const qrCode = qr.imageSync(`https://kazoo.com/cafe/${cafeId}`, { type: "png" });
//       const qrCodeBase64 = qrCode.toString("base64");
  
//       cafe.qrCode = qrCodeBase64;
//       await cafe.save();
  
//       return res.status(200).json({ message: "QR code generated successfully", data: qrCodeBase64 });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: "Error generating QR code" });
//     }
//   });
  
//   module.exports = router;

// module.exports = router;