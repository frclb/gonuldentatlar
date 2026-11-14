# Gemini görsel komutları

Bütün magnolyaları sitedeki yeni Çilekli Magnolya görselinin tarzında üretmek için.

## Nasıl çalışıyoruz

Gemini bir görseli düzenlerken **ilk görselin kabını, ışığını ve katman düzenini korur**; metinle düzen değiştirmeye ise direnir. Bu yüzden her ürünü bitmiş, beğenilmiş bir görselden türetiyoruz ve yalnızca değişen malzemeyi söylüyoruz.

Ürünler sitedeki düzenlerine göre üç gruba ayrılıyor:

| Grup | Düzen | Temel görsel | Ürün |
|---|---|---|---|
| A | Kap duvarına dayalı dik meyve dilimleri | Çilekli Magnolya (hazır) | 15 |
| B | Yatay katmanlar (çikolata, Oreo, Lotus, ceviz, balkabağı) | Grubun ilk ürünü önce özenle yapılacak | 7 |
| C | Küp meyveli Cup serisi | Grubun ilk ürünü önce özenle yapılacak | 3 |

## A grubu adımları

Her ürün dört turda çıkar; her tur **yeni sohbette** yapılır ve sonuç **indirme düğmesiyle** indirilir (ekran görüntüsü ya da kopyala-yapıştır kaliteyi düşürür).

1. **Kupa:** `yeni-gorseller/temel-kupa.jpg` + ürünün metni.
2. **Kupayı netleştir:** 1. turun sonucu + aşağıdaki netleştirme metni.
3. **Kavanoz:** önce `yeni-gorseller/temel-kavanoz.png`, sonra 2. turdaki net kupa (iki görsel birlikte) + aşağıdaki kavanoz metni + ürünün "Change only this" maddeleri.
4. **Kavanozu netleştir:** 3. turun sonucu + netleştirme metni (`container and lid` yerine `glass jar with no lid`).

İndirmeden önce bak: kap ve ışık aynı mı, meyveler alttaki bisküviye değiyor mu, meyve sırasının üstündeki ince bisküvi bandı duruyor mu, meyveler birbirine değmiyor mu, tepedeki süs net mi. Kap ya da ışık kaymaya başlarsa yeni sohbet aç.

Muzlu'da öğrendiklerimiz:

- Çapraz kesilmiş uzun oval muz boyanmış gibi duruyor. Kabın duvarına yapışık **yuvarlak dilim** hem gerçekçi hem de doğru boyda çıkıyor: muz çapı çilek yarımının boyuna yakın.
- Gemini'nin ilk çıktısı çoğu zaman yumuşak çıkıyor; Çilekli'den yaklaşık dört kat az keskin (bisküvi ve taban da dahil). Netleştirme turu bunu Çilekli düzeyine getiriyor ve kap, katmanlar yerinde kalıyor. Aynı görseli üçüncü kez Gemini'den geçirme: arka planda bloklanma başlıyor.
- 2026-10-30'dan beri temel görseller açık mermer zeminde (eski ahşap zeminliler `yeni-gorseller/eski/*-ahsap.*`).
- Netleştirme turu bazen hiçbir şey değiştirmiyor (Gemini görseli aynen geri veriyor). O zaman Gemini sonucuna hafif keskinleştirme (PIL `UnsharpMask`, radius 1.2, kupada percent 100, kavanozda 60) uygulanıp netlik Çilekli'ye denk getiriliyor.
- Kavanozda tek görselle iki denemede de meyvelerin üstündeki bisküvi bandı silindi ve dilimler birbirine değdi. Net kupayı ikinci görsel olarak verince Gemini düzeni oradan aldı.
- Kupada muzun görünüşü için ikinci görsel vermek işe yaramadı: Gemini o görseldeki dizilimi de kopyaladı. Dilimleri Çilekli'deki gibi ayrık ve araları krema dolu yapmak için tek görselle "yalnızca çilekleri değiştir" diye yazmak, dilimi çilekten biraz dar istemek ve aradaki dikey krema şeritlerini açıkça tarif etmek gerekti.

- Ürün sitedeki orijinalle aynı olmalı. En sadık sonuç için ikinci görsel olarak orijinal verilir (`git show f36d10b^:public/images/products/<slug>.webp`). Yalnızca metinle Gemini kremayı, kırıkları ve süsü kendine göre değiştiriyor. Çilekli Çikolatalı böyle yapıldı:

