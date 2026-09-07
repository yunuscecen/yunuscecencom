const blockedKeys = new Set([
  "__proto__",
  "prototype",
  "constructor",
]);

const isPlainObject = (value) => {
  return (
    Object.prototype.toString.call(value) ===
    "[object Object]"
  );
};

const inspectValue = (
  value,
  path = "İçerik",
  depth = 0
) => {
  if (depth > 10) {
    throw new Error(
      `${path} izin verilenden fazla iç içe alan içeriyor.`
    );
  }

  if (value === null) {
    return;
  }

  if (typeof value === "string") {
    if (value.length > 20000) {
      throw new Error(
        `${path} alanı izin verilenden daha uzun.`
      );
    }

    return;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(
        `${path} geçerli bir sayı içermelidir.`
      );
    }

    return;
  }

  if (typeof value === "boolean") {
    return;
  }

  if (Array.isArray(value)) {
    if (value.length > 100) {
      throw new Error(
        `${path} en fazla 100 öğe içerebilir.`
      );
    }

    value.forEach((item, index) => {
      inspectValue(
        item,
        `${path}[${index}]`,
        depth + 1
      );
    });

    return;
  }

  if (!isPlainObject(value)) {
    throw new Error(
      `${path} desteklenmeyen bir veri türü içeriyor.`
    );
  }

  const entries = Object.entries(value);

  if (entries.length > 100) {
    throw new Error(
      `${path} izin verilenden fazla alan içeriyor.`
    );
  }

  entries.forEach(([key, childValue]) => {
    if (
      blockedKeys.has(key) ||
      key.startsWith("$") ||
      key.includes(".")
    ) {
      throw new Error(
        `${path} içerisinde geçersiz bir alan adı bulundu.`
      );
    }

    inspectValue(
      childValue,
      `${path}.${key}`,
      depth + 1
    );
  });
};

const validateStructuredContent = (
  payload,
  res
) => {
  if (!isPlainObject(payload)) {
    res.status(400);
    throw new Error(
      "Gönderilen içerik geçerli bir nesne olmalıdır."
    );
  }

  if (Object.keys(payload).length === 0) {
    res.status(400);
    throw new Error(
      "Güncellenecek geçerli bir içerik alanı bulunamadı."
    );
  }

  try {
    inspectValue(payload);
  } catch (error) {
    res.status(400);
    throw error;
  }

  return payload;
};

export default validateStructuredContent;