import { GarmentProduct, ExperienceCardItem } from '../types';

import heroImg from '../assets/images/hero_sculptural_piece_1789592524800.jpg';
import tshirtBlackBoxy from '../assets/images/tshirt_black_boxy_1789595644021.jpg';
import tshirtRawBone from '../assets/images/tshirt_raw_bone_1789595658414.jpg';
import tshirtCyberGraphic from '../assets/images/tshirt_cyber_graphic_1789595670090.jpg';
import tshirtWashedCharcoal from '../assets/images/tshirt_washed_charcoal_1789595682698.jpg';
import tshirtOversizedNoir from '../assets/images/tshirt_oversized_noir_1789595692943.jpg';
import tshirtRawTee from '../assets/images/garment_raw_tee_1789592562105.jpg';
import hoodieImg from '../assets/images/garment_ego_hoodie_1789592536665.jpg';
import vestImg from '../assets/images/garment_sculpt_vest_1789592549152.jpg';
import detailMacroImg from '../assets/images/garment_detail_macro_1789592574781.jpg';
import backViewImg from '../assets/images/garment_back_view_1789592587301.jpg';

export const HERO_ASSET = {
  image: heroImg,
  title: 'COLLECTION 01',
  tagline: 'Une pièce pensée entre matière, mouvement et identité.',
  concept: 'ÉDITION ARCHITECTURALE LIMITÉE',
};

export const BRAND_COLORS = {
  noirProfond: '#1F1F1C',
  blancIvoire: '#FFFAFA',
  jauneVif: '#F6D110',
  bleuAzur: '#0C5FB3',
};

export const BRAND_INFO = {
  name: 'NEÏROUA',
  slogan: 'OSE REDÉFINIR LES CODES.',
  concept: "Un mot né d'une combinaison : « new » (nouveau) et « roi », devenant ainsi NEÏROUA.",
  description:
    "NEÏROUA est bien plus qu'une marque, c'est une identité portée. Née en Côte d'Ivoire, NEÏROUA incarne l'audace, l'élégance urbaine et la puissance des origines.",
  history:
    "NEÏROUA est née pour devenir un patrimoine collectif, une marque à laquelle chacun peut s'identifier, sans jamais imposer une seule voix, une seule communauté, une seule idéologie. La société t'impose de te conformer au regard des autres, la peur du jugement te pousse à cacher qui tu es réellement. NEÏROUA ne s'adresse pas à une foule. Elle s'adresse à toi. À chacun, un par un, et c'est ainsi qu'elle devient un patrimoine collectif. La marque reste en retrait. C'est toi qui imposes ta présence.",
  mission:
    "Incarner l'élégance urbaine à travers des pièces qui te laissent exister avant elles. Créer une identité streetwear ivoirienne et africaine où t'affirmer ne dépend jamais de te faire remarquer.",
  vision:
    "Une identité intemporelle, où le vêtement précède la marque. Un style hybride entre streetwear et haute couture accessible. Créer une nouvelle identité streetwear africaine, pensée comme un patrimoine collectif, un par un, jamais imposé en bloc.",
  positioning:
    "Une marque streetwear hybride, entre streetwear et haute couture accessible, influencée par la culture ivoirienne et pensée pour conquérir la scène afro et mondiale.",
  target:
    "Adolescents, jeunes et jeunes adultes à l'esprit créatif, ceux qui cherchent à s'affirmer sans se conformer, passionnés de mode et d'identités créatives.",
  origin: "Abidjan, Côte d'Ivoire — Paris — Tokyo",
  tag: 'COLLECTION 01 // EGO',
  contact: {
    email: 'neiroua.ci@gmail.com',
    secondaryEmail: 'neiroua.znz@gmail.com',
    phone: '+225 07 11 05 92 28',
    address: "Abidjan, Côte d'Ivoire",
  },
  social: [
    { name: 'Instagram', url: 'https://instagram.com', handle: '@neiroua.official' },
    { name: 'TikTok', url: 'https://tiktok.com', handle: '@neiroua' },
    { name: 'Facebook', url: 'https://facebook.com', handle: 'NEÏROUA Streetwear' },
  ],
};