```text
Edit the first photo. Keep from it only the container, its size, position and camera angle, the marble countertop, background and light. Same image size as the first photo, no text. Change the dessert inside so it is the same dessert as in the second photo, with the same layers from top to bottom and the same topping. Crisp, in perfect focus, photorealistic.
```

- Kırıklar tek tip tane olmamalı: olabildiğince ince, karışık boyutlu. "Ezilmiş bisküvi" yazınca Gemini iri parça ekliyor. İşe yarayan tarif, görselin üstünden ayrı bir turda:

```text
Edit this photo. Change only the texture of the biscuit crumbs; do not change anything else. Each crumb layer keeps exactly the same shape, height and position and stays completely full and dense. Replace them with very finely ground tea biscuit crumbs in a warm pale golden beige, like coarse sand: most of the layer is very fine sandy crumbs and biscuit powder, naturally mixed with tiny irregular bits of slightly different sizes. The largest bit is only about the size of a strawberry seed; no big chunks, no flakes, no sticks, no round beads, no pattern. Dense, matte, dry and natural.
```

- Oreo'da aynı tarif parlak siyah çakıl gibi tek tip çıktı. Üç ek tur gerekti: önce "real crushed Oreo: soft, matte, fine cocoa cookie powder, mixed with irregular bits", sonra iri parçaları küçült ("about three quarters is very fine powder and sandy crumbs, none bigger than a strawberry seed"), en son yalnızca rengi koyulaştır ("deep, almost black, matte, a few very tiny specks of white cream"). İnceltme turu rengi kahverengiye çekiyor, son tur bunun için.

- 2026-11-07'den beri krema beyaz, kırıklar ince ve karışık (temel görseller de öyle; sarı kremalılar `yeni-gorseller/eski/*-sari-krema.*`). Referans görsel vermek bu değişikliği yaptırmıyor: Gemini neredeyse hiçbir şeyi değiştirmedi. Tek görsel ve açık tarif işe yarıyor, kaynak olarak en net görsel verilmeli:

```text
Edit this photo. Change only the crumb texture and the cream color; do not change anything else. The container, lid, clear foot, size, position, camera angle, marble countertop, background, light and the fruit stay exactly as they are, sharp and detailed. Every layer keeps exactly the same shape, height and position. Important: the crumb patches between the fruit at the top of the fruit row stay exactly where they are and stay crumbs, and below them the same cream strips remain; do not replace crumbs with cream. Same image size, no text. (1) The cream now looks yellow, which is wrong. Make all the cream a clean, soft, pure white milk cream, with no yellow tint. (2) The crumbs now look like coarse granules, which is wrong. Crush them much finer: very finely ground tea biscuit crumbs in a warm pale golden beige, like coarse sand: most of it is very fine sandy crumbs and biscuit powder, naturally mixed with tiny irregular bits of slightly different sizes. No big chunks, no granules, no flakes, no round beads, no pattern. Each crumb layer stays full and dense, matte, dry and natural. Crisp, in perfect focus, photorealistic.
```

Kırık türü için ikinci maddedeki tanım değişir. Oreo'da hazır beyaz kremalı görselden tek turda şu tarif tuttu: "real crushed Oreo cookies, crushed very fine, in a deep, almost black dark cocoa color, matte and not glossy: about three quarters of each layer is very fine cookie powder and sandy crumbs, mixed with small irregular bits of different sizes, none bigger than a strawberry seed, and a few very tiny specks of white cream filling. No gravel, no beads, no big chunks." Muz yuvarlak dilim kalır. Gemini kısa süreli kullanım sınırı koyabiliyor; birkaç dakika beklemek yetiyor.

### Netleştirme metni
```text
Edit this photo. Keep everything exactly the same: the same container and lid, size, position, camera angle, marble countertop, background, light, the same layers and the same size, shape, position and color of every fruit piece, crumb band and cream. Only make the photo sharper and more detailed, like a crisp high-resolution food photo taken with a macro lens in perfect focus: the fruit gets crisp clean edges, fine natural texture and a slightly moist sheen; every biscuit crumb is sharp and distinct; the cream looks smooth but in focus; the background wall is smooth and clean. Keep it subtle and photorealistic, no oversharpening, no new objects. Same image size, no text.
```

