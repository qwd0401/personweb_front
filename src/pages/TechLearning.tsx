import { useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Skeleton,
  Alert,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { TechArticle } from "../types/api";
import { useQuery } from "@tanstack/react-query";
import { blogApi } from "../api";

const BlogSkeleton = () => (
  <Grid item xs={12}>
    <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Skeleton variant="text" width={200} height={32} sx={{ mb: 1 }} />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Skeleton variant="rounded" width={80} height={24} />
              <Skeleton variant="rounded" width={60} height={24} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ mb: 3 }}>
          {[1, 2].map((index) => (
            <Skeleton
              key={index}
              variant="text"
              width={`${90 - index * 10}%`}
              height={24}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {[1, 2, 3].map((index) => (
            <Skeleton
              key={index}
              variant="rounded"
              width={60}
              height={24}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  </Grid>
);

const TechLearning = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );

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

  // 获取所有唯一的分类
  const categories = Array.from(
    new Set(articles?.map((article) => article.category) || [])
  );

  // 过滤文章
  const filteredArticles =
    articles?.filter((article) => {
      if (selectedCategory && article.category !== selectedCategory)
        return false;
      if (selectedDifficulty && article.difficulty !== selectedDifficulty)
        return false;
      return true;
    }) || [];

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
            fontSize: { xs: "2.5rem", md: "3rem" },
            fontWeight: 800,
            mb: 2,
            background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          技术学习
        </Typography>
        <Typography
          variant="body1"
          align="center"
          sx={{
            color: "text.secondary",
            maxWidth: 600,
            mx: "auto",
            fontSize: { xs: "1rem", sm: "1.125rem" },
            lineHeight: 1.8,
          }}
        >
          系统化的技术学习路径，从入门到精通的完整指南
        </Typography>
      </Box>

      {/* 过滤器 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            技术分类
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {categories.map((category) => (
              <Chip
                key={category}
                label={category}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category ? null : category
                  )
                }
                color={selectedCategory === category ? "primary" : "default"}
                variant={selectedCategory === category ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
            难度级别
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {["入门", "进阶", "高级"].map((level) => (
              <Chip
                key={level}
                label={level}
                onClick={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === level ? null : level
                  )
                }
                color={
                  level === "入门"
                    ? "success"
                    : level === "进阶"
                    ? "warning"
                    : "error"
                }
                variant={selectedDifficulty === level ? "filled" : "outlined"}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          加载失败，请稍后重试
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {isLoading ? (
            Array.from(new Array(3)).map((_, index) => (
              <BlogSkeleton key={index} />
            ))
          ) : filteredArticles?.length === 0 ? (
            <Grid item xs={12}>
              <Typography align="center" color="text.secondary" sx={{ py: 8 }}>
                没有找到相关文章
              </Typography>
            </Grid>
          ) : (
            filteredArticles?.map((article, index) => (
              <Grid item xs={12} key={article.id}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow:
                        theme.palette.mode === "dark"
                          ? "0 12px 40px rgba(33, 150, 243, 0.3)"
                          : "0 12px 40px rgba(33, 150, 243, 0.2)",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 700,
                            mb: 1,
                          }}
                        >
                          {article.title}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
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
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.secondary",
                        mb: 3,
                        lineHeight: 1.8,
                      }}
                    >
                      {article.description}
                    </Typography>
                    <Box>
                      {article.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{
                            mr: 1,
                            mb: 1,
                            color: "primary.main",
                            border: "1px solid",
                            borderColor: "primary.main",
                            "&:hover": {
                              transform: "translateY(-2px)",
                            },
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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
      )}
    </Container>
  );
};

export default TechLearning;
