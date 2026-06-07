import axios from 'axios';

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const ERROR_TRANSLATIONS: Record<string, string> = {
  'observer cannot be the task performer': 'Наблюдатель не может быть исполнителем задачи',
  'duplicate observer id': 'Наблюдатель уже добавлен',
  'task title must not be empty': 'Название задачи не может быть пустым',
  'task title must not exceed 255 characters': 'Название не должно превышать 255 символов',
  'task description must not exceed 10000 characters': 'Описание не должно превышать 10000 символов',
  'invalid task status': 'Некорректный статус задачи',
  'invalid task status transition': 'Недопустимый переход статуса',
  'performer id must be greater than zero': 'Укажите исполнителя',
  'creator id must be greater than zero': 'Укажите создателя',
  'task is deleted': 'Задача удалена',
};

function extractDescription(message: string): string {
  const match = message.match(/desc = (.+)$/);
  return match ? match[1] : message;
}

function translateError(message: string): string {
  const normalized = message.trim().toLowerCase();
  return ERROR_TRANSLATIONS[normalized] ?? message;
}

function normalizeApiMessage(message: string): string {
  return translateError(extractDescription(message));
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.error) return normalizeApiMessage(data.error);
    if (data?.message) return normalizeApiMessage(data.message);
  }

  if (error instanceof Error && error.message) {
    return normalizeApiMessage(error.message);
  }

  return fallback;
}
