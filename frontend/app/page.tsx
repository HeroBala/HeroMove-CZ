"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    fetch("http://127.0.0.1:8000/")
      .then(res => res.json())
      .then(data => console.log("Backend says:", data));
  }, []);

  return (
    <iframe
      src="index.html"
      style={{
        width: "100%",
        height: "100vh",
        border: "none",
      }}
    />
  );
}
