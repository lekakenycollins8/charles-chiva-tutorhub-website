// About page data

export const person = {
    firstName: 'Charles',
    lastName: 'O.O',
    get name() {
        return `${this.firstName} ${this.lastName}`;
    },
    role: 'Professional Tutor',
    avatar: '/images/chiva-logo.png',
    location: 'Global',        
    languages: ['English', 'Swahili']  
};

export const aboutContent = {
    intro: {
        title: 'Meet Your Tutor',
        subtitle: `${person.name}`,
        description: "As the founder and lead tutor at CHIVA Tutorhub, I bring 10 years of professional tutoring experience and a solid academic foundation in the subjects I teach. I am passionate about helping students understand the content and develop the critical thinking skills and confidence they need to succeed academically and in real-world applications.\n\nMy approach is centered around clear communication, active engagement, and problem-solving, creating a supportive learning environment that fosters growth and mastery."
    },
    qualifications: {
        title: 'My Qualifications & Experience',
        education: [
            {
                name: 'University of Education',
                description: "Master's degree in Organic chemistry and basic mathematics"
            },
            {
                name: 'State University',
                description: "Bachelor's degree in education science"
            },
            {
                name: 'Professional Certifications',
                description: "Certified Accounting Professional, Certified Professional Tutor in Business"
            }
        ],
        experience: [
            "Over 10 years of tutoring experience in Chemistry, Mathematics, Business, and Accounting",
            "Have helped students improve grades by 80% or more, with many students achieving A/B grades in final exams",
            "Extensive experience with both high school and college-level students",
            "Proven success in exam preparation, homework support, and concept mastery across a variety of curricula"
        ],
        specializations: [
            {
                title: 'Chemistry',
                description: "From basic chemistry principles to advanced organic and inorganic chemistry"
            },
            {
                title: 'Mathematics',
                description: "Algebra, Calculus, Geometry, Trigonometry, and Statistics"
            },
            {
                title: 'Business',
                description: "Business strategy, marketing, management, and economics"
            },
            {
                title: 'Accounting',
                description: "Financial accounting, managerial accounting, and corporate finance"
            }
        ]
    },
    philosophy: {
        title: 'Tutoring Philosophy',
        description: [
            "I believe in personalized learning that adapts to each student's individual needs.",
            "My goal is to break down complex concepts into understandable, manageable parts, ensuring that each student feels confident and empowered.",
            "I use a variety of teaching techniques, including:",
            "Interactive problem-solving to reinforce theoretical knowledge",
            "Real-world applications to connect academic content with practical skills",
            "Focused one-on-one attention to address specific learning gaps",
            "Ongoing progress assessments to track improvements and adjust the learning plan"
        ],
        conclusion: "I aim to make every session engaging, motivating, and focused on your academic goals. Whether you're preparing for exams, tackling difficult assignments, or simply looking to improve your understanding of key concepts, I'm here to support you every step of the way."
    },
    whyChoose: {
        title: 'Why Choose CHIVA Tutorhub?',
        reasons: [
            {
                title: "Expert Tutoring",
                description: "In-depth understanding of subjects, backed by years of academic study and hands-on tutoring experience."
            },
            {
                title: "Tailored Approach",
                description: "Every student has unique learning needs. Customized tutoring plans to fit your learning style and goals."
            },
            {
                title: "Proven Success",
                description: "Students consistently achieve higher grades and improve their understanding of complex concepts."
            },
            {
                title: "Flexible Sessions",
                description: "Online and in-person tutoring options that fit your schedule and needs."
            }
        ]
    },
    goals: {
        title: 'Let\'s Achieve Your Academic Goals Together',
        description: "At CHIVA Tutorhub, I am committed to helping students unlock their full potential. Whether you are struggling with difficult concepts or aiming for top grades, I'm here to help you succeed. Let's work together to make learning enjoyable and effective!"
    },
    contact: {
        email: "chivatutorhub@gmail.com",
        instagram: "https://www.instagram.com/chiva_tutorhub/profilecard/?igsh=eGRsaHhkN2Y4eDls"
    }
};
