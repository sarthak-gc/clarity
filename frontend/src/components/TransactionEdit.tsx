import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { TransactionI } from "@/types/all";
import { useCategoryStore } from "@/store/CategoryStore";

interface TransactionEditProps {
  transaction: TransactionI;
  isOpen: boolean;
  onUpdate: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export function TransactionEdit({
  transaction,
  isOpen,
  onUpdate,
  onDelete,
  onClose,
}: TransactionEditProps) {
  const { categories } = useCategoryStore();

  const [formData, setFormData] = useState({
    amt: transaction.amt,
    type: transaction.type as "INCOME" | "EXPENSES",
    description: transaction.description || "",
    categoryId: transaction.categoryId || "",
    categoryName: "",
    date: new Date(transaction.date || transaction.createdAt),
  });

  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    setFormData({
      amt: transaction.amt,
      type: transaction.type as "INCOME" | "EXPENSES",
      description: transaction.description || "",
      categoryId: transaction.categoryId || "",
      categoryName: "",
      date: new Date(transaction.date || transaction.createdAt),
    });
  }, [transaction]);

  const handleUpdate = async () => {
    onUpdate();
  };

  const handleDelete = async () => {
    onDelete();
  };

  const handleAddCategory = () => {
    const categoryName = prompt("Enter category name:");
    if (categoryName) {
      setFormData({
        ...formData,
        categoryName: categoryName.trim(),
        categoryId: "",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amt}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amt: parseFloat(e.target.value) || 0,
                })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "INCOME" | "EXPENSES") =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EXPENSES">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter description"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) => {
              if (value === "new-category") {
                handleAddCategory();
                return;
              }
              setFormData({ ...formData, categoryId: value, categoryName: "" });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
              <SelectItem
                value="new-category"
                className="text-blue-600 font-medium"
              >
                + Add New Category
              </SelectItem>
            </SelectContent>
          </Select>

          {formData.categoryName && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              New category: {formData.categoryName}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Date *</Label>
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.date && "text-muted-foreground",
              )}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.date ? format(formData.date, "PPP") : "Pick a date"}
            </Button>

            {showCalendar && (
              <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-lg">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => {
                    setFormData({ ...formData, date: date || new Date() });
                    setShowCalendar(false);
                  }}
                  initialFocus
                />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
