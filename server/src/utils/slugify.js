export const slugifyText = (value) => {
  return value
    .toString()
    .trim()
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const createUniqueSlug = async (
  Model,
  value,
  excludedDocumentId = null
) => {
  const baseSlug = slugifyText(value) || "proje";

  let candidate = baseSlug;
  let counter = 2;

  const createFilter = () => {
    const filter = { slug: candidate };

    if (excludedDocumentId) {
      filter._id = {
        $ne: excludedDocumentId,
      };
    }

    return filter;
  };

  while (await Model.exists(createFilter())) {
    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return candidate;
};