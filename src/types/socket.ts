export interface SocketMessage {
  type: string
  message: string
  [key: string]: unknown
}

export interface TaskNotifyMessage {
  event: string;
  title?: string;
  description?: string;
  user_id?: number;
  [key: string]: unknown;
}
