import { ReactNode } from 'react';

export interface Topic {
  title: string;
  details: string[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string; // Icon identifier to be rendered in component
  topics: Topic[];
  levels: string[];
  img: string;
}

// Detailed services data with topics, details, and levels
export const services: Service[] = [
  {
    id: 'chemistry',
    title: 'Chemistry',
    description: 'I provide tutoring in both basic and advanced chemistry topics, covering fundamental principles as well as specialized areas. Some of the topics I teach include:',
    icon: 'chemistry',
    topics: [
      { 
        title: "General Chemistry", 
        details: [
          "Atomic Structure and the Periodic Table",
          "Chemical Bonding (Ionic, Covalent, Metallic)",
          "Stoichiometry and Mole Concept",
          "Balancing Chemical Equations",
          "States of Matter: Solids, Liquids, Gases",
          "Acids and Bases: Properties, pH, Titration",
          "Thermochemistry: Heat and Enthalpy",
          "Chemical Kinetics and Reaction Rates",
          "Chemical Equilibrium",
          "Redox Reactions and Electrochemistry",
        ]
      },
      { 
        title: "Organic Chemistry", 
        details: [
          "Structure and Bonding in Organic Molecules",
          "Functional Groups (Alkanes, Alkenes, Alkynes, Alcohols, etc.)",
          "Isomerism (Structural, Geometrical, Optical)",
          "Nucleophilic Substitution and Elimination Reactions",
          "Hydrocarbons and Their Derivatives",
          "Aromatic Compounds and Benzene Reactions",
          "Organic Reactions and Mechanisms",
          "Synthesis and Analysis of Organic Compounds",
        ]
      },
      { 
        title: "Inorganic Chemistry", 
        details: [
          "Transition Metals and Coordination Chemistry",
          "Properties of Metals and Nonmetals",
          "Oxidation States and Complexes",
          "Periodicity and the Periodic Trends",
          "Crystal Field Theory",
        ]
      },
      { 
        title: "Biochemistry", 
        details: [
          "Structure and Function of Biomolecules (Proteins, Carbohydrates, Lipids, Nucleic Acids)",
          "Enzyme Kinetics",
          "Metabolic Pathways (Glycolysis, Krebs Cycle, etc.)",
          "Protein Synthesis and Genetic Code",
        ]
      },
    ],
    levels: ["High School", "College"],
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  },
  {
    id: 'mathematics',
    title: 'Mathematics',
    description: 'Mathematics is essential for solving real-world problems. I cover a wide range of topics, from basic algebra to advanced calculus and statistics, including:',
    icon: 'mathematics',
    topics: [
      { 
        title: "Algebra", 
        details: [
          "Simplifying Expressions and Polynomials",
          "Solving Linear and Quadratic Equations",
          "Exponents and Radicals",
          "Factorization and Fractions",
          "Systems of Equations (Linear, Non-Linear)",
          "Inequalities and Absolute Value",
        ]
      },
      { 
        title: "Geometry", 
        details: [
          "Basic Geometric Shapes and Properties",
          "Perimeter, Area, and Volume of 2D and 3D Shapes",
          "Congruence and Similarity",
          "Theorems on Triangles, Circles, and Angles",
          "Coordinate Geometry and the Distance Formula",
          "Trigonometry: Sine, Cosine, Tangent, and their Applications",
        ]
      },
      { 
        title: "Trigonometry", 
        details: [
          "Trigonometric Ratios and Functions",
          "Unit Circle and Angle Measurement",
          "Solving Trigonometric Equations",
          "Graphing Trigonometric Functions",
          "Trigonometric Identities and Proofs",
        ]
      },
      { 
        title: "Calculus", 
        details: [
          "Limits and Continuity",
          "Differentiation: Rules, Applications (Slope, Tangents)",
          "Integration: Basic Techniques, Area under Curves",
          "Derivatives of Polynomials, Exponentials, and Trigonometric Functions",
          "Applications of Derivatives (Maxima, Minima, Optimization)",
          "Sequences and Series",
          "Multivariable Calculus (Partial Derivatives, Multiple Integrals)",
          "Differential Equations",
        ]
      },
      { 
        title: "Statistics & Probability", 
        details: [
          "Descriptive Statistics (Mean, Median, Mode, Standard Deviation)",
          "Probability Distributions (Binomial, Normal, etc.)",
          "Hypothesis Testing",
          "Combinatorics (Permutations and Combinations)",
          "Correlation and Regression Analysis",
        ]
      },
    ],
    levels: ["High School", "College"],
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg",
  },
  {
    id: 'business',
    title: 'Business',
    description: 'In Business studies, I offer tutoring in fundamental and advanced concepts that are essential for understanding business operations, strategy, and financial management:',
    icon: 'business',
    topics: [
      { 
        title: "Business Fundamentals", 
        details: [
          "Introduction to Business and Entrepreneurship",
          "Business Structures (Sole Proprietorship, Partnership, Corporation)",
          "Marketing Principles and Strategies",
          "Business Communication and Negotiation",
          "Organizational Behavior",
          "Human Resource Management",
          "Leadership and Management Styles",
        ]
      },
      { 
        title: "Management", 
        details: [
          "Principles of Management",
          "Strategic Planning and Decision Making",
          "Business Operations and Efficiency",
          "Risk Management and Crisis Management",
          "Project Management: Planning, Execution, and Control",
          "Leadership and Motivation Theories",
          "Corporate Social Responsibility",
        ]
      },
      { 
        title: "Marketing", 
        details: [
          "Marketing Research and Consumer Behavior",
          "Marketing Mix (Product, Price, Place, Promotion)",
          "Brand Management and Digital Marketing",
          "Social Media Marketing and Advertising",
          "Market Segmentation and Targeting",
          "Public Relations and Corporate Communication",
        ]
      },
      { 
        title: "Economics", 
        details: [
          "Microeconomics (Supply and Demand, Elasticity, Market Structures)",
          "Macroeconomics (GDP, Inflation, Unemployment)",
          "International Trade and Global Economics",
          "Monetary and Fiscal Policy",
          "Economic Indicators and their Impact on Business",
        ]
      },
      { 
        title: "Finance", 
        details: [
          "Corporate Finance and Financial Analysis",
          "Time Value of Money and Investment Valuation",
          "Budgeting and Forecasting",
          "Financial Ratios and Performance Metrics",
          "Capital Structure and Financial Markets",
          "Risk and Return Analysis",
        ]
      },
      { 
        title: "Business Law", 
        details: [
          "Contract Law and Legal Aspects of Business",
          "Intellectual Property and Copyright Laws",
          "Business Ethics and Legal Issues in Management",
          "Consumer Protection and Employment Law",
        ]
      },
    ],
    levels: ["High School", "College"],
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  },
  {
    id: 'accounting',
    title: 'Accounting',
    description: 'I offer tutoring in both financial and managerial accounting, helping students understand the principles and practices used in business accounting and finance.',
    icon: 'accounting',
    topics: [
      { 
        title: "Financial Accounting", 
        details: [
          "Introduction to Financial Statements (Balance Sheet, Income Statement, Cash Flow Statement)",
          "The Accounting Equation: Assets = Liabilities + Equity",
          "Journal Entries and Ledger Posting",
          "Accrual vs. Cash Accounting",
          "Depreciation and Amortization",
          "Bank Reconciliation and Trial Balance",
          "Inventory Valuation (FIFO, LIFO, Weighted Average)",
          "Accounting for Receivables and Payables",
          "Closing Entries and Adjusting Entries",
        ]
      },
      { 
        title: "Managerial Accounting", 
        details: [
          "Cost Behavior and Cost-Volume-Profit Analysis",
          "Budgeting and Variance Analysis",
          "Break-even Analysis",
          "Standard Costing and Activity-Based Costing (ABC)",
          "Job Order and Process Costing",
          "Financial Decision Making and Capital Budgeting (NPV, IRR)",
          "Budget Preparation and Forecasting",
        ]
      },
      { 
        title: "Corporate Accounting", 
        details: [
          "Consolidated Financial Statements",
          "Stockholders' Equity and Dividends",
          "Earnings Per Share (EPS) Calculation",
          "Accounting for Leases and Pensions",
          "Taxation and Deferred Taxes",
          "Accounting for Mergers and Acquisitions",
        ]
      },
      { 
        title: "Auditing and Ethics", 
        details: [
          "Principles of Auditing",
          "Internal Controls and Risk Management",
          "Ethical Standards in Accounting",
          "Auditor's Reports and Assurance Services",
          "Fraud Detection and Prevention",
        ]
      },
    ],
    levels: ["High School", "College"],
    img: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  }
];
