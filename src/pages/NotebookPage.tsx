import { useState } from "react";
import { useTranslation } from "@/hooks/use-translation";
import { useIsMobile } from "@/hooks/use-mobile";
import TopBar from "@/components/TopBar";
import { Plus, BookOpen, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

const NotebookPage = () => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showList, setShowList] = useState(true);

  const createNote = () => {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
    };
    setNotes((prev) => [note, ...prev]);
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    if (isMobile) setShowList(false);
  };

  const saveNote = () => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) => (n.id === activeNote.id ? { ...n, title, content } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setTitle("");
      setContent("");
    }
  };

  const selectNote = (note: Note) => {
    saveNote();
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    if (isMobile) setShowList(false);
  };

  return (
    <div className="flex h-full flex-col">
      <TopBar title={t("notebook.title")}>
        {isMobile && activeNote && (
          <button
            onClick={() => { saveNote(); setShowList(true); }}
            className="text-xs text-primary font-medium"
          >
            ← {t("sidebar.gems")}
          </button>
        )}
      </TopBar>

      <div className="flex flex-1 overflow-hidden">
        {/* Notes list */}
        {(!isMobile || showList) && (
          <div className={`${isMobile ? "w-full" : "w-64"} border-r border-border p-4 overflow-y-auto`}>
            <button
              onClick={createNote}
              className="flex w-full items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:border-primary hover:text-primary mb-4"
            >
              <Plus className="h-4 w-4" /> {t("notebook.newNote")}
            </button>

            {notes.length === 0 && (
              <p className="text-xs text-muted-foreground text-center mt-8">{t("notebook.noNotes")}</p>
            )}

            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all mb-1 ${
                  activeNote?.id === note.id
                    ? "bg-accent-dim text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <span className="truncate flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 shrink-0" />
                  {note.title}
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                  className="text-destructive/60 hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </button>
            ))}
          </div>
        )}

        {/* Editor */}
        {(!isMobile || !showList) && (
          <div className="flex-1 p-4 sm:p-6">
            {activeNote ? (
              <div className="mx-auto max-w-2xl space-y-4 animate-fade-in">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={saveNote}
                  placeholder={t("notebook.titlePlaceholder")}
                  className="w-full bg-transparent text-xl sm:text-2xl font-bold text-foreground outline-none placeholder:text-muted-foreground"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onBlur={saveNote}
                  rows={20}
                  placeholder={t("notebook.placeholder")}
                  className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground leading-relaxed resize-none"
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center animate-fade-in px-4">
                <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-bold mb-2">{t("notebook.title")}</h3>
                <p className="text-sm text-muted-foreground max-w-sm">{t("notebook.description")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookPage;
