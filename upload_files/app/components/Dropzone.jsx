"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getSignature, saveToDatabase } from "../_actions";

const Dropzone = ({ className }) => {
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        // If allowing multiple files
        // ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 1,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  async function action() {
    const file = files[0];
    if (!file) return;

    // get a signature using server action
    const { timestamp, signature } = await getSignature();

    // upload to cloudinary using the signature
    const formData = new FormData();

    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);
    formData.append("folder", "next");

    const endpoint = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL;
    const data = await fetch(endpoint, {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    // write to database using server actions
    await saveToDatabase({
      version: data?.version,
      signature: data?.signature,
      public_id: data?.public_id,
    });
  }

  return (
    <form action={action} className="max-w-2xl mx-auto p-5">
    <div {...getRootProps({ className: className })} className="border-dashed border-4 border-gray-300 p-8 rounded-lg text-center">
      <input {...getInputProps({ name: "file" })} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <ArrowUpTrayIcon className="h-12 w-12 text-blue-500" />
        {isDragActive ? (
          <p className="text-gray-600">Drop the files here...</p>
        ) : (
          <p className="text-gray-600">Drag & drop files here, or click to select files</p>
        )}
      </div>
    </div>
  
    {/* Preview */}
    <section className="mt-8">
      <h3 className="text-lg font-semibold border-b pb-2 text-gray-800">
        Accepted Files
      </h3>
      {files.map((file) => (
        <div key={file.name} className="flex flex-col mt-4 space-y-2  items-center bg-white p-4 rounded-lg shadow-md">
          <Image
            src={file.preview}
            alt={file.name}
            width={200}
            height={200}
            onLoad={() => URL.revokeObjectURL(file.preview)}
            className="rounded-md object-cover"
          />
          <div className=" flex gap-5 items-center ml-4">
            <button
              type="button"
              className="w-auto h-8 border border-rose-500 px-3 py-1 text-xs font-semibold uppercase rounded-md text-rose-500 hover:bg-rose-500 hover:text-white transition-all "
              onClick={() => removeFile(file.name)}
            >
              Remove
            </button>
            <button
              type="submit"
              className="w-auto  h-8 mt-1 border rounded-lg border-purple-500 px-3 text-xs font-semibold uppercase tracking-wide text-purple-500 hover:bg-purple-500 hover:text-white transition-all"
            >
              Upload to Cloudinary
            </button>
       
          </div>
          <p className="text-xs font-medium text-gray-700">{file.name}</p>
        </div>
      ))}
  
      {/* Rejected Files */}
      <h3 className="text-lg mt-8 font-semibold border-b pb-2 text-gray-800">
        Rejected Files
      </h3>
      <ul className="mt-4 flex flex-col space-y-2">
        {rejected.map(({ file, errors }) => (
          <li key={file.name} className="flex flex-col sm:flex-row items-start justify-between bg-white p-4 rounded-lg shadow-md">
            <div className="mb-2 sm:mb-0">
              <p className="text-sm font-medium text-gray-700">{file.name}</p>
              <ul className="text-sm text-red-500">
                {errors.map((error) => (
                  <li key={error.code}>{error.message}</li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="w-full sm:w-auto mt-1 rounded-md border border-rose-500 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
              onClick={() => removeRejected(file.name)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  </form>
  
  );
};

export default Dropzone;
