// Projects.tsx - 项目展示页面组件
import { useState, useEffect } from 'react';
import { 
  Container, 
  Grid, 
  Typography, 
  Box, 
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  useTheme,
  Link as MuiLink
} from '@mui/material';
import { motion } from 'framer-motion';
import { getProjects } from '../services/api';
import { Project } from '../types';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchIcon from '@mui/icons-material/Launch';
import { useTranslation } from 'react-i18next';

const ProjectCard = ({ project }: { project: Project }) => {
  const theme = useTheme();
  
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      sx={{
        p: 4,
        height: '100%',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(98, 0, 234, 0.3)'
            : '0 8px 32px rgba(98, 0, 234, 0.2)',
          '& .project-outcome': {
            color: 'primary.main',
            transform: 'translateY(-2px)',
          }
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 2,
        }}
      >
        {project.title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: 'text.secondary',
          mb: 3,
          lineHeight: 1.8,
        }}
      >
        {project.description}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
        {project.technologies.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            size="small"
            sx={{
              borderRadius: 1,
              bgcolor: theme.palette.mode === 'dark' 
                ? 'rgba(98, 0, 234, 0.1)'
                : 'rgba(98, 0, 234, 0.05)',
              border: '1px solid',
              borderColor: 'primary.main',
              color: 'primary.main',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: theme.palette.mode === 'dark'
                  ? 'rgba(98, 0, 234, 0.2)'
                  : 'rgba(98, 0, 234, 0.1)',
                transform: 'translateY(-2px)',
              }
            }}
          />
        ))}
      </Box>

      <Typography
        className="project-outcome"
        variant="body2"
        sx={{
          color: 'success.main',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          display: 'inline-block',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          bgcolor: theme.palette.mode === 'dark'
            ? 'rgba(76, 175, 80, 0.1)'
            : 'rgba(76, 175, 80, 0.05)',
        }}
      >
        {project.outcome}
      </Typography>

      {(project.github || project.demo) && (
        <Box 
          sx={{ 
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 1,
          }}
        >
          {project.github && (
            <Tooltip title="查看源码" arrow>
              <IconButton
                component={MuiLink}
                href={project.github}
                target="_blank"
                size="small"
                sx={{
                  color: 'text.secondary',
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'scale(1.1)',
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {project.demo && (
            <Tooltip title="在线预览" arrow>
              <IconButton
                component={MuiLink}
                href={project.demo}
                target="_blank"
                size="small"
                sx={{
                  color: 'text.secondary',
                  bgcolor: theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(0, 0, 0, 0.03)',
                  '&:hover': {
                    color: 'primary.main',
                    transform: 'scale(1.1)',
                    bgcolor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.05)',
                  },
                }}
              >
                <LaunchIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};

const Projects = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err) {
        setError('获取项目数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{ mb: { xs: 4, md: 6 } }}
      >
        <Typography
          variant="h1"
          align="center"
          sx={{
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            fontWeight: 800,
            mb: 2,
            color: 'text.primary',
          }}
        >
          {t('projects.title')}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            fontSize: { xs: '1rem', sm: '1.125rem' },
            lineHeight: 1.8,
          }}
        >
          {t('projects.description')}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {loading ? (
          Array.from(new Array(4)).map((_, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Box sx={{ p: 3, height: '100%', borderRadius: 4, bgcolor: 'background.paper' }}>
                <Skeleton variant="text" width="60%" height={40} sx={{ mb: 2 }} />
                <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />
                <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
                  {[1, 2, 3].map((index) => (
                    <Skeleton
                      key={index}
                      variant="rounded"
                      width={80}
                      height={32}
                      sx={{ borderRadius: 1 }}
                    />
                  ))}
                </Box>
                <Skeleton variant="text" width="40%" height={24} />
              </Box>
            </Grid>
          ))
        ) : error ? (
          <Grid item xs={12}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Grid>
        ) : (
          projects.map((project) => (
            <Grid item xs={12} md={6} key={project.id}>
              <ProjectCard project={project} />
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Projects; 