### Kavanoz metni
İlk görsel temel kavanoz, ikinci görsel ürünün net kupası. Bu metnin sonuna ürünün "Change only this" maddeleri eklenir.
```text
Edit the first photo (the glass jar). Keep everything in it exactly the same: the same glass jar with no lid, size, position and camera angle, the same marble countertop, background and light, the same layer heights. Same image size as the first photo, no text. Change only the dessert inside, so it matches the dessert in the second photo: the same crumbs, cream, sauces and fruit, looking exactly like in the second photo, arranged like in the second photo: a thin band of crumbs runs across the top of the fruit row directly under the cream layer; the fruit pieces stand clearly apart from each other with their bottom edges on the base; between every two neighbouring pieces there is a wide vertical strip of smooth vanilla cream running from the base up to the crumb band, with only a small crumb patch at the very top of each gap, exactly like in the second photo. The cream is one smooth continuous filling, not separate lumps or drops. The topping is like in the second photo.
```

## A grubu

Her bloğun tamamı tek seferde kopyalanır. Gemini'ye yazarken satır sonları boşlukla birleştirilir (Enter mesajı gönderir).

### 2. Muzlu Magnolya · `muzlu-magnolya`
```text
Edit this photo. Replace only the red strawberry halves; do not change anything else. The vanilla cream and the biscuit crumbs between the strawberries must stay exactly as they are now, and the container, lid, table, background, light and all layers stay exactly the same. Same image size, no text.
- Each strawberry half on the wall becomes one fresh round banana slice, about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle, pale creamy ivory-yellow, slightly translucent and moist, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the very center, crisp edges, sharp focus.
- Each banana slice is a little narrower than the strawberry it replaces and sits in its place with its bottom edge on the biscuit base, so the slices stand clearly apart from each other.
- Between every two neighbouring slices there is a wide vertical strip of smooth ivory vanilla cream, about as wide as the cream strips between the strawberries now, running from the biscuit base up to the thin crumb band at the top of the fruit row. The crumbs stay only in that thin band and in the small crumb patch at the very top of each gap, exactly as now. The cream is one smooth continuous filling, not separate white lumps, balls or drops. Any space left above a slice is filled with the same smooth cream.
- On top, replace the whole strawberry with two round banana slices lying flat on the crumbs, slightly overlapping.
```

