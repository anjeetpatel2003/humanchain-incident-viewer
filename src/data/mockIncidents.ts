
import { Incident } from '../types/incident';

export const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics in job recommendations, potentially leading to discriminatory hiring practices. This issue was discovered during a routine audit of the recommendation system's output patterns.",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "Language model provided incorrect safety procedure information in an industrial setting, potentially risking worker safety. The model generated convincing but entirely incorrect emergency protocols.",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z"
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata in responses. While no critical information was compromised, this indicates a potential vulnerability in the data handling system.",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z"
  },
  {
    id: 4,
    title: "Autonomous System Override Failure",
    description: "Critical safety override failed to activate during autonomous system test, requiring manual intervention. Investigation revealed potential gaps in failsafe mechanisms.",
    severity: "High",
    reported_at: "2025-04-10T16:45:00Z"
  },
  {
    id: 5,
    title: "AI Model Performance Degradation",
    description: "Gradual decline in model accuracy observed over time, affecting user experience but not critical functions. Regular monitoring caught the issue before significant impact.",
    severity: "Low",
    reported_at: "2025-03-25T11:20:00Z"
  }
];
