import { type Note } from "@prisma/client";
import { useState } from "react";

import ReactMarkdown from "react-markdown";

type NoteCardProps = {
  note: Note;
  onDelete: () => void;
};

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="card border border-gray-200 bg-white">
      <div className="card-body m-0 p-1">
        <div
          className={`collapse-arrow ${
            isExpanded ? "collapse-open" : ""
          } collapse`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="collapse-title text-xl font-light">{note.title}</div>
          <div className="collapse-content">
            <article className="prose lg:prose-xl">
              <ReactMarkdown>{note.content}</ReactMarkdown>
            </article>
          </div>
        </div>
        <div className="card-actions mx-2 justify-end">
          <button className="btn-warning btn-xs btn w-20" onClick={onDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
