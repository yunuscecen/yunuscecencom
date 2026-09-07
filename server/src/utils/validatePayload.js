const validatePayload = (schema, payload, res) => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    res.status(400);

    throw new Error(
      result.error.issues[0]?.message ||
        "Gönderilen bilgiler geçersiz."
    );
  }

  return result.data;
};

export default validatePayload;