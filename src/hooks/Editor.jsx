import { useState } from "react";
import ReactQuill from "react-quill-new";
import React from "react";

const useEditor = (id, initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const modules = {
    // toolbar what tools appear in the UI
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
      ["bold", "italic", "underline"],
      [{ color: [] }, { background: [] }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["link", "image"],
    ],
  };

  const format = [
    "header",
    "bold",
    "color",
    "background",
    "italic",
    "underline",
    "blockquote",
    "code-block",
    "list",
    "align",
    "size",
    "link",
    "image",
  ];

  const reset = () => setValue("");

  return [
    <ReactQuill
      id={`${id}`}
      value={value}
      theme="snow"
      modules={modules}
      formats={format}
      placeholder="Enter instructions"
      onChange={setValue}
    />,
    value,
    reset,
  ];
};

export default useEditor;
