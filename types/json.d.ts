// This declaration file enables TypeScript to import JSON files
declare module "*.json" {
  const value: any;
  export default value;
} 