export const mocked_dossiers = [
  {
    id: 1,
    title: "Introdução à Programação",
    description: "Conceitos básicos de lógica e algoritmos.",
    evaluation_area: "Computação",
    concept: "A, B, C",
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
              { id: 10001, titulo: "Utiliza corretamente if/else", descriptionId: "1001" },
              { id: 10002, titulo: "Implementa lógica com operadores relacionais", descriptionId: "1001" }
            ]
          },
          {
            id: 1002,
            title: "Laços de Repetição",
            categoryId: "101",
            criteria: [
              { id: 10003, titulo: "Utiliza corretamente while e for", descriptionId: "1002" }
            ]
          }
        ]
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
              { id: 10004, titulo: "Resolve problemas simples com algoritmos", descriptionId: "1003" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Cálculo I",
    description: "Estudo de limites, derivadas e aplicações.",
    evaluation_area: "Matemática",
    concept: "A, B, C, D",
    categories: [
      {
        id: 201,
        title: "Limites",
        weight: 0.25,
        dossierTemplateId: "template_2",
        descriptions: [
          {
            id: 2001,
            title: "Cálculo de Limites",
            categoryId: "201",
            criteria: [
              { id: 20001, titulo: "Calcula limites com precisão", descriptionId: "2001" }
            ]
          }
        ]
      },
      {
        id: 202,
        title: "Derivadas",
        weight: 0.5,
        dossierTemplateId: "template_2",
        descriptions: [
          {
            id: 2002,
            title: "Regras de Derivação",
            categoryId: "202",
            criteria: [
              { id: 20002, titulo: "Aplica regras de derivação", descriptionId: "2002" }
            ]
          }
        ]
      },
      {
        id: 203,
        title: "Aplicações de Derivadas",
        weight: 0.25,
        dossierTemplateId: "template_2",
        descriptions: [
          {
            id: 2003,
            title: "Estudo de máximos e mínimos",
            categoryId: "203",
            criteria: [
              { id: 20003, titulo: "Identifica pontos críticos corretamente", descriptionId: "2003" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Física Mecânica",
    description: "Leis do movimento e energia.",
    evaluation_area: "Física",
    concept: "A, B",
    categories: [
      {
        id: 301,
        title: "Cinemática",
        weight: 0.5,
        dossierTemplateId: "template_3",
        descriptions: [
          {
            id: 3001,
            title: "Movimento Retilíneo",
            categoryId: "301",
            criteria: [
              { id: 30001, titulo: "Calcula velocidade e aceleração", descriptionId: "3001" }
            ]
          }
        ]
      },
      {
        id: 302,
        title: "Dinâmica",
        weight: 0.5,
        dossierTemplateId: "template_3",
        descriptions: [
          {
            id: 3002,
            title: "Leis de Newton",
            categoryId: "302",
            criteria: [
              { id: 30002, titulo: "Aplica corretamente as leis de Newton", descriptionId: "3002" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Química Inorgânica",
    description: "Estrutura atômica, tabela periódica e ligações.",
    evaluation_area: "Química",
    concept: "A, C, D",
    categories: [
      {
        id: 401,
        title: "Estrutura Atômica",
        weight: 0.4,
        dossierTemplateId: "template_4",
        descriptions: [
          {
            id: 4001,
            title: "Modelos Atômicos",
            categoryId: "401",
            criteria: [
              { id: 40001, titulo: "Compreende os modelos atômicos", descriptionId: "4001" }
            ]
          }
        ]
      },
      {
        id: 402,
        title: "Tabela Periódica",
        weight: 0.3,
        dossierTemplateId: "template_4",
        descriptions: [
          {
            id: 4002,
            title: "Classificação dos Elementos",
            categoryId: "402",
            criteria: [
              { id: 40002, titulo: "Identifica grupos e períodos", descriptionId: "4002" }
            ]
          }
        ]
      },
      {
        id: 403,
        title: "Ligações Químicas",
        weight: 0.3,
        dossierTemplateId: "template_4",
        descriptions: [
          {
            id: 4003,
            title: "Ligações Iônicas e Covalentes",
            categoryId: "403",
            criteria: [
              { id: 40003, titulo: "Distingue tipos de ligação", descriptionId: "4003" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    title: "História Moderna",
    description: "Análise dos eventos do século XIX em diante.",
    evaluation_area: "História",
    concept: "B, C, D",
    categories: [
      {
        id: 501,
        title: "Revoluções",
        weight: 0.4,
        dossierTemplateId: "template_5",
        descriptions: [
          {
            id: 5001,
            title: "Revolução Francesa",
            categoryId: "501",
            criteria: [
              { id: 50001, titulo: "Analisa causas e consequências", descriptionId: "5001" }
            ]
          }
        ]
      },
      {
        id: 502,
        title: "Industrialização",
        weight: 0.3,
        dossierTemplateId: "template_5",
        descriptions: [
          {
            id: 5002,
            title: "Primeira Revolução Industrial",
            categoryId: "502",
            criteria: [
              { id: 50002, titulo: "Compreende o impacto da industrialização", descriptionId: "5002" }
            ]
          }
        ]
      },
      {
        id: 503,
        title: "Guerras Mundiais",
        weight: 0.3,
        dossierTemplateId: "template_5",
        descriptions: [
          {
            id: 5003,
            title: "Primeira Guerra Mundial",
            categoryId: "503",
            criteria: [
              { id: 50003, titulo: "Identifica causas e efeitos do conflito", descriptionId: "5003" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Geometria Analítica",
    description: "Estudo de retas, planos e curvas no espaço.",
    evaluation_area: "Matemática",
    concept: "A, B, C",
    categories: [
      {
        id: 601,
        title: "Retas e Planos",
        weight: 0.6,
        dossierTemplateId: "template_6",
        descriptions: [
          {
            id: 6001,
            title: "Equações de Retas",
            categoryId: "601",
            criteria: [
              { id: 60001, titulo: "Determina a equação de uma reta", descriptionId: "6001" }
            ]
          }
        ]
      },
      {
        id: 602,
        title: "Curvas",
        weight: 0.4,
        dossierTemplateId: "template_6",
        descriptions: [
          {
            id: 6002,
            title: "Cônicas",
            categoryId: "602",
            criteria: [
              { id: 60002, titulo: "Classifica e interpreta cônicas", descriptionId: "6002" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Redação Técnica",
    description: "Desenvolvimento de textos objetivos e claros.",
    evaluation_area: "Linguagens",
    concept: "B, C, D, E",
    categories: [
      {
        id: 701,
        title: "Clareza e Coerência",
        weight: 0.5,
        dossierTemplateId: "template_7",
        descriptions: [
          {
            id: 7001,
            title: "Organização Textual",
            categoryId: "701",
            criteria: [
              { id: 70001, titulo: "Constrói textos coerentes e coesos", descriptionId: "7001" }
            ]
          }
        ]
      },
      {
        id: 702,
        title: "Norma Culta",
        weight: 0.5,
        dossierTemplateId: "template_7",
        descriptions: [
          {
            id: 7002,
            title: "Correção Gramatical",
            categoryId: "702",
            criteria: [
              { id: 70002, titulo: "Utiliza regras gramaticais corretamente", descriptionId: "7002" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Banco de Dados Relacional",
    description: "Modelagem de dados e consultas em SQL.",
    evaluation_area: "Computação",
    concept: "A, B",
    categories: [
      {
        id: 801,
        title: "Modelagem de Dados",
        weight: 0.5,
        dossierTemplateId: "template_8",
        descriptions: [
          {
            id: 8001,
            title: "Modelo Entidade-Relacionamento",
            categoryId: "801",
            criteria: [
              { id: 80001, titulo: "Cria diagramas corretos", descriptionId: "8001" }
            ]
          }
        ]
      },
      {
        id: 802,
        title: "SQL",
        weight: 0.5,
        dossierTemplateId: "template_8",
        descriptions: [
          {
            id: 8002,
            title: "Consultas",
            categoryId: "802",
            criteria: [
              { id: 80002, titulo: "Escreve consultas SQL básicas", descriptionId: "8002" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Eletricidade e Magnetismo",
    description: "Campos elétricos e magnéticos em circuitos.",
    evaluation_area: "Física",
    concept: "C, D, E",
    categories: [
      {
        id: 901,
        title: "Eletrostática",
        weight: 0.3,
        dossierTemplateId: "template_9",
        descriptions: [
          {
            id: 9001,
            title: "Força Elétrica",
            categoryId: "901",
            criteria: [
              { id: 90001, titulo: "Aplica corretamente a Lei de Coulomb", descriptionId: "9001" }
            ]
          }
        ]
      },
      {
        id: 902,
        title: "Magnetismo",
        weight: 0.3,
        dossierTemplateId: "template_9",
        descriptions: [
          {
            id: 9002,
            title: "Campo Magnético",
            categoryId: "902",
            criteria: [
              { id: 90002, titulo: "Analisa interações magnéticas", descriptionId: "9002" }
            ]
          }
        ]
      },
      {
        id: 903,
        title: "Circuitos Elétricos",
        weight: 0.4,
        dossierTemplateId: "template_9",
        descriptions: [
          {
            id: 9003,
            title: "Leis de Kirchhoff",
            categoryId: "903",
            criteria: [
              { id: 90003, titulo: "Resolve circuitos aplicando as leis de Kirchhoff", descriptionId: "9003" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Ética Profissional",
    description: "Reflexões sobre práticas profissionais e responsabilidade.",
    evaluation_area: "Filosofia",
    concept: "A, D",
    categories: [
      {
        id: 1001,
        title: "Responsabilidade Profissional",
        weight: 0.6,
        dossierTemplateId: "template_10",
        descriptions: [
          {
            id: 10001,
            title: "Código de Ética",
            categoryId: "1001",
            criteria: [
              { id: 100001, titulo: "Conhece os princípios do código de ética", descriptionId: "10001" }
            ]
          }
        ]
      },
      {
        id: 1002,
        title: "Dilemas Éticos",
        weight: 0.4,
        dossierTemplateId: "template_10",
        descriptions: [
          {
            id: 10002,
            title: "Resolução de Conflitos",
            categoryId: "1002",
            criteria: [
              { id: 100002, titulo: "Propõe soluções éticas para dilemas", descriptionId: "10002" }
            ]
          }
        ]
      }
    ]
  }
];
