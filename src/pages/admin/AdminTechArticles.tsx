import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Stack,
  Chip,
  Alert,
  MenuItem,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogApi } from "../../api";
import { TechArticle } from "../../types/api";

const DIFFICULTY_LEVELS = ["入门", "进阶", "高级"];

const AdminTechArticles = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] =
    useState<Partial<TechArticle> | null>(null);
  const [formError, setFormError] = useState("");

  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<TechArticle[]>({
    queryKey: ["techArticles"],
    queryFn: async () => {
      const response = await blogApi.getAll();
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: blogApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techArticles"] });
      setOpenDialog(false);
      setEditingArticle(null);
    },
    onError: () => {
      setFormError("创建失败，请重试");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TechArticle> }) =>
      blogApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techArticles"] });
      setOpenDialog(false);
      setEditingArticle(null);
    },
    onError: () => {
      setFormError("更新失败，请重试");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: blogApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techArticles"] });
    },
    onError: () => {
      setFormError("删除失败，请重试");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!editingArticle?.title || !editingArticle?.content) {
      setFormError("标题和内容不能为空");
      return;
    }

    if (editingArticle.id) {
      updateMutation.mutate({
        id: editingArticle.id.toString(),
        data: editingArticle,
      });
    } else {
      createMutation.mutate(editingArticle as TechArticle);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("确定要删除这篇文章吗？")) {
      deleteMutation.mutate(id.toString());
    }
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          技术文章管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingArticle({});
            setOpenDialog(true);
          }}
        >
          新建文章
        </Button>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          加载失败，请重试
        </Alert>
      ) : null}

      <Stack spacing={3}>
        {articles?.map((article) => (
          <Card
            key={article.id}
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {article.title}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <Chip
                      label={article.category}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      label={article.difficulty}
                      size="small"
                      color={
                        article.difficulty === "入门"
                          ? "success"
                          : article.difficulty === "进阶"
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingArticle(article);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(article.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {article.description}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                {article.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingArticle(null);
          setFormError("");
        }}
        maxWidth="md"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingArticle?.id ? "编辑文章" : "新建文章"}
          </DialogTitle>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="标题"
              value={editingArticle?.title || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  title: e.target.value,
                })
              }
              required
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              label="描述"
              value={editingArticle?.description || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  description: e.target.value,
                })
              }
              required
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="内容"
              value={editingArticle?.content || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  content: e.target.value,
                })
              }
              required
              multiline
              rows={6}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="难度级别"
              value={editingArticle?.difficulty || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  difficulty: e.target.value,
                })
              }
              required
              sx={{ mb: 2 }}
            >
              {DIFFICULTY_LEVELS.map((level) => (
                <MenuItem key={level} value={level}>
                  {level}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="技术分类"
              value={editingArticle?.category || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  category: e.target.value,
                })
              }
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="标签"
              value={editingArticle?.tags?.join(", ") || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  tags: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              helperText="使用逗号分隔多个标签"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="学习资源"
              value={editingArticle?.resources?.join("\n") || ""}
              onChange={(e) =>
                setEditingArticle({
                  ...editingArticle,
                  resources: e.target.value
                    .split("\n")
                    .map((r) => r.trim())
                    .filter(Boolean),
                })
              }
              multiline
              rows={3}
              helperText="每行一个资源链接"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingArticle(null);
                setFormError("");
              }}
            >
              取消
            </Button>
            <Button type="submit" variant="contained">
              确定
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminTechArticles;
