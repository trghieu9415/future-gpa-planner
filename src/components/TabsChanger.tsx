import { useEffect, useRef, useState } from "react";
import { useScheduleStore } from "@/hooks/useScheduleStore";
import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";

export const TabsChanger = () => {
  const { schedules, getActivatedSchedule, addSchedule, removeSchedule, setActivatedSchedule } = useScheduleStore();

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  const handleTabDoubleClick = (e: React.MouseEvent<HTMLDivElement>, tabId: string, currentName: string) => {
    e.currentTarget.focus();
    setEditingTabId(tabId);
    setEditingName(currentName);
  };

  const handleRename = (tabId: string) => {
    if (editingName.trim()) {
      getActivatedSchedule().name = editingName.trim();
    }
    setEditingTabId(null);
    setEditingName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === "Enter") {
      handleRename(tabId);
    } else if (e.key === "Escape") {
      setEditingTabId(null);
      setEditingName("");
    }
  };

  return (
    <div className="w-full grid grid-cols-6 gap-x-1 mb-1 mx-[0.5rem]">
      {schedules.length > 0 &&
        schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`flex items-center justify-between p-1 px-2 border-b h-8 cursor-pointer border rounded-md ${
              getActivatedSchedule()?.id === schedule.id
                ? "bg-white border-b-0 rounded-b-none tabs-wrapper"
                : "bg-[#cccccc]"
            }`}
            onClick={() => setActivatedSchedule(schedule.id)}
            onDoubleClick={(e) => handleTabDoubleClick(e, schedule.id, schedule.name)}
          >
            {editingTabId === schedule.id ? (
              <input
                ref={inputRef}
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, schedule.id)}
                onBlur={() => handleRename(schedule.id)}
                className="border text-sm rounded px-2 py-1 w-full border-none focus:outline-none"
              />
            ) : (
              <span className="font-semibold truncate text-sm">{schedule.name}</span>
            )}
            <button
              className="text-gray-500 hover:text-gray-700 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                removeSchedule(schedule.id);
              }}
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      {schedules.length <= 5 && (
        <Button
          variant="link"
          className="h-8 w-8 border-none group text-gray-500 hover:text-gray-700"
          onClick={() => addSchedule(`Tab mới`)}
        >
          <Plus className="size-4" />
        </Button>
      )}
    </div>
  );
};
