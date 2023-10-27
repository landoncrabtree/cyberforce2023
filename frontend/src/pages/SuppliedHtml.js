function SuppliedHTML({ user_supplied }) {
  // Ensure user_supplied is properly sanitized and validated to prevent XSS attacks
  const sanitizedHTML = /* Sanitize and validate user_supplied here */user_supplied;

  return (
    <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />
  );
}

export default SuppliedHTML;
