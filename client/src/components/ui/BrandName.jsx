const BrandName = ({
  name = "Yunus Çeçen",
  as: Component = "span",
  className = "",
}) => {
  const activeLanguage =
    window.localStorage.getItem("site-language") || "en";

  const displayedName =
    activeLanguage === "tr"
      ? name
      : name
          .replaceAll("Ç", "C")
          .replaceAll("ç", "c");

  return (
    <Component
      className={`notranslate ${className}`.trim()}
      translate="no"
    >
      {displayedName}
    </Component>
  );
};

export default BrandName;