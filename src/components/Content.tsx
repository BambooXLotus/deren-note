import { useSession } from "next-auth/react";
import { useRef, useState, type KeyboardEvent } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

import toast from "react-hot-toast";
import { type Topic } from "@prisma/client";

type ContentProps = {
  id?: string;
};

const Content: React.FC<ContentProps> = () => {
  const [topicTitle, setTopicTitle] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const { data: sessionData } = useSession();
  const { data: topics, refetch: refetchTopics } = api.topic.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const { mutateAsync: createTopicMutation, isLoading: isLoadingCreateTopic } =
    api.topic.create.useMutation({});

  const topicSchema = z.string().min(3).max(20);

  async function handleCreateTopic() {
    try {
      topicSchema.parse(topicTitle);

      await toast.promise(
        createTopicMutation(
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
      console.log(error);
    }
  }

  return (
    <div className="gap2 mx-5 mt-5 grid grid-cols-4">
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
          className={`input-bordered input input-sm w-full`}
          disabled={isLoadingCreateTopic}
          value={topicTitle}
          onChange={(event) => setTopicTitle(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              void handleCreateTopic();
            }
          }}
        />
        <div className="alert alert-error mt-3 shadow-lg">
          <div>
            <span>Error! Task failed successfully.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
