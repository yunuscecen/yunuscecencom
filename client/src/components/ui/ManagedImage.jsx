import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

const ManagedImage = ({
  src,
  alt = "",
  label = "Görsel alanı",
  badge = "",
  className = "",
  loading = "lazy",
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const hasImage = Boolean(src) && !imageError;

  return (
    <div className={`managed-image ${className}`}>
      {hasImage ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="managed-image__placeholder">
          <ImageIcon aria-hidden="true" />

          <span>{label}</span>

          <small>Admin panelinden değiştirilebilir</small>
        </div>
      )}

      {badge && (
        <span className="managed-image__badge">{badge}</span>
      )}
    </div>
  );
};

export default ManagedImage;