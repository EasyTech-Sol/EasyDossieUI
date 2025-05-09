type Student = {
    name: string;
    registration: string | number;
};

  
type RawStudent = {
    [key: string]: string | number;
};