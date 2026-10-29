# Gemini görsel komutları

Bütün magnolyaları beğendiğimiz Çilekli Magnolya görselinin tarzında üretmek için.

## Nasıl kullanılır

Gemini bir görseli düzenlerken **ilk görselin şeklini korur**. Bu yüzden temel olarak hep doğru kabı içeren görseli veriyoruz ve sadece içindeki tatlıyı ve arka planı değiştirtiyoruz.

1. gemini.google.com → **yeni sohbet** (eski sohbet yanlış kabı hatırlıyor).
2. İki görsel ekle: **1)** `yeni-gorseller/kap-referans-kupa.png` (kap, aynen korunur), **2)** malzeme tarzı için beğendiğin Çilekli Magnolya görseli. Çilekli bizim kapta çıktıktan sonra 2. görsel olarak onu kullan.
3. **Sabit stil** metnini, hemen altına ürünün metnini yapıştır.
4. Beğendiğin sonucu Gemini'nin **indirme düğmesiyle** indir (ekran görüntüsü ya da kopyala-yapıştır kaliteyi düşürür).
5. Aynı sohbette **Kavanoz** adımıyla aynı tatlının kavanoz hâlini üret (sitedeki "Kavanoz" geçişi için gerekli).
6. Dosyaları proje klasöründe `yeni-gorseller/` içine şu adlarla koy:
   - `<kod>.png` → kupa
   - `<kod>-kavanoz.png` → kavanoz

   Her ürünün kodu başlığın yanında yazıyor.

   Kabın oranı için Gemini'yle uğraşma: indirdiğin görseli `instagram/sablon/kap-genislet.py` ile %12 genişletiyoruz, kap gerçek oranına geliyor.

Katman sırası ve süslemeler sitedeki katman listesinden çıkarıldı. Kendi ürününe uymayan bir şey varsa (örneğin üst süsleme) metinde değiştir; görsel, müşterinin eline geçen tatlıya benzemeli.

## Sabit stil

```text
Edit the first image. Keep the container exactly as it is: the same clear cup, the same lid with the ribbed rim and the low flat-topped dome, the same pedestal foot, the same size, shape, proportions, position and camera angle. Do not change the container at all.
Change only the food inside and the background:
- Food: use the realistic food style of the second image (fine sandy biscuit crumbs, smooth ivory vanilla pudding cream, juicy fresh fruit), with soft wavy borders between the layers. The dessert is described below.
- Background: a rustic wooden table and a blurred warm cream background with soft window light from the left, like the second image.
Square format, photorealistic, no text.
```

## Kavanoz (her üründen sonra)

Aynı sohbette iki görsel ekle: **1)** `yeni-gorseller/kap-referans-kavanoz.png`, **2)** az önce çıkan kupa görseli.

```text
Edit the first image the same way. Keep the jar exactly as it is: the same size, shape, threads, position and camera angle, no lid. Replace only the food inside with the exact same dessert and layers as in the second image, and use the same wooden table, background and light as the second image. Square format, photorealistic, no text.
```

## Sonraki ürünler (aynı sohbette, sadece metin)

Bizim kapta doğru bir görsel çıktıktan sonra, aynı sohbette görsel eklemeden şu metin + ürünün metni yeterli. Gemini son görseli düzenler. 4-5 üründe bir ya da kap/ışık kaymaya başlayınca beğendiğin kupa görselini yeniden ekle.

```text
Keep this exact photo: the same cup, lid, foot, size, position, wooden table, background and light. Change only the dessert inside to the one described below.
```

## Kap değişirse

```text
The container changed. Keep the container from the first image exactly as it is; change only the food inside and the background.
```

## Ürünler

### 1. Çilekli Magnolya · `cilekli-magnolya`
```text
Dessert: strawberry magnolia. Inside the dome: a dollop of vanilla pudding cream with one whole fresh strawberry with green leaves. Layers from top to bottom: finely crushed tea biscuit crumbs, smooth vanilla pudding cream, large fresh strawberry halves (cut lengthwise, standing upright) pressed against the cup wall with the cut side facing out, cream, thick crushed tea biscuit base.
```

### 2. Muzlu Magnolya · `muzlu-magnolya`
```text
Dessert: banana magnolia pudding. Under the dome: a dollop of cream topped with a few fresh banana slices. Layers from top to bottom: vanilla pudding cream, finely crushed tea biscuit crumbs, cream, fresh round banana slices pressed against the cup wall, cream, thick crushed tea biscuit base.
```

### 3. Çikolatalı Magnolya · `cikolatali-magnolya`
```text
Dessert: chocolate magnolia pudding. Under the dome: dark chocolate shavings on top. Layers from top to bottom: dark chocolate shavings, a glossy dark chocolate sauce layer, vanilla pudding cream, thick crushed tea biscuit base.
```

