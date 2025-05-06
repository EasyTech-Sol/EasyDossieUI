import axios from 'axios';
import { Student } from '../components/importStudents/ImportStudents';

export const sendStudentsToServer = async (
  classId: number,
  students: Student[]
) => {
  const payload = { classId, students };

  const response = await axios.post('http://localhost:3000/importStudents', payload);


  return response.data; 
};
