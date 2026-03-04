# Statify 🎧

Statify, Spotify API'sini kullanarak en çok dinlediğiniz sanatçıları ve şarkıları (aylık, 6 aylık ve yıllık) görebildiğiniz, Spotify temasına uygun olarak tasarlanmış modern bir web uygulamasıdır.

## 🚀 Özellikler

- **Spotify ile Bağlan:** PKCE Yetkilendirme (Authorization) Akışı kullanılarak güvenli giriş, arka uca (backend) ihtiyaç duymaz (Client Secret gizli kalır).
- **En Çok Dinlenen Sanatçılar & Şarkılar:** Kişiselleştirilmiş istatistiklerinizi tek bir yerden görebilme.
- **Zaman Aralıkları:** Dinleme alışkanlıklarınızı **Aylık (Kısa vadeli)**, **6 Aylık (Orta vadeli)** ve **Yıllık (Uzun vadeli)** olarak filtreleme.
- **Modern Tasarım:** Şık "Glassmorphism" kartlar, Spotify yeşili detayları ve premium animasyonlar.
- **Tamamen İstemci Taraflı (SPA):** Vanilla JS ve Vite kullanılarak yapılmış hızlı ve akıcı dolaşım imkanı sağlayan Hash-based Router yapısı.

## 🛠️ Teknolojiler

- Vanilla JavaScript (ES Modules)
- Vite
- Vanilla CSS (Özel Tasarım Sistemi)
- Spotify Web API (PKCE Code Flow)

## 🏃‍♂️ Kurulum ve Çalıştırma

### Ön Gereksinimler

Projenin kendi cihazınızda çalışabilmesi için bir **Spotify Client ID** almanız gerekir.

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)'a gidin ve giriş yapın.
2. Sağ üstten **"Create App"** butonuna tıklayarak yeni bir uygulama oluşturun.
3. Uygulamanızı açın ve **"Settings"** bölümüne girin.
4. **Redirect URIs** bölümüne `http://127.0.0.1:5173/callback` adresini ekleyin ve kaydedin.
5. Aynı sayfada yer alan **Client ID** değerini kopyalayın.

### Kurulum Adımları

1. Repoyu bilgisayarınıza indirin:

   ```bash
   git clone https://github.com/KULLANICI_ADIN/Statify.git
   cd Statify
   ```

2. Gerekli paketleri indirin (pnpm önerilir):

   ```bash
   pnpm install
   ```

3. Ana dizindeki `.env.example` dosyasının adını `.env` olarak değiştirin veya kopyalayın.

   ```bash
   cp .env.example .env
   ```

4. `.env` dosyasını açıp içine Spotify Dashboard'dan aldığınız **Client ID**'yi yapıştırın:

   ```env
   VITE_SPOTIFY_CLIENT_ID=buraya_client_id_gelecek
   ```

5. Geliştirme sunucusunu başlatın:

   ```bash
   pnpm run dev
   ```

6. Tarayıcınızda [http://127.0.0.1:5173](http://127.0.0.1:5173) adresine giderek uygulamayı kullanmaya başlayabilirsiniz.
   _(Spotify güvenlik kuralları gereği, localhost yerine 127.0.0.1 üzerinden çalışması zorunludur.)_

## 📦 Sunucuya Dağıtım (Deployment)

Proje statik dosyalardan oluştuğu için Vercel, Netlify veya GitHub Pages gibi platformlarda ücretsiz ve kolayca host edilebilir.

Dağıtım platformunda (örneğin Vercel) uygulamanızı kurarken:

1. Çevre değişkenleri (Environment Variables) kısmına `VITE_SPOTIFY_CLIENT_ID`'yi eklemeyi unutmayın.
2. Yayınlanan canlı sitenizin adresini (örn. `https://statify-deneme.vercel.app/callback`), Spotify Developer Dashboard'da **Redirect URIs** bölümüne eklemelisiniz.

## 📄 Lisans

Bu proje MIT lisansı altındadır. Daha fazla bilgi için [LICENSE](LICENSE) dosyasına göz atabilirsiniz.
