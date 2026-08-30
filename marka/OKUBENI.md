# Marka dosyaları

Bu klasör siteyle birlikte yayınlanmaz; yalnızca kaynak dosyaları saklar.
Sitede kullanılan vektörler `public/images/logo/` altındadır.

## Doküman

| Dosya | Ne |
| --- | --- |
| `Gonulden-Tatlar-Marka-Isareti.pdf` | Marka işareti dokümanı — A4, 6 sayfa |
| `Gonulden-Tatlar-Marka-Isareti.docx` | Aynı dokümanın Word sürümü |

## Sosyal medya görselleri (`png/`)

| Dosya | Kullanım |
| --- | --- |
| `profil-kakao-1080.png` | Instagram profil fotoğrafı — kakao zemin |
| `profil-krem-1080.png` | Instagram profil fotoğrafı — krem zemin |
| `isaret-kakao-seffaf-1024.png` | Şeffaf zeminli işaret, açık zeminler için |
| `isaret-krem-seffaf-1024.png` | Şeffaf zeminli işaret, koyu zeminler için |
| `yatay-logo-krem-2400.png` | Yatay logo, krem zemin |
| `yatay-logo-kakao-2400.png` | Yatay logo, kakao zemin |
| `yatay-logo-seffaf-2400.png` | Yatay logo, şeffaf zemin |

Profil görsellerinde işaret, kare kenarının %58'ini kaplar; Instagram daireye
kırptığında kesilmez.

## Baskı ve tabela

Vektör dosyalar `public/images/logo/` altında: `marka-isareti-kakao.svg`,
`marka-isareti-krem.svg`, `marka-isareti-tekrenk.svg`. Matbaaya ve tabelacıya
PNG değil, bu SVG'ler verilmelidir.

## Yeniden üretim

Görseller `scripts/` altındaki üreticilerle değil, elle hazırlanmış HTML'den
Chrome ile alınmıştır. İşaretin kaynağı `src/components/brand/Logo.tsx` içindeki
`LogoMark` bileşenidir; geometri değişirse SVG ve PNG'ler de yenilenmelidir.
