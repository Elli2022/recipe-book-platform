-- Eleonora Nocentinis glutenfri spaghetti med citron, smör, sparris och burrata (idempotent)
insert into public.recipes (
  id,
  owner_id,
  owner_name,
  name,
  description,
  portions,
  category,
  ingredients,
  instructions,
  image,
  source_image
) values (
  'd4a52622-1871-449e-9b9a-d1c745fbb314',
  null,
  'Eleonora Nocentini',
  'Glutenfri spaghetti med citron, smör, sparris och burrata',
  'Ljummen glutenfri spaghetti i smörig citronsås, serverad med lätt förvälld sparris, krämig burrata och rostade mandelflarn. Eleonora Nocentinis recept.',
  '4',
  'huvudrätt, pasta',
  array[
    '360 g glutenfri spaghetti (torr vikt)',
    '400 g sparris',
    '2 burrata (à ca 125 g)',
    '100 g smör',
    '2 citroner',
    '50 g mandlar',
    '2 msk olivolja',
    'salt',
    'nymalen svartpeppar'
  ],
  array[
    'Sätt ugnen på 175 °C. Lägg mandlarna på en plåt och rosta i ugnen ca 8–10 min tills de är gyllene och doftar. Låt svalna något och skiva eller flisa dem grovt till mandelflarn.',
    'Skölj sparrisen och bryt bort de träiga ändarna. Koka dem i lättsaltat vatten 2–3 minuter tills de är mjuka men fortfarande har lite tuggmotstånd. Häll av och håll sparrisen varm under lock.',
    'Koka pastan i rikligt med saltat vatten enligt förpackningens anvisning tills den är al dente. Spara ca 1 dl av pastavattnet innan du häller av.',
    'Riv zest från en citron och pressa saften från båda citronerna. Smält smöret i en stor stekpanna eller wok på medelvärme. Tillsätt citronsaften och hälften av zesten. Låt sjuda 1–2 minuter och smaka av med salt och peppar.',
    'Tillsätt den avrunna pastan till såsen tillsammans med en skvätt pastavatten. Vänd runt så att pastan täcks av den smöriga citronsåsen. Om såsen känns trög, tillsätt lite mer pastavatten.',
    'Lägg upp pastan på varma tallrikar. Toppa med sparris, en halverad burrata per portion, rostade mandelflarn och resten av citronzesten. Ringla ev. med lite olivolja och servera direkt.'
  ],
  '/images/pastaBurrataSparrisCitron.jpeg',
  'Eleonora Nocentinis recept'
)
on conflict (id) do update set
  owner_name = excluded.owner_name,
  name = excluded.name,
  description = excluded.description,
  portions = excluded.portions,
  category = excluded.category,
  ingredients = excluded.ingredients,
  instructions = excluded.instructions,
  image = excluded.image,
  source_image = excluded.source_image,
  updated_at = now();
