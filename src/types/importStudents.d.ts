type Student = {
  id: number;
  name: string;
  registration: string | number;
};

type RawStudent = {
  [key: string]: string | number;
};
