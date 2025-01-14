import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  useTheme,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { motion } from "framer-motion";
import { adminGetMessages } from "../../services/api";
import { Message } from "../../types";

const AdminMessages = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // 获取消息列表
  const fetchMessages = async () => {
    try {
      const response = await adminGetMessages();
      setMessages(response.data || []);
    } catch (err) {
      setError("获取消息列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(135deg, #6200EA 0%, #B388FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          消息管理
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={3}>
        {messages.map((message) => (
          <Card
            key={message._id}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <EmailIcon color="primary" />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {message.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {message.email}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setSelectedMessage(message);
                      setOpenDialog(true);
                    }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
              <Typography
                color="text.secondary"
                sx={{
                  mb: 2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {message.message}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {new Date(message.createdAt).toLocaleString("zh-CN")}
                </Typography>
                <Chip
                  label="未回复"
                  size="small"
                  color="warning"
                  sx={{ borderRadius: 1 }}
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedMessage(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>消息详情</DialogTitle>
        <DialogContent>
          {selectedMessage && (
            <Box sx={{ pt: 2 }}>
              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                发送者
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedMessage.name} ({selectedMessage.email})
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                发送时间
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {new Date(selectedMessage.createdAt).toLocaleString("zh-CN")}
              </Typography>

              <Typography
                variant="subtitle2"
                color="text.secondary"
                gutterBottom
              >
                消息内容
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
                {selectedMessage.message}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setSelectedMessage(null);
            }}
          >
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminMessages;
