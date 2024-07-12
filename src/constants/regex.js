const RegexSchema = {
  Username: /^[a-zA-Z]{3,}$/g,
  Password: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/g
};
export default RegexSchema;
