export interface Student {
  id: string;
  name: string;
  nim: string;
  email: string;
  class: string;
  year: number;
  gpa: number;
  status: 'active' | 'graduated' | 'dropout';
  createdAt: Date;
}

export interface StudentFormData {
  name: string;
  nim: string;
  email: string;
  class: string;
  year: number;
  gpa: number;
  status: 'active' | 'graduated' | 'dropout';
}
