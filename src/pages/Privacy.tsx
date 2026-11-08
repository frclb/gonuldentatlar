import { Link } from 'react-router-dom'
import { LegalBlock, LegalList, LegalPage } from '@/components/layout/LegalPage'
import { useCatalog } from '@/context/CatalogContext'
import { analyticsEnabled, openConsentSettings } from '@/lib/analytics'
import { formatPhone } from '@/lib/format'
import { useSeo } from '@/lib/seo'

/**
 * Gizlilik ve çerez politikası.
 *
 * Site tarayıcı deposunu (localStorage) kullanır; Google Analytics ölçüm kimliği
 * tanımlıysa ziyaretçi onay verdiğinde Analytics çerezleri de yazılır. Metin bu iki
 * durumu ayrı ayrı anlatır. Yeni bir anahtar eklenirse buradaki liste de güncellenmelidir.
 */
export default function Privacy() {
  const { settings } = useCatalog()

  useSeo({
    title: 'Gizlilik ve Çerez Politikası | Gönülden Tatlar',
    description:
      'Gönülden Tatlar sitesinde hangi bilgiler tarayıcında saklanır, hangi dış hizmetler kullanılır ve bunları nasıl silersin.',
    path: '/gizlilik',
  })

  return (
    <LegalPage
      eyebrow="Gizlilik"
      title="Gizlilik ve Çerez Politikası"
      intro="Bu sitede hangi bilgilerin saklandığını, nerede durduğunu ve nasıl silebileceğini sade bir dille anlatıyoruz."
      updatedAt={analyticsEnabled ? '9 Kasım 2026' : '3 Eylül 2026'}
    >
      <LegalBlock title="Kısaca">
        <p>
          Bu site tamamen statiktir: arka planda bir sunucu uygulaması, veritabanı ya da üyelik sistemi
          yoktur. Sepetin, favorilerin ve sipariş formuna yazdıkların{' '}
          <strong className="text-cocoa-700">yalnızca kendi tarayıcında</strong> durur. Bize ulaşan tek
          şey, sen gönder tuşuna bastığında WhatsApp'a düşen sipariş mesajıdır.
          {analyticsEnabled &&
            ' Onay verirsen, siteyi nasıl kullandığın Google Analytics ile isimsiz olarak sayılır.'}
        </p>
      </LegalBlock>

      {analyticsEnabled ? (
        <LegalBlock title="Çerez kullanıyor muyuz?">
          <p>
            Yalnızca sen izin verirsen. Siteye ilk girdiğinde çıkan bantta{' '}
            <strong className="text-cocoa-700">Kabul et</strong> dersen Google Analytics yüklenir ve
            ziyaretini ölçmek için şu çerezleri yazar:
          </p>
          <LegalList
            items={[
              <>
                <strong className="text-cocoa-700">_ga</strong> ve{' '}
                <strong className="text-cocoa-700">_ga_&lt;kimlik&gt;</strong> — aynı tarayıcıdan gelen
                ziyaretleri birbirinden ayırmak için rastgele bir numara; en fazla 2 yıl saklanır.
              </>,
            ]}
          />
          <p>
            Ölçülenler: hangi sayfaları gezdiğin, ne kadar kaldığın, hangi butonlara (WhatsApp, Instagram,
            konum) tıkladığın, sepete ekleme ve sipariş adımları, yaklaşık konum (şehir düzeyinde) ve cihaz
            türü. Adın, telefonun, adresin ya da sipariş notun Analytics'e gönderilmez. Bu veriler yalnızca
            siteyi ve menüyü geliştirmek için kullanılır; reklam amaçlı kullanılmaz.
          </p>
          <p>
            <strong className="text-cocoa-700">Reddet</strong> dersen Google'a hiçbir istek gitmez ve
            site aynı şekilde çalışır. Kararını istediğin zaman değiştirebilirsin:{' '}
            <button
              type="button"
              onClick={openConsentSettings}
              className="font-semibold text-cocoa-700 underline underline-offset-4 hover:text-cocoa-800"
            >
              Çerez tercihini değiştir
            </button>
            . Onayını geri çektiğinde Analytics çerezleri silinir.
          </p>
        </LegalBlock>
      ) : (
        <LegalBlock title="Çerez kullanıyor muyuz?">
          <p>
            Hayır. Site reklam, ölçümleme ya da takip çerezi kullanmaz; üçüncü taraf bir analiz aracı
            bağlı değildir. Bunun yerine tarayıcının kendi deposu (localStorage) kullanılır. Buradaki
            bilgiler bize gönderilmez, başka sitelerden okunamaz ve seni siteler arasında izlemek için
            kullanılmaz.
          </p>
        </LegalBlock>
      )}

      <LegalBlock title="Tarayıcında neler saklanıyor?">
        <LegalList
          items={[
            <>
              <strong className="text-cocoa-700">gt:cart</strong> — sepetindeki ürünler, adetler ve
              seçenekler
            </>,
            <>
              <strong className="text-cocoa-700">gt:favorites</strong> — kalp işaretiyle işaretlediğin
              ürünler
            </>,
            <>
              <strong className="text-cocoa-700">gt:catalog</strong> — menü, kategoriler, işletme
              ayarları ve bu tarayıcıda oluşturduğun sipariş kayıtları
            </>,
            ...(analyticsEnabled
              ? [
                  <>
                    <strong className="text-cocoa-700">gt:analytics-consent</strong> — çerez bandında
                    verdiğin karar (kabul ya da ret) ve tarihi
                  </>,
                ]
              : []),
          ]}
        />
        <p>
          Bu bilgiler süresizdir; sen silene kadar cihazında kalır. Tarayıcı ayarlarından site verilerini
          temizleyerek ya da gizli sekmede gezerek istediğin an kaldırabilirsin. Silmen sitenin
          çalışmasını engellemez, yalnızca sepetin ve favorilerin sıfırlanır.
        </p>
      </LegalBlock>

      <LegalBlock title="Dışarıya giden istekler">
        <p>Sayfayı açtığında şu hizmetlere istek gider:</p>
        <LegalList
          items={[
            <>
              <strong className="text-cocoa-700">GitHub Pages:</strong> sitenin barındırıldığı yer. IP
              adresin ve tarayıcı bilgin barındırıcının sunucu kayıtlarına düşer; bu kayıtlara bizim
              erişimimiz yok.
            </>,
            <>
              <strong className="text-cocoa-700">Google Fonts:</strong> sitedeki yazı tipleri buradan
              yüklenir, bu sırada IP adresin Google'a iletilir.
            </>,
            <>
              <strong className="text-cocoa-700">WhatsApp (Meta):</strong> yalnızca sipariş ya da iletişim
              butonuna bastığında açılır. Mesajı göndermediğin sürece bilgilerin bize ulaşmaz.
            </>,
            <>
              <strong className="text-cocoa-700">Instagram (Meta):</strong> yalnızca Instagram bağlantısına
              tıkladığında açılır. Sayfaya gömülü bir Instagram içeriği yoktur.
            </>,
            ...(analyticsEnabled
              ? [
                  <>
                    <strong className="text-cocoa-700">Google Analytics:</strong> yalnızca çerez bandında
                    onay verdiysen yüklenir; gezinme ve tıklama bilgileri Google'a gönderilir. Google, IP
                    adresini yaklaşık konumu bulmak için kullanır, Analytics'te saklamaz.
                  </>,
                ]
              : []),
          ]}
        />
      </LegalBlock>

      <LegalBlock title="Ödeme ve kart bilgileri">
        <p>
          Sitede ödeme alınmaz. Kart numarası, banka bilgisi veya benzeri bir finansal veri hiçbir
          aşamada istenmez ve saklanmaz. Ücret, teslimat sırasında ya da mağazada tahsil edilir.
        </p>
      </LegalBlock>

      <LegalBlock title="Çocukların gizliliği">
        <p>
          Site çocuklara yönelik değildir ve bilerek çocuklardan kişisel veri toplamaz. Böyle bir verinin
          iletildiğini fark edersek sileriz.
        </p>
      </LegalBlock>

      <LegalBlock title="Kişisel verilerin işlenmesi">
        <p>
          Ad, telefon ve adres bilgilerinin hangi amaçla işlendiği, kimlere aktarıldığı ve KVKK kapsamındaki
          haklarına dair ayrıntılar için{' '}
          <Link to="/kvkk" className="font-semibold text-cocoa-700 underline underline-offset-4 hover:text-cocoa-800">
            KVKK Aydınlatma Metni
          </Link>{' '}
          sayfasına bakabilirsin.
        </p>
      </LegalBlock>

      <LegalBlock title="Değişiklikler ve iletişim">
        <p>
          Bu politika gerektiğinde güncellenir; sayfanın başındaki tarih son güncellemeyi gösterir.
          Soruların için {formatPhone(settings.phone)} numarasından, WhatsApp hattımızdan ya da{' '}
          <a href={`mailto:${settings.email}`} className="underline underline-offset-2 hover:text-cocoa-700">
            {settings.email}
          </a>{' '}
          adresinden bize ulaşabilirsin.
        </p>
      </LegalBlock>
    </LegalPage>
  )
}
