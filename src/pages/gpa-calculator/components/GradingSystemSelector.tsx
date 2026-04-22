import { useState, useEffect } from "react";
import { Trash2, Settings, Pencil, X, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

import { useGradingStorage, SystemType } from "@/hooks/useGradingStorage";
import { Grade } from "@/pages/gpa-calculator/types/grade";
import { toast } from "sonner";

export const GradingSystemSelector = () => {
  const { selectedType, saveType, customSystem, saveCustomSystem } = useGradingStorage();

  const [isOpen, setIsOpen] = useState(false);

  const [draftGrades, setDraftGrades] = useState<Grade[]>(customSystem.grades);

  const [letter, setLetter] = useState("");
  const [value, setValue] = useState("");
  const [editingLetter, setEditingLetter] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDraftGrades(customSystem.grades);
      handleCancelEdit();
    }
  }, [isOpen, customSystem.grades]);

  const handleSaveCustomGrade = () => {
    if (!letter || !value) return;

    const upperLetter = letter.toUpperCase();
    const numValue = parseFloat(value);

    if (editingLetter !== upperLetter && draftGrades.some((g) => g.letter === upperLetter)) {
      toast.error("Điểm này đã tồn tại!");
      return;
    }

    const filteredGrades = editingLetter
      ? draftGrades.filter((g) => g.letter !== editingLetter)
      : draftGrades.filter((g) => g.letter !== upperLetter);

    const newGrades = [...filteredGrades, { letter: upperLetter, value: numValue }];
    newGrades.sort((a, b) => b.value - a.value);

    setDraftGrades(newGrades);
    handleCancelEdit();
  };

  const handleEditClick = (g: Grade) => {
    setLetter(g.letter);
    setValue(g.value.toString());
    setEditingLetter(g.letter);
  };

  const handleCancelEdit = () => {
    setLetter("");
    setValue("");
    setEditingLetter(null);
  };

  const handleRemoveCustomGrade = (letterToRemove: string) => {
    const newGrades = draftGrades.filter((g) => g.letter !== letterToRemove);
    setDraftGrades(newGrades);

    if (editingLetter === letterToRemove) handleCancelEdit();
  };

  const handleConfirmSave = () => {
    saveCustomSystem({ grades: draftGrades });
    saveType("custom");
    setIsOpen(false);
  };

  return (
    <div>
      <RadioGroup
        value={selectedType}
        onValueChange={(val) => saveType(val as SystemType)}
        className="flex flex-col sm:flex-row mb-3"
      >
        <div className="flex items-center space-x-2 h-8">
          <RadioGroupItem value="letter" id="r-letter" />
          <Label htmlFor="r-letter" className="cursor-pointer">
            K24 và các khóa trước
          </Label>
        </div>

        <div className="flex items-center space-x-2 h-8">
          <RadioGroupItem value="plus" id="r-plus" />
          <Label htmlFor="r-plus" className="cursor-pointer">
            K25+
          </Label>
        </div>

        <div className="flex items-center space-x-2 h-8">
          <RadioGroupItem value="custom" id="r-custom" />
          <Label htmlFor="r-custom" className="cursor-pointer">
            Tùy Chỉnh
          </Label>

          {selectedType === "custom" && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-4 size-7 px-3 text-xs">
                  <Settings className="size-3.5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                  <DialogTitle>Tạo hệ điểm của bạn</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 items-end py-4">
                  <div className="space-y-1.5 w-20">
                    <Label className="text-xs text-muted-foreground">Chữ</Label>
                    <Input
                      placeholder="A"
                      value={letter}
                      onChange={(e) => setLetter(e.target.value.toLocaleUpperCase())}
                    />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <Label className="text-xs text-muted-foreground">Hệ số 4 (VD: 3.5)</Label>
                    <Input type="number" step="0.1" value={value} onChange={(e) => setValue(e.target.value)} />
                  </div>

                  <div className="flex gap-1">
                    <Button
                      onClick={handleSaveCustomGrade}
                      variant={editingLetter ? "default" : "secondary"}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {editingLetter ? <Check /> : <Plus />}
                    </Button>

                    {editingLetter && (
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="border rounded-md divide-y max-h-[250px] overflow-y-auto">
                  {draftGrades.length === 0 && (
                    <p className="p-4 text-center text-sm text-muted-foreground">Chưa có dữ liệu</p>
                  )}
                  {draftGrades.map((g) => (
                    <div
                      key={g.letter}
                      className={`flex justify-between items-center p-2 px-4 hover:bg-muted/50 transition-colors ${
                        editingLetter === g.letter ? "bg-primary/5" : ""
                      }`}
                    >
                      <span className="font-mono font-bold">{g.letter}</span>
                      {editingLetter === g.letter ? (
                        <span className="text-sm text-muted-foreground">Đang chỉnh sửa</span>
                      ) : null}
                      <div className="flex items-center gap-1">
                        <span className="font-mono mr-3 text-sm">{g.value.toFixed(1)}</span>

                        <Button variant="ghost" size="icon" className="h-7 w-7 " onClick={() => handleEditClick(g)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 "
                          onClick={() => handleRemoveCustomGrade(g.letter)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <DialogFooter className="mt-2 flex gap-2 sm:justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
                    Hủy
                  </Button>
                  <Button
                    type="button"
                    onClick={handleConfirmSave}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                  >
                    Lưu thay đổi
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </RadioGroup>
    </div>
  );
};
