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
