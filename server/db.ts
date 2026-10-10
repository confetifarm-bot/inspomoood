import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Product, Category, Promotion, StoreSettings, FAQ, Order } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/db.json');

export interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  settings: StoreSettings;
  faqs: FAQ[];
  orders: Order[];
  adminToken: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-ramos',
    name: 'Ramos y flores',
    slug: 'ramos-y-flores',
    description: 'Arreglos florales frescos y preservados con envoltura prémium y tarjeta dedicatoria.',
    icon: 'flower',
    order: 1,
    visible: true,
  },
  {
    id: 'cat-perfumes',
    name: 'Perfumes',
    slug: 'perfumes',
    description: 'Aromas envolventes en presentaciones de autor, sin notas exageradas ni certificados ficticios.',
    icon: 'sparkles',
    order: 2,
    visible: true,
  },
  {
    id: 'cat-disfraces',
    name: 'Disfraces individuales y para parejas',
    slug: 'disfraces',
    description: 'Diseños temáticos divertidos y cómodos con selección independiente de tallas para cada persona.',
    icon: 'mask',
    order: 3,
    visible: true,
  },
  {
    id: 'cat-ropa-accesorios',
    name: 'Ropa y accesorios para combinar',
    slug: 'ropa-para-combinar',
    description: 'Prendas coordinadas en suave algodón peruano para usar juntos con estilo discreto.',
    icon: 'shirt',
    order: 4,
    visible: true,
  },
  {
    id: 'cat-personalizados',
    name: 'Detalles personalizados',
    slug: 'detalles-personalizados',
    description: 'Grabados en madera, acrílico y mensajes a medida con recargos transparentes.',
    icon: 'pen-tool',
    order: 5,
    visible: true,
  },
  {
    id: 'cat-combos',
    name: 'Combos para parejas',
    slug: 'combos-parejas',
    description: 'Packs completos pensados para aniversarios, citas y celebraciones memorables.',
    icon: 'heart-handshake',
    order: 6,
    visible: true,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    "id": "prod-rosas-eternas",
    "name": "Ramo de Rosas Eternas de Satén (Colección Romance)",
    "slug": "ramo-rosas-eternas-saten-romance",
    "category": "cat-ramos",
    "shortDescription": "Rosas artesanales de satén brillante en envoltura de lujo con tarjeta dedicatoria y luces.",
    "description": "Ramo confeccionado pétalo por pétalo con fino satén de alta densidad que conserva su brillo y color para siempre. Presentado en envoltura coreana impermeable con moño de seda y dedicatoria personalizada.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png",
      "/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Especial.png",
      "/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Sencillo.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo de nueve rosas satinadas-6.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo Romance de rosas de satén-3.png"
    ],
    "whatIncludes": [
      "Rosas de satén artesanales confeccionadas a mano",
      "Envoltura coreana prémium en tonos pasteles o negro mate",
      "Luces micro LED cálidas con batería incluida",
      "Tarjeta caligrafiada con dedicatoria personalizada"
    ],
    "whatExcludes": [
      "Florero de acrílico (disponible como adicional)"
    ],
    "isBouquet": true,
    "bouquetDetails": {
      "sizes": [
        {
          "id": "size-sencillo",
          "label": "12 Rosas Satinadas (Sencillo)",
          "extraPrice": 0
        },
        {
          "id": "size-especial",
          "label": "24 Rosas Satinadas (Especial Deluxe)",
          "extraPrice": 40
        },
        {
          "id": "size-premium",
          "label": "36 Rosas Buchón Imperial (Premium)",
          "extraPrice": 85
        }
      ],
      "availableFlowerColors": [
        "Rojo Romántico",
        "Rosa Pastel",
        "Azul Cielo",
        "Blanco Puro"
      ],
      "includesDedicatoryCard": true
    },
    "variants": [
      {
        "id": "v-rojo",
        "name": "Rojo Pasión",
        "stock": 15,
        "price": 69
      },
      {
        "id": "v-rosa",
        "name": "Rosa Pastel",
        "stock": 12,
        "price": 69
      },
      {
        "id": "v-azul",
        "name": "Azul Real",
        "stock": 10,
        "price": 69
      }
    ],
    "stock": 25,
    "occasions": [
      "aniversario",
      "san-valentin",
      "cumpleanos",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-ramo-carritos",
    "name": "Ramo Sorpresa de Carritos Hot Wheels & Rosas",
    "slug": "ramo-sorpresa-carritos-hot-wheels-rosas",
    "category": "cat-ramos",
    "shortDescription": "Carritos originales Hot Wheels coleccionables combinados con rosas satinadas y chocolates.",
    "description": "¡El regalo viral favorito para sorprender a él! Diseñado en bouquet negro mate con vehículos Hot Wheels nuevos sellados en sus soportes, rosas de satén hechas a mano y bombones Ferrero Rocher.",
    "price": 59,
    "comparePrice": 75,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Ramo_Carritos_Premium_Final.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo_Carritos_Especial.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo_Carritos_Sencillo.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo gran sorpresa de carritos y rosas-7.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo de carritos con rosas y chocolates-1.png",
      "/imagenes/20_Ramos_y_Regalos/Mini ramo con carrito y rosas satinadas-5.png"
    ],
    "whatIncludes": [
      "Carritos Hot Wheels originales surtidos en escala 1:64",
      "Rosas satinadas confeccionadas artesanalmente",
      "Bombones de chocolate Ferrero Rocher",
      "Envoltura de lujo en papel negro y dorado con lazo satinado",
      "Tarjeta con dedicatoria personalizada"
    ],
    "whatExcludes": [
      "Modelos específicos de edición limitada numerada"
    ],
    "isBouquet": true,
    "bouquetDetails": {
      "sizes": [
        {
          "id": "hw-3",
          "label": "3 Carritos Hot Wheels + Rosas (Sencillo)",
          "extraPrice": 0
        },
        {
          "id": "hw-5",
          "label": "5 Carritos Hot Wheels + Rosas (Especial)",
          "extraPrice": 35
        },
        {
          "id": "hw-7",
          "label": "7 Carritos Hot Wheels + Chocolates (Premium Final)",
          "extraPrice": 70
        }
      ],
      "availableFlowerColors": [
        "Negro & Dorado",
        "Rojo & Negro",
        "Azul Metálico"
      ],
      "includesDedicatoryCard": true
    },
    "variants": [
      {
        "id": "v-hw-std",
        "name": "Pack Hot Wheels Clásico",
        "stock": 18,
        "price": 59
      }
    ],
    "stock": 18,
    "occasions": [
      "cumpleanos",
      "aniversario",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-limpiapipas",
    "name": "Ramo de Flores de Limpiapipas Artesanales (Jardín Eterno)",
    "slug": "ramo-flores-limpiapipas-artesanales",
    "category": "cat-ramos",
    "shortDescription": "Flores afelpadas confeccionadas 100% a mano con limpiapipas en tonos pasteles y girasoles.",
    "description": "Tierno y duradero arreglo floral artesanal. Cada flor está moldeada con limpiapipas aterciopelados de colores vivos que nunca pierden su forma. Incluye girasoles sonrientes, tulipanes y margaritas.",
    "price": 59,
    "comparePrice": 75,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Premium_Final.png",
      "/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Especial.png",
      "/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Sencillo.png",
      "/imagenes/20_Ramos_y_Regalos/Jardín especial de flores de limpiapipas-2.png"
    ],
    "whatIncludes": [
      "Girasoles, tulipanes y margaritas de limpiapipas",
      "Envoltura coreana en papel kraft y seda suave",
      "Tarjeta con dedicatoria impresa caligráfica",
      "Luces cálidas de microhadas"
    ],
    "whatExcludes": [
      "Florero cilíndrico"
    ],
    "isBouquet": true,
    "bouquetDetails": {
      "sizes": [
        {
          "id": "lp-sencillo",
          "label": "Ramo Tierno 6 Flores (Sencillo)",
          "extraPrice": 0
        },
        {
          "id": "lp-especial",
          "label": "Ramo Jardín 12 Flores (Especial)",
          "extraPrice": 30
        },
        {
          "id": "lp-premium",
          "label": "Ramo Gran Jardín 18 Flores (Premium Final)",
          "extraPrice": 60
        }
      ],
      "availableFlowerColors": [
        "Multicolor Pastel",
        "Girasoles & Margaritas",
        "Lila & Rosa"
      ],
      "includesDedicatoryCard": true
    },
    "variants": [
      {
        "id": "v-lp-pastel",
        "name": "Paleta Pastel",
        "stock": 20,
        "price": 59
      }
    ],
    "stock": 20,
    "occasions": [
      "cumpleanos",
      "san-valentin",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-capibara-girasoles",
    "name": "Ramo Capibara y Girasoles \"Abrazo Soleado\"",
    "slug": "ramo-capibara-girasoles-abrazo-soleado",
    "category": "cat-ramos",
    "shortDescription": "Peluche de capibara adorable en el centro rodeado de girasoles radiantes y follaje.",
    "description": "El detalle más tierno y reconfortante. Incluye un peluche de capibara de felpa ultra suave sujetando una flor, rodeado de girasoles artesanales y envoltura en tonos cálidos miel.",
    "price": 49,
    "comparePrice": 63,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Capibara y girasoles_ abrazo soleado-6.png",
      "/imagenes/20_Ramos_y_Regalos/Trío soleado de girasoles artesanales-1.png"
    ],
    "whatIncludes": [
      "1x Peluche de capibara premium importado suave",
      "Girasoles artesanales de satén y limpiapipas",
      "Envoltura coreana en doble tono mantequilla",
      "Tarjeta con mensaje dedicatorio"
    ],
    "whatExcludes": [],
    "isBouquet": true,
    "bouquetDetails": {
      "sizes": [
        {
          "id": "capi-std",
          "label": "Bouquet Completo con Capibara",
          "extraPrice": 0
        }
      ],
      "availableFlowerColors": [
        "Amarillo Sol & Miel"
      ],
      "includesDedicatoryCard": true
    },
    "variants": [
      {
        "id": "v-capi",
        "name": "Estándar",
        "stock": 12,
        "price": 49
      }
    ],
    "stock": 12,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-ramo-ositos",
    "name": "Ramo de Ositos \"Juntos Siempre\"",
    "slug": "ramo-ositos-juntos-siempre",
    "category": "cat-ramos",
    "shortDescription": "Parejita de ositos abrazados con ramo de rosas de papel y satén con corona y luces.",
    "description": "Símbolo de unión y complicidad. Dos ositos de felpa con coronita dorada rodeados de rosas de satén en tono rosa y blanco, envoltura con bordes ondulados y luces LED.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Ramo de ositos juntos siempre-7.png",
      "/imagenes/20_Ramos_y_Regalos/Dulce detalle_ seis rosas de papel-4.png"
    ],
    "whatIncludes": [
      "2x Ositos de felpa vestidos de novios/pareja",
      "Rosas satinadas y flores de papel artesanales",
      "Luces cálidas integradas",
      "Tarjeta de amor personalizada"
    ],
    "whatExcludes": [],
    "isBouquet": true,
    "bouquetDetails": {
      "sizes": [
        {
          "id": "ositos-std",
          "label": "Bouquet Dúo Ositos",
          "extraPrice": 0
        }
      ],
      "availableFlowerColors": [
        "Rosa Tierno & Blanco",
        "Rojo & Crema"
      ],
      "includesDedicatoryCard": true
    },
    "variants": [
      {
        "id": "v-ositos",
        "name": "Dúo Ositos Rosas",
        "stock": 10,
        "price": 69
      }
    ],
    "stock": 10,
    "occasions": [
      "aniversario",
      "san-valentin"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-estrellitas-origami",
    "name": "Ramo de Estrellitas Origami Pastel Galaxy",
    "slug": "ramo-estrellitas-origami-pastel",
    "category": "cat-ramos",
    "shortDescription": "Cientos de estrellas de papel origami dobladas artesanalmente con rosas azules y luces.",
    "description": "Hecho a mano con paciencia y detalle. Cada estrella representa un deseo y está doblada en papel japonés en tonos celestes y pasteles, rodeada de rosas artesanales y luces tenues.",
    "price": 39,
    "comparePrice": 51,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Ramo de estrellitas origami pastel-5.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo azul de cinco rosas artesanales-3.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo artesanal de siete rosas de papel-4.png"
    ],
    "whatIncludes": [
      "Más de 100 estrellas origami plegadas a mano",
      "Rosas azules artesanales de satén",
      "Envoltura azul medianoche y tul estrellado",
      "Tarjeta caligrafiada"
    ],
    "whatExcludes": [],
    "isBouquet": true,
    "bouquetDetails": {
      "sizes": [
        {
          "id": "origami-std",
          "label": "Ramo Galaxia 100 Estrellas",
          "extraPrice": 0
        }
      ],
      "availableFlowerColors": [
        "Azul Galaxia",
        "Rosa Pastel",
        "Multicolor"
      ],
      "includesDedicatoryCard": true
    },
    "variants": [
      {
        "id": "v-origami",
        "name": "Azul Galaxia",
        "stock": 14,
        "price": 39
      }
    ],
    "stock": 14,
    "occasions": [
      "cumpleanos",
      "aniversario",
      "porque-si"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-duo-joker-harley",
    "name": "Disfraz Dúo Pareja: Joker & Harley Quinn Comics",
    "slug": "disfraz-duo-pareja-joker-harley-quinn",
    "category": "cat-disfraces",
    "shortDescription": "Conjunto completo temático para pareja con selección independiente de talla para cada uno.",
    "description": "El conjunto definitivo de villanos de cómic. Incluye traje completo de Joker con chaqueta morada, chaleco amarillo y pantalón a juego; y conjunto de Harley Quinn con top, chaqueta bicolor y accesorios. Material elástico de alta comodidad.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Joker_y_Harley_Quinn.png",
      "/imagenes/08_Villanas_y_Antiheroinas_Comics/Harley_Quinn.png",
      "/imagenes/10_Villanos_Masculinos/Joker_v01.png"
    ],
    "whatIncludes": [
      "1x Traje Joker completo (Chaqueta morada + Chaleco + Camisa + Pantalón)",
      "1x Conjunto Harley Quinn (Chaqueta bicolor + Top + Short / Falda + Guantes)",
      "Tallas independientes para cada integrante",
      "Bolsa portatrajes protectora InspoMood"
    ],
    "whatExcludes": [
      "Calzado o zapatillas de los modelos"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Joker",
      "person2Label": "Talla Harley Quinn",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "El precio de S/ 195.00 incluye los dos disfraces completos."
    },
    "variants": [
      {
        "id": "v-joker-harley",
        "name": "Pack Dúo Estándar",
        "stock": 8,
        "price": 159
      }
    ],
    "stock": 8,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": true,
    "active": true
  },
  {
    "id": "prod-duo-aladdin-jasmine",
    "name": "Disfraz Dúo Pareja: Aladdin & Jasmine Noches de Arabia",
    "slug": "disfraz-duo-pareja-aladdin-jasmine",
    "category": "cat-disfraces",
    "shortDescription": "Elegantes trajes inspirados en Agrabah con telas satinadas y acabados dorados.",
    "description": "Viaja a un mundo ideal con tu persona favorita. Incluye conjunto de Aladdin con chaleco morado, pantalones bombachos blancos y faja dorada; y traje de Jasmine con top turquesa bordado, mallas/pantalón fluido y tiara decorativa.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Aladdin_y_Jasmine.png",
      "/imagenes/01_Princesas_Disney/Jasmine_Conjunto.png",
      "/imagenes/01_Princesas_Disney/Jasmine_Body_v01.png"
    ],
    "whatIncludes": [
      "1x Conjunto Aladdin (Chaleco + Camisa + Bombacho + Faja + Fez)",
      "1x Conjunto Jasmine (Top turquesa + Pantalón/Falda de velo + Diadema con gema)",
      "Tallas independientes por persona",
      "Portatrajes InspoMood"
    ],
    "whatExcludes": [
      "Lámpara mágica de metal",
      "Zapatillas"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Aladdin",
      "person2Label": "Talla Jasmine",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Precio completo por ambos trajes coordinados."
    },
    "variants": [
      {
        "id": "v-aladdin-jasmine",
        "name": "Pack Dúo Arabia",
        "stock": 10,
        "price": 159
      }
    ],
    "stock": 10,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": true,
    "active": true
  },
  {
    "id": "prod-duo-chucky-tiffany",
    "name": "Disfraz Dúo Pareja: Chucky & Tiffany Novia Diabólica",
    "slug": "disfraz-duo-pareja-chucky-tiffany",
    "category": "cat-disfraces",
    "shortDescription": "La pareja más icónica del terror con overol Good Guys y vestido de novia gótica.",
    "description": "Impresiona en cualquier fiesta temática. Traje de Chucky con suéter a rayas de punto y overol de corderoy con estampado Good Guys; y Tiffany con chaqueta de cuero sintético y vestido blanco de satén.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Chucky_y_Tiffany.png",
      "/imagenes/11_Terror_Femenino/Chucky.png",
      "/imagenes/12_Terror_Masculino/Chucky_Overol_baggy_largo.png"
    ],
    "whatIncludes": [
      "1x Overol Chucky Good Guys + Polo a rayas de manga larga",
      "1x Vestido de novia blanco Tiffany + Casaca biker de cuero vegano",
      "Tallas independientes por persona"
    ],
    "whatExcludes": [
      "Cuchillos de utilería",
      "Pelucas"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Chucky",
      "person2Label": "Talla Tiffany",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "El precio cubre los dos conjuntos completos."
    },
    "variants": [
      {
        "id": "v-chucky-tiffany",
        "name": "Pack Dúo Terror",
        "stock": 6,
        "price": 159
      }
    ],
    "stock": 6,
    "occasions": [
      "halloween"
    ],
    "isFeatured": true,
    "active": true
  },
  {
    "id": "prod-duo-angel-demonio",
    "name": "Disfraz Dúo Pareja: Ángel Celestial & Demonio Nocturno",
    "slug": "disfraz-duo-pareja-angel-demonio",
    "category": "cat-disfraces",
    "shortDescription": "Contraste perfecto en blanco y rojo/negro con alas estructuradas y accesorios.",
    "description": "La combinación de opuestos perfecta para parejas. Traje de ángel en blanco inmaculado con halo brillante y alas de plumas; y traje de demonio con cuernos texturizados, capa y tridente.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Angel_y_Demonio.png",
      "/imagenes/15_Fantasia_Mitologia_y_Western/Angel_Femenino.png",
      "/imagenes/15_Fantasia_Mitologia_y_Western/Diablo.png"
    ],
    "whatIncludes": [
      "1x Conjunto Ángel blanco + Alas de plumas + Halo",
      "1x Conjunto Demonio rojo/negro + Diadema cuernos + Capa",
      "Tallas individuales para cada uno"
    ],
    "whatExcludes": [
      "Calzado"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Demonio",
      "person2Label": "Talla Ángel",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Incluye ambos disfraces completos con sus alas y accesorios."
    },
    "variants": [
      {
        "id": "v-angel-demonio",
        "name": "Pack Dúo Fantasía",
        "stock": 12,
        "price": 159
      }
    ],
    "stock": 12,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-beetlejuice-lydia",
    "name": "Disfraz Dúo Pareja: Beetlejuice & Lydia Deetz",
    "slug": "disfraz-duo-pareja-beetlejuice-lydia",
    "category": "cat-disfraces",
    "shortDescription": "Traje a rayas blanco y negro icónico con vestido gótico rojo victoriano de Lydia.",
    "description": "Inspirado en el clásico de Tim Burton. Traje de Beetlejuice con saco y pantalón a rayas llamativas más corbata; y vestido de novia gótica rojo con velo dramático de encaje para Lydia.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Beetlejuice_y_Lydia.png"
    ],
    "whatIncludes": [
      "1x Traje Beetlejuice a rayas (Saco + Pantalón + Corbata)",
      "1x Vestido rojo encaje Lydia + Velo con tiara",
      "Tallas independientes para cada integrante"
    ],
    "whatExcludes": [
      "Peluca verde Beetlejuice"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Beetlejuice",
      "person2Label": "Talla Lydia",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Precio completo por el par de trajes."
    },
    "variants": [
      {
        "id": "v-bj-lydia",
        "name": "Pack Beetlejuice & Lydia",
        "stock": 7,
        "price": 159
      }
    ],
    "stock": 7,
    "occasions": [
      "halloween"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-morticia-gomez",
    "name": "Disfraz Dúo Pareja: Morticia & Gomez Addams",
    "slug": "disfraz-duo-pareja-morticia-gomez",
    "category": "cat-disfraces",
    "shortDescription": "Elegancia oscura y romance gótico eterno con vestido sirena y traje a rayas finas.",
    "description": "Para la pareja con el amor más apasionado y refinado. Vestido corte sirena de Morticia en terciopelo negro con mangas de telaraña; y traje diplomático a rayas de Gomez con corbata de moño.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Morticia_y_Gomez.png"
    ],
    "whatIncludes": [
      "1x Vestido sirena Morticia aterciopelado",
      "1x Saco y pantalón diplomático Gomez + Pajarita",
      "Rosa negra de cortesía"
    ],
    "whatExcludes": [
      "Cigarro falso Gomez",
      "Zapatos"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Gomez",
      "person2Label": "Talla Morticia",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Precio por los dos conjuntos elegantes completos."
    },
    "variants": [
      {
        "id": "v-addams",
        "name": "Pack Los Addams",
        "stock": 9,
        "price": 159
      }
    ],
    "stock": 9,
    "occasions": [
      "halloween",
      "aniversario"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-pirata-corsaria",
    "name": "Disfraz Dúo Pareja: Pirata Corsario & Capitana Rebelde",
    "slug": "disfraz-duo-pareja-pirata-corsaria",
    "category": "cat-disfraces",
    "shortDescription": "Aventura en alta mar con chalecos de cuero vegano, camisas con chorrera y pañuelos.",
    "description": "Conjunto coordinado de corsarios con ricos detalles de estilo colonial, cinturones con hebillas anchas y sombreros piratas con plumas.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Pirata_y_Corsaria.png",
      "/imagenes/13_Piratas_Femeninos/Capitana_Pirata_v01.png",
      "/imagenes/14_Piratas_Masculinos/Capitan_Pirata.png"
    ],
    "whatIncludes": [
      "1x Traje Pirata Masculino (Camisa + Chaleco + Pantalón + Faja + Sombrero)",
      "1x Traje Capitana Femenino (Corsé + Blusa campesina + Falda asimétrica + Pañuelo)",
      "Tallas independientes"
    ],
    "whatExcludes": [
      "Espadas de metal",
      "Botas"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Pirata",
      "person2Label": "Talla Corsaria",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "El precio incluye ambos trajes y accesorios de cabeza."
    },
    "variants": [
      {
        "id": "v-piratas",
        "name": "Pack Piratas",
        "stock": 11,
        "price": 159
      }
    ],
    "stock": 11,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-woody-bopeep",
    "name": "Disfraz Dúo Pareja: Woody & Bo Peep Toy Story",
    "slug": "disfraz-duo-pareja-woody-bo-peep",
    "category": "cat-disfraces",
    "shortDescription": "Los juguetes favoritos de Pixar en versión adorable con camisa amarilla y enterizo celeste.",
    "description": "Conjunto nostálgico y adorable. Woody con camisa a cuadros amarillos, chaleco estampado de vaquita y sombrero; Bo Peep con enterizo celeste, capa rosa y báculo decorativo.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Woody_y_Bo_Peep.png"
    ],
    "whatIncludes": [
      "1x Traje Woody (Camisa cuadros + Chaleco vaquita + Sombrero + Pañuelo)",
      "1x Traje Bo Peep (Enterizo celeste + Capa reversible rosa + Moño para el cabello)",
      "Tallas independientes"
    ],
    "whatExcludes": [
      "Botas vaqueras"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Woody",
      "person2Label": "Talla Bo Peep",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Incluye ambos disfraces completos."
    },
    "variants": [
      {
        "id": "v-toystory",
        "name": "Pack Woody & Bo Peep",
        "stock": 8,
        "price": 159
      }
    ],
    "stock": 8,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-vampiro-vampiresa",
    "name": "Disfraz Dúo Pareja: Vampiro Aristócrata & Vampiresa Gótica",
    "slug": "disfraz-duo-pareja-vampiros",
    "category": "cat-disfraces",
    "shortDescription": "Capas con cuello levantado forrado en satén carmesí y chalecos victorianos.",
    "description": "Clásico romance de la noche. Elegantes trajes victorianos en terciopelo y brocado negro con toques de rojo sangre, incluye capas con forro satinado.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Vampiro_y_Vampiresa.png",
      "/imagenes/12_Terror_Masculino/Vampiro.png"
    ],
    "whatIncludes": [
      "1x Traje Vampiro (Chaleco brocado + Camisa con chorrera + Capa satén rojo/negro)",
      "1x Traje Vampiresa (Corsé aterciopelado + Falda con capas + Capa corta)",
      "Tallas independientes"
    ],
    "whatExcludes": [
      "Colmillos protésicos",
      "Lentes de contacto"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Vampiro",
      "person2Label": "Talla Vampiresa",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Precio completo por ambos disfraces."
    },
    "variants": [
      {
        "id": "v-vampiros",
        "name": "Pack Vampiros",
        "stock": 7,
        "price": 159
      }
    ],
    "stock": 7,
    "occasions": [
      "halloween"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-ghostface",
    "name": "Disfraz Dúo Pareja: Dúo Ghostface Woodsboro",
    "slug": "disfraz-duo-pareja-ghostface",
    "category": "cat-disfraces",
    "shortDescription": "Túnicas negras rasgadas con mangas murciélago y las icónicas máscaras de Scream.",
    "description": "¿Cuál es tu película de terror favorita? Conjunto coordinado de Ghostface con túnicas negras fluidas con brillos sutiles, capuchas amplias y máscaras originales.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Duo_Ghostface.png",
      "/imagenes/11_Terror_Femenino/Ghostface_v01.png",
      "/imagenes/12_Terror_Masculino/Ghostface_Jean_baggy.png"
    ],
    "whatIncludes": [
      "2x Túnicas negras con capucha y mangas drapeadas",
      "2x Máscaras Ghostface oficiales",
      "2x Cinturones de ajuste"
    ],
    "whatExcludes": [
      "Cuchillos de utilería"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Persona 1",
      "person2Label": "Talla Persona 2",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Incluye las 2 túnicas y 2 máscaras completas."
    },
    "variants": [
      {
        "id": "v-ghostface",
        "name": "Pack Dúo Ghostface",
        "stock": 12,
        "price": 159
      }
    ],
    "stock": 12,
    "occasions": [
      "halloween"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-ninjas",
    "name": "Disfraz Dúo Pareja: Ninjas Urbanos Cyber Kage",
    "slug": "disfraz-duo-pareja-ninjas-urbanos",
    "category": "cat-disfraces",
    "shortDescription": "Atuendos tácticos negros con arneses rojos, capuchas y cubre bocas.",
    "description": "Estilo moderno y ágil. Trajes ajustados de tejido elástico transpirable con cintas rojas cruzadas en brazos y piernas, capuchas y antifaces ninjas.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Ninjas_Urbanos.png"
    ],
    "whatIncludes": [
      "2x Monos/Conjuntos ninja tácticos con capucha",
      "2x Cubrebocas/antifaces de tela",
      "Cintas decorativas rojas para extremidades"
    ],
    "whatExcludes": [
      "Katanas de utilería"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Ninja 1",
      "person2Label": "Talla Ninja 2",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Precio completo para ambas personas."
    },
    "variants": [
      {
        "id": "v-ninjas",
        "name": "Pack Ninjas",
        "stock": 10,
        "price": 159
      }
    ],
    "stock": 10,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-duo-rumi-jinu",
    "name": "Disfraz Dúo Pareja: Rumi & Jinu K-Pop Demon Hunters",
    "slug": "disfraz-duo-pareja-rumi-jinu",
    "category": "cat-disfraces",
    "shortDescription": "Diseño coreano moderno con estilo idol cazador de demonios con toques cyberpunk.",
    "description": "Atuendos coordinados de alta moda inspirados en la estética de bandas idol de K-Pop y cazadores de sombras. Prendas estructuradas con correajes decorativos y cortes modernos.",
    "price": 159,
    "comparePrice": 189,
    "images": [
      "/imagenes/18_Disfraces_en_Pareja/Rumi_y_Jinu.png",
      "/imagenes/06_KPop_Demon_Hunters/Rumi.png",
      "/imagenes/06_KPop_Demon_Hunters/Jinu_Saja_Boys_Masculino.png"
    ],
    "whatIncludes": [
      "1x Conjunto Masculino Jinu (Chaqueta estructurada + Pantalón cargo fino + Arnés)",
      "1x Conjunto Femenino Rumi (Top estilo crop idol + Falda/short + Cinturón utilitario)",
      "Tallas independientes"
    ],
    "whatExcludes": [
      "Accesorios luminosos"
    ],
    "isCoupleItem": true,
    "isCoupleSection": true,
    "coupleDetails": {
      "person1Label": "Talla Jinu",
      "person2Label": "Talla Rumi",
      "sizes": [
        "S",
        "M",
        "L",
        "XL"
      ],
      "pricingNote": "Precio completo por los 2 conjuntos coordinados."
    },
    "variants": [
      {
        "id": "v-kpop",
        "name": "Pack K-Pop Hunters",
        "stock": 8,
        "price": 159
      }
    ],
    "stock": 8,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-rapunzel",
    "name": "Disfraz Princesa Rapunzel Enredados Deluxe",
    "slug": "disfraz-princesa-rapunzel-deluxe",
    "category": "cat-disfraces",
    "shortDescription": "Body corsé morado con detalles en rosa pastel, mallas o falda y lazos dorados.",
    "description": "Inspirado en la princesa de la torre dorada. Confeccionado en terciopelo y satén morado con pasamanería dorada en el corpiño y mangas abullonadas en rosa y violeta.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/01_Princesas_Disney/Rapunzel_Body_y_mallas.png",
      "/imagenes/01_Princesas_Disney/Rapunzel_Minishort.png"
    ],
    "whatIncludes": [
      "1x Body / Corpiño corsé ajustable con mangas bombachas",
      "1x Mallas transparentes o minishort a elección",
      "Cinta para trenza con florecitas decorativas"
    ],
    "whatExcludes": [
      "Peluca rubia de 2 metros"
    ],
    "variants": [
      {
        "id": "rap-s",
        "name": "Talla S",
        "stock": 8,
        "price": 69
      },
      {
        "id": "rap-m",
        "name": "Talla M",
        "stock": 10,
        "price": 69
      },
      {
        "id": "rap-l",
        "name": "Talla L",
        "stock": 6,
        "price": 69
      }
    ],
    "stock": 24,
    "occasions": [
      "halloween",
      "cumpleanos",
      "porque-si"
    ],
    "isFeatured": true,
    "active": true
  },
  {
    "id": "prod-disfraz-ariel",
    "name": "Disfraz Princesa Ariel La Sirenita Glam",
    "slug": "disfraz-princesa-ariel-la-sirenita",
    "category": "cat-disfraces",
    "shortDescription": "Top morado en forma de caracola con body y mallas escamadas en verde esmeralda brillante.",
    "description": "Transformación marina deslumbrante. Corpiño morado con copas en forma de ostra satinada y mallas/short con textura escamada brillante que imita la cola de sirena.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/01_Princesas_Disney/Ariel_Body_y_mallas.png",
      "/imagenes/01_Princesas_Disney/Ariel_Minishort.png"
    ],
    "whatIncludes": [
      "1x Top caracola morado acolchado",
      "1x Mallas o minishort escamado en verde esmeralda",
      "Horquilla de estrella de mar"
    ],
    "whatExcludes": [
      "Peluca roja"
    ],
    "variants": [
      {
        "id": "ariel-s",
        "name": "Talla S",
        "stock": 7,
        "price": 69
      },
      {
        "id": "ariel-m",
        "name": "Talla M",
        "stock": 9,
        "price": 69
      },
      {
        "id": "ariel-l",
        "name": "Talla L",
        "stock": 5,
        "price": 69
      }
    ],
    "stock": 21,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-cruella",
    "name": "Disfraz Cruella de Vil Haute Couture",
    "slug": "disfraz-cruella-de-vil",
    "category": "cat-disfraces",
    "shortDescription": "Vestido/body negro ajustado con capa/estola de dálmata y guantes largos rojos.",
    "description": "Elegancia villana y teatral. Body negro en satén brillante, estola suave estampada de dálmata y guantes de ópera rojo pasión.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/02_Villanas_Disney/Cruella_Body_y_mallas.png",
      "/imagenes/02_Villanas_Disney/Cruella_Conjunto.png"
    ],
    "whatIncludes": [
      "1x Body / Vestido negro ajustado",
      "1x Estola afelpada con estampado de manchas dálmata",
      "1x Par de guantes largos rojos satinados"
    ],
    "whatExcludes": [
      "Boquilla para cigarrillo"
    ],
    "variants": [
      {
        "id": "cru-s",
        "name": "Talla S",
        "stock": 6,
        "price": 69
      },
      {
        "id": "cru-m",
        "name": "Talla M",
        "stock": 8,
        "price": 69
      },
      {
        "id": "cru-l",
        "name": "Talla L",
        "stock": 5,
        "price": 69
      }
    ],
    "stock": 19,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-malefica",
    "name": "Disfraz Maléfica Señora del Mal con Cuernos",
    "slug": "disfraz-malefica-reina-del-mal",
    "category": "cat-disfraces",
    "shortDescription": "Body negro entallado con cuello alzado dramático, mangas de murciélago y cuernos.",
    "description": "Poder y misticismo. Cuernos esculpidos ligeros de ajuste seguro, body en terciopelo negro y capa con cuello estructurado gótico.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/02_Villanas_Disney/Malefica_Body_y_mallas.png",
      "/imagenes/02_Villanas_Disney/Malefica_Conjunto.png"
    ],
    "whatIncludes": [
      "1x Body / Vestido negro con cuello alzado",
      "1x Diadema con cuernos de Maléfica texturizados",
      "Colgante gótico de cortesía"
    ],
    "whatExcludes": [
      "Cetro de cuervo"
    ],
    "variants": [
      {
        "id": "mal-s",
        "name": "Talla S",
        "stock": 5,
        "price": 69
      },
      {
        "id": "mal-m",
        "name": "Talla M",
        "stock": 7,
        "price": 69
      },
      {
        "id": "mal-l",
        "name": "Talla L",
        "stock": 4,
        "price": 69
      }
    ],
    "stock": 16,
    "occasions": [
      "halloween"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-tinkerbell",
    "name": "Disfraz Campanita / Tinkerbell Hada del Bosque",
    "slug": "disfraz-campanita-tinkerbell-hada",
    "category": "cat-disfraces",
    "shortDescription": "Vestidito verde lima con dobladillo en hojas de pico y alas transparentes tornasoladas.",
    "description": "La magia de Nunca Jamás en tu closet. Vestido en verde manzana con escote corazón y falda terminada en pétalos, acompañado de alas ligeras que reflejan brillos tornasol.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/03_Hadas/Tinkerbell_v02.png",
      "/imagenes/03_Hadas/Silvermist_v01.png",
      "/imagenes/03_Hadas/Rosetta.png"
    ],
    "whatIncludes": [
      "1x Vestido verde campanita con escote en pétalos",
      "1x Alas de hada transparentes tornasoladas",
      "Pompones blancos para zapatillas"
    ],
    "whatExcludes": [
      "Varita mágica"
    ],
    "variants": [
      {
        "id": "tink-s",
        "name": "Talla S",
        "stock": 6,
        "price": 69
      },
      {
        "id": "tink-m",
        "name": "Talla M",
        "stock": 8,
        "price": 69
      },
      {
        "id": "tink-l",
        "name": "Talla L",
        "stock": 4,
        "price": 69
      }
    ],
    "stock": 18,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-draculaura",
    "name": "Disfraz Draculaura Monster High Sweet Goth",
    "slug": "disfraz-draculaura-monster-high",
    "category": "cat-disfraces",
    "shortDescription": "Chaleco rosa fucsia con chorrera blanca de encaje, faldita plisada blanca y mallas negras.",
    "description": "El estilo vampírico más coqueto de Monster High. Chaleco rosa con botones plateados, mangas de malla transparente y falda tableada.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/04_Monster_High/Draculaura.png",
      "/imagenes/04_Monster_High/Frankie_Stein.png",
      "/imagenes/04_Monster_High/Clawdeen_Wolf.png",
      "/imagenes/04_Monster_High/Cleo_de_Nile.png"
    ],
    "whatIncludes": [
      "1x Chaleco rosa con chorrera y mangas de red",
      "1x Falda tableada blanca",
      "1x Mallas transparentes con diseño",
      "Tatuaje adhesivo de corazón para mejilla"
    ],
    "whatExcludes": [
      "Botas rosas altas"
    ],
    "variants": [
      {
        "id": "drac-s",
        "name": "Talla S",
        "stock": 7,
        "price": 69
      },
      {
        "id": "drac-m",
        "name": "Talla M",
        "stock": 9,
        "price": 69
      },
      {
        "id": "drac-l",
        "name": "Talla L",
        "stock": 4,
        "price": 69
      }
    ],
    "stock": 20,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-kim-possible",
    "name": "Disfraz Kim Possible & Shego (Serie Animada)",
    "slug": "disfraz-kim-possible-shego",
    "category": "cat-disfraces",
    "shortDescription": "Crop top negro de cuello alto, pantalón cargo verde militar y cinturón utilitario.",
    "description": "¿Cuál es la situación? Disfraz fiel al clásico de Disney Channel con top ajustado de manga larga, pantalón cargo holgado con bolsillos reales y cinturón con cartucheras.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/05_Series_Disney/Kim_Possible_Conjunto.png",
      "/imagenes/05_Series_Disney/Kim_Possible_Minishort.png",
      "/imagenes/05_Series_Disney/Shego_Body.png",
      "/imagenes/05_Series_Disney/Shego_Conjunto.png"
    ],
    "whatIncludes": [
      "1x Crop top manga larga negro de cuello tortuga",
      "1x Pantalón cargo verde militar con elástico en tobillos",
      "1x Cinturón utilitario marrón con bolsillos",
      "Guantes negros"
    ],
    "whatExcludes": [
      "Kimmunicator de juguete"
    ],
    "variants": [
      {
        "id": "kim-s",
        "name": "Talla S",
        "stock": 8,
        "price": 69
      },
      {
        "id": "kim-m",
        "name": "Talla M",
        "stock": 10,
        "price": 69
      },
      {
        "id": "kim-l",
        "name": "Talla L",
        "stock": 6,
        "price": 69
      }
    ],
    "stock": 24,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-spider-gwen",
    "name": "Disfraz Spider-Gwen Heroína Arácnida",
    "slug": "disfraz-spider-gwen-multiverso",
    "category": "cat-disfraces",
    "shortDescription": "Enterizo sublimado con capucha forrada en telaraña rosa y máscara con lentes 3D.",
    "description": "Del multiverso arácnido a tu fiesta. Enterizo de spandex de alta elasticidad en blanco, negro y fucsia con capucha incorporada y antifaz a juego.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/07_Superheroinas_y_Versiones_Femeninas/Spider_Gwen.png",
      "/imagenes/07_Superheroinas_y_Versiones_Femeninas/Scarlet_Witch_v01.png",
      "/imagenes/07_Superheroinas_y_Versiones_Femeninas/Batgirl_v01.png"
    ],
    "whatIncludes": [
      "1x Enterizo de spandex completo con capucha estampada",
      "1x Máscara de tela con visor"
    ],
    "whatExcludes": [
      "Zapatillas de ballet"
    ],
    "variants": [
      {
        "id": "sg-s",
        "name": "Talla S",
        "stock": 6,
        "price": 69
      },
      {
        "id": "sg-m",
        "name": "Talla M",
        "stock": 8,
        "price": 69
      },
      {
        "id": "sg-l",
        "name": "Talla L",
        "stock": 4,
        "price": 69
      }
    ],
    "stock": 18,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-gatita",
    "name": "Disfraz Gatita Coquette Glam Velvet",
    "slug": "disfraz-gatita-coquette-glam",
    "category": "cat-disfraces",
    "shortDescription": "Body de terciopelo suave con orejitas esponjosas, collar de lazo y colita afelpada.",
    "description": "Súper tierno y favorecedor. Confeccionado en velvet de tacto sedoso con diadema de orejas de gato, gargantilla con cascabel o dije y colita modelable.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/17_Animales/Gatita_Rosado_Final.png",
      "/imagenes/17_Animales/Gatita_Negro.png",
      "/imagenes/17_Animales/Gatita_Blanco.png",
      "/imagenes/17_Animales/Gatita_Rojo.png"
    ],
    "whatIncludes": [
      "1x Body entallado de terciopelo elástico",
      "1x Diadema con orejas afelpadas de gatita",
      "1x Cola con broche de seguridad",
      "Gargantilla con cascabel"
    ],
    "whatExcludes": [
      "Medias de malla"
    ],
    "variants": [
      {
        "id": "gat-rosa",
        "name": "Rosa Pastel",
        "stock": 8,
        "price": 69
      },
      {
        "id": "gat-negro",
        "name": "Negro Medianoche",
        "stock": 10,
        "price": 69
      },
      {
        "id": "gat-blanco",
        "name": "Blanco Nieve",
        "stock": 6,
        "price": 69
      }
    ],
    "stock": 24,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-disfraz-conejita",
    "name": "Disfraz Conejita Sweet Bunny Velvet",
    "slug": "disfraz-conejita-sweet-bunny",
    "category": "cat-disfraces",
    "shortDescription": "Body corte clásico con orejas largas flexibles de conejo, corbata de moño y puños.",
    "description": "Elegancia clásica de conejita en terciopelo suave. Incluye diadema con orejas altas modelables con alambre interno, puños blancos y pompón trasero.",
    "price": 69,
    "comparePrice": 86,
    "images": [
      "/imagenes/17_Animales/Conejita_Blanco.png",
      "/imagenes/17_Animales/Conejita_Rosado.png",
      "/imagenes/17_Animales/Conejita_Negro.png",
      "/imagenes/17_Animales/Conejita_Lila.png"
    ],
    "whatIncludes": [
      "1x Body aterciopelado con copas estructuradas",
      "1x Diadema con orejas altas flexibles",
      "1x Cuello blanco con pajarita de moño",
      "Puños y pompón trasero"
    ],
    "whatExcludes": [],
    "variants": [
      {
        "id": "con-blanco",
        "name": "Blanco",
        "stock": 8,
        "price": 69
      },
      {
        "id": "con-rosa",
        "name": "Rosado",
        "stock": 8,
        "price": 69
      },
      {
        "id": "con-negro",
        "name": "Negro",
        "stock": 7,
        "price": 69
      }
    ],
    "stock": 23,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-kit-citas",
    "name": "Kit de Citas y Recuerdos InspoMood (100 Citas + Álbum)",
    "slug": "kit-citas-y-recuerdos-inspomood",
    "category": "cat-personalizados",
    "shortDescription": "Caja de madera con tarjetas raspables de 100 citas secretas, fotos polaroid y álbum.",
    "description": "El regalo más especial para parejas. Incluye 100 tarjetas raspables con ideas de citas creativas divididas en categorías (en casa, al aire libre, románticas y aventuras), mini álbum para pegar las fotos y cámara de fotos de recuerdo.",
    "price": 59,
    "comparePrice": 75,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Kit de citas y recuerdos-8.png",
      "/imagenes/20_Ramos_y_Regalos/Caja de regalo elegante para él-2.png"
    ],
    "whatIncludes": [
      "100x Tarjetas raspables con citas y retos para dos",
      "1x Álbum de recuerdos en pasta dura con hojas kraft",
      "10x Mini fotos Polaroid personalizadas con sus recuerdos",
      "Caja de presentación InspoMood con listón"
    ],
    "whatExcludes": [],
    "isPersonalized": true,
    "personalizedFields": [
      {
        "id": "p-nombres",
        "fieldName": "Nombres de la pareja",
        "placeholder": "Ej: Camila & Diego",
        "extraCharge": 0
      },
      {
        "id": "p-fecha",
        "fieldName": "Fecha especial o aniversario",
        "placeholder": "Ej: 14/02/2024",
        "extraCharge": 0
      }
    ],
    "variants": [
      {
        "id": "v-kit",
        "name": "Edición Romance Completa",
        "stock": 15,
        "price": 59
      }
    ],
    "stock": 15,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "san-valentin",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-caja-para-el",
    "name": "Caja de Regalo Elegante \"Para Él\" Edición Noir",
    "slug": "caja-regalo-elegante-para-el-noir",
    "category": "cat-personalizados",
    "shortDescription": "Presentación de lujo en negro mate con billetera de cuero, perfume de bolsillo y chocolates.",
    "description": "Un detalle pensado exclusivamente para él. Incluye caja rígida negra con lazo satinado, viruta aromática, billetera o tarjetero personalizado y chocolates finos.",
    "price": 79,
    "comparePrice": 98,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Caja de regalo elegante para él-2.png",
      "/imagenes/20_Ramos_y_Regalos/Ramo_Carritos_Sencillo.png"
    ],
    "whatIncludes": [
      "Caja rígida negra de alta resistencia con cierre magnético",
      "Billetera de cuero legítimo con grabado de iniciales",
      "Chocolates Ferrero Rocher en estuche",
      "Tarjeta dedicatoria en papel de alto gramaje"
    ],
    "whatExcludes": [],
    "isPersonalized": true,
    "personalizedFields": [
      {
        "id": "p-inici",
        "fieldName": "Iniciales para grabado",
        "placeholder": "Ej: D.A.",
        "extraCharge": 0
      }
    ],
    "variants": [
      {
        "id": "v-box",
        "name": "Caja Noir Completa",
        "stock": 11,
        "price": 79
      }
    ],
    "stock": 11,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "porque-si"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-catalogo-15-prendas",
    "name": "Arma tu Disfraz: Catálogo 15 Prendas Mix & Match",
    "slug": "arma-tu-disfraz-15-prendas-mix-match",
    "category": "cat-ropa-accesorios",
    "shortDescription": "Combina bodies, tops, faldas, shorts y accesorios para armar el outfit temático a tu estilo.",
    "description": "Libertad total para armar tu disfraz favorito. Selecciona entre nuestra variedad de 15 piezas independientes confeccionadas en telas prémium: terciopelo, charol, spandex y encaje.",
    "price": 79,
    "comparePrice": 98,
    "images": [
      "/imagenes/19_Catalogos_Prendas_Independientes/Arma_tu_disfraz_15_prendas.png",
      "/imagenes/19_Catalogos_Prendas_Independientes/Catalogo_01_Pop_y_Aventura.png",
      "/imagenes/19_Catalogos_Prendas_Independientes/Catalogo_02_Villanas_y_Glamour.png",
      "/imagenes/19_Catalogos_Prendas_Independientes/Catalogo_03_Fantasia_y_Western.png"
    ],
    "whatIncludes": [
      "1x Prenda superior a elección (Body o Crop top)",
      "1x Prenda inferior a elección (Falda, Short o Pantalón)",
      "1x Accesorio temático (Diadema, guantes o antifaz)",
      "Bolsa portaprendas InspoMood"
    ],
    "whatExcludes": [],
    "variants": [
      {
        "id": "v-s",
        "name": "Talla S",
        "stock": 10,
        "price": 79
      },
      {
        "id": "v-m",
        "name": "Talla M",
        "stock": 12,
        "price": 79
      },
      {
        "id": "v-l",
        "name": "Talla L",
        "stock": 8,
        "price": 79
      }
    ],
    "stock": 30,
    "occasions": [
      "halloween",
      "porque-si"
    ],
    "isFeatured": false,
    "active": true
  },
  {
    "id": "prod-combo-amor",
    "name": "Combo InspoMood Dúo Amor: Ramo Romance + Kit de Citas + Caja Sorpresa",
    "slug": "combo-inspomood-duo-amor-ramo-kit",
    "category": "cat-combos",
    "shortDescription": "El pack más completo: Ramo de Rosas de Satén + Kit 100 Citas + Caja de lujo con dedicatoria.",
    "description": "La experiencia de regalo total para derretir el corazón de tu persona favorita. Combina nuestro ramo de rosas eternas hechas a mano, el kit con 100 citas secretas y fotos polaroid.",
    "price": 89,
    "comparePrice": 110,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Ramo Romance de rosas de satén-3.png",
      "/imagenes/20_Ramos_y_Regalos/Kit de citas y recuerdos-8.png",
      "/imagenes/20_Ramos_y_Regalos/Rosas_Eternas_Premium.png"
    ],
    "whatIncludes": [
      "Ramo de Rosas de Satén con luces micro LED",
      "Kit de 100 citas raspables con álbum de recuerdos",
      "10 fotos polaroid impresas con sus mejores momentos",
      "Empaque de regalo imperial InspoMood con tarjeta caligrafiada"
    ],
    "whatExcludes": [],
    "variants": [
      {
        "id": "v-combo-total",
        "name": "Combo Imperial Completo",
        "stock": 14,
        "price": 89
      }
    ],
    "stock": 14,
    "occasions": [
      "aniversario",
      "san-valentin",
      "cumpleanos"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-perfume-noche-juntos",
    "name": "Perfume Signature \"InspoMood Noche Juntos\" EDP 100ml",
    "slug": "perfume-noche-juntos-eau-de-parfum",
    "category": "cat-perfumes",
    "shortDescription": "Fragancia unisex cálida de autor presentada en estuche InspoMood con accesorios.",
    "description": "Una fragancia íntima y envolvente desarrollada artesanalmente. Abre con toques suaves de bergamota dulce, corazón de vainilla bourbon y fondo de sándalo y almizcle blanco.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Set de perfume con logo InspoMood.png",
      "/imagenes/20_Ramos_y_Regalos/Set de regalo InspoMood con perfume.png",
      "/imagenes/20_Ramos_y_Regalos/Tarjeta de catálogo con logo InspoMood original.png"
    ],
    "whatIncludes": [
      "Frasco de vidrio ámbar de 100ml con tapa de madera maciza",
      "Caja rígida protectora con cierre magnético y diseño InspoMood",
      "Muestra de cortesía de 3ml de fragancia complementaria"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 100,
      "presentation": "Frasco de vidrio ámbar pesado con atomizador de micropulverización",
      "notesSummary": "Salida de bergamota suave; cuerpo de vainilla de Madagascar; fondo amaderado de sándalo y almizcle cálido."
    },
    "variants": [
      {
        "id": "v-100ml",
        "name": "100ml Eau de Parfum",
        "stock": 12,
        "price": 109
      }
    ],
    "stock": 12,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "san-valentin"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-bleu-chanel",
    "name": "Box Deluxe para Él: Bleu de Chanel & Rosas Eternas",
    "slug": "box-deluxe-para-el-bleu-de-chanel",
    "category": "cat-perfumes",
    "shortDescription": "Caja rígida negra con Bleu de Chanel 100ml, rosas eternas rojas, bombones y tarjeta caligrafiada.",
    "description": "El regalo definitivo para él. Incluye el icónico perfume amaderado aromático Bleu de Chanel en presentación de lujo sobre cama de rosas preservadas y detalles dorados.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Detalle para él con Bleu de Chanel.png",
      "/imagenes/20_Ramos_y_Regalos/Detalle elegante con perfume y accesorios.png"
    ],
    "whatIncludes": [
      "Perfume Bleu de Chanel 100ml en frasco original sellado",
      "Caja rígida protectora con lazo de satén negro",
      "Arreglo de rosas eternas artesanales",
      "Tarjeta personalizada con dedicatoria"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 100,
      "presentation": "Frasco de autor con atomizador spray de lujo",
      "notesSummary": "Limón fresco, cedro seco, incienso y fondo aromático de sándalo."
    },
    "variants": [
      {
        "id": "var-100ml",
        "name": "Presentación 100ml Box Completo",
        "price": 109,
        "stock": 10
      }
    ],
    "stock": 10,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "san-valentin"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-dior-sauvage",
    "name": "Box Exclusivo para Él: Dior Sauvage & Accesorios Noir",
    "slug": "box-exclusivo-para-el-dior-sauvage",
    "category": "cat-perfumes",
    "shortDescription": "Set masculino con Dior Sauvage 100ml, accesorios de cuero y rosas preservadas.",
    "description": "Una composición poderosa e instintiva. Presentada en caja magnética con fragancia Dior Sauvage, complementos masculinos y envoltura de alta gama.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Detalle para él_ Sauvage y accesorios.png",
      "/imagenes/20_Ramos_y_Regalos/Detalle para él con Bleu de Chanel.png"
    ],
    "whatIncludes": [
      "Perfume Dior Sauvage 100ml",
      "Brazalete o accesorio noir a juego",
      "Caja de madera lacada o rígida de lujo",
      "Tarjeta dedicatoria lacrada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 100,
      "presentation": "Frasco degradado azul noche con tapa magnética",
      "notesSummary": "Bergamota picante de Reggio, pimienta de Sichuan y ambroxan ambarado."
    },
    "variants": [
      {
        "id": "var-100ml",
        "name": "Set Sauvage 100ml",
        "price": 109,
        "stock": 8
      }
    ],
    "stock": 8,
    "occasions": [
      "cumpleanos",
      "aniversario",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-jpg-le-male",
    "name": "Caja de Regalo de Lujo: JPG Le Male Le Parfum Edition",
    "slug": "caja-regalo-jpg-le-male-le-parfum",
    "category": "cat-perfumes",
    "shortDescription": "Estuche de colección con Jean Paul Gaultier Le Male Le Parfum 125ml y orquídeas satinadas.",
    "description": "Viste de gala tu sorpresa con Le Male Le Parfum en frasco negro con detalles dorados de capitán. Elegancia pura para momentos inolvidables.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Caja de regalo Le Male Le Parfum.png"
    ],
    "whatIncludes": [
      "Jean Paul Gaultier Le Male Le Parfum 125ml",
      "Caja premium acolchada con cinta dorada",
      "Detalle floral artesanal a juego",
      "Dedicatoria personalizada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 125,
      "presentation": "Busto icónico negro y dorado mate",
      "notesSummary": "Cardamomo intenso, lavanda irisada, vainilla oriental y maderas nobles."
    },
    "variants": [
      {
        "id": "var-125ml",
        "name": "Frasco 125ml Box Deluxe",
        "price": 109,
        "stock": 7
      }
    ],
    "stock": 7,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "san-valentin"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-acqua-di-gio",
    "name": "Set Elegante para Él: Giorgio Armani Acqua di Giò",
    "slug": "set-elegante-giorgio-armani-acqua-di-gio",
    "category": "cat-perfumes",
    "shortDescription": "Aroma fresco acuático con notas mediterráneas y flores satinadas.",
    "description": "La frescura del mar y el sol capturada en una caja de regalo artesanal. Un clásico infalible para sorprender a él en su día.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Regalo elegante con Acqua di Giò.png"
    ],
    "whatIncludes": [
      "Perfume Giorgio Armani Acqua di Giò 100ml",
      "Caja de regalo InspoMood",
      "Luces micro-LED cálidas de ambientación",
      "Tarjeta dedicatoria"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 100,
      "presentation": "Frasco de vidrio esmerilado",
      "notesSummary": "Mandarina verde, notas marinas, romero y pachulí blanco."
    },
    "variants": [
      {
        "id": "var-100ml",
        "name": "Presentación 100ml",
        "price": 109,
        "stock": 10
      }
    ],
    "stock": 10,
    "occasions": [
      "cumpleanos",
      "porque-si",
      "aniversario"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-good-girl",
    "name": "Box Alta Gama para Ella: Carolina Herrera Good Girl & Rosas",
    "slug": "box-alta-gama-carolina-herrera-good-girl",
    "category": "cat-perfumes",
    "shortDescription": "Caja de ensueño con el icónico stiletto Good Girl 80ml, rosas rojas y mariposas doradas.",
    "description": "La combinación perfecta de audacia y sofisticación. El tacón de Good Girl rodeado de rosas eternas artesanales y luces tenues para derretirle el corazón.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Regalo elegante con perfume Good Girl.png",
      "/imagenes/20_Ramos_y_Regalos/Regalo para ella con Good Girl.png"
    ],
    "whatIncludes": [
      "Perfume Carolina Herrera Good Girl 80ml stiletto original",
      "Arreglo de rosas de satén de alta confección",
      "Mariposa de cristal decorativa y luces cálidas",
      "Caja rígida con lazo de seda y dedicatoria"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 80,
      "presentation": "Frasco zapato tacón de aguja azul medianoche",
      "notesSummary": "Almendra, café, nardo, jazmín sambac, haba tonka y cacao."
    },
    "variants": [
      {
        "id": "var-80ml",
        "name": "Stiletto 80ml Box Deluxe",
        "price": 109,
        "stock": 12
      }
    ],
    "stock": 12,
    "occasions": [
      "aniversario",
      "san-valentin",
      "cumpleanos"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-ysl-libre",
    "name": "Box Glamour para Ella: YSL Libre Eau de Parfum",
    "slug": "box-glamour-ysl-libre-eau-de-parfum",
    "category": "cat-perfumes",
    "shortDescription": "Fragancia floral de alta costura con azahar de Marruecos y rosas de satén crema.",
    "description": "Libre de Yves Saint Laurent representa la libertad y la elegancia sensual. Presentado en una delicada caja regalo con detalles en dorado y lazo rosa pastel.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Detalle para ella con Libre.png"
    ],
    "whatIncludes": [
      "Perfume YSL Libre Eau de Parfum 90ml",
      "Caja de regalo artesanal con acabado sedoso",
      "Rosas eternas en tonos pastel",
      "Tarjeta personalizada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 90,
      "presentation": "Frasco joya con logotipo Cassandre dorado en relieve",
      "notesSummary": "Lavanda francesa, flor de naranja de Marruecos, orquídea y vainilla."
    },
    "variants": [
      {
        "id": "var-90ml",
        "name": "Libre EDP 90ml Box",
        "price": 109,
        "stock": 9
      }
    ],
    "stock": 9,
    "occasions": [
      "cumpleanos",
      "aniversario",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-la-vie-est-belle",
    "name": "Box Romántico: Lancôme La Vie Est Belle & Arreglo Floral",
    "slug": "box-romantico-lancome-la-vie-est-belle",
    "category": "cat-perfumes",
    "shortDescription": "La icónica sonrisa de cristal de Lancôme en una caja de regalo con flores eternas.",
    "description": "Haz que la vida sea hermosa con esta fragancia dulce e inolvidable de Lancôme. Presentada sobre un lecho de rosas artesanales de satén y bombones finos.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Detalle para ella_ La Vie Est Belle.png"
    ],
    "whatIncludes": [
      "Perfume Lancôme La Vie Est Belle 100ml",
      "Lazo de organza gris en el cuello del frasco",
      "Arreglo floral artesanal en tonos rosados",
      "Dedicatoria personalizada caligrafiada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 100,
      "presentation": "Frasco con sonrisa de cristal y alas de libertad",
      "notesSummary": "Iris pallida, pachulí dulce, flor de azahar, jazmín sambac y praliné."
    },
    "variants": [
      {
        "id": "var-100ml",
        "name": "Frasco 100ml Box Romántico",
        "price": 109,
        "stock": 11
      }
    ],
    "stock": 11,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "san-valentin"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-black-opium",
    "name": "Caja de Regalo Noir: YSL Black Opium & Flores Satinadas",
    "slug": "caja-regalo-noir-ysl-black-opium",
    "category": "cat-perfumes",
    "shortDescription": "Toque rebelde y seductor con café negro, vainilla y rosas de satén negro y carmín.",
    "description": "Adrenalina y glamour en una sola caja. El misterio de Black Opium rodeado de elementos oscuros y luces que brillan en la noche.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Caja de regalo con Black Opium.png"
    ],
    "whatIncludes": [
      "YSL Black Opium Eau de Parfum 90ml",
      "Caja decorativa con purpurina y acabado noir",
      "Rosas eternas de satén carmín y negro",
      "Tarjeta personalizada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 90,
      "presentation": "Frasco negro con destellos brillantes y centro rosa",
      "notesSummary": "Café negro, flores blancas de azahar, vainilla y madera de cedro."
    },
    "variants": [
      {
        "id": "var-90ml",
        "name": "Black Opium 90ml",
        "price": 109,
        "stock": 8
      }
    ],
    "stock": 8,
    "occasions": [
      "aniversario",
      "san-valentin",
      "cumpleanos"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-versace-bright-crystal",
    "name": "Set Coquette: Versace Bright Crystal & Detalles Rosa Pastel",
    "slug": "set-coquette-versace-bright-crystal",
    "category": "cat-perfumes",
    "shortDescription": "Fragancia fresca y cristalina con granada dulce, peonías y caja coquette.",
    "description": "La pureza de Versace Bright Crystal en un empaque diseñado para amantes de los tonos pasteles y detalles ultra femeninos.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Set de regalo con Bright Crystal.png"
    ],
    "whatIncludes": [
      "Versace Bright Crystal 90ml",
      "Caja con tapizado interior suave",
      "Moño rosa pastel con detalles satinados",
      "Tarjeta con mensaje a elección"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 90,
      "presentation": "Frasco con tapón joya talla diamante faceteado",
      "notesSummary": "Granada, yuzu fresco, flor de loto, peonía y almizcle suave."
    },
    "variants": [
      {
        "id": "var-90ml",
        "name": "Bright Crystal 90ml",
        "price": 109,
        "stock": 10
      }
    ],
    "stock": 10,
    "occasions": [
      "cumpleanos",
      "porque-si",
      "aniversario"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-valentino-born-in-roma",
    "name": "Caja Couture: Valentino Donna Born in Roma",
    "slug": "caja-couture-valentino-donna-born-in-roma",
    "category": "cat-perfumes",
    "shortDescription": "Elegancia italiana con tachuelas rockstud y bouquet floral de alta costura.",
    "description": "Inspirada en Roma, donde la elegancia y la rebeldía se encuentran. Un regalo de alto impacto visual y sensorial con Valentino Born in Roma.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Caja de regalo Valentino Born in Roma.png"
    ],
    "whatIncludes": [
      "Valentino Donna Born in Roma 100ml",
      "Caja de regalo rígida con textura especial",
      "Rosas eternas fucsia y negro mate",
      "Tarjeta lacrada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 100,
      "presentation": "Frasco prismático con tachuelas icónicas Rockstud",
      "notesSummary": "Grosella negra, trío de jazmines nobles y vainilla bourbon ahumada."
    },
    "variants": [
      {
        "id": "var-100ml",
        "name": "Born in Roma 100ml Couture",
        "price": 109,
        "stock": 7
      }
    ],
    "stock": 7,
    "occasions": [
      "aniversario",
      "san-valentin",
      "cumpleanos"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-prada-paradoxe",
    "name": "Box Floral Vanguardia: Prada Paradoxe Eau de Parfum",
    "slug": "box-floral-vanguardia-prada-paradoxe",
    "category": "cat-perfumes",
    "shortDescription": "Frasco triangular icónico de Prada con flores eternas y envoltura de autor.",
    "description": "La reinvención de la feminidad floral de Prada. Un regalo contemporáneo con diseño de vanguardia que deslumbrará al abrir la caja.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Regalo elegante con perfume Prada Paradoxe.png"
    ],
    "whatIncludes": [
      "Prada Paradoxe Eau de Parfum 90ml",
      "Caja con logotipo en bajo relieve",
      "Rosas de satén artesanales",
      "Tarjeta dedicatoria"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 90,
      "presentation": "Frasco triangular inclinado con logo Prada en negro",
      "notesSummary": "Yemas de neroli, ámbar cálido y almizcle blanco de larga fijación."
    },
    "variants": [
      {
        "id": "var-90ml",
        "name": "Paradoxe 90ml Box",
        "price": 109,
        "stock": 9
      }
    ],
    "stock": 9,
    "occasions": [
      "cumpleanos",
      "aniversario",
      "san-valentin"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-box-mugler-alien",
    "name": "Box Místico: Mugler Alien Eau de Parfum & Detalles",
    "slug": "box-mistico-mugler-alien-eau-de-parfum",
    "category": "cat-perfumes",
    "shortDescription": "Frasco talismán amatista con jazmín solar, madera de cachemira y ámbar.",
    "description": "Una fragancia magnética y misteriosa que no pasa desapercibida. Presentada en un cofre nocturno con luces LED y flores eternas moradas.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Regalo elegante con perfume Alien.png"
    ],
    "whatIncludes": [
      "Mugler Alien Eau de Parfum 90ml",
      "Caja especial talismán con visor transparente",
      "Flores preservadas en tonos violeta y dorado",
      "Dedicatoria personalizada"
    ],
    "whatExcludes": [],
    "isPerfume": true,
    "perfumeDetails": {
      "milliliters": 90,
      "presentation": "Frasco piedra amatista con garras doradas de alta joyería",
      "notesSummary": "Jazmín sambac solar, maderas nobles de cachemira y ámbar blanco."
    },
    "variants": [
      {
        "id": "var-90ml",
        "name": "Alien 90ml Box",
        "price": 109,
        "stock": 8
      }
    ],
    "stock": 8,
    "occasions": [
      "aniversario",
      "cumpleanos"
    ],
    "isFeatured": false,
    "isCoupleSection": false,
    "active": true
  },
  {
    "id": "prod-combo-floral-perfume-deluxe",
    "name": "Combo InspoMood Dúo Amor: Caja Floral Deluxe + Fragancia Signature",
    "slug": "combo-inspomood-caja-floral-deluxe-fragancia",
    "category": "cat-combos",
    "shortDescription": "Caja sorpresa con bouquet floral completo, perfume de autor y accesorios en conjunto.",
    "description": "El combo más completo de InspoMood para celebraciones inolvidables. Une la belleza imperecedera de nuestras flores de satén con una fragancia cautivadora y tarjeta dedicatoria.",
    "price": 109,
    "comparePrice": 134,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Caja regalo floral con perfume y detalles.png",
      "/imagenes/20_Ramos_y_Regalos/Set de regalo InspoMood con perfume.png",
      "/imagenes/20_Ramos_y_Regalos/Catálogo InspoMood con logo floral corregido.png"
    ],
    "whatIncludes": [
      "Caja floral de lujo con apertura especial",
      "Fragancia de autor 100ml en estuche acolchado",
      "Arreglo completo de flores eternas preservadas",
      "Luces cálidas LED integradas y tarjeta caligrafiada"
    ],
    "whatExcludes": [],
    "variants": [
      {
        "id": "var-combo-completo",
        "name": "Combo Deluxe Completo",
        "price": 109,
        "stock": 15
      }
    ],
    "stock": 15,
    "occasions": [
      "aniversario",
      "san-valentin",
      "cumpleanos"
    ],
    "isFeatured": true,
    "isCoupleSection": true,
    "isCoupleItem": true,
    "active": true
  },
  {
    "id": "prod-caja-floral-inspomood",
    "name": "Caja Sorpresa InspoMood: Arreglo Floral & Joyas con Logo Oficial",
    "slug": "caja-sorpresa-inspomood-arreglo-floral-joyas",
    "category": "cat-personalizados",
    "shortDescription": "Caja de regalo artesanal InspoMood con rosas de satén, joyería fina y grabado especial.",
    "description": "Un detalle íntimo y personalizado. Incluye mensaje a medida, rosas artesanales de satén y presentación exclusiva InspoMood con acabados de alta calidad.",
    "price": 139,
    "comparePrice": 169,
    "images": [
      "/imagenes/20_Ramos_y_Regalos/Set de regalo floral con logo InspoMood.png",
      "/imagenes/20_Ramos_y_Regalos/Catálogo InspoMood con logo floral corregido.png"
    ],
    "whatIncludes": [
      "Caja InspoMood con sello de autenticidad",
      "Arreglo floral artesanal en tonos rosa y blanco",
      "Tarjeta personalizada con mensaje dedicatorio",
      "Espacio para joya o detalle sorpresa"
    ],
    "whatExcludes": [],
    "isPersonalized": true,
    "personalizedFields": [
      {
        "id": "field-nombre",
        "fieldName": "Nombre para la dedicatoria",
        "placeholder": "Ej: Para mi amor Camila",
        "extraCharge": 0
      },
      {
        "id": "field-mensaje",
        "fieldName": "Mensaje especial interior",
        "placeholder": "Escribe tu dedicatoria personalizada...",
        "extraCharge": 0
      }
    ],
    "variants": [
      {
        "id": "var-caja-standard",
        "name": "Caja con Arreglo Floral",
        "price": 139,
        "stock": 14
      }
    ],
    "stock": 14,
    "occasions": [
      "aniversario",
      "cumpleanos",
      "porque-si"
    ],
    "isFeatured": true,
    "isCoupleSection": false,
    "active": true
  }
];