export const EXPERIENCE_CARDS: ExperienceCardItem[] = [
  {
    id: 'visualisation',
    title: 'VISUALISATION 3D & 360°',
    subtitle: 'Immersion volumétrique',
    badge: 'SCAN SPATIAL 360°',
    image: tshirtCyberGraphic,
    actionText: 'EXPLORER LE MAILLAGE',
  },
  {
    id: 'collection',
    title: 'COLLECTION T-SHIRTS & CAPSULE',
    subtitle: "Pièces d'exposition & Prêt-à-porter",
    badge: 'HOMME & FEMME',
    image: tshirtBlackBoxy,
    actionText: 'ACCÉDER AU CATALOGUE',
  },
  {
    id: 'video',
    title: 'VIDÉO RUNWAY & PROMO',
    subtitle: 'Cinématographie & Mouvement',
    badge: 'FILM 4K',
    image: tshirtRawBone,
    actionText: 'VOIR LE FILM',
  },
];

export const PRODUCTS: GarmentProduct[] = [
  // SECTION HOMME
  {
    id: 'neiroua-tee-black-boxy',
    name: 'T-SHIRT BOXY NOIR MONOLITHE',
    collection: 'COLLECTION 01 // EGO',
    gender: 'homme',
    price: 145,
    currency: '€',
    category: 'T-shirt boîte lourd',
    tagline: 'Coton lourd 420 GSM teinté dans la masse, coupe architecturale drop-shoulder.',
    composition: '100% Coton brut haute densité 420 g/m²',
    weight: '420 GSM',
    arAvailable: true,
    videoDuration: '0:35',
    sizes: ['S', 'M', 'L', 'XL'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: tshirtBlackBoxy,
        description: 'Coupe boxy oversize aux épaules tombantes et tombé sculptural net.',
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: 'Ligne dorsale minimale avec signature NEÏROUA imprimée en relief thermique.',
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: 'Collerette renforcée double surpiqûre et grain de coton armuré non abrasif.',
      },
    ],
  },
  {
    id: 'neiroua-tee-faded-charcoal',
    name: 'T-SHIRT CHARCOAL DÉLAVÉ ARCHIVE',
    collection: 'COLLECTION 01 // EGO',
    gender: 'homme',
    price: 150,
    currency: '€',
    category: 'T-shirt boîte lourd',
    tagline: "Délavage artisanal à l'acide minéral offrant une patine gris carbone unique.",
    composition: '100% Coton peigné lavé aux enzymes 390 g/m²',
    weight: '390 GSM',
    arAvailable: true,
    videoDuration: '0:28',
    sizes: ['M', 'L', 'XL'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: tshirtWashedCharcoal,
        description: "Effet grunge chic et texture patinée façon pièce d'archive rare.",
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: 'Couture dorsale centrale apparente façon atelier expérimental.',
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: 'Encolure surélevée coupée net avec bords légèrement usés à la main.',
      },
    ],
  },
  {
    id: 'neiroua-tee-cyber-graphic',
    name: 'T-SHIRT GRAPHIC MONOGRAMME OR',
    collection: 'COLLECTION 01 // EGO',
    gender: 'homme',
    price: 155,
    currency: '€',
    category: 'T-shirt boîte lourd',
    tagline: 'Sérigraphie jaune vif haute adhérence et typographie Teko sur base noire dense.',
    composition: '100% Coton peigné fin lourd 400 g/m²',
    weight: '400 GSM',
    arAvailable: true,
    videoDuration: '0:32',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: tshirtCyberGraphic,
        description: 'Typographie Teko expressive et accents jaune vif #F6D110.',
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: 'Empiècement dorsal sérigraphié avec étoile polaire NEÏROUA.',
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: 'Pigments haute définition résistant aux lavages extrêmes.',
      },
    ],
  },
  {
    id: 'neiroua-veste-sculpturale',
    name: 'GILET MONOLITHE 01 ARCHITECTURE',
    collection: 'COLLECTION 01 // EGO',
    gender: 'homme',
    price: 340,
    currency: '€',
    category: "Veste & Pièce d'exception",
    tagline: "Structure tactique texturée aux finitions métalliques brossées et inserts d'ivoire.",
    composition: '100% Coton brut lourd 520 g/m² & Bouclerie aluminium anodisé',
    weight: '520 GSM',
    arAvailable: true,
    videoDuration: '0:45',
    sizes: ['S', 'M', 'L', 'XL'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: vestImg,
        description: 'Façade architecturale à découpe ergonomique et poches modulaires intégrées.',
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: "Ligne dorsale brodée au fil ivoire haute résistance et empiècement d'aération.",
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: "Macro-texturation brute du tissage armuré et surpiqûres sellier au point d'or.",
      },
    ],
  },
  {
    id: 'neiroua-hoodie-ego',
    name: 'HOODIE ÉRABLE NOIR EGO',
    collection: 'COLLECTION 01 // EGO',
    gender: 'homme',
    price: 260,
    currency: '€',
    category: 'Sweat à capuche sculptural',
    tagline: 'Capuche double volume au tombé lourd et gravure géométrique ton sur ton.',
    composition: "Molleton bio ultra-dense 600 g/m², filage peigné d'exception",
    weight: '600 GSM',
    arAvailable: true,
    videoDuration: '0:38',
    sizes: ['M', 'L', 'XL'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: hoodieImg,
        description: "Silhouette boxy oversize avec découpe d'épaules tombantes et col sculptural.",
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: 'Manifeste NEÏROUA discrètement embossé en typographie technique le long du dos.',
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: 'Finition bouclée interne brossée à la main pour une tenue thermique sculpturale.',
      },
    ],
  },

  // SECTION FEMME
  {
    id: 'neiroua-femme-raw-bone',
    name: 'T-SHIRT ÉCRU RAW IDENTITY',
    collection: 'COLLECTION 01 // EGO',
    gender: 'femme',
    price: 140,
    currency: '€',
    category: 'T-shirt boîte sculptural',
    tagline: "Coton brut non blanchi teinté aux nuances minérales naturelles d'ivoire.",
    composition: '100% Coton brut biologique non traité 380 g/m²',
    weight: '380 GSM',
    arAvailable: true,
    videoDuration: '0:40',
    sizes: ['XS', 'S', 'M', 'L'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: tshirtRawBone,
        description: "Tissage d'armure organique au coloris blanc ivoire et tombé fluide moderne.",
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: 'Dorsale avec micro-typographie cartographique Abidjan — Paris.',
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: 'Fibre peignée ultra-douce aux finitions sellier ton sur ton.',
      },
    ],
  },
  {
    id: 'neiroua-femme-sculpt-noir',
    name: 'T-SHIRT MATTE SCULPT NOIR',
    collection: 'COLLECTION 01 // EGO',
    gender: 'femme',
    price: 145,
    currency: '€',
    category: 'T-shirt coupe nette',
    tagline: 'Volume architectural sculpté aux découpes épurées et fini mat profond velouté.',
    composition: '100% Coton peigné mercerisé lourd 420 g/m²',
    weight: '420 GSM',
    arAvailable: true,
    videoDuration: '0:30',
    sizes: ['XS', 'S', 'M', 'L'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: tshirtOversizedNoir,
        description: 'Silhouette monolithique pure sans ornement superflu au tombé impeccable.',
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: "Ligne médiane profilée et empiècement d'épaule ergonomique.",
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: 'Finition mate veloutée au toucher soyeux et robuste.',
      },
    ],
  },
  {
    id: 'neiroua-femme-atelier-tee',
    name: 'T-SHIRT ATELIER BRUT MATIÈRE',
    collection: 'COLLECTION 01 // EGO',
    gender: 'femme',
    price: 130,
    currency: '€',
    category: 'T-shirt minimaliste',
    tagline: 'Coton brut texturé à encolure ronde fine et silhouette décontractée noble.',
    composition: '100% Coton brut peigné non blanchi 380 g/m²',
    weight: '380 GSM',
    arAvailable: true,
    videoDuration: '0:30',
    sizes: ['XS', 'S', 'M', 'L'],
    views: [
      {
        type: 'face',
        label: 'VUE FACE',
        image: tshirtRawTee,
        description: 'Collerette renforcée en bord-côte fin et coupe nette contemporaine.',
      },
      {
        type: 'dos',
        label: 'VUE DOS',
        image: backViewImg,
        description: 'Signature cartographique Abidjan sérigraphiée discrètement.',
      },
      {
        type: 'detail',
        label: 'VUE DÉTAIL',
        image: detailMacroImg,
        description: "Grain tactile du tissu d'armure et étiquette tissée en fil d'or.",
      },
    ],
  },
];
