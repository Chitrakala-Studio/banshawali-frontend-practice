export const getGenderRowClass = (gender) => {
  if (!gender) return "";
  const lowerGender = gender.toLowerCase();
  if (lowerGender === "male") return "bg-blue-50"; // Light blue for males
  if (lowerGender === "female") return "bg-pink-50"; // Light pink for females
  return "";
};
