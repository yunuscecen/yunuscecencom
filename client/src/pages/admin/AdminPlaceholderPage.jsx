const AdminPlaceholderPage = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <div>
      <header className="admin-page-header">
        <div>
          <span>{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </header>

      <section className="admin-panel admin-placeholder">
        <span />

        <h2>{title} modülü</h2>

        <p>
          Bu alan sonraki aşamada gerçek form ve medya yönetimine
          bağlanacak.
        </p>
      </section>
    </div>
  );
};

export default AdminPlaceholderPage;