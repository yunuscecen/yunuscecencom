const AdminStringListField = ({
  label,
  items = [],
  onChange,
  addLabel = "Yeni öğe",
  placeholder = "",
  multiline = false,
}) => {
  const updateItem = (index, value) => {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? value : item
      )
    );
  };

  const removeItem = (index) => {
    onChange(
      items.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const moveItem = (index, direction) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const nextItems = [...items];

    [nextItems[index], nextItems[targetIndex]] = [
      nextItems[targetIndex],
      nextItems[index],
    ];

    onChange(nextItems);
  };

  return (
    <div className="admin-string-list">
      <div className="admin-string-list__heading">
        <span className="admin-field-label">{label}</span>
        <small>{items.length} öğe</small>
      </div>

      <div className="admin-repeatable-list">
        {items.map((item, index) => (
          <article
            className="admin-repeatable-item"
            key={`${label}-${index}`}
          >
            <div className="admin-repeatable-item__heading">
              <strong>
                {label} {index + 1}
              </strong>

              <div className="admin-repeatable-actions">
                <button
                  type="button"
                  disabled={index === 0}
                  aria-label="Yukarı taşı"
                  onClick={() => moveItem(index, -1)}
                >
                  ↑
                </button>

                <button
                  type="button"
                  disabled={index === items.length - 1}
                  aria-label="Aşağı taşı"
                  onClick={() => moveItem(index, 1)}
                >
                  ↓
                </button>

                <button
                  className="is-danger"
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  Sil
                </button>
              </div>
            </div>

            <label className="admin-form-field">
              <span>İçerik</span>

              {multiline ? (
                <textarea
                  rows="5"
                  value={item}
                  placeholder={placeholder}
                  onChange={(event) =>
                    updateItem(index, event.target.value)
                  }
                />
              ) : (
                <input
                  type="text"
                  value={item}
                  placeholder={placeholder}
                  onChange={(event) =>
                    updateItem(index, event.target.value)
                  }
                />
              )}
            </label>
          </article>
        ))}

        <button
          className="admin-add-button"
          type="button"
          onClick={() => onChange([...items, ""])}
        >
          + {addLabel}
        </button>
      </div>
    </div>
  );
};

export default AdminStringListField;