import { useState, useEffect } from 'react';
import {
  Box,
  Button,
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
  CircularProgress,
  Link as MuiLink
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { Project } from '../../types';
import { getProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } from '../../services/api';
import { AdminCard } from './AdminLayout';

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [formError, setFormError] = useState('');

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError('获取项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    try {
      // 在发送请求前打印数据
      console.log('发送的项目数据:', {
        ...editingProject,
        title: editingProject?.title,
        description: editingProject?.description,
        technologies: editingProject?.technologies,
        outcome: editingProject?.outcome,
        github: editingProject?.github,
        demo: editingProject?.demo
      });

      if (editingProject?.id) {
        // 更新项目
        try {
          await adminUpdateProject(editingProject.id.toString(), editingProject);
          console.log('项目更新成功:', editingProject.id);
        } catch (error: any) {
          console.error('更新项目失败:', {
            projectId: editingProject.id,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          throw error;
        }
      } else {
        // 创建新项目
        try {
          await adminCreateProject(editingProject as Project);
          console.log('新项目创建成功');
        } catch (error: any) {
          console.error('创建项目失败:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
          });
          throw error;
        }
      }

      setOpenDialog(false);
      setEditingProject(null);
      fetchProjects();
    } catch (err: any) {
      console.error('操作失败:', err);
      setFormError(err.response?.data?.message || '操作失败，请重试');
    }
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个项目吗？')) {
      try {
        console.log('准备删除项目:', id);
        await adminDeleteProject(id.toString());
        console.log('项目删除成功:', id);
        fetchProjects();
      } catch (error: any) {
        console.error('删除项目失败:', {
          projectId: id,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
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
            color: 'text.primary',
          }}
        >
          项目管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingProject({});
            setOpenDialog(true);
          }}
          sx={{
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
              transform: 'translateY(-2px)',
            },
          }}
        >
          新建项目
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2}>
        {projects.map((project) => (
          <AdminCard key={project.id}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {project.title}
                </Typography>
                <Box>
                  {project.github && (
                    <IconButton
                      component={MuiLink}
                      href={project.github}
                      target="_blank"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'scale(1.1)' 
                        }
                      }}
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {project.demo && (
                    <IconButton
                      component={MuiLink}
                      href={project.demo}
                      target="_blank"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': { 
                          color: 'primary.main',
                          transform: 'scale(1.1)' 
                        }
                      }}
                    >
                      <LaunchIcon />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => {
                      setEditingProject(project);
                      setOpenDialog(true);
                    }}
                    sx={{ color: 'primary.main', '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(project.id)}
                    sx={{ color: 'error.main', '&:hover': { transform: 'scale(1.1)' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {project.description}
              </Typography>
              <Box sx={{ mb: 2 }}>
                {project.technologies.map((tech, index) => (
                  <Chip
                    key={`${project.id}-${tech}-${index}`}
                    label={tech}
                    size="small"
                    sx={{
                      mr: 1,
                      mb: 1,
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
                {project.outcome}
              </Typography>
            </CardContent>
          </AdminCard>
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingProject(null);
          setFormError('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingProject?.id ? '编辑项目' : '新建项目'}
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
              label="项目名称"
              value={editingProject?.title || ''}
              onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="项目描述"
              value={editingProject?.description || ''}
              onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
              required
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="技术栈"
              value={editingProject?.technologies?.join(', ') || ''}
              onChange={(e) => setEditingProject({
                ...editingProject,
                technologies: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
              })}
              required
              helperText="使用逗号分隔多个技术"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="项目成果"
              value={editingProject?.outcome || ''}
              onChange={(e) => setEditingProject({ ...editingProject, outcome: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Github 链接"
              value={editingProject?.github || ''}
              onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
              placeholder="https://github.com/username/project"
              helperText="可选，项目源码仓库地址"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="演示链接"
              value={editingProject?.demo || ''}
              onChange={(e) => setEditingProject({ ...editingProject, demo: e.target.value })}
              placeholder="https://demo.example.com"
              helperText="可选，项目在线演示地址"
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenDialog(false);
                setEditingProject(null);
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

export default AdminProjects; 