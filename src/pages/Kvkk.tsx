import { LegalBlock, LegalList, LegalPage } from '@/components/layout/LegalPage'
import { useCatalog } from '@/context/CatalogContext'
import { formatPhone } from '@/lib/format'
import { useSeo } from '@/lib/seo'

/**
 * KVKK aydınlatma metni.
 *
 * Metin sitenin gerçek veri akışını anlatır: form verisi hiçbir sunucuya
 * gönderilmez, ziyaretçinin tarayıcısında kalır ve yalnızca WhatsApp'a
 * aktarılır. Akış değişirse (form bir sunucuya bağlanırsa) bu metin de
 * güncellenmelidir.
 */
export default function Kvkk() {
  const { settings } = useCatalog()

  useSeo({
    title: 'KVKK Aydınlatma Metni | Gönülden Tatlar',
    description:
      'Gönülden Tatlar kişisel verilerin işlenmesine ilişkin aydınlatma metni: hangi veriler, hangi amaçla işlenir ve haklarınız.',
    path: '/kvkk',
  })

  return (
    <LegalPage
      eyebrow="KVKK"
      title="Kişisel Verilerin Korunması Aydınlatma Metni"
      intro="6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 10. maddesi uyarınca, sipariş ve iletişim sırasında verdiğin bilgilerin nasıl işlendiğini burada açıklıyoruz."
      updatedAt="3 Eylül 2026"
    >
      <LegalBlock title="1. Veri sorumlusu">
        <p>
          Kişisel verilerin, veri sorumlusu sıfatıyla {settings.name} tarafından aşağıda açıklanan
          kapsamda işlenmektedir.
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-cocoa-700">Adres:</strong> {settings.address}
            </>,
            <>
              <strong className="text-cocoa-700">Telefon:</strong> {formatPhone(settings.phone)}
            </>,
            <>
              <strong className="text-cocoa-700">WhatsApp:</strong> {formatPhone(settings.whatsapp)}
            </>,
          ]}
        />
      </LegalBlock>

      <LegalBlock title="2. İşlenen kişisel veriler">
        <p>Sipariş verirken ya da iletişim formunu doldururken yalnızca şu bilgiler alınır:</p>
        <LegalList
          items={[
            <>
              <strong className="text-cocoa-700">Kimlik:</strong> ad ve soyad
            </>,
            <>
              <strong className="text-cocoa-700">İletişim:</strong> telefon numarası
            </>,
            <>
              <strong className="text-cocoa-700">Teslimat:</strong> yalnızca paket servis seçilirse adres ve
              adres tarifi
            </>,
            <>
              <strong className="text-cocoa-700">Sipariş:</strong> seçilen ürünler, adetler ve varsa sipariş
              notu
            </>,
          ]}
        />
        <p>
          Kimlik numarası, doğum tarihi, e-posta ya da ödeme bilgisi istenmez. Sitede ödeme alınmaz;
          ücret teslimatta ya da mağazada tahsil edilir.
        </p>
      </LegalBlock>

      <LegalBlock title="3. Verilerin toplanma yöntemi">
        <p>
          Bu site tamamen statiktir; arka planda çalışan bir sunucu uygulaması yoktur. Formu
          doldurduğunda bilgiler <strong className="text-cocoa-700">bize doğrudan gönderilmez</strong>;
          yalnızca kendi cihazında, tarayıcının hafızasında tutulur ve içeriği hazır bir WhatsApp
          mesajına dönüştürülür. Veriler bize ancak sen WhatsApp'ta gönder tuşuna bastığında ulaşır.
          Göndermekten vazgeçersen hiçbir bilgi bize geçmez.
        </p>
      </LegalBlock>

      <LegalBlock title="4. İşleme amaçları ve hukuki sebep">
        <LegalList
          items={[
            'Siparişin alınması, hazırlanması ve teslim edilmesi',
            'Sipariş hakkında seninle iletişime geçilmesi',
            'Talep ve şikâyetlerin karşılanması',
            'İlgili mevzuattan doğan yükümlülüklerin yerine getirilmesi',
          ]}
        />
        <p>
          Bu işleme, KVKK m.5/2-c uyarınca bir sözleşmenin kurulması ve ifasıyla doğrudan ilgili olması,
          m.5/2-ç uyarınca hukuki yükümlülüğün yerine getirilmesi ve m.5/2-f uyarınca meşru menfaat
          hukuki sebeplerine dayanır.
        </p>
      </LegalBlock>

      <LegalBlock title="5. Verilerin aktarılması">
        <p>
          Verilerin pazarlama amacıyla üçüncü kişilere satılmaz veya devredilmez. Hizmetin işleyişi
          gereği şu aktarımlar gerçekleşir:
        </p>
        <LegalList
          items={[
            <>
              <strong className="text-cocoa-700">WhatsApp (Meta):</strong> sipariş mesajını ilettiğin
              platform. Mesaj içeriği ve telefon numaran Meta'nın sunucuları üzerinden geçer ve yurt
              dışında işlenir.
            </>,
            <>
              <strong className="text-cocoa-700">GitHub Pages (Microsoft):</strong> sitenin barındırıldığı
              hizmet. Siteyi ziyaret ettiğinde IP adresin ve tarayıcı bilgin barındırıcının sunucu
              kayıtlarına düşer; bu kayıtlara bizim erişimimiz yoktur.
            </>,
            <>
              <strong className="text-cocoa-700">Google Fonts:</strong> sitedeki yazı tipleri Google
              sunucularından yüklenir; bu sırada IP adresin Google'a iletilir.
            </>,
          ]}
        />
        <p>
          Bu hizmetlerin tamamı yurt dışında bulunduğundan aktarım KVKK m.9 kapsamındadır. Siteyi
          kullanman bu aktarımların gerçekleşmesi anlamına gelir.
        </p>
      </LegalBlock>

      <LegalBlock title="6. Saklama süresi">
        <p>
          Formda girdiğin bilgiler yalnızca kendi tarayıcında saklanır; tarayıcı verilerini temizlediğinde
          ya da farklı bir cihaz kullandığında kaybolur. Bize WhatsApp üzerinden ulaşan sipariş
          mesajları, siparişin tamamlanmasının ardından ilgili mevzuatta öngörülen süre boyunca saklanır,
          sürenin sonunda silinir.
        </p>
      </LegalBlock>

      <LegalBlock title="7. Haklarınız">
        <p>KVKK m.11 uyarınca veri sorumlusuna başvurarak şu haklara sahipsin:</p>
        <LegalList
          items={[
            'Kişisel verinin işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme',
            'İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme',
            'Yurt içinde veya yurt dışında verilerin aktarıldığı üçüncü kişileri bilme',
            'Eksik veya yanlış işlenmişse düzeltilmesini isteme',
            'Şartları oluştuğunda silinmesini veya yok edilmesini isteme',
            'Düzeltme, silme ve yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme',
            'İşlenen verilerin münhasıran otomatik sistemlerle analiz edilmesi suretiyle aleyhine bir sonucun ortaya çıkmasına itiraz etme',
            'Kanuna aykırı işleme sebebiyle zarara uğraman hâlinde zararın giderilmesini talep etme',
          ]}
        />
      </LegalBlock>

      <LegalBlock title="8. Başvuru">
        <p>
          Taleplerini {formatPhone(settings.phone)} numaralı telefondan, WhatsApp hattımızdan ya da{' '}
          {settings.address} adresine yazılı olarak iletebilirsin. Başvurun en geç otuz gün içinde
          sonuçlandırılır.
        </p>
      </LegalBlock>
    </LegalPage>
  )
}
