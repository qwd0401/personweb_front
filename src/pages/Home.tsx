// Home.tsx - 网站首页组件
import { Box, Typography, Container, Button, Grid } from '@mui/material';
import { motion } from 'framer-motion'; // 引入动画库
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 国际化支持
import DynamicCard from '../components/DynamicCard';

const Home = () => {
  // 获取翻译函数
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg">
      {/* 主要内容网格布局 */}
      <Grid 
        container 
        spacing={{ xs: 4, md: 8 }} 
        alignItems="center"
        // 响应式最小高度设置
        sx={{ minHeight: { xs: 'auto', md: 'calc(100vh - 200px)' } }}
      >
        {/* 左侧文本内容区域 */}
        <Grid item xs={12} md={6}>
          <Box
            // 使用 framer-motion 添加入场动画
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* 主标题 */}
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                fontWeight: 800,
                mb: 2,
                // 设置渐变文字效果
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              {t('home.title')}
            </Typography>
            
            {/* 描述文本 */}
            <Typography
              variant="body1"
              sx={{
                fontSize: { xs: '1rem', sm: '1.125rem' },
                color: 'text.secondary',
                mb: 4,
                maxWidth: 480,
                lineHeight: 1.8,
              }}
            >
              {t('home.description')}
            </Typography>

            {/* 按钮区域 - 带动画效果 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                component={Link}
                to="/projects"
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  py: 1.5,
                  px: 4,
                  fontSize: '1rem',
                }}
              >
                {t('home.viewProjects')}
              </Button>
            </motion.div>
          </Box>
        </Grid>

        {/* 右侧动态卡片区域 */}
        <Grid item xs={12} md={6}>
          <DynamicCard />
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home; 