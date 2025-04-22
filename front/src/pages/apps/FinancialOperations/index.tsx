import { FormInput } from "../../../components";
import React, { useState } from "react";




export default function FinancialOperations() {
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h4 className="card-title">Purchase Order Recording</h4>
        </div>
      </div>
      <div className="p-6">
        <form className="">
          <div className="flex gap-2 flex-wrap">
            <FormInput
              label="No.Po"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="text"
              placeholder="123456"
              className="form-input w-40"
              key="po-number"
            />
            <FormInput
              label="Concept"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="concept"
              placeholder="anticipo"
              className="form-input w-28"
              key="concept"
            />
            <FormInput
              label="Bank"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="bank"
              placeholder="10000"
              className="form-input w-28"
              key="bank"
              />
            <FormInput
              label="Visa Reference"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="text"
              name="fo"
              placeholder="123"
              className="form-input w-28"
              key="fo"
              />
            <FormInput
              label="Date"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="date"
              name="date"
              placeholder="123"
              className="form-input w-40"
              key="date"
              />
            <FormInput
              label="Amount"
              labelClassName="text-gray-800 text-sm font-medium inline-block mb-2"
              type="number"
              name="amount"
              placeholder="123"
              className="form-input w-40"
              key="amount"
              />
            </div>
  {/* Custom Dropzone */}
  <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-400 rounded-md p-4 mt-4 text-center"
          >
            <p>Drop files here or click to upload</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer text-primary underline"
            >
              Browse files
            </label>
          </div>

          {/* Display Selected Files */}
          {files.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium">Selected Files:</h5>
              <ul className="list-disc list-inside">
                {files.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    <span className="text-pink-900 font-bold text-xs">TODO: allow to remove files</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
            <span>PREGUNTAR: ¿cómo se relacionará con la Purchase Order? esto en caso de que se registre antes</span>
          <button type="submit" className="btn block bg-primary text-white mt-8">Submit</button>
        </form>
      </div>
    </div>
  );
}