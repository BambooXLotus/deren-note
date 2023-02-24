import { useSession } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

import toast from "react-hot-toast";
import { type Topic } from "@prisma/client";
import NoteEditor from "./NoteEditor";
import NoteCard from "./NoteCard";

type ContentProps = {
  id?: string;
};

const Content: React.FC<ContentProps> = () => {
  const [topicTitle, setTopicTitle] = useState("");
  const [topicTitleErrors, setTopicTitleErrors] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: sessionData } = useSession();
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );
  const { data: notes, refetch: refetchNotes } = api.note.getAll.useQuery(
    {
      topicId: selectedTopic?.id ?? "",
    },
    {
      enabled: sessionData?.user !== undefined && selectedTopic !== null,
    }
  );

  const { mutateAsync: createTopic } = api.topic.create.useMutation({});
  const { mutateAsync: createNote } = api.note.create.useMutation();
  const { mutate: deleteNote } = api.note.delete.useMutation();

  async function handleCreateTopic() {
    const topicSchema = z.string().min(3).max(20);

    try {
      topicSchema.parse(topicTitle);

      await toast.promise(
        createTopic(
          {
            title: topicTitle,
          },
          {
            onSuccess: (data) => {
              setTopicTitle("");
              setSelectedTopic(data);
              void refetchTopics();
            },
          }
        ),
        {
          loading: "Creating Topic",
          success: "Cool",
          error: "error",
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const donkey = error.issues.map((issue) => issue.message).join(", ");
        setTopicTitleErrors(donkey);
      }
    }
  }

  async function handleCreateNote(title: string, content: string) {
    const noteSchema = z.object({
      title: z.string().min(3).max(255),
      content: z.string().min(3).max(1000),
    });

    const note = {
      title,
      content,
    };

    if (!selectedTopic) return;

    try {
      noteSchema.parse(note);

      await toast.promise(
        createNote(
          {
            title,
            content,
            topicId: selectedTopic.id,
          },
          {
            onSuccess: () => {
              void refetchNotes();
            },
          }
        ),
        {
          loading: "Saving Note",
          success: "Note Saved",
          error: "Error Saving Note",
        }
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        const donkey = error.issues.map((issue) => issue.message).join(", ");
        setTopicTitleErrors(donkey);
      }
    }
  }

  function handleDeleteNote(noteId: string) {
    deleteNote({ id: noteId }, { onSuccess: () => void refetchNotes() });
  }

  return (
    <div className="mx-5 mt-5 grid grid-cols-4 gap-2">
      <div className="px-2">
        <ul className="menu rounded-box w-full bg-base-100">
          {topics?.map((topic) => (
            <li key={topic.id}>
              <a
                href="#"
                onClick={(evt) => {
                  evt.preventDefault();
                  setSelectedTopic(topic);
                }}
              >
                {topic.title}
              </a>
            </li>
          ))}
        </ul>
        <div className="divider"></div>
        <input
          type="text"
          placeholder="New Topic"
          className={`input-bordered input input-sm w-full rounded`}
          // disabled={isLoadingCreateTopic}
          value={topicTitle}
          onChange={(event) => setTopicTitle(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleCreateTopic();
            }
          }}
        />
        {topicTitleErrors && (
          <div className="alert alert-error mt-3 rounded-lg shadow-xl">
            <div>
              <span>{topicTitleErrors}</span>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-3">
        <div className="space-y-3">
          {notes?.map((note) => (
            <div key={note.id}>
              <NoteCard
                note={note}
                onDelete={() => void handleDeleteNote(note.id)}
              />
            </div>
          ))}
          <NoteEditor
            onSave={({ title, content }) =>
              void handleCreateNote(title, content)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Content;
