import { Code, ConnectError } from "@connectrpc/connect";

export const RPC_ERROR_MESSAGE_VI = {
  [Code.Canceled]: "Yêu cầu đã bị hủy!",
  [Code.Unknown]: "Đã xảy ra lỗi không xác định!",
  [Code.InvalidArgument]: "Dữ liệu gửi lên không hợp lệ!",
  [Code.DeadlineExceeded]: "Hết thời gian xử lý yêu cầu!",
  [Code.NotFound]: "Không tìm thấy dữ liệu!",
  [Code.AlreadyExists]: "Dữ liệu đã tồn tại!",
  [Code.PermissionDenied]: "Bạn không có quyền thực hiện hành động này!",
  [Code.ResourceExhausted]: "Hệ thống đang quá tải, vui lòng thử lại sau!",
  [Code.FailedPrecondition]:
    "Trạng thái hiện tại không cho phép thực hiện hành động này!",
  [Code.Aborted]: "Yêu cầu đã bị hủy do xung đột!",
  [Code.OutOfRange]: "Giá trị vượt quá phạm vi cho phép!",
  [Code.Unimplemented]: "Chức năng chưa được hỗ trợ!",
  [Code.Internal]: "Lỗi hệ thống!",
  [Code.Unavailable]: "Dịch vụ hiện không khả dụng!",
  [Code.DataLoss]: "Dữ liệu bị lỗi hoặc mất mát!",
  [Code.Unauthenticated]: "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!",
};

export function mapRpcErrorMessage(error: unknown): string {
  const fallback = RPC_ERROR_MESSAGE_VI[Code.Unknown];

  if (error instanceof ConnectError) {
    if (error.rawMessage && error.rawMessage.trim().length > 0) {
      return error.rawMessage;
    }

    return RPC_ERROR_MESSAGE_VI[error.code] ?? fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}
