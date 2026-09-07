import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const AdminLoginPage = () => {
  const {
    login,
    isAuthenticated,
    authLoading,
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setStatus("submitting");
    setErrorMessage("");

    try {
      await login(form);

      const destination =
        location.state?.from?.pathname || "/admin";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      setStatus("error");

      setErrorMessage(
        error.response?.data?.message ||
          "Giriş yapılamadı. Bilgilerinizi kontrol edin."
      );
    }
  };

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="admin-login">
      <section className="admin-login__visual">
        <div
          className="admin-login__field"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <div className="admin-login__visual-content">
          <span>YÇ / Portfolio OS</span>
          <h1>İçeriğin kontrol merkezi.</h1>

          <p>
            Projeleri, görselleri ve site içeriğini tek yerden
            yönetin.
          </p>
        </div>
      </section>

      <section className="admin-login__form-area">
        <form onSubmit={handleSubmit}>
          <header>
            <span>Secure access</span>
            <h2>Yönetim paneli</h2>

            <p>
              Devam etmek için admin hesabınızla giriş yapın.
            </p>
          </header>

          <label>
            <span>E-posta</span>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            <span>Parola</span>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              minLength={8}
              required
            />
          </label>

          {errorMessage && (
            <p
              className="admin-login__error"
              role="alert"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
          >
            {status === "submitting"
              ? "Giriş yapılıyor..."
              : "Giriş yap"}

            <ArrowRight size={17} />
          </button>
        </form>
      </section>
    </main>
  );
};

export default AdminLoginPage;