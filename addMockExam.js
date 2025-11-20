const { db } = require('./admin-init');

const mockExamsData = [
  {
    title: 'Khmer Rouge Regime Final Mock Exam (1975–1979)',
    module: 'Modern Cambodian History',
    timeLimitMinutes: 45, 
    passMarkPercent: 70, 
    questions: [
      {
        questionText: "Which person was the leader of the Khmer Rouge and prime minister of Democratic Kampuchea?",
        options: [
          "Prince Norodom Sihanouk",
          "Lon Nol",
          "Pol Pot",
          "Heng Samrin"
        ],
        // Pol Pot
        correctAnswerIndex: 2
      },
      {
        questionText: "What was the official name of Cambodia under Khmer Rouge rule from 1975 to 1979?",
        options: [
          "The Kingdom of Cambodia",
          "The Khmer Republic",
          "Democratic Kampuchea",
          "The People's Republic of Kampuchea"
        ],
        // Democratic Kampuchea
        correctAnswerIndex: 2
      },
      {
        questionText: "Which segment of the population was forced to move from the cities to the countryside after the Khmer Rouge took power in 1975?",
        options: [
          "Only government officials",
          "The entire urban population",
          "Foreign diplomats",
          "Only military personnel"
        ],
        // The entire urban population
        correctAnswerIndex: 1
      },
      {
        questionText: "What was the Khmer Rouge's main ideological goal, which involved destroying urban life and professional classes?",
        options: [
          "Establishing a multi-party democracy",
          "Rapid industrialization",
          "Creating a purely agrarian communist society",
          "Restoring the monarchy"
        ],
        // Creating a purely agrarian communist society
        correctAnswerIndex: 2
      },
      {
        questionText: "Which country invaded Cambodia in late 1978 and overthrew the Khmer Rouge regime in early 1979?",
        options: [
          "China",
          "The United States",
          "Vietnam",
          "Thailand"
        ],
        // Vietnam
        correctAnswerIndex: 2
      }
    ]
  },
  {
    title: 'French Colonial Era Mock Exam (1863–1953)',
    module: 'Colonial Cambodian History',
    timeLimitMinutes: 30,
    passMarkPercent: 75,
    questions: [
      {
        questionText: "The French Protectorate was established after King Norodom signed a treaty in which year?",
        options: [
          "1853",
          "1863",
          "1873",
          "1883"
        ],
        // 1863
        correctAnswerIndex: 1
      },
      {
        questionText: "What administrative entity did Cambodia belong to, alongside Vietnam and Laos, during the French colonial period?",
        options: [
          "The French Commonwealth",
          "French West Africa",
          "French Indochina Union",
          "The Federation of Asian States"
        ],
        // French Indochina Union
        correctAnswerIndex: 2
      },
      {
        questionText: "What was the title of the highest-ranking French official in Cambodia, who controlled all key administrative functions?",
        options: [
          "Governor-General",
          "Viceroy",
          "Resident-Superior",
          "High Commissioner"
        ],
        // Resident-Superior
        correctAnswerIndex: 2
      },
      {
        questionText: "What key resource became a major commercial export for French colonial Cambodia?",
        options: [
          "Oil",
          "Rubber",
          "Silk",
          "Diamonds"
        ],
        // Rubber
        correctAnswerIndex: 1
      },
      {
        questionText: "The 'Royal Crusade for Independence' was successfully led by which monarch, culminating in independence in 1953?",
        options: [
          "King Sisowath Monivong",
          "King Norodom Sihanouk",
          "King Ang Duong",
          "Prince Sirik Matak"
        ],
        // King Norodom Sihanouk
        correctAnswerIndex: 1
      }
    ]
  }
];

async function addDummyMockExams() {
  console.log('Starting to add dummy mock exams...');

  const addPromises = mockExamsData.map(exam => {
    return db.collection('mockExams').add(exam);
  });

  try {
    const documentReferences = await Promise.all(addPromises);
    
    console.log(`Success! Added ${documentReferences.length} mock exams.`);
    documentReferences.forEach(docRef => {
      console.log(`  - Added mock exam with ID: ${docRef.id}`);
    });

  } catch (error)
 {
    console.error('Error adding dummy mock exams:', error.message);
  }
}

addDummyMockExams();