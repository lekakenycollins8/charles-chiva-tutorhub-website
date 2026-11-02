export interface ResourceCategory {
  name: string;
  description: string;
  gradient: string;
}

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    name: "CPA Notes",
    description: "Professional accounting study materials for CPA exams",
    gradient: "from-blue-500 to-blue-700"
  },
  {
    name: "KCSE Revision Notes",
    description: "Kenya Certificate of Secondary Education revision materials",
    gradient: "from-green-500 to-green-700"
  },
  {
    name: "IGCSE NOTES",
    description: "International General Certificate of Secondary Education study materials",
    gradient: "from-purple-500 to-purple-700"
  },
  {
    name: "CBE/CBC Notes",
    description: "Competency-Based Education and Curriculum notes",
    gradient: "from-orange-500 to-orange-700"
  },
  {
    name: "IELTS Study Materials",
    description: "IELTS exam preparation resources and practice materials",
    gradient: "from-red-500 to-red-700"
  },
  {
    name: "Mathematics",
    description: "Comprehensive math notes and problem-solving guides",
    gradient: "from-indigo-500 to-indigo-700"
  },
  {
    name: "Chemistry",
    description: "Chemistry notes, formulas, and practical guides",
    gradient: "from-teal-500 to-teal-700"
  },
  {
    name: "Physics",
    description: "Physics concepts, formulas, and problem-solving materials",
    gradient: "from-cyan-500 to-cyan-700"
  },
  {
    name: "Biology",
    description: "Biology notes covering all major topics and concepts",
    gradient: "from-emerald-500 to-emerald-700"
  },
  {
    name: "Questions & Answers Booklets",
    description: "Compiled Q&A booklets for exam preparation",
    gradient: "from-amber-500 to-amber-700"
  },
  {
    name: "Accounting",
    description: "Accounting principles, financial statements, and tutorials",
    gradient: "from-rose-500 to-rose-700"
  },
  {
    name: "Other",
    description: "Miscellaneous educational resources and study materials",
    gradient: "from-gray-500 to-gray-700"
  }
];

// Helper function to get category by name
export function getCategoryByName(name: string): ResourceCategory | undefined {
  return RESOURCE_CATEGORIES.find(cat => cat.name === name);
}

// Helper function to get category names array
export function getCategoryNames(): string[] {
  return RESOURCE_CATEGORIES.map(cat => cat.name);
}

// Helper function to get category description
export function getCategoryDescription(name: string): string {
  const category = getCategoryByName(name);
  return category?.description || "";
}

// Helper function to get category gradient
export function getCategoryGradient(name: string): string {
  const category = getCategoryByName(name);
  return category?.gradient || "from-gray-500 to-gray-700";
}
