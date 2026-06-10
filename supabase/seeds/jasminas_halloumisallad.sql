-- Jasminas Halloumisallad (idempotent)
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
  'b8c4e2f1-6a3d-4f5e-9c2b-1d8e7f6a5b4c',
  null,
  'Jasmina',
  'Jasminas Halloumisallad',
  'Fräsch sallad med ugnsbakade småtomater, söt honungsmelon (vattenmelon funkar också) och pepprig ruccola. Grillad halloumi ger sältan och mustig smak.',
  '4',
  'Sallad',
  array[
    '400 g halloumi',
    '500 g småtomater (gärna röda och gula)',
    '½ honungsmelon eller vattenmelon',
    '100 g ruccola',
    '2 msk olivolja',
    '1 msk honung',
    'flingsalt och svartpeppar',
    'ev. balsamicoglaze till servering'
  ],
  array[
    'Sätt ugnen på 200 °C.',
    'Halvera småtomaterna, lägg på plåt med bakplåtspapper. Ringla över olivolja och honung, salta och peppra. Ugnsbaka ca 25–30 min tills tomaterna är mjuka och lätt karamelliserade.',
    'Skär halloumin i skivor och stek eller grilla i het panna tills den får fina grillränder och gyllene yta.',
    'Skär melonen i lagom stora bitar.',
    'Blanda ruccola, melon och tomater på ett fat. Toppa med halloumi och servera direkt.'
  ],
  '/images/jasminas-halloumisallad.jpg',
  'Familjerecept'
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
