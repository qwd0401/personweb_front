// Contact.tsx - 联系页面组件
import { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Paper,
  CircularProgress,
  Grid,
} from '@mui/material';
import { motion } from 'framer-motion'; // 动画库
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import { sendContactMessage } from '../services/api';
import { ContactForm } from '../types';

// 联系信息卡片组件
const ContactInfo = ({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      mb: 3,
    }}
  >
    {/* 图标容器 */}
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // 渐变背景
        background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.08) 0%, rgba(179, 136, 255, 0.08) 100%)',
        color: 'primary.main',
        mr: 2,
        // 悬停动画效果
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'scale(1.1)',
          background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.12) 0%, rgba(179, 136, 255, 0.12) 100%)',
        },
      }}
    >
      {icon}
    </Box>
    {/* 文本内容 */}
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 0.5, color: 'text.secondary' }}>
        {title}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {content}
      </Typography>
    </Box>
  </Box>
);

const Contact = () => {
  // 表单状态管理
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  // 提示消息状态
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await sendContactMessage(formData);
      // 成功提示
      setSnackbar({
        open: true,
        message: response.message,
        severity: 'success',
      });
      // 重置表单
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      // 错误提示
      setSnackbar({
        open: true,
        message: '发送失败，请稍后重试',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      {/* 页面标题区域 */}
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
            background: 'linear-gradient(135deg, #6200EA 0%, #B388FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          联系我吧
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
          如果您有任何问题或合作意向，欢迎随时与我联系
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 左侧联系信息 */}
        <Grid item xs={12} md={5}>
          <Box
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            sx={{
              p: { xs: 3, md: 4 },
              height: '100%',
              background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.03) 0%, rgba(179, 136, 255, 0.03) 100%)',
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {/* 联系方式列表 */}
            <ContactInfo
              icon={<EmailIcon />}
              title="邮箱"
              content="contact@example.com"
            />
            <ContactInfo
              icon={<PhoneIcon />}
              title="电话"
              content="+86 123 4567 8901"
            />
            <ContactInfo
              icon={<LocationOnIcon />}
              title="地址"
              content="中国上海市浦东新区xxx路xxx号"
            />
          </Box>
        </Grid>

        {/* 右侧联系表单 */}
        <Grid item xs={12} md={7}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              background: 'linear-gradient(135deg, rgba(98, 0, 234, 0.03) 0%, rgba(179, 136, 255, 0.03) 100%)',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3,
            }}
          >
            {/* 表单区域 */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            >
              {/* 表单输入字段 */}
              <TextField
                required
                label="姓名"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& > fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  },
                }}
              />
              <TextField
                required
                type="email"
                label="邮箱地址"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& > fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  },
                }}
              />
              <TextField
                required
                label="留言内容"
                multiline
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                variant="outlined"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      '& > fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  alignSelf: 'flex-start',
                  fontSize: '1rem',
                }}
              >
                {loading ? '发送中...' : '发送留言'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 提示消息 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 