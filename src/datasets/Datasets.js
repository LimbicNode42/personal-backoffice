import React, { useState, useEffect, useRef } from 'react';
import { gql, useQuery, useMutation } from "@apollo/client";
import { useAuth } from "../auth/Login";

const GET_DATASETS = gql`query GetFiles { getFiles }`;
const APPEND_DATASET = gql`
  mutation AppendToJSONL($fileName: String!, $record: JSON!) {
    appendToJSONL(fileName: $fileName, record: $record)
  }
`;

function Datasets() {
  const [selectedFile, setSelectedFile] = useState("");
  const [source, setSource] = useState("");
  const [instruction, setInstruction] = useState("");
  const [output, setOutput] = useState("");
  const sourceRef = useRef(null);

  const { token } = useAuth();

  const {
    data,
    loading: queryLoading,
    error: queryError,
    refetch,
  } = useQuery(GET_DATASETS);

  const [
    appendToJSONL,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(APPEND_DATASET);

  const isLoading = queryLoading || mutationLoading;
  const error = queryError || mutationError;

  // Refetch on token update
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a dataset file first.");
      return;
    }

    try {
      await appendToJSONL({
        variables: {
          fileName: selectedFile,
          record: {
            source,
            instruction,
            output,
          },
        },
      });

      // Reset form
      setSource("");
      setInstruction("");
      setOutput("");
      console.log("✅ Submitted successfully");

      setTimeout(() => {
        sourceRef.current?.focus();
      }, 0);

      refetch();
    } catch (err) {
      console.error("❌ Submission failed:", err);
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-600">Error: {error.message}</p>;

  return (
    <div className="w-[50vw] mx-auto flex flex-col items-center">
      {/* Dataset Dropdown */}
      <div className="text-center px-4 w-full">
        <label className="block text-sm font-medium mb-1">Dataset:</label>
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
          className="border px-4 py-2 rounded bg-white shadow-sm text-gray-700 hover:bg-gray-50 w-full"
        >
          <option value="">Select Dataset</option>
          {data?.getFiles.map((file) => (
            <option key={file} value={file}>
              {file}
            </option>
          ))}
        </select>
      </div>

      <br />

      {selectedFile && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input
              ref={sourceRef}
              type="text"
              name="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instruction</label>
            <textarea
              name="instruction"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={4}
              placeholder="Enter instruction..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
            <textarea
              name="output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={4}
              placeholder="Enter output..."
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              disabled={mutationLoading}
            >
              {mutationLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Datasets;
