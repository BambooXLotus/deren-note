import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

type NoteEditorProps = {
  onSave: (note: { title: string; content: string }) => void;
};

const NoteEditor: React.FC<NoteEditorProps> = ({ onSave }) => {
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="card border border-gray-200 bg-white">
      <div className="card-body">
        <h2 className="card-title">
          <input
            type="text"
            className="input-primary input input-lg w-full rounded font-bold"
            placeholder="Note Title"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </h2>
        <CodeMirror
          value={code}
          height="30vh"
          minWidth="100%"
          className="border border-gray-300"
          onChange={(value) => setCode(value)}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
          ]}
        />
        <div className="card-actions justify-end">
          <button
            onClick={() => {
              onSave({
                title,
                content: code,
              });
              setCode("");
              setTitle("");
            }}
            className="btn-primary btn w-40"
            disabled={title.trim().length === 0 || code.trim().length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
