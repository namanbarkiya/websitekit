/**
 * QR Code Tool Types
 *
 * Type definitions for the QR Code tool state and configuration.
 */

export interface QRCodeState {
  content: string;
  size: number;
  margin: number;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  colorDark: string;
  colorLight: string;
  format: "svg" | "png";
}

export const DEFAULT_STATE: QRCodeState = {
  content: "",
  size: 256,
  margin: 4,
  errorCorrectionLevel: "M",
  colorDark: "#000000",
  colorLight: "#FFFFFF",
  format: "svg",
};