const DEFAULT_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-envio-gratis',
    name: 'Envío Gratis en Lima Metropolitana',
    description: 'Envío sin costo automático en compras a partir de S/ 180.00.',
    type: 'free_shipping',
    value: 0,
    minPurchaseAmount: 180.00,
    active: true,
  },
  {
    id: 'promo-regalo-cortesia',
    name: 'Mini Vela Aromática de Masaje de Cortesía',
    description: 'Llévate de regalo una vela de cera de soja con aroma a vainilla por compras desde S/ 150.00.',
    type: 'courtesy_gift',
    value: 0,
    minPurchaseAmount: 150.00,
    giftProductName: 'Mini Vela Aromática de Soya 40g (Cortesía InspoMood)',
    active: true,
  },
  {
    id: 'promo-cupon-bienvenida',
    name: 'Descuento Amor Incondicional (Cupón AMOR10)',
    description: '10% de descuento en el total de tus productos usando el cupón AMOR10.',
    type: 'discount_percent',
    value: 10,
    minPurchaseAmount: 100.00,
    couponCode: 'AMOR10',
    active: true,
  }
];

const DEFAULT_SETTINGS: StoreSettings = {
  brandName: 'InspoMood',
  tagline: 'Detalles para compartir',
  logoUrl: '/logo/logo.png',
  heroTitle: 'Detalles que conectan con tu persona favorita',
  heroSubtitle: 'Ramos, perfumes, disfraces y detalles para compartir, sorprender y crear recuerdos juntos.',
  heroButtonExplore: 'Explorar productos',
  heroButtonFinder: 'Encontrar un detalle',
  whatsappNumber: '+51 919 192 244',
  whatsappGreeting: '¡Hola InspoMood! Vengo desde su tienda online y deseo coordinar un pedido al 919 192 244:',
  facebookUrl: 'https://www.facebook.com/profile.php?id=61595327577046&locale=es_LA',
  tiktok: '@inspomood.peru',
  phone: '+51 919 192 244',
  email: 'pedidos@inspomood.pe',
  storeAddress: 'Surco - Lima Sur',
  freeShippingThreshold: 180.00,
  limaDistricts: [
    { name: 'Miraflores', cost: 12.00, estimatedDays: 'Mismo día / 24 hrs' },
    { name: 'San Isidro', cost: 12.00, estimatedDays: 'Mismo día / 24 hrs' },
    { name: 'Barranco', cost: 12.00, estimatedDays: 'Mismo día / 24 hrs' },
    { name: 'Surco (Santiago de Surco)', cost: 14.00, estimatedDays: '24 hrs' },
    { name: 'San Borja', cost: 14.00, estimatedDays: '24 hrs' },
    { name: 'Jesús María / Lince / Magdalena', cost: 14.00, estimatedDays: '24 hrs' },
    { name: 'Pueblo Libre / San Miguel', cost: 15.00, estimatedDays: '24 - 48 hrs' },
    { name: 'La Molina', cost: 16.00, estimatedDays: '24 - 48 hrs' },
    { name: 'Chorrillos', cost: 15.00, estimatedDays: '24 hrs' },
    { name: 'Lima Cercado / Breña', cost: 15.00, estimatedDays: '24 - 48 hrs' },
    { name: 'Los Olivos / San Martín de Porres / Comas', cost: 18.00, estimatedDays: '24 - 48 hrs' },
    { name: 'Ate / Santa Anita / San Juan de Lurigancho', cost: 19.00, estimatedDays: '24 - 48 hrs' },
    { name: 'San Juan de Miraflores / Villa El Salvador', cost: 18.00, estimatedDays: '24 - 48 hrs' },
    { name: 'Otros distritos de Lima Metropolitana', cost: 20.00, estimatedDays: '24 - 48 hrs' },
  ],
  provinciaRates: [
    {
      departamento: 'Arequipa',
      agenciaCost: 18.00,
      domicilioCost: 28.00,
      estimatedDays: '2 a 3 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier', 'Marvisur']
    },
    {
      departamento: 'Cusco',
      agenciaCost: 20.00,
      domicilioCost: 30.00,
      estimatedDays: '2 a 4 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier', 'Wari Palomino']
    },
    {
      departamento: 'La Libertad (Trujillo)',
      agenciaCost: 18.00,
      domicilioCost: 26.00,
      estimatedDays: '2 a 3 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier', 'Línea']
    },
    {
      departamento: 'Lambayeque (Chiclayo)',
      agenciaCost: 18.00,
      domicilioCost: 26.00,
      estimatedDays: '2 a 3 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier']
    },
    {
      departamento: 'Piura',
      agenciaCost: 20.00,
      domicilioCost: 28.00,
      estimatedDays: '3 a 4 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier']
    },
    {
      departamento: 'Junín (Huancayo)',
      agenciaCost: 18.00,
      domicilioCost: 26.00,
      estimatedDays: '2 a 3 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier', 'Molina']
    },
    {
      departamento: 'Ica / Chincha / Pisco',
      agenciaCost: 16.00,
      domicilioCost: 24.00,
      estimatedDays: '1 a 2 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier', 'Soyuz/PerúBus']
    },
    {
      departamento: 'Otros departamentos de provincias',
      agenciaCost: 22.00,
      domicilioCost: 32.00,
      estimatedDays: '3 a 5 días hábiles',
      agenciasDisponibles: ['Shalom Empresarial', 'Olva Courier']
    },
  ],
  paymentInstructions: {
    yapePlin: {
      enabled: true,
      number: '919 192 244',
      holder: 'InspoMood Perú E.I.R.L.',
      qrNote: 'Envía captura de la transferencia vía WhatsApp indicando tu código de pedido.'
    },
    transferencia: {
      enabled: true,
      bankName: 'BCP Banco de Crédito del Perú (Soles)',
      accountNumber: '194-98471203-0-45',
      cci: '002-1940098471203045-92',
      holder: 'InspoMood Perú E.I.R.L.'
    },
    tarjeta: {
      enabled: true,
      note: 'Aceptamos transferencias y pagos directos. Si deseas pagar con tarjeta de crédito/débito, te enviaremos un link oficial de Niubiz / Izipay a través de WhatsApp.'
    }
  },
  policies: {
    shippingPolicy: 'Envíos en Lima Metropolitana: Se entregan con motorizado privado en el turno seleccionado (Mañana: 10:00 a 14:00 hrs | Tarde: 14:30 a 19:00 hrs). Entregas en provincias: Se despachan dentro de las 24 horas de confirmado el pago a través de agencias autorizadas (Shalom, Olva Courier) con número de seguimiento para recojo en agencia o entrega a domicilio.',
    exchangePolicy: 'Garantía InspoMood: Si un ramo llega en condiciones no óptimas, se repone sin costo adicional el mismo día reportándolo dentro de las 2 horas de recibido con fotografía. En disfraces y prendas coordinadas, permitimos cambio de talla dentro de los 7 días posteriores a la recepción con sus etiquetas originales intactas.',
    privacyPolicy: 'Los datos personales (nombres, números telefónicos y direcciones de entrega) son tratados estrictamente para la gestión y coordinación del envío de tu pedido. No compartimos tus datos con terceros ni enviamos publicidad no solicitada.'
  }
};

