import { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, Chip, Box, Skeleton } from '@mui/material';
import { motion } from 'framer-motion';
import { getBlogs } from '../services/api';
import { Blog as BlogType } from '../types';

const BlogSkeleton = () => (
  <Grid item xs={12}>
    <Card 
      elevation={0}
      sx={{ 
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Skeleton 
          variant="text" 
          width="70%" 
          height={40} 
          sx={{ 
            mb: 2,
          }}
        />
        <Skeleton 
          variant="text" 
          width="20%" 
          height={24} 
          sx={{ 
            mb: 3,
          }}
        />
        <Box sx={{ mb: 3 }}>
          {[1, 2, 3].map((index) => (
            <Skeleton
              key={index}
              variant="text"
              width={`${90 - index * 10}%`}
              height={24}
              sx={{ 
                mb: 1,
              }}
            />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {[1, 2].map((index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={60}
              height={24}
              sx={{
                borderRadius: 1,
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

const Blog = () => {
  const [blogs, setBlogs] = useState<BlogType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await getBlogs();
        setBlogs(data);
      } catch (err) {
        setError('获取博客数据失败');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
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
            fontSize: { xs: '2.5rem', md: '3rem' },
            fontWeight: 800,
            mb: 2,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          技术博客
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
          分享技术见解和开发经验，记录学习成长的点滴
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          Array.from(new Array(3)).map((_, index) => (
            <BlogSkeleton key={index} />
          ))
        ) : error ? (
          <Grid item xs={12}>
            <Typography color="error" align="center">
              {error}
            </Typography>
          </Grid>
        ) : (
          blogs.map((blog, index) => (
            <Grid item xs={12} key={blog.id}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 12px 40px rgba(98, 0, 234, 0.3)'
                        : '0 12px 40px rgba(98, 0, 234, 0.2)',
                    borderColor: 'primary.main',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: '1.5rem', md: '1.75rem' },
                      mb: 1,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {blog.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      mb: 2,
                      fontWeight: 600,
                    }}
                  >
                    {new Date(blog.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.8,
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
                        sx={{
                          mr: 1,
                          mb: 1,
                          color: 'primary.main',
                          border: '1px solid',
                          borderColor: 'primary.main',
                          fontWeight: 600,
                          '&:hover': {
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Blog; 