export const calculateEMI = (principal, ratePerYear, tenureInMonths) => {
  if (!principal || !tenureInMonths) return 0;
  // standard EMI formula: P x R x (1+R)^N / [(1+R)^N-1]
  // R = rate per month
  const R = ratePerYear / 12 / 100;
  const N = tenureInMonths;
  
  if (R === 0) return principal / N; // 0% interest case
  
  const emi = (principal * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
  return Math.round(emi);
};
