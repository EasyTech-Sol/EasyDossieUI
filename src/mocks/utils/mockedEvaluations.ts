export const mocked_evaluations = {
  message: "Avaliaçoes retornadas com sucesso",
  dossierTemplate: {
    id: 1,
    title: "Introdução à Programação",
    description: "Conceitos básicos de lógica e algoritmos.",
    evaluation_area: "Computação",
    concepts: "A, B, C",
    categories: [
      {
        id: 101,
        title: "Lógica de Programação",
        weight: 0.5,
        dossierTemplateId: "template_1",
        descriptions: [
          {
            id: 1001,
            title: "Estruturas Condicionais",
            categoryId: "101",
            criteria: [
              {
                id: 10001,
                title: "Utiliza corretamente if/else",
                descriptionId: "1001",
              },
              {
                id: 10002,
                title: "Implementa lógica com operadores relacionais",
                descriptionId: "1001",
              },
            ],
          },
          {
            id: 1002,
            title: "Laços de Repetição",
            categoryId: "101",
            criteria: [
              {
                id: 10003,
                title: "Utiliza corretamente while e for",
                descriptionId: "1002",
              },
            ],
          },
        ],
      },
      {
        id: 102,
        title: "Algoritmos",
        weight: 0.5,
        dossierTemplateId: "template_1",
        descriptions: [
          {
            id: 1003,
            title: "Resolução de Problemas",
            categoryId: "102",
            criteria: [
              {
                id: 10004,
                title: "Resolve problemas simples com algoritmos",
                descriptionId: "1003",
              },
            ],
          },
        ],
      },
    ],
  },
  evaluations: [
    {
      studentId: 1,
      studentName: "João da Silva",
      evaluation: [
        { criterionId: 10001, concept: "A" },
        { criterionId: 10002, concept: "B" },
        { criterionId: 10003, concept: "A" },
      ],
    },
    {
      studentId: 2,
      studentName: "Maria Oliveira",
      evaluation: [
        { criterionId: 10001, concept: "B" },
        { criterionId: 10003, concept: "C" },
        { criterionId: 10004, concept: "A" },
      ],
    },
    {
      studentId: 3,
      studentName: "Carlos Souza",
      evaluation: [
        { criterionId: 10002, concept: "C" },
        { criterionId: 10004, concept: "B" },
      ],
    },
  ],
};
