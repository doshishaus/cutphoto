"use client"
import React, { useState } from "react";
import { Button, Box } from "@mui/material";

const ImageResizer = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [resizedImage, setResizedImage] = useState<string | null>(null);

  // 画像アップロード処理
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 画像リサイズ処理
  const handleResize = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const isLandscape = img.width > img.height;

      if (isLandscape) {
        canvas.width = 1562; // 15.62cmをpxに換算
        canvas.height = 976;  // 9.76cmをpxに換算
      } else {
        canvas.width = 976;   // 9.76cmをpxに換算
        canvas.height = 1562; // 15.62cmをpxに換算
      }

      if (ctx) {
        // 中央揃えで画像を描画
        const offsetX = (canvas.width - img.width) / 2;
        const offsetY = (canvas.height - img.height) / 2;
        ctx.drawImage(img, offsetX, offsetY, img.width, img.height);
        
        // リサイズした画像をBlob形式で保存
        setResizedImage(canvas.toDataURL("image/png"));
      }
    };
  };

  // ダウンロード処理
  const handleDownload = () => {
    if (resizedImage) {
      const link = document.createElement("a");
      link.href = resizedImage;
      link.download = "resized-image.png";
      link.click();
    }
  };

  return (
    <Box>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageSrc && <img src={imageSrc} alt="uploaded" style={{ maxWidth: "100%" }} />}
      <Button variant="contained" onClick={handleResize}>
        Resize Image
      </Button>
      {resizedImage && (
        <>
          <img src={resizedImage} alt="resized" style={{ maxWidth: "100%" }} />
          <Button variant="contained" onClick={handleDownload}>
            Download Image
          </Button>
        </>
      )}
    </Box>
  );
};

export default ImageResizer;
