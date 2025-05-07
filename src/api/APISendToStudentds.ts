import axios from 'axios';
import { Student } from '../components/importStudents/ImportStudents';

export const sendStudentsToServer = async (
  classId: number,
  students: Student[]
) => {
  const payload = { classId, students };

  const response = await axios.post('http://localhost:3000/importStudents', payload);

  console.log("Dados que devem enviados ao backend:", JSON.stringify(payload, null, 2));

  return response.data; 
};
