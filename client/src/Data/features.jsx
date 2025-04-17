// src/data/features.jsx
import { 
  FaHeadphones, 
  FaBook, 
  FaPencilAlt, 
  FaMicrophone, 
  FaChartLine, 
  FaUsers,
  FaCoins,
  FaPlay
} from 'react-icons/fa';

const features = [
  {
    icon: <FaHeadphones />,
    title: "Listening Tests",
    description: "Practice with authentic listening materials and improve comprehension with timed exercises.",
    token: 1,
    link: "/test/listening"
  },
  {
    icon: <FaBook />,
    title: "Reading Practice",
    description: "Enhance reading speed and accuracy with diverse practice passages and question types.",
    token: 1,
    link: "/test/reading"
  },
  {
    icon: <FaPencilAlt />,
    title: "Writing Feedback",
    description: "Get AI-powered feedback on essays to improve structure, vocabulary and grammar.",
    token: 1,
    link: "/test/writing"
  },
  {
    icon: <FaMicrophone />,
    title: "Speaking Practice",
    description: "Simulate real exam conditions with our AI speaking assistant and instant feedback.",
    token: 1,
    link: "/test/speaking"
  },
  {
    icon: <FaChartLine />,
    title: "Progress Tracking",
    description: "Monitor your band scores and identify weak areas with detailed analytics.",
    token: 0,
    link: "/dashboard"
  },
  {
    icon: <FaUsers />,
    title: "Community Support",
    description: "Connect with other test-takers and get expert advice in our community forums.",
    token: 0,
    link: "/community"
  }
];

export default features;