const field = (path, label, type = "text") => ({
  path,
  label,
  type,
});

const pageContentFields = [
  {
    key: "home",
    label: "Ana Sayfa",
    groups: [
      {
        title: "Yükleme ve hata mesajları",
        fields: [
          field("home.loadingKicker", "Yükleme üst başlığı"),
          field("home.loadingText", "Yükleme mesajı"),
          field("home.errorKicker", "Hata üst başlığı"),
          field("home.errorTitle", "Hata başlığı"),
          field(
            "home.errorDescription",
            "Hata açıklaması",
            "textarea"
          ),
        ],
      },
      {
        title: "Vitrin alanı",
        fields: [
          field("home.coordinateLeft", "Sol dekoratif metin"),
          field("home.coordinateRight", "Sağ dekoratif metin"),
          field("home.railItems.0.eyebrow", "İlk kart üst başlığı"),
          field("home.railItems.0.title", "İlk kart başlığı"),
          field(
            "home.railItems.0.description",
            "İlk kart açıklaması",
            "textarea"
          ),
          field("home.railItems.1.eyebrow", "İkinci kart üst başlığı"),
          field("home.railItems.1.title", "İkinci kart başlığı"),
          field(
            "home.railItems.1.description",
            "İkinci kart açıklaması",
            "textarea"
          ),
        ],
      },
      {
        title: "Bölüm etiketleri",
        fields: [
          field("home.manifestoKicker", "Perspektif etiketi"),
          field(
            "home.featuredImageLabel",
            "Vitrin görseli placeholder metni"
          ),
          field("home.featuredImageBadge", "Vitrin görseli rozeti"),
          field(
            "home.featuredImageFallbackCaption",
            "Varsayılan görsel açıklaması"
          ),
          field(
            "home.featuredImageRecommendation",
            "Görsel boyut önerisi"
          ),
          field(
            "home.projectsSectionNumber",
            "Projeler bölüm numarası"
          ),
          field(
            "home.allProjectsLabel",
            "Tüm projeler bağlantı metni"
          ),
          field(
            "home.servicesSectionNumber",
            "Hizmetler bölüm numarası"
          ),
          field(
            "home.processSectionNumber",
            "Süreç bölüm numarası"
          ),
          field("home.aboutKicker", "Hakkımda bölüm etiketi"),
          field(
            "home.aboutButtonLabel",
            "Hakkımda bağlantı metni"
          ),
        ],
      },
    ],
  },
  {
    key: "projects",
    label: "Projeler",
    groups: [
      {
        title: "Sayfa başlangıcı",
        fields: [
          field("projects.heroKicker", "Üst başlık"),
          field("projects.title", "Ana başlık"),
          field(
            "projects.description",
            "Sayfa açıklaması",
            "textarea"
          ),
          field("projects.countSuffix", "Proje sayısı son eki"),
        ],
      },
      {
        title: "Durum mesajları",
        fields: [
          field("projects.loadingText", "Yükleme mesajı"),
          field("projects.errorText", "Hata mesajı"),
          field("projects.emptyKicker", "Boş durum üst başlığı"),
          field("projects.emptyTitle", "Boş durum başlığı"),
          field(
            "projects.emptyDescription",
            "Boş durum açıklaması",
            "textarea"
          ),
        ],
      },
            {
        title: "SEO",
        fields: [
          field("projects.seo.title", "SEO başlığı"),
          field(
            "projects.seo.description",
            "SEO açıklaması",
            "textarea"
          ),
        ],
      },
    ],
  },
  {
    key: "services",
    label: "Hizmetler",
    groups: [
      {
        title: "Sayfa başlangıcı",
        fields: [
          field("services.heroKicker", "Üst başlık"),
          field("services.title", "Ana başlık"),
          field(
            "services.description",
            "Sayfa açıklaması",
            "textarea"
          ),
        ],
      },
      {
        title: "Hizmet alanları",
        fields: [
          field("services.loadingText", "Yükleme mesajı"),
          field("services.errorText", "Hata mesajı"),
          field("services.emptyText", "Boş durum mesajı"),
          field(
            "services.deliverablesLabel",
            "Teslim kapsamı başlığı"
          ),
          field(
            "services.contactButtonLabel",
            "İletişim butonu"
          ),
        ],
      },
            {
        title: "SEO",
        fields: [
          field("services.seo.title", "SEO başlığı"),
          field(
            "services.seo.description",
            "SEO açıklaması",
            "textarea"
          ),
        ],
      },
    ],
  },
  {
    key: "about",
    label: "Hakkımda",
    groups: [
      {
        title: "Hikâye ve bilgiler",
        fields: [
          field("about.storyKicker", "Hikâye bölüm etiketi"),
          field("about.roleLabel", "Rol etiketi"),
          field("about.locationLabel", "Konum etiketi"),
          field("about.statusLabel", "Durum etiketi"),
        ],
      },
      {
        title: "Yetenekler",
        fields: [
          field("about.skillsKicker", "Yetenekler üst başlığı"),
          field("about.skillsTitle", "Yetenekler başlığı"),
        ],
      },
      {
        title: "Deneyim",
        fields: [
          field(
            "about.experienceKicker",
            "Deneyim üst başlığı"
          ),
          field("about.experienceTitle", "Deneyim başlığı"),
        ],
      },
      {
        title: "İletişim çağrısı",
        fields: [
          field("about.ctaKicker", "CTA üst başlığı"),
          field("about.ctaTitle", "CTA başlığı", "textarea"),
          field("about.ctaButtonLabel", "CTA butonu"),
        ],
      },
    ],
  },
  {
    key: "projectDetail",
    label: "Proje Detayı",
    groups: [
      {
        title: "Genel etiketler",
        fields: [
          field(
            "projectDetail.backLabel",
            "Projeler sayfasına dönüş"
          ),
          field("projectDetail.clientLabel", "Müşteri etiketi"),
          field("projectDetail.yearLabel", "Yıl etiketi"),
          field("projectDetail.servicesLabel", "Hizmetler etiketi"),
          field(
            "projectDetail.technologyLabel",
            "Teknolojiler etiketi"
          ),
          field(
            "projectDetail.overviewKicker",
            "Proje özeti etiketi"
          ),
        ],
      },
      {
        title: "İçerik bölümleri",
        fields: [
          field(
            "projectDetail.challengeKicker",
            "Problem üst başlığı"
          ),
          field(
            "projectDetail.challengeTitle",
            "Problem başlığı"
          ),
          field(
            "projectDetail.solutionKicker",
            "Çözüm üst başlığı"
          ),
          field(
            "projectDetail.solutionTitle",
            "Çözüm başlığı"
          ),
          field(
            "projectDetail.galleryCaption",
            "Galeri görseli açıklaması"
          ),
          field(
            "projectDetail.resultsKicker",
            "Sonuçlar üst başlığı"
          ),
          field(
            "projectDetail.resultsTitle",
            "Sonuçlar başlığı"
          ),
        ],
      },
      {
        title: "Proje bağlantıları",
        fields: [
          field(
            "projectDetail.linksTitle",
            "Bağlantılar başlığı"
          ),
          field(
            "projectDetail.liveLinkLabel",
            "Canlı proje bağlantısı"
          ),
          field(
            "projectDetail.githubLinkLabel",
            "GitHub bağlantısı"
          ),
          field(
            "projectDetail.behanceLinkLabel",
            "Behance bağlantısı"
          ),
        ],
      },
    ],
  },
  {
    key: "contact",
    label: "İletişim",
    groups: [
      {
        title: "Sayfa başlangıcı",
        fields: [
          field("contact.heroKicker", "Üst başlık"),
          field("contact.title", "Ana başlık", "textarea"),
          field(
            "contact.highlightedText",
            "Degrade uygulanacak ifade"
          ),
        ],
      },
      {
        title: "İletişim bilgileri",
        fields: [
          field("contact.emailLabel", "E-posta etiketi"),
          field("contact.phoneLabel", "Telefon etiketi"),
          field("contact.locationLabel", "Konum etiketi"),
        ],
      },
      {
        title: "Form alanları",
        fields: [
          field("contact.nameLabel", "Ad soyad etiketi"),
          field("contact.formEmailLabel", "Form e-posta etiketi"),
          field("contact.companyLabel", "Şirket etiketi"),
          field("contact.serviceLabel", "Hizmet etiketi"),
          field(
            "contact.servicePlaceholder",
            "Hizmet seçimi placeholder"
          ),
          field("contact.budgetLabel", "Bütçe etiketi"),
          field(
            "contact.budgetPlaceholder",
            "Bütçe seçimi placeholder"
          ),
          field("contact.messageLabel", "Mesaj etiketi"),
          field(
            "contact.consentText",
            "Form bilgilendirme metni",
            "textarea"
          ),
          field("contact.submitLabel", "Gönder butonu"),
          field(
            "contact.submittingLabel",
            "Gönderim sırasındaki buton"
          ),
          field(
            "contact.errorMessage",
            "Varsayılan hata mesajı",
            "textarea"
          ),
        ],
      },
      {
        title: "Hizmet seçenekleri",
        fields: [
          field(
            "contact.serviceOptions.0.label",
            "Web geliştirme"
          ),
          field("contact.serviceOptions.1.label", "WordPress"),
          field("contact.serviceOptions.2.label", "UI / UX"),
          field(
            "contact.serviceOptions.3.label",
            "Grafik tasarım"
          ),
          field("contact.serviceOptions.4.label", "Markalaşma"),
          field("contact.serviceOptions.5.label", "Diğer"),
        ],
      },
      {
        title: "Bütçe seçenekleri",
        fields: [
          field(
            "contact.budgetOptions.0.label",
            "Birinci bütçe seçeneği"
          ),
          field(
            "contact.budgetOptions.1.label",
            "İkinci bütçe seçeneği"
          ),
          field(
            "contact.budgetOptions.2.label",
            "Üçüncü bütçe seçeneği"
          ),
          field(
            "contact.budgetOptions.3.label",
            "Dördüncü bütçe seçeneği"
          ),
          field(
            "contact.budgetOptions.4.label",
            "Beşinci bütçe seçeneği"
          ),
        ],
      },
            {
        title: "SEO",
        fields: [
          field("contact.seo.title", "SEO başlığı"),
          field(
            "contact.seo.description",
            "SEO açıklaması",
            "textarea"
          ),
        ],
      },
    ],
  },
];

export default pageContentFields;