### 4. Çilekli Muzlu Çikolatalı Magnolya · `cilekli-muzlu-cikolatali-magnolya`
```text
Dessert: strawberry, banana and chocolate magnolia pudding. Under the dome: a dollop of cream with one whole strawberry and a banana slice. Layers from top to bottom: finely crushed tea biscuit crumbs, a glossy dark chocolate sauce layer, alternating large fresh strawberry halves (cut lengthwise, standing upright) and banana slices pressed against the cup wall in vanilla pudding cream, thick crushed tea biscuit base.
```

### 5. Oreolu Magnolya · `oreolu-magnolya`
```text
Dessert: Oreo magnolia pudding. Under the dome: one whole Oreo cookie standing in a dollop of cream. Layers from top to bottom: Oreo cookie pieces, vanilla pudding cream, crushed Oreo crumbs (black with white cream specks), cream, thick crushed Oreo base.
```

### 6. Lotuslu Magnolya · `lotuslu-magnolya`
```text
Dessert: Lotus Biscoff magnolia pudding. Under the dome: one whole Lotus caramelized biscuit standing in a dollop of cream. Layers from top to bottom: Lotus biscuit pieces, vanilla pudding cream, amber crushed caramelized Lotus biscuit crumbs, cream, thick crushed Lotus biscuit base.
```

### 7. Cevizli Magnolya · `cevizli-magnolya`
```text
Dessert: walnut magnolia pudding. Under the dome: a few walnut halves on a dollop of cream. Layers from top to bottom: walnut halves, vanilla pudding cream, chopped walnut pieces, cream, thick crushed tea biscuit base.
```

### 8. Çilekli Red Velvet Magnolya · `cilekli-red-velvet-magnolya`
```text
Dessert: strawberry red velvet magnolia pudding. Under the dome: one whole strawberry on a dollop of cream sprinkled with red velvet crumbs. Layers from top to bottom: deep red velvet cake crumbs, vanilla pudding cream, large fresh strawberry halves (cut lengthwise, standing upright) pressed against the cup wall, cream, thick red velvet cake crumb base.
```

### 9. Çilekli Muzlu Magnolya · `cilekli-muzlu-magnolya`
```text
Dessert: strawberry and banana magnolia pudding. Under the dome: a dollop of cream with one whole strawberry and a banana slice. Layers from top to bottom: finely crushed tea biscuit crumbs, vanilla pudding cream, alternating large fresh strawberry halves (cut lengthwise, standing upright) and banana slices pressed against the cup wall, cream, thick crushed tea biscuit base.
```

### 10. Çilekli Çikolatalı Magnolya · `cilekli-cikolatali-magnolya`
```text
Dessert: strawberry and chocolate magnolia pudding. Under the dome: one whole strawberry on a dollop of cream drizzled with chocolate sauce. Layers from top to bottom: finely crushed tea biscuit crumbs, a glossy dark chocolate sauce layer, large fresh strawberry halves (cut lengthwise, standing upright) pressed against the cup wall in vanilla pudding cream, thick crushed tea biscuit base.
```

### 11. Muzlu Çikolatalı Magnolya · `muzlu-cikolatali-magnolya`
```text
Dessert: banana and chocolate magnolia pudding. Under the dome: banana slices on a dollop of cream drizzled with chocolate sauce. Layers from top to bottom: finely crushed tea biscuit crumbs, a glossy dark chocolate sauce layer, fresh banana slices pressed against the cup wall in vanilla pudding cream, thick crushed tea biscuit base.
```

### 12. Kakaolu Bisküvili Çilekli Magnolya · `kakaolu-biskuvili-cilekli-magnolya`
```text
Dessert: cocoa biscuit strawberry magnolia pudding. Under the dome: one whole strawberry on a dollop of cream sprinkled with dark cocoa biscuit crumbs. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, vanilla pudding cream, large fresh strawberry halves (cut lengthwise, standing upright) pressed against the cup wall, cream, thick crushed cocoa biscuit base.
```

### 13. Kakaolu Bisküvili Muzlu Magnolya · `kakaolu-biskuvili-muzlu-magnolya`
```text
Dessert: cocoa biscuit banana magnolia pudding. Under the dome: banana slices on a dollop of cream sprinkled with dark cocoa biscuit crumbs. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, vanilla pudding cream, fresh banana slices pressed against the cup wall, cream, thick crushed cocoa biscuit base.
```

### 14. Kakaolu Bisküvili Çilekli Muzlu Magnolya · `kakaolu-biskuvili-cilekli-muzlu-magnolya`
```text
Dessert: cocoa biscuit strawberry and banana magnolia pudding. Under the dome: one whole strawberry and a banana slice on a dollop of cream. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, vanilla pudding cream, alternating large fresh strawberry halves (cut lengthwise, standing upright) and banana slices pressed against the cup wall, cream, thick crushed cocoa biscuit base.
```

### 15. Kakaolu Bisküvili Çikolatalı Magnolya · `kakaolu-biskuvili-cikolatali-magnolya`
```text
Dessert: cocoa biscuit chocolate magnolia pudding. Under the dome: dark chocolate shavings on a dollop of cream. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, a glossy dark chocolate sauce layer, vanilla pudding cream, thick crushed cocoa biscuit base.
```

### 16. Kakaolu Bisküvili Çilekli Çikolatalı Magnolya · `kakaolu-biskuvili-cilekli-cikolatali-magnolya`
```text
Dessert: cocoa biscuit strawberry chocolate magnolia pudding. Under the dome: one whole strawberry on a dollop of cream drizzled with chocolate sauce. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, a glossy dark chocolate sauce layer, large fresh strawberry halves (cut lengthwise, standing upright) pressed against the cup wall in vanilla pudding cream, thick crushed cocoa biscuit base.
```

### 17. Kakaolu Bisküvili Muzlu Çikolatalı Magnolya · `kakaolu-biskuvili-muzlu-cikolatali-magnolya`
```text
Dessert: cocoa biscuit banana chocolate magnolia pudding. Under the dome: banana slices on a dollop of cream drizzled with chocolate sauce. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, a glossy dark chocolate sauce layer, fresh banana slices pressed against the cup wall in vanilla pudding cream, thick crushed cocoa biscuit base.
```

### 18. Kakaolu Bisküvili Çilekli Muzlu Çikolatalı Magnolya · `kakaolu-biskuvili-cilekli-muzlu-cikolatali-magnolya`
```text
Dessert: cocoa biscuit strawberry, banana and chocolate magnolia pudding. Under the dome: one whole strawberry and a banana slice on a dollop of cream drizzled with chocolate sauce. Layers from top to bottom: dark brown crushed cocoa biscuit crumbs, a glossy dark chocolate sauce layer, alternating large fresh strawberry halves (cut lengthwise, standing upright) and banana slices pressed against the cup wall in vanilla pudding cream, thick crushed cocoa biscuit base.
```

### 19. Oreolu Çilekli Magnolya · `oreolu-cilekli-magnolya`
```text
Dessert: Oreo strawberry magnolia pudding. Under the dome: one whole strawberry and half an Oreo cookie on a dollop of cream. Layers from top to bottom: crushed Oreo crumbs, vanilla pudding cream, large fresh strawberry halves (cut lengthwise, standing upright) pressed against the cup wall, cream, thick crushed Oreo base.
```

### 20. Oreolu Muzlu Magnolya · `oreolu-muzlu-magnolya`
```text
Dessert: Oreo banana magnolia pudding. Under the dome: banana slices and half an Oreo cookie on a dollop of cream. Layers from top to bottom: crushed Oreo crumbs, vanilla pudding cream, fresh banana slices pressed against the cup wall, cream, thick crushed Oreo base.
```

### 21. Cevizli Çikolatalı Magnolya · `cevizli-cikolatali-magnolya`
```text
Dessert: walnut chocolate magnolia pudding. Under the dome: walnut halves on a dollop of cream drizzled with chocolate sauce. Layers from top to bottom: finely crushed tea biscuit crumbs, a glossy dark chocolate sauce layer, chopped walnuts mixed with chocolate pieces in vanilla pudding cream, thick crushed tea biscuit base.
```

### 22. Balkabaklı Magnolya · `balkabakli-magnolya`
```text
Dessert: pumpkin magnolia pudding with Turkish candied pumpkin. Under the dome: a few small orange candied pumpkin cubes on a dollop of cream. Layers from top to bottom: finely crushed tea biscuit crumbs, a bright orange layer of Turkish candied pumpkin puree, vanilla pudding cream, thick crushed tea biscuit base.
```

### 23. Çilekli Çikolatalı Cup · `cilekli-cikolatali-cup`
```text
Dessert: strawberry chocolate cup. The top surface is fully covered with glossy chocolate sauce and diced fresh strawberries. Layers from top to bottom: diced fresh strawberries, a glossy dark chocolate sauce layer, light pink strawberry cream, thick crushed tea biscuit base.
```

### 24. Muzlu Çikolatalı Cup · `muzlu-cikolatali-cup`
```text
Dessert: banana chocolate cup. The top surface is fully covered with glossy chocolate sauce and diced fresh banana. Layers from top to bottom: diced fresh banana, a glossy dark chocolate sauce layer, pale yellow banana cream, thick crushed tea biscuit base.
```

### 25. Çilekli Muzlu Çikolatalı Cup · `cilekli-muzlu-cikolatali-cup`
```text
Dessert: strawberry, banana and chocolate cup. The top surface is fully covered with glossy chocolate sauce, diced fresh strawberries and diced banana. Layers from top to bottom: diced strawberries and banana, a glossy dark chocolate sauce layer, light fruit cream, thick crushed tea biscuit base.
```
