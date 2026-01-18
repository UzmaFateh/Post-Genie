"use client";
import { saveAs } from "file-saver";

export function downloadTxt(filename: string, text: string) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename + ".txt");
}

export function downloadDocx(filename: string, text: string) {
  // Basic docx blob (not a full .docx package). For production, generate on server.
  const blob = new Blob([text], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
  saveAs(blob, filename + ".docx");
}
