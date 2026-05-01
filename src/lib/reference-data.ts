/**
 * Reference dropdown data used in the SignUp and Admin forms.
 * In production this would come from the Spring Boot backend.
 */
export const ROLES = ["ADMIN", "ENGINEER", "TECHNICIAN", "EMPLOYEE"] as const;

export const DESIGNATIONS = [
  "Chief Inspector",
  "Field Engineer",
  "Junior Engineer",
  "Site Technician",
  "Operator",
] as const;

export const STATES = [
  "Andhra Pradesh",
  "Karnataka",
  "Kerala",
  "Maharashtra",
  "Tamil Nadu",
  "Telangana",
] as const;

export const DISTRICTS_BY_STATE: Record<string, readonly string[]> = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "Guntur", "Visakhapatnam"],
  Karnataka: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"],
  Kerala: ["Ernakulam", "Kozhikode", "Thiruvananthapuram", "Thrissur"],
  Maharashtra: ["Mumbai", "Nagpur", "Nashik", "Pune"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
  Telangana: ["Hyderabad", "Karimnagar", "Nizamabad", "Warangal"],
};
