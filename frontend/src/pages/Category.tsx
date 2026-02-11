import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/CategoryStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Tag,
  Trash2,
  FolderOpen,
  AlertCircle,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getErrorMessage, getFormErrorMessage } from "@/lib/errorHandling";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/lib/api";

export const Category = () => {
  const { categories, setCategories, addCategory, removeCategory } =
    useCategoryStore();
  const [error, setError] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const { user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await apiService.getCategories();
const data = response.data
        setCategories(data.categories);
      } catch (error) {
        setError(getErrorMessage(error));
      }
    };
    getAllCategories();
  }, [user, setCategories]);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setError(
        getFormErrorMessage("categoryName", "Please enter a category name"),
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiService.createCategory(newCategoryName.trim());
      
const data = response.data
        addCategory({
          name: newCategoryName.trim(),
          id: data.category.id,
        });
        setNewCategoryName("");
        setIsAddDialogOpen(false);
     
    } catch (error) {
      console.error("Failed to add category:", error);
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      !window.confirm(`Are you sure you want to delete category "${name}"?`)
    ) {
      return;
    }

    try {
      const response = await apiService.deleteCategory(id);
      if (response) {
        removeCategory(id);
      }
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleEditCategory = (id: string, name: string) => {
    setEditingCategory({ id, name });
    setEditCategoryName(name);
  };

  const handleSaveEdit = async () => {
    if (!editCategoryName.trim() || !editingCategory) {
      return;
    }

    try {
      await apiService.updateCategory(editingCategory.id, editCategoryName.trim());
        setEditingCategory(null);
        setEditCategoryName("");
        getAllCategories();
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName("");
  };

  const getAllCategories = async () => {
    try{
      const response = await apiService.getCategories();
      setCategories(response.data.categories);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 mt-1">
            Manage your transaction categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setNewCategoryName("");
                    setError("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddCategory}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Adding..." : "Add Category"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {categories.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No categories yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first category to organize your transactions
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Category
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card
              onClick={async () => {
                navigate(`/categories/${category.id}`);
              }}
              key={category.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                {editingCategory?.id === category.id ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <Input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="flex-1"
                        placeholder="Category name"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Tag className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          Category
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEditCategory(category.id, category.name)
                        }
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDeleteCategory(category.id, category.name)
                        }
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
