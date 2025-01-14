export const handleApiError = (error: any) => {
  if (error.response) {
    // 服务器响应错误
    const { status, data } = error.response;
    switch (status) {
      case 401:
        // 处理未授权
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
        break;
      case 403:
        // 处理禁止访问
        break;
      case 404:
        // 处理未找到
        break;
      default:
      // 处理其他错误
    }
    return data.message || "请求失败";
  }
  return error.message || "网络错误";
};
