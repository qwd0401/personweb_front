import { useState, useEffect } from 'react';
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
  useTheme,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import { Blog } from '../../types';
import { getBlogs, adminCreateBlog, adminUpdateBlog, adminDeleteBlog } from '../../services/api';

const AdminBlogs = () => {
  const theme = useTheme();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Partial<Blog> | null>(null);
  const [formError, setFormError] = useState('');

  // 获取博客列表
  const fetchBlogs = async () => {
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (err) {
      setError('获取博客列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      if (editingBlog?.id) {
        await adminUpdateBlog(editingBlog.id.toString(), editingBlog);
      } else {
        await adminCreateBlog(editingBlog as Blog);
      }
      setOpenDialog(false);
      setEditingBlog(null);
      fetchBlogs();
    } catch (err) {
      setFormError('操作失败，请重试');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这篇博客吗？')) {
      try {
        await adminDeleteBlog(id.toString());
        fetchBlogs();
      } catch (err) {
        setError('删除失败');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          博客管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingBlog({});
            setOpenDialog(true);
          }}
        >
          新建博客
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {blogs.map((blog) => (
          <Card
            key={blog.id}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              '&:hover': {
                borderColor: 'primary.main',
                boxShadow: theme.shadows[4],
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(blog.date).toLocaleDateString('zh-CN')}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingBlog(blog);
                      setOpenDialog(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(blog.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {blog.content}
              </Typography>
              <Box>
                {blog.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{ mr: 1, mb: 1 }}
                  />
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
          setEditingBlog(null);
          setFormError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingBlog?.id ? '编辑博客' : '新建博客'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {formError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {formError}
              </Alert>
            )}
            <TextField
              fullWidth
              label="博客标题"
              value={editingBlog?.title || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="博客内容"
              value={editingBlog?.content || ''}
              onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
              required
              multiline
              rows={6}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="标签"
              value={editingBlog?.tags?.join(', ') || ''}
              onChange={(e) => setEditingBlog({
                ...editingBlog,
                tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              required
              helperText="使用逗号分隔多个标签"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingBlog(null);
                setFormError('');
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

export default AdminBlogs; 