"use client";

import { useEffect } from "react";
import { printAppSignature } from "../../config/appSignature";

export default function SignatureLoader() {
  useEffect(() => {
    printAppSignature();
  }, []);

  return null;
}