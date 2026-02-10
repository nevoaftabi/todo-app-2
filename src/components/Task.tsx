export type Task = {
  id: string;
  title: string;
  subject: string;
  isCompleted: boolean;
  isEditMode: boolean;
  tempTitle: string;
  createdAt: number;
};