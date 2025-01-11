import { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { adminLogin } from '../../services/api';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/projects');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Submitting credentials:', credentials);
      const response = await adminLogin(credentials);
      console.log('Login response:', response);

      if (response.success) {
        const token = localStorage.getItem('admin_token');
        if (!token) {
          throw new Error('No token saved after login');
        }
        navigate('/admin/projects', { replace: true });
      } else {
        setError(response.message || '登录失败');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Card
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            管理员登录
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="用户名"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              disabled={loading}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="密码"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  登录中...
                </Box>
              ) : (
                '登录'
              )}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Login; 