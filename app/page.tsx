"use client";
import React, {  useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Home() {
  const [loading, setLoading] = useState<string>("");
  const onDrop = async (acceptedFiles: File[]) => { 
    try {
      if (!acceptedFiles[0].type.startsWith("video/")) {
        alert("文件格式错误，请上传视频文件。");
        return;
      }
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);
      if (acceptedFiles[0]) {
        // setPreview(URL.createObjectURL(acceptedFiles[0]));
        setLoading("正在上传视频中...");
      }
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert('上传失败')
        setLoading("");
        return;
      }else{
        alert('上传成功')
      }
      setLoading("");
    } catch (error) {
      alert("上传过程中发生错误，请重试。");
      console.error("Error:", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".avi"] }, // Updated to accept video files
    maxFiles: 1,
    // noClick: !session,
  });
  return (
    <>
      <div className="w-full h-screen p-4 flex flex-col   rounded-md items-center">
        <h2 className="text-black font-bold text-sm text-center">Upload video</h2>
        <div className="relative mt-2">
        <div
          {...getRootProps()}
          className="border border-dashed border-gray-400 rounded-md p-4 text-center md:w-[440px] sm:w-[280px] mx-auto my-4 cursor-pointer "
        >
          <input {...getInputProps()} />
          <div className="flex flex-col">
            <div className="px-4 py-2 flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M13.3333 23.6667L20 17M20 17L26.6666 23.6667M20 17V32M33.3333 27.9047C35.3692 26.2234 36.6666 23.6799 36.6666 20.8333C36.6666 15.7707 32.5626 11.6667 27.5 11.6667C27.1358 11.6667 26.7951 11.4767 26.6102 11.1629C24.4367 7.47473 20.424 5 15.8333 5C8.92975 5 3.33331 10.5964 3.33331 17.5C3.33331 20.9435 4.72572 24.0618 6.97823 26.3226"
                  stroke="#FFA462"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {loading ? (
              <p className="text-sm">Uploading video...</p>
            ) : (
              <p className="text-sm">
                Drag and drop an video here, or click to select one.
              </p>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
