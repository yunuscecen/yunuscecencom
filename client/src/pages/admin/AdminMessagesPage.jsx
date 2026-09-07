import {
  useCallback,
  useEffect,
  useState,
} from "react";

import http from "../../api/http";
import { useConfirm } from "../../context/ConfirmContext";
const statusLabels = {
  new: "Yeni",
  read: "Okundu",
  replied: "Yanıtlandı",
  archived: "Arşivlendi",
};

const serviceLabels = {
  "web-development": "Web Development",
  wordpress: "WordPress",
  "ui-ux": "UI / UX",
  "graphic-design": "Graphic Design",
  branding: "Branding",
  other: "Diğer",
  "": "Belirtilmedi",
};

const initialPagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
};

const initialStats = {
  total: 0,
  counts: {
    new: 0,
    read: 0,
    replied: 0,
    archived: 0,
  },
  recentMessages: [],
};

const extractData = (response) =>
  response.data?.data || response.data;

const formatDate = (value) => {
  if (!value) return "";

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const createReplyLink = (message) => {
  const subject = encodeURIComponent(
    `Projeniz hakkında — ${message.service
      ? serviceLabels[message.service]
      : "Yunus Çeçen"}`
  );

  const body = encodeURIComponent(
    `Merhaba ${message.name},\n\nMesajınız için teşekkür ederim.\n\n`
  );

  return `mailto:${message.email}?subject=${subject}&body=${body}`;
};

const AdminMessagesPage = () => {
  const confirm = useConfirm();

  const [messages, setMessages] = useState([]);
   const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [searchInput, setSearchInput] = useState("");

  const [filters, setFilters] = useState({
    status: "",
    service: "",
    search: "",
  });

  const [pagination, setPagination] =
    useState(initialPagination);

  const [stats, setStats] = useState(initialStats);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] =
    useState(false);
  const [statusUpdating, setStatusUpdating] =
    useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [feedback, setFeedback] = useState(null);
  const loadStats = async () => {
    try {
      const response = await http.get(
        "/admin/messages/stats"
      );

      setStats({
        ...initialStats,
        ...extractData(response),
        counts: {
          ...initialStats.counts,
          ...extractData(response)?.counts,
        },
      });
    } catch (error) {
      console.error(
        "Mesaj istatistikleri alınamadı.",
        error
      );
    }
  };

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);

      const response = await http.get(
        "/admin/messages",
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,

            ...(filters.status && {
              status: filters.status,
            }),

            ...(filters.service && {
              service: filters.service,
            }),

            ...(filters.search && {
              search: filters.search,
            }),
          },
        }
      );

      const data = extractData(response);

      setMessages(Array.isArray(data) ? data : []);

      setPagination((current) => ({
        ...current,
        ...(response.data?.pagination || {}),
      }));
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Mesajlar alınamadı.",
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.status,
    filters.service,
    filters.search,
  ]);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSearch = (event) => {
    event.preventDefault();

    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setFilters((current) => ({
      ...current,
      search: searchInput.trim(),
    }));
  };

  const resetFilters = () => {
    setSearchInput("");

    setPagination((current) => ({
      ...current,
      page: 1,
    }));

    setFilters({
      status: "",
      service: "",
      search: "",
    });
  };

  const openMessage = async (message) => {
    setDetailLoading(true);
    setFeedback(null);

    try {
      const response = await http.get(
        `/admin/messages/${message._id}`
      );

      let detailedMessage = extractData(response);

      if (detailedMessage.status === "new") {
        const statusResponse = await http.patch(
          `/admin/messages/${message._id}`,
          {
            status: "read",
          }
        );

        detailedMessage = extractData(statusResponse);

        setMessages((current) =>
          current.map((item) =>
            item._id === detailedMessage._id
              ? detailedMessage
              : item
          )
        );

        await loadStats();
      }

      setSelectedMessage(detailedMessage);
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Mesaj detayı alınamadı.",
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!selectedMessage?._id) return;

    try {
      setStatusUpdating(true);
      setFeedback(null);

      const response = await http.patch(
        `/admin/messages/${selectedMessage._id}`,
        {
          status,
        }
      );

      const updatedMessage = extractData(response);

      setSelectedMessage(updatedMessage);

      setMessages((current) =>
        current.map((message) =>
          message._id === updatedMessage._id
            ? updatedMessage
            : message
        )
      );

      await loadStats();

      if (
        filters.status &&
        filters.status !== updatedMessage.status
      ) {
        setSelectedMessage(null);
        await loadMessages();
      }

      setFeedback({
        type: "success",
        message: "Mesaj durumu güncellendi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Mesaj durumu güncellenemedi.",
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDelete = async (message) => {
    if (!message?._id) return;

    const confirmed = await confirm({
      title: `${message.name} tarafından gönderilen mesaj silinsin mi?`,
      description:
        "Mesaj kalıcı olarak kaldırılacak. Bu işlem geri alınamaz.",
      confirmLabel: "Mesajı sil",
      cancelLabel: "Vazgeç",
      tone: "danger",
    });

    if (!confirmed) return;

    try {
      setDeletingId(message._id);
      setFeedback(null);

      await http.delete(`/admin/messages/${message._id}`);

      if (selectedMessage?._id === message._id) {
        setSelectedMessage(null);
      }

      const deletingLastItem =
        messages.length === 1 && pagination.page > 1;

      if (deletingLastItem) {
        setPagination((current) => ({
          ...current,
          page: current.page - 1,
        }));
      } else {
        await loadMessages();
      }

      await loadStats();

      setFeedback({
        type: "success",
        message: "Mesaj kalıcı olarak silindi.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error.response?.data?.message ||
          "Mesaj silinemedi.",
      });
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="admin-editor">
      <header className="admin-editor-header">
        <div>
          <span className="admin-editor-eyebrow">
            Gelen kutusu
          </span>

          <h1>Mesajlar</h1>

          <p>
            İletişim formundan gelen talepleri görüntüle,
            sınıflandır ve yanıtla.
          </p>
        </div>

        <div className="admin-unread-counter">
          <strong>{stats.counts.new}</strong>
          <span>yeni mesaj</span>
        </div>
      </header>

      {feedback && (
        <div
          className={`admin-feedback admin-feedback--${feedback.type}`}
          role="status"
        >
          {feedback.message}
        </div>
      )}

      <section className="admin-message-stats">
        <button
          type="button"
          className={
            filters.status === "" ? "is-active" : ""
          }
          onClick={() => {
            setPagination((current) => ({
              ...current,
              page: 1,
            }));

            setFilters((current) => ({
              ...current,
              status: "",
            }));
          }}
        >
          <span>Tümü</span>
          <strong>{stats.total}</strong>
        </button>

        {Object.entries(statusLabels).map(
          ([status, label]) => (
            <button
              type="button"
              className={
                filters.status === status
                  ? "is-active"
                  : ""
              }
              key={status}
              onClick={() => {
                setPagination((current) => ({
                  ...current,
                  page: 1,
                }));

                setFilters((current) => ({
                  ...current,
                  status,
                }));
              }}
            >
              <span>{label}</span>
              <strong>
                {stats.counts[status] || 0}
              </strong>
            </button>
          )
        )}
      </section>

      <section className="admin-message-toolbar">
        <form onSubmit={handleSearch}>
          <input
            type="search"
            value={searchInput}
            placeholder="İsim, e-posta, şirket veya mesaj ara..."
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
          />

          <button type="submit">Ara</button>
        </form>

        <select
          value={filters.service}
          onChange={(event) => {
            setPagination((current) => ({
              ...current,
              page: 1,
            }));

            setFilters((current) => ({
              ...current,
              service: event.target.value,
            }));
          }}
        >
          <option value="">Tüm hizmetler</option>

          {Object.entries(serviceLabels)
            .filter(([value]) => value)
            .map(([value, label]) => (
              <option value={value} key={value}>
                {label}
              </option>
            ))}
        </select>

        {(filters.status ||
          filters.service ||
          filters.search) && (
          <button
            className="admin-filter-reset"
            type="button"
            onClick={resetFilters}
          >
            Filtreleri temizle
          </button>
        )}
      </section>

      <div className="admin-message-layout">
        <section className="admin-message-list">
          <div className="admin-list-panel__heading">
            <div>
              <h2>Mesaj listesi</h2>
              <p>{pagination.total} sonuç</p>
            </div>
          </div>

          {loading ? (
            <div className="admin-empty-state">
              Mesajlar yükleniyor...
            </div>
          ) : messages.length === 0 ? (
            <div className="admin-empty-state">
              <strong>Mesaj bulunamadı.</strong>
              <p>
                Seçili filtrelere uygun mesaj bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="admin-message-list__items">
              {messages.map((message) => (
                <button
                  type="button"
                  className={`admin-message-card ${
                    message.status === "new"
                      ? "is-unread"
                      : ""
                  } ${
                    selectedMessage?._id === message._id
                      ? "is-selected"
                      : ""
                  }`}
                  key={message._id}
                  onClick={() => openMessage(message)}
                >
                  <div className="admin-message-card__top">
                    <strong>{message.name}</strong>

                    <time>
                      {formatDate(message.createdAt)}
                    </time>
                  </div>

                  <span>{message.email}</span>

                  <p>{message.message}</p>

                  <div className="admin-message-card__bottom">
                    <span>
                      {serviceLabels[message.service] ||
                        "Belirtilmedi"}
                    </span>

                    <span
                      className={`admin-message-status admin-message-status--${message.status}`}
                    >
                      {statusLabels[message.status]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button
                type="button"
                disabled={pagination.page <= 1}
                onClick={() =>
                  setPagination((current) => ({
                    ...current,
                    page: current.page - 1,
                  }))
                }
              >
                Önceki
              </button>

              <span>
                {pagination.page} /{" "}
                {pagination.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  pagination.page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPagination((current) => ({
                    ...current,
                    page: current.page + 1,
                  }))
                }
              >
                Sonraki
              </button>
            </div>
          )}
        </section>

        {detailLoading ? (
          <aside className="admin-message-detail">
            <div className="admin-empty-state">
              Mesaj açılıyor...
            </div>
          </aside>
        ) : selectedMessage ? (
          <aside className="admin-message-detail">
            <div className="admin-message-detail__heading">
              <div>
                <span className="admin-editor-eyebrow">
                  Mesaj detayı
                </span>

                <h2>{selectedMessage.name}</h2>
                <a href={`mailto:${selectedMessage.email}`}>
                  {selectedMessage.email}
                </a>
              </div>

              <button
                className="admin-editor-close"
                type="button"
                aria-label="Mesaj detayını kapat"
                onClick={() =>
                  setSelectedMessage(null)
                }
              >
                ×
              </button>
            </div>

            <dl className="admin-message-facts">
              <div>
                <dt>Tarih</dt>
                <dd>
                  {formatDate(
                    selectedMessage.createdAt
                  )}
                </dd>
              </div>

              <div>
                <dt>Hizmet</dt>
                <dd>
                  {serviceLabels[
                    selectedMessage.service
                  ] || "Belirtilmedi"}
                </dd>
              </div>

              {selectedMessage.company && (
                <div>
                  <dt>Şirket</dt>
                  <dd>{selectedMessage.company}</dd>
                </div>
              )}

              {selectedMessage.budget && (
                <div>
                  <dt>Bütçe</dt>
                  <dd>{selectedMessage.budget}</dd>
                </div>
              )}
            </dl>

            <div className="admin-message-body">
              <span>Mesaj</span>
              <p>{selectedMessage.message}</p>
            </div>

            <label className="admin-form-field">
              <span>Mesaj durumu</span>

              <select
                value={selectedMessage.status}
                disabled={statusUpdating}
                onChange={(event) =>
                  updateStatus(event.target.value)
                }
              >
                {Object.entries(statusLabels).map(
                  ([value, label]) => (
                    <option value={value} key={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>

            <div className="admin-message-detail__actions">
              <a
                className="admin-primary-button"
                href={createReplyLink(selectedMessage)}
                onClick={() => {
                  if (
                    selectedMessage.status !==
                    "replied"
                  ) {
                    updateStatus("replied");
                  }
                }}
              >
                E-posta ile yanıtla
              </a>

                           <button
                className="admin-secondary-button"
                type="button"
                disabled={
                  deletingId === selectedMessage._id
                }
                onClick={() =>
                  handleDelete(selectedMessage)
                }
              >
                {deletingId === selectedMessage._id
                  ? "Siliniyor..."
                  : "Mesajı sil"}
              </button>
            </div>
          </aside>
        ) : (
          <aside className="admin-editor-placeholder">
            <span>Inbox / Detail</span>
            <h2>Okumak için bir mesaj seç.</h2>
            <p>
              Mesajın tüm bilgileri burada gösterilir.
            </p>
          </aside>
        )}
      </div>

     
    </div>
  );
};

export default AdminMessagesPage;