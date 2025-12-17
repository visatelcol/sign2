
"use client";
import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignPage({ params }: { params: { token: string } }) {
  const sigRef = useRef<SignatureCanvas>(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      alert("Please sign.");
      return;
    }
    setBusy(true);
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");

    const res = await fetch(`/api/sign/${params.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl }),
    });

    setBusy(false);
    if (!res.ok) {
      alert(await res.text());
      return;
    }
    alert("Signed successfully");
  }

  return (
    <div style={{ maxWidth: 700, margin: "20px auto" }}>
      <h2>Sign Document</h2>
      <div style={{ border: "1px solid #ccc", padding: 10 }}>
        <SignatureCanvas ref={sigRef} penColor="black" canvasProps={{ width: 600, height: 220 }} />
      </div>
      <button onClick={submit} disabled={busy} style={{ marginTop: 10 }}>
        {busy ? "Signing..." : "Submit Signature"}
      </button>
    </div>
  );
}