### 4. Çilekli Muzlu Çikolatalı Magnolya · `cilekli-muzlu-cikolatali-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Replace the plain cream band directly under the top crumbs with a glossy dark chocolate sauce layer of the same height.
- Replace every second strawberry half with a fresh round banana slice (about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle a little narrower than the strawberry, pale creamy ivory-yellow, slightly translucent, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the center; its bottom edge on the base), so strawberry and banana alternate.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, next to the whole strawberry, add one round banana slice and a small square piece of dark chocolate.
```

### 8. Çilekli Red Velvet Magnolya · `cilekli-red-velvet-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs deep red velvet cake crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the strawberries and the base. Same fine texture, same layer heights.
```

### 9. Çilekli Muzlu Magnolya · `cilekli-muzlu-magnolya`
Temel kupadan "her ikinci çileği muza çevir" üç denemede de bisküvi bandını ya da krema şeritlerini bozdu. İşe yarayan ters yol: kremalı Muzlu kupadan (`yeni-gorseller/deneme/muzlu-acik-mermer-2.jpg`, keskinleştirilmemiş hâli) başlayıp sağdaki iki muzu çileğe çevirmek. Kavanoz, temel kavanoz ile bu kupa birlikte verilerek kavanoz metniyle yapıldı.
```text
Edit this photo. On the front wall there are four banana slices: a half-hidden one at the left edge, two whole ones in the middle, and a half-hidden one at the right edge. Replace only two of them with strawberry halves: the RIGHT one of the two whole middle slices, and the half-hidden slice at the RIGHT edge. From left to right the wall must read: half banana (left edge), whole banana, whole strawberry, half strawberry (right edge). Do not change anything else: the thin band of biscuit crumbs across the top of the fruit row, the crumb patches at the top of each gap, the vertical vanilla cream strips between the fruit, the container, lid, marble countertop, background, light and all layers stay exactly as they are now. Same image size, no text.
Each new strawberry half is cut lengthwise and pressed flat against the plastic with its cut face showing: a red teardrop shape, pointed end up, pale centre, fine white fibers radiating from the core, tiny seeds along the red edge, juicy and glossy, crisp edges, sharp focus; it stands where the banana slice was, about as wide as it and a little taller, its wide bottom on the biscuit base and its tip just under the thin crumb band, with the cream strips on both sides still visible.
On top, replace the back banana slice with one whole fresh strawberry with its green leaves, next to the remaining banana slice.
```

### 10. Çilekli Çikolatalı Magnolya · `cilekli-cikolatali-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Replace the plain cream band directly under the top crumbs with a glossy dark chocolate sauce layer of the same height.
- On top, add a small square piece of dark chocolate next to the whole strawberry.
```

### 11. Muzlu Çikolatalı Magnolya · `muzlu-cikolatali-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Replace the plain cream band directly under the top crumbs with a glossy dark chocolate sauce layer of the same height.
- Replace each strawberry half on the wall with a fresh round banana slice, about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle, pale creamy ivory-yellow, slightly translucent and moist, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the very center, crisp edges. Each slice is a little narrower than the strawberry it replaces and sits in its place with its bottom edge on the base, so the slices stand clearly apart.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, replace the whole strawberry with one round banana slice and a small square piece of dark chocolate.
```

### 12. Kakaolu Bisküvili Çilekli Magnolya · `kakaolu-biskuvili-cilekli-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs dark brown cocoa biscuit crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the strawberries and the base. Same fine texture, same layer heights.
```

### 13. Kakaolu Bisküvili Muzlu Magnolya · `kakaolu-biskuvili-muzlu-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs dark brown cocoa biscuit crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the fruit pieces and the base. Same fine texture, same layer heights.
- Replace each strawberry half on the wall with a fresh round banana slice, about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle, pale creamy ivory-yellow, slightly translucent and moist, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the very center, crisp edges. Each slice is a little narrower than the strawberry it replaces and sits in its place with its bottom edge on the base, so the slices stand clearly apart.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, replace the whole strawberry with two round banana slices lying flat on the crumbs, slightly overlapping.
```

### 14. Kakaolu Bisküvili Çilekli Muzlu Magnolya · `kakaolu-biskuvili-cilekli-muzlu-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs dark brown cocoa biscuit crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the fruit pieces and the base. Same fine texture, same layer heights.
- Replace every second strawberry half with a fresh round banana slice (about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle a little narrower than the strawberry, pale creamy ivory-yellow, slightly translucent, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the center; its bottom edge on the base), so strawberry and banana alternate.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, add one round banana slice lying flat next to the whole strawberry.
```

### 16. Kakaolu Bisküvili Çilekli Çikolatalı Magnolya · `kakaolu-biskuvili-cilekli-cikolatali-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs dark brown cocoa biscuit crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the strawberries and the base. Same fine texture, same layer heights.
- Replace the plain cream band directly under the top crumbs with a glossy dark chocolate sauce layer of the same height.
- On top, add a small square piece of dark chocolate next to the whole strawberry.
```

### 17. Kakaolu Bisküvili Muzlu Çikolatalı Magnolya · `kakaolu-biskuvili-muzlu-cikolatali-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs dark brown cocoa biscuit crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the fruit pieces and the base. Same fine texture, same layer heights.
- Replace the plain cream band directly under the top crumbs with a glossy dark chocolate sauce layer of the same height.
- Replace each strawberry half on the wall with a fresh round banana slice, about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle, pale creamy ivory-yellow, slightly translucent and moist, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the very center, crisp edges. Each slice is a little narrower than the strawberry it replaces and sits in its place with its bottom edge on the base, so the slices stand clearly apart.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, replace the whole strawberry with one round banana slice and a small square piece of dark chocolate.
```

### 18. Kakaolu Bisküvili Çilekli Muzlu Çikolatalı Magnolya · `kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs dark brown cocoa biscuit crumbs instead of tea biscuit crumbs: the thick top layer, the thin band between the fruit pieces and the base. Same fine texture, same layer heights.
- Replace the plain cream band directly under the top crumbs with a glossy dark chocolate sauce layer of the same height.
- Replace every second strawberry half with a fresh round banana slice (about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle a little narrower than the strawberry, pale creamy ivory-yellow, slightly translucent, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the center; its bottom edge on the base), so strawberry and banana alternate.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, next to the whole strawberry, add one round banana slice and a small square piece of dark chocolate.
```

### 19. Oreolu Çilekli Magnolya · `oreolu-cilekli-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs finely crushed Oreo cookie crumbs (almost black, with tiny white cream specks) instead of tea biscuit crumbs: the thick top layer, the thin band between the strawberries and the base. Same layer heights.
```

### 20. Oreolu Muzlu Magnolya · `oreolu-muzlu-magnolya`
```text
Edit this photo. Keep everything else exactly the same: the same container (and its lid, if it has one), size, position and camera angle, the same marble countertop, background and light, the same layer heights, and the same arrangement and spacing of the fruit pieces. Keep the same photorealistic food style: fine sandy crumbs, smooth ivory vanilla cream, fresh fruit with natural depth and texture. Same image size, no text.
Change only this:
- Make all the crumbs finely crushed Oreo cookie crumbs (almost black, with tiny white cream specks) instead of tea biscuit crumbs: the thick top layer, the thin band between the fruit pieces and the base. Same layer heights.
- Replace each strawberry half on the wall with a fresh round banana slice, about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle, pale creamy ivory-yellow, slightly translucent and moist, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the very center, crisp edges. Each slice is a little narrower than the strawberry it replaces and sits in its place with its bottom edge on the base, so the slices stand clearly apart.
- The cream and crumbs between the fruit pieces stay exactly as between the strawberries now: between every two neighbouring pieces a wide vertical strip of smooth vanilla cream runs from the base up to the thin crumb band at the top of the fruit row, with only a small crumb patch at the very top of each gap. The cream is one smooth continuous filling, not separate lumps or drops. The pieces must not touch each other.
- On top, replace the whole strawberry with two round banana slices lying flat on the crumbs, slightly overlapping.
```

## Kalan ürünler: sitedeki orijinalden türetme (2026-11-11)

Eski görseli duran ürünlerde tarif zaten sitedeki görselde; tatlı oradan alınır, kap, zemin ve ışık temel görselden. Her tur **yeni sohbette** ve + menüsünden **Görüntü oluştur** seçilerek yapılır. Bu seçilmezse Gemini bazen "yalnızca bir dil modeliyim" deyip görsel üretmiyor. Ücretsiz hesapta yaklaşık 15 görselden sonra birkaç saatlik sınır geliyor.

1. **Kupa:** 1. görsel `yeni-gorseller/temel-kupa.jpg`, 2. görsel sitedeki orijinal kupa (webp, png'ye çevrilerek) + kupa metni.
2. **İnce kırık:** 1. turun sonucu + kırık metni. Gemini kırıkları orijinaldeki gibi boncuk taneli kopyalıyor; bu tur onları kumsu yapıyor.
3. **Yuvarlak muz (muzlularda):** 2. turun sonucu + muz metni. Orijinallerde muz uzun oval; yenilenen ürünlerde yuvarlak dilim.
4. **Kavanoz:** 1. görsel `yeni-gorseller/temel-kavanoz.png`, 2. görsel son kupa + kavanoz metni.

Site karesi: kupa `python3 instagram/sablon/site-kare.py <kupa.jpg> <slug>.webp 0.94559 -126.54 219.32`, kavanoz `... <slug>-kavanoz.webp 0.930909 0 0`.

Kupa metni (kakaolularda `The biscuit crumbs` yerine `The cocoa biscuit crumbs`):
```text
Edit the first photo. Keep from it only the container and its lid, its size, position and camera angle, the marble countertop, background and light. Same image size as the first photo, no text. Change the dessert inside so it is the same dessert as in the second photo, with the same layers from top to bottom, the same fruit pieces in the same arrangement and the same topping. The cream is a clean, soft, pure white milk cream with no yellow tint. The biscuit crumbs are very finely ground, like coarse sand: mostly fine sandy crumbs and biscuit powder with tiny irregular bits of slightly different sizes, none bigger than a strawberry seed; each crumb layer stays full and dense. Crisp, in perfect focus, photorealistic.
```

Kırık metni (kakaolularda renk `in a rich medium-dark cocoa brown`, malzeme `cocoa biscuit crumbs ... cocoa biscuit powder`):
```text
Edit this photo. Change only the crumb texture; do not change anything else. The container, lid, clear foot, size, position, camera angle, marble countertop, background, light, the white cream, the chocolate sauce, the fruit and the topping stay exactly as they are, sharp and detailed. Every layer keeps exactly the same shape, height and position. Same image size, no text. The crumbs now look like round granules or beads, which is wrong. Crush them much finer: very finely ground tea biscuit crumbs in a warm pale golden beige, like coarse sand: most of it is very fine sandy crumbs and biscuit powder, naturally mixed with tiny irregular bits of slightly different sizes. The largest bit is only about the size of a strawberry seed. No big chunks, no granules, no flakes, no round beads, no pattern. Each crumb layer stays full and dense, matte, dry and natural. Crisp, in perfect focus, photorealistic.
```

Muz metni (çilekli muzlularda "the strawberry halves" korunanlara eklenir, sona "so strawberry and banana still alternate"). İlk denemede "about as wide as the oval piece" yazınca dilimler birbirine değdi; "a little narrower" ve krema şeridi tarifiyle düzeldi:
```text
Edit this photo. Change only the banana pieces on the front wall; do not change anything else. The container, lid, clear foot, size, position, camera angle, marble countertop, background, light, the crumbs, the white cream above the fruit row, the chocolate sauce and the topping stay exactly as they are, sharp and detailed. Same image size, no text. Each tall oval banana piece on the wall becomes one fresh round banana slice, about 1 cm thick, pressed flat against the wall so its cut face shows: a natural, slightly irregular circle, pale creamy ivory-yellow, slightly translucent and moist, with a faint darker ring just inside its edge and a small soft star of tiny dark brown seeds in the very center, crisp edges, sharp focus. Each round slice is a little narrower than the oval piece it replaces and stands in its place with its bottom edge on the crumb base. The slices must not touch each other: between every two neighbouring slices there is a wide vertical strip of smooth white cream running from the crumb base up to the cream above the fruit row, with a small patch of fine crumbs at the top of each gap, like between the oval pieces now. The cream is one smooth continuous filling, not separate lumps, balls or drops. Crisp, in perfect focus, photorealistic.
```

Kavanoz metni:
```text
Edit the first photo (the glass jar). Keep everything in it exactly the same: the same glass jar with no lid, size, position and camera angle, the same marble countertop, background and light. Same image size as the first photo, no text. Change only the dessert inside, so it is the same dessert as in the second photo: the same layers from top to bottom in the same order and proportions, the same very fine sandy biscuit crumbs, pure white cream, glossy chocolate sauce and fruit, looking exactly like in the second photo, and the same topping. The fruit pieces against the glass are arranged like in the second photo: they stand clearly apart with their bottom edges on the crumb base, and between every two neighbouring pieces there is a vertical strip of smooth white cream with a small crumb patch at its top. The cream is one smooth continuous filling, not separate lumps or drops. Crisp, in perfect focus, photorealistic.
```

Ek bulgular:

- Muzlularda kırık ve yuvarlak muz tek turda istenebilir: "Change only two things: the crumb texture and the banana pieces on the front wall", ardından (1) kırık, (2) muz maddeleri. İlk tura (kupa) eklenen muz/kırık istekleri ise dikkate alınmıyor.
- Gemini bazen görsel modunda bile "yalnızca bir dil modeliyim" diyor. "Yeniden yap" düğmesi bir menü açar; oradaki **Tekrar dene** genelde görseli üretir.
- Kakaolu kavanozda üst katman çikolata talaşına dönebiliyor ve süs ikiye katlanabiliyor. Kavanoz metninde üst katmanı ("the same very fine sandy cocoa biscuit crumbs ..., not chocolate shavings or curls") ve süsü ("only one small square piece of dark chocolate and ...") açıkça yazmak düzeltti.
- Yatay katmanlılarda (B) kavanoz metni katmanları sırayla sayar ve "There is no fruit." der. Çikolatalı'da ilk turun kırıkları zaten ince çıktı, kırık turu gerekmedi. Oreolu'da kırık turu Oreo tarifiyle yapıldı.
- Kırık turu kupa görselini de netleştiriyor.

- Yatay katmanlılarda ve Cup serisinde en güvenli yol katmanları komutta numaralayarak saymak: "with exactly these horizontal layers from top to bottom, in the same heights as in the second photo: (1) ..., (2) ...". Saymayınca Kakaolu Bisküvili Çikolatalı'da iki çikolata sosu katmanı kırığa döndü, Balkabaklı kavanozda üst kırığın altına balkabağı yerine krema geldi ("directly under the crumbs ..., there is no white cream directly under the top crumbs" yazınca düzeldi).
- Kavanozda süs (Lotus bisküvisi, ceviz) büyüyüp yatabiliyor: "in the same size as in the second photo relative to the container, perfectly straight and upright, rises only a little above the rim, not tilted and not oversized".
- Cup serisi katmanları: (1) üst yüzeyi oluşturan kalın parlak çikolata sosu, üstünde küp meyve yığını, üstte kırık yok, (2) beyaz krema, (3) duvara dayalı küp meyve şeridi, (4) beyaz krema, (5) ince kırık taban.

Bu yolla 2026-11-11'de yenilenenler (ara görseller `yeni-gorseller/deneme/yeni3-*`): Çilekli Muzlu Çikolatalı, Muzlu Çikolatalı, Kakaolu Bisküvili Çilekli Çikolatalı, Kakaolu Bisküvili Muzlu Çikolatalı, Kakaolu Bisküvili Çilekli Muzlu Çikolatalı, Çikolatalı, Oreolu, Lotuslu, Cevizli, Kakaolu Bisküvili Çikolatalı, Cevizli Çikolatalı, Balkabaklı, Çilekli Çikolatalı Cup.

## Set görselleri (`public/images/genel`, 2026-11-11)

Çoklu ürün fotoğrafları tek turda yenilendi: 1. görsel eski set (sayı, diziliş, kap türü ondan), 2. görsel bitmiş, aynı oranlı bir set ya da aynı kırık türünden bir ürün görseli (zemin, ışık, doku ondan). Komut: "Keep the desserts exactly as they are arranged ... do not zoom in. Change only the setting and the style to match the second photo: the same soft, warm cream wall with gentle window light from the left, with no diagonal shadow stripes; the same light white marble countertop ...", ardından kırık türü (çay bisküvisi / kakaolu / Oreo) ve "Same image size and aspect ratio as the first photo (3:2 landscape)".

- 2. görsel temel kupa (dikey) olunca çıktı 16:9 geldi ve kaplar büyüdü; aynı oranlı bitmiş bir set verince oran korundu.
- Stil örneğindeki tatlılar kopyalanabiliyor: Klasik Üçlü'yü örnek verince Karışık Dörtlü'nün bir kabı çikolata katmanlı oldu, Beyaz Çikolatalı'da küp muz dilime döndü. Çözüm: kapları soldan sağa tek tek tarif etmek ya da içeriği aynı olan bir örnek seçmek.
- Kırık rengi için seçenek yazmak ("tea biscuit, cocoa or Oreo") çay bisküvili kaplarda kakaolu kırık ve çikolata katmanı yerine kırık üretti; her sete tek bir kırık türü yazılmalı.
- Tek bir süs yanlışsa (Vitrin'de cevizin çileğe dönmesi) yalnızca o süsü değiştiren hedefli bir tur yetiyor.
- Kareler (`*-kare.webp`, 1000×1000) Gemini'siz türetilir: `python3 instagram/sablon/set-kare.py <ad>` — geniş görsel 1000 genişliğe küçültülüp dikeyde ortalanır, üst boşluk duvar şeridi uzatılıp yumuşatılarak, alt boşluk mermerin en alt 70 satırı ileri-geri yansıtılıp bulanıklaştırılarak doldurulur.
- `og-cover.jpg` 1200×630 JPEG olarak yazılır.
- 2026-11-14 kırık inceltme turu: ilk turda kırıklar birçok sette boncuk kaldı (Beyaz Çikolatalı, Kakaolu Üçlü/Dörtlü cup, Karışık Dörtlü kavanoz, Vitrin, og-cover). Mevcut set görseli tek başına verilip ürünlerdeki kırık metniyle ("Change only the texture of the ... crumbs; All N jars ... stay exactly as they are ... do not zoom in ... Same image size and aspect ratio (3:2 landscape)") tek turda düzeldi. `python3 instagram/sablon/set-yerlestir.py <ad>:<deneme>` yerine koyar.
- Vitrin'de "walnut crumbs" da yazınca öndeki cevizli kavanoz baştan sona kırıkla doldu. "Inside every jar the layers stay exactly as they are ... Do not add crumbs where there is cream" ile düzgün çıktı.

## Yeni ürünler (2026-11-14)

Kullanıcının çekimi (`menuresimler/plastik 7`, `kavanoz 7`: bej zemin, çapraz gölge, sarımsı krema, boncuk kırık) bizim standarda çevrildi. Kopyalar `yeni-gorseller/yeni7/<slug>-cup|kavanoz.jpg`.

1. **Kupa:** 1. görsel `temel-kupa.jpg`, 2. görsel ürünün kendi cup fotoğrafı + numaralı katman listesi ("with exactly these horizontal layers from top to bottom, in the same proportions as in the second photo: (1) ... (5) ...") + beyaz krema ve ince kırık tarifi.
2. Gerekirse düzeltme turu (aşağıda).
3. **Kavanoz:** 1. görsel `temel-kavanoz.png`, 2. görsel son kupa + aynı numaralı katman listesi.
4. `site-kare.py` ile 1100×1100 webp (kupa `0.94559 -126.54 219.32`, kavanoz `0.930909 0 0`).

Bulgular:
- Orijinalden gelen krema sarımsı/vanilya benekli ve kırıklar boncuk kopyalanabiliyor (Orman Meyveli, Lotus Soslu, Kadayıflı Çikolatalı). Tek görselli "Change only the crumb texture and the cream color" turu düzeltti.
- Kadayıflı'da taban da kadayıf; Gemini tabanı bisküvi kırığı yaptı. "Change only the beige crumb base ... it becomes the same toasted kadayif as the layer on top" ile düzeldi. Kadayıflılarda komuta "There are no biscuit crumbs" eklenmeli.
- Spoonful'da oranlar kaydı (ince çikolata, kalın taban). "Twice as thick" aşırı geldi; oranı kesirle yazmak ("top quarter / middle half / bottom fifth") daha iyi oldu.
- Portakal dilimi ve Lotus bisküvisi kavanozda büyüyebilir: "the same size as in the second photo relative to the container, not oversized".
- Gemini'de f.celebi402 hesabı yaklaşık 15 görselden sonra "Kullanım kotanız azalıyor" uyarısı veriyor.

## B ve C grupları (sonra)

Bu grupların düzeni Çilekli'den farklı. Önce her grubun ilk ürünü (B için Çikolatalı Magnolya, C için Çilekli Çikolatalı Cup) Çilekli'deki gibi tur tur yapılacak; o görsel beğenilince grubun geri kalanı A grubundaki gibi ondan türetilecek. Aşağıdaki tarifler o zaman komuta dönüştürülecek ham malzeme; katman sırası sitedeki görsellerden.

### 3. Çikolatalı Magnolya · `cikolatali-magnolya`
Tepede bitter çikolata kareleri; çay bisküvisi kırığı, parlak bitter çikolata sosu, vanilyalı krema, çikolata sosu, krema, kalın çay bisküvisi tabanı.

### 5. Oreolu Magnolya · `oreolu-magnolya`
Tepede bütün bir Oreo; Oreo kırığı, vanilyalı krema, Oreo kırığı (siyah, beyaz krema benekli), krema, kalın Oreo tabanı.

### 6. Lotuslu Magnolya · `lotuslu-magnolya`
Tepede bütün bir Lotus bisküvisi; Lotus kırığı, vanilyalı krema, kehribar renkli karamelli Lotus kırığı, krema, kalın Lotus tabanı.

### 7. Cevizli Magnolya · `cevizli-magnolya`
Tepede ceviz içi; ceviz içleri, vanilyalı krema, ceviz kırığı, krema, kalın çay bisküvisi tabanı.

### 15. Kakaolu Bisküvili Çikolatalı Magnolya · `kakaolu-biskuvili-cikolatali-magnolya`
Tepede bitter çikolata kareleri; koyu kakaolu bisküvi kırığı, parlak bitter çikolata sosu, vanilyalı krema, kalın kakaolu bisküvi tabanı.

### 21. Cevizli Çikolatalı Magnolya · `cevizli-cikolatali-magnolya`
Tepede ceviz içi ve bitter çikolata karesi; çay bisküvisi kırığı, parlak bitter çikolata sosu, krema içinde ceviz ve çikolata parçaları, kalın çay bisküvisi tabanı.

### 22. Balkabaklı Magnolya · `balkabakli-magnolya`
Tepede küp turuncu balkabağı tatlısı; çay bisküvisi kırığı, parlak turuncu balkabağı tatlısı katmanı, vanilyalı krema, kalın çay bisküvisi tabanı.

### 23. Çilekli Çikolatalı Cup · `cilekli-cikolatali-cup`
Üstü küp doğranmış taze çilek; parlak bitter çikolata sosu, açık pembe çilekli krema, kalın çay bisküvisi tabanı.

### 24. Muzlu Çikolatalı Cup · `muzlu-cikolatali-cup`
Üstü küp doğranmış taze muz; parlak bitter çikolata sosu, açık sarı muzlu krema, kalın çay bisküvisi tabanı.

### 25. Çilekli Muzlu Çikolatalı Cup · `cilekli-muzlu-cikolatali-cup`
Üstü küp doğranmış çilek ve muz; parlak bitter çikolata sosu, açık meyveli krema, kalın çay bisküvisi tabanı.
