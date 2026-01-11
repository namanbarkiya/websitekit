import QRCode from "qrcode";

import type { QRCodeState } from "../types";

export interface QRGenerationResult {
  svg: string;
  png: Blob | null;
}

export async function generateQRCode(
  state: QRCodeState
): Promise<QRGenerationResult> {
  if (!state.content.trim()) {
    return { svg: "", png: null };
  }

  // Generate SVG
  const svgString = await QRCode.toString(state.content, {
    type: "svg",
    width: state.size,
    margin: state.margin,
    color: {
      dark: state.colorDark,
      light: state.colorLight,
    },
    errorCorrectionLevel: state.errorCorrectionLevel,
  });

  // Generate PNG blob
  const canvas = document.createElement("canvas");
  await QRCode.toCanvas(canvas, state.content, {
    width: state.size,
    margin: state.margin,
    color: {
      dark: state.colorDark,
      light: state.colorLight,
    },
    errorCorrectionLevel: state.errorCorrectionLevel,
  });

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({
        svg: svgString,
        png: blob,
      });
    }, "image/png");
  });
}
