import { mockExam1 } from './mockExam1'
import { mockExam2 } from './mockExam2'

export type MockExam = typeof mockExam1

export const mockExams: MockExam[] = [
  mockExam1,
  mockExam2,
]
