type NoteEditorProps = {
  onSave: (note: { title: string; content: string }) => void;
};

const NoteEditor: React.FC<NoteEditorProps> = () => {
  return <div>NoteEditor</div>;
};

export default NoteEditor;
