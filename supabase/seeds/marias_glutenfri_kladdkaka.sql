-- Maria Larssons familjefavorit (idempotent)
-- För Arlas bild inbäddad i recipes.image: kör npm run seed:family-recipes (läser JPEG från public/)
-- Denna SQL sätter Arlas bild-URL om du bara vill köra SQL Editor:

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
  'f3051ec7-e4bc-4824-bad3-57f7941dabb0',
  null,
  'Maria Larsson',
  'Glutenfri kladdkaka med mandelmjöl (Marias)',
  'Familjens favorit. Maria Larsson tipsade om receptet — hon är partner till Robin Bergman och Jessicas kusin. Glutenfri kladdkaka med mandelmjöl, baserat på Arlas recept.',
  '12',
  'Bakverk',
  array[
    '150 g smör',
    '3 ägg',
    '3 dl strösocker',
    '1½ dl mandelmjöl',
    '1 dl kakao',
    '½ msk vaniljsocker',
    '2 krm salt'
  ],
  array[
    'Sätt ugnen på 175 °C (160 °C varmluft).',
    'Smörj en form med löstagbar kant, ca 24 cm i diameter, och bröa den med mandelmjöl.',
    'Smält smöret. Rör ihop ägg och socker. Blanda de torra ingredienserna och rör ner i smeten tillsammans med smöret.',
    'Häll smeten i formen. Grädda i mitten av ugnen ca 25 min tills ytan är torr men mitten fortfarande känns lite lös. Låt svalna.',
    'Servera med vispad grädde.'
  ],
  'https://images.arla.com/recordid/F3051EC7-E4BC-4824-BAD357F7941DABBB/glutenfri-kladdkaka.jpg',
  'https://www.arla.se/recept/glutenfri-kladdkaka/'
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
