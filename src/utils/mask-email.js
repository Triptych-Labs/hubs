export default function maskEmail(email) {
  if (!email) return "";
  const emailIdentity = email.slice(0, 4);
  const emailDomain = email.slice(-3);
  const truncatedIdentity = emailIdentity.substring(0, Math.min(emailIdentity.length, 3));
  return `${truncatedIdentity}...${emailDomain}`;
}