const DEFAULT_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: '¿Con cuánta anticipación debo hacer mi pedido de flores o disfraces?',
    answer: 'Para ramos y regalos estándar en Lima, podemos atender pedidos para el mismo día si se confirman antes de las 12:00 m. Para disfraces, prendas personalizadas y envíos a provincias, recomendamos realizar el pedido con 48 a 72 horas de anticipación.',
    category: 'Envíos y Fechas'
  },
  {
    id: 'faq-2',
    question: '¿Cómo funciona la selección de tallas en los disfraces o poleras de pareja?',
    answer: 'Cada prenda del conjunto tiene su propio selector de talla independiente (por ejemplo, Talla Persona 1: M, Talla Persona 2: S). El precio publicado ya incluye las dos prendas completas.',
    category: 'Productos'
  },
  {
    id: 'faq-3',
    question: '¿Puedo enviar un regalo como sorpresa directa a mi pareja?',
    answer: '¡Por supuesto! Es una de nuestras especialidades. Solo ingresa los datos de entrega de tu persona favorita y déjanos su número celular para la entrega. No incluiremos comprobantes de pago ni precios dentro del paquete.',
    category: 'Sorpresas'
  },
  {
    id: 'faq-4',
    question: '¿Qué sucede una vez que finalizo mi pedido en la web?',
    answer: 'Tu pedido se guardará con un código único (ej: INSP-8492) en estado "Pendiente de confirmación". La web te ofrecerá abrir WhatsApp con todo el detalle listo para que nuestro equipo valide la disponibilidad y coordine el pago contigo.',
    category: 'Proceso de Compra'
  },
  {
    id: 'faq-5',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos transferencias por Yape y Plin, transferencias bancarias a través del BCP, BBVA e Interbank, y links de pago seguros con tarjeta de crédito o débito.',
    category: 'Pagos'
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products || DEFAULT_PRODUCTS,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          promotions: parsed.promotions || DEFAULT_PROMOTIONS,
          settings: parsed.settings || DEFAULT_SETTINGS,
          faqs: parsed.faqs || DEFAULT_FAQS,
          orders: parsed.orders || [],
          adminToken: parsed.adminToken || 'inspomood2026',
        };
      }
    } catch (e) {
      console.error('Error loading db.json, initializing defaults:', e);
    }

    const initialData: DatabaseSchema = {
      products: DEFAULT_PRODUCTS,
      categories: DEFAULT_CATEGORIES,
      promotions: DEFAULT_PROMOTIONS,
      settings: DEFAULT_SETTINGS,
      faqs: DEFAULT_FAQS,
      orders: [],
      adminToken: 'inspomood2026',
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  public getBootstrapData() {
    return {
      products: this.data.products.filter(p => p.active),
      categories: this.data.categories.filter(c => c.visible).sort((a, b) => a.order - b.order),
      promotions: this.data.promotions.filter(p => p.active),
      settings: this.data.settings,
      faqs: this.data.faqs,
    };
  }

  public getAllProductsAdmin() {
    return this.data.products;
  }

  public saveProduct(product: Product): Product {
    const index = this.data.products.findIndex(p => p.id === product.id);
    if (index >= 0) {
      this.data.products[index] = product;
    } else {
      this.data.products.unshift(product);
    }
    this.saveData(this.data);
    return product;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.saveData(this.data);
    return this.data.products.length < initialLen;
  }

  public resetDemoProducts(): void {
    // Keeps non-demo products, restores default demos
    const customProducts = this.data.products.filter(p => !p.isDemo);
    this.data.products = [...DEFAULT_PRODUCTS, ...customProducts];
    this.saveData(this.data);
  }

  public clearDemoProducts(): void {
    this.data.products = this.data.products.filter(p => !p.isDemo);
    this.saveData(this.data);
  }

  public getAllCategoriesAdmin() {
    return this.data.categories;
  }

  public saveCategory(category: Category): Category {
    const index = this.data.categories.findIndex(c => c.id === category.id);
    if (index >= 0) {
      this.data.categories[index] = category;
    } else {
      this.data.categories.push(category);
    }
    this.saveData(this.data);
    return category;
  }

  public deleteCategory(id: string): boolean {
    const initialLen = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    this.saveData(this.data);
    return this.data.categories.length < initialLen;
  }

  public getSettings() {
    return this.data.settings;
  }

  public saveSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
    };
    this.saveData(this.data);
    return this.data.settings;
  }

  public getAllOrders(): Order[] {
    return this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getOrderById(id: string): Order | undefined {
    return this.data.orders.find(o => o.id === id || o.orderCode === id);
  }

  public createOrder(order: Order): Order {
    // Deduct stock on the server
    for (const item of order.items) {
      const product = this.data.products.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        if (item.selectedVariantId) {
          const variant = product.variants.find(v => v.id === item.selectedVariantId);
          if (variant) {
            variant.stock = Math.max(0, variant.stock - item.quantity);
          }
        }
      }
    }

    this.data.orders.unshift(order);
    this.saveData(this.data);
    return order;
  }

  public updateOrder(id: string, updates: Partial<Order>): Order | null {
    const index = this.data.orders.findIndex(o => o.id === id || o.orderCode === id);
    if (index >= 0) {
      this.data.orders[index] = {
        ...this.data.orders[index],
        ...updates,
      };
      this.saveData(this.data);
      return this.data.orders[index];
    }
    return null;
  }

  public getAllPromotions() {
    return this.data.promotions;
  }

  public savePromotion(promo: Promotion): Promotion {
    const idx = this.data.promotions.findIndex(p => p.id === promo.id);
    if (idx >= 0) {
      this.data.promotions[idx] = promo;
    } else {
      this.data.promotions.push(promo);
    }
    this.saveData(this.data);
    return promo;
  }

  public deletePromotion(id: string): boolean {
    const len = this.data.promotions.length;
    this.data.promotions = this.data.promotions.filter(p => p.id !== id);
    this.saveData(this.data);
    return this.data.promotions.length < len;
  }

  public getAllFaqs() {
    return this.data.faqs;
  }

  public saveFaq(faq: FAQ): FAQ {
    const idx = this.data.faqs.findIndex(f => f.id === faq.id);
    if (idx >= 0) {
      this.data.faqs[idx] = faq;
    } else {
      this.data.faqs.push(faq);
    }
    this.saveData(this.data);
    return faq;
  }

  public deleteFaq(id: string): boolean {
    const len = this.data.faqs.length;
    this.data.faqs = this.data.faqs.filter(f => f.id !== id);
    this.saveData(this.data);
    return this.data.faqs.length < len;
  }

  public verifyAdmin(password: string): boolean {
    return password === 'inspomood2026' || password === this.data.adminToken;
  }

  public setAdminPassword(newPassword: string): void {
    this.data.adminToken = newPassword;
    this.saveData(this.data);
  }
}

export const db = new DatabaseManager();
