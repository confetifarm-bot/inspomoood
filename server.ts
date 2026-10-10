import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.js';
import { Order, CartItem, Product, StoreSettings } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Static file serving for images and brand assets
app.use('/imagenes', express.static(path.join(__dirname, 'imagenes')));
app.use('/logo', express.static(path.join(__dirname, 'logo')));
app.get('/logo.png', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'logo', 'logo.png'));
});
app.get('/favicon.ico', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'logo', 'logo.png'));
});

// Helper to authenticate admin
const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.replace(/^Bearer\s+/i, '') : req.headers['x-admin-token'];
  
  if (!token || !db.verifyAdmin(String(token))) {
    res.status(401).json({ error: 'No autorizado. Se requieren credenciales de administrador.' });
    return;
  }
  next();
};

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// Bootstrap initial data for fast load
app.get('/api/bootstrap', (req: Request, res: Response) => {
  try {
    const data = db.getBootstrapData();
    res.json(data);
  } catch (error) {
    console.error('Error in /api/bootstrap:', error);
    res.status(500).json({ error: 'Error cargando datos de la tienda' });
  }
});

// Get products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, occasion, featured, couple } = req.query;
  let products = db.getBootstrapData().products;

  if (category) {
    products = products.filter(p => p.category === category || p.slug === category);
  }
  if (occasion) {
    products = products.filter(p => p.occasions.includes(String(occasion)));
  }
  if (featured === 'true') {
    products = products.filter(p => p.isFeatured);
  }
  if (couple === 'true') {
    products = products.filter(p => p.isCoupleSection || p.isCoupleItem);
  }

  res.json(products);
});

// Single product
app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const products = db.getAllProductsAdmin();
  const product = products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
  
  if (!product || !product.active) {
    res.status(404).json({ error: 'Producto no encontrado' });
    return;
  }
  res.json(product);
});

// Order creation with server-side calculation and stock validation
app.post('/api/orders', (req: Request, res: Response) => {
  try {
    const {
      items,
      deliveryZoneType,
      deliveryDetails,
      paymentMethod,
      couponCode
    }: {
      items: CartItem[];
      deliveryZoneType: 'lima' | 'provincias';
      deliveryDetails: any;
      paymentMethod: any;
      couponCode?: string;
    } = req.body;

    if (!items || items.length === 0) {
      res.status(400).json({ error: 'El carrito de compras está vacío.' });
      return;
    }

    if (!deliveryDetails || !deliveryDetails.recipientName || !deliveryDetails.phone) {
      res.status(400).json({ error: 'Por favor completa los datos de entrega requeridos.' });
      return;
    }

    const allProducts = db.getAllProductsAdmin();
    const settings = db.getSettings();
    const promotions = db.getAllPromotions().filter(p => p.active);

    // Verify each item against real DB price and check stock
    const verifiedItems: CartItem[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const realProduct = allProducts.find(p => p.id === item.productId);
      if (!realProduct || !realProduct.active) {
        res.status(400).json({ error: `El producto "${item.name}" ya no está disponible.` });
        return;
      }

      if (realProduct.stock < item.quantity) {
        res.status(400).json({
          error: `Stock insuficiente para "${realProduct.name}". Solo quedan ${realProduct.stock} unidades.`
        });
        return;
      }

      let unitPrice = realProduct.price;
      let extraCharges = 0;

      // Handle bouquet size extra charge
      if (realProduct.isBouquet && item.bouquetConfig?.sizeLabel) {
        const sizeOpt = realProduct.bouquetDetails?.sizes.find(s => s.label === item.bouquetConfig?.sizeLabel);
        if (sizeOpt) {
          extraCharges += sizeOpt.extraPrice;
        }
      }

      // Handle personalized extra charges
      if (realProduct.isPersonalized && item.personalizedValues && realProduct.personalizedFields) {
        for (const field of realProduct.personalizedFields) {
          if (field.extraCharge > 0 && item.personalizedValues[field.fieldName]) {
            extraCharges += field.extraCharge;
          }
        }
      }

      const finalUnitPrice = unitPrice + extraCharges;
      calculatedSubtotal += finalUnitPrice * item.quantity;

      verifiedItems.push({
        ...item,
        name: realProduct.name,
        category: realProduct.category,
        unitBasePrice: unitPrice,
        extraCharges,
        finalUnitPrice,
      });
    }

    // Evaluate promotions
    let discountAmount = 0;
    let courtesyGift: string | undefined = undefined;

    // Check discount promotions
    if (couponCode) {
      const appliedCoupon = promotions.find(
        p => p.couponCode?.toUpperCase() === couponCode.trim().toUpperCase() &&
             calculatedSubtotal >= p.minPurchaseAmount
      );
      if (appliedCoupon) {
        if (appliedCoupon.type === 'discount_percent') {
          discountAmount = (calculatedSubtotal * appliedCoupon.value) / 100;
        } else if (appliedCoupon.type === 'discount_fixed') {
          discountAmount = Math.min(calculatedSubtotal, appliedCoupon.value);
        }
      }
    }

    // Check courtesy gifts
    const giftPromo = promotions.find(
      p => p.type === 'courtesy_gift' && calculatedSubtotal >= p.minPurchaseAmount
    );
    if (giftPromo && giftPromo.giftProductName) {
      courtesyGift = giftPromo.giftProductName;
    }

    // Compute shipping cost
    let shippingCost = 0;
    let isFreeShipping = false;

    // Check free shipping promo
    const freeShippingPromo = promotions.find(
      p => p.type === 'free_shipping' && calculatedSubtotal >= p.minPurchaseAmount
    );
    if (freeShippingPromo || (settings.freeShippingThreshold && calculatedSubtotal >= settings.freeShippingThreshold)) {
      if (deliveryZoneType === 'lima') {
        isFreeShipping = true;
      }
    }

    if (!isFreeShipping) {
      if (deliveryZoneType === 'lima') {
        const foundDistrict = settings.limaDistricts.find(
          d => d.name.toLowerCase() === (deliveryDetails.distrito || '').toLowerCase()
        );
        shippingCost = foundDistrict ? foundDistrict.cost : 18.00;
      } else {
        const foundProvincia = settings.provinciaRates.find(
          p => p.departamento.toLowerCase() === (deliveryDetails.departamento || '').toLowerCase()
        );
        if (foundProvincia) {
          shippingCost = deliveryDetails.modalidad === 'domicilio'
            ? foundProvincia.domicilioCost
            : foundProvincia.agenciaCost;
        } else {
          shippingCost = deliveryDetails.modalidad === 'domicilio' ? 28.00 : 20.00;
        }
      }
    }

    const total = Math.max(0, calculatedSubtotal - discountAmount + shippingCost);

    // Generate unique human-readable order code
    const orderNum = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `INSP-${orderNum}`;
    const orderId = `ord-${Date.now()}`;

    // Construct formatted WhatsApp message
    const digits = (settings.whatsappNumber || '').replace(/[^0-9]/g, '');
    const cleanPhone = digits.length === 9 ? `51${digits}` : (digits || '51919192244');

    let waText = `*¡HOLA INSPOMOOD! ACABO DE REGISTRAR MI PEDIDO #${orderCode}*\n\n`;
    waText += `*PRODUCTOS SELECCIONADOS (${verifiedItems.length}):*\n`;
    waText += `-----------------------------------------\n`;

    verifiedItems.forEach((it, idx) => {
      waText += `${idx + 1}. *${it.name}*\n`;
      waText += `   • Cantidad: ${it.quantity} ${it.quantity === 1 ? 'unidad' : 'unidades'}\n`;
      waText += `   • Precio: S/ ${(it.finalUnitPrice * it.quantity).toFixed(2)}\n`;
      if (it.coupleSizes) {
        waText += `   • Tallas Duo: P1: ${it.coupleSizes.person1Size} | P2: ${it.coupleSizes.person2Size}\n`;
      }
      if (it.singleSize) {
        waText += `   • Talla: ${it.singleSize}\n`;
      }
      if (it.selectedVariantName) {
        waText += `   • Opcion: ${it.selectedVariantName}\n`;
      }
      if (it.bouquetConfig) {
        waText += `   • Ramo: ${it.bouquetConfig.sizeLabel} (${it.bouquetConfig.flowerColor})\n`;
        if (it.bouquetConfig.dedicationText) {
          waText += `   • Dedicatoria: "${it.bouquetConfig.dedicationText}"\n`;
        }
      }
      if (it.personalizedValues && Object.keys(it.personalizedValues).length > 0) {
        Object.entries(it.personalizedValues).forEach(([k, v]) => {
          if (v && String(v).trim()) {
            waText += `   • ${k}: ${String(v).trim()}\n`;
          }
        });
      }
      waText += `\n`;
    });

    waText += `*RESUMEN DE PAGO:*\n`;
    waText += `-----------------------------------------\n`;
    waText += `• Subtotal: S/ ${calculatedSubtotal.toFixed(2)}\n`;
    if (discountAmount > 0) {
      waText += `• Descuento aplicado: -S/ ${discountAmount.toFixed(2)}\n`;
    }
    if (courtesyGift) {
      waText += `• Obsequio de cortesia: ${courtesyGift}\n`;
    }
    waText += `• Envio: ${isFreeShipping ? '¡GRATIS!' : 'S/ ' + shippingCost.toFixed(2)}\n`;
    waText += `• *TOTAL ESTIMADO: S/ ${total.toFixed(2)}*\n\n`;

    waText += `*DATOS DE ENTREGA:*\n`;
    waText += `-----------------------------------------\n`;
    waText += `• Nombre: ${deliveryDetails.recipientName}\n`;
    waText += `• Telefono de contacto: ${deliveryDetails.phone}\n`;
    if (deliveryZoneType === 'lima') {
      waText += `• Destino: Lima Metropolitana (${deliveryDetails.distrito})\n`;
      if (deliveryDetails.direccion) waText += `• Direccion: ${deliveryDetails.direccion}\n`;
      if (deliveryDetails.referencia) waText += `• Referencia: ${deliveryDetails.referencia}\n`;
    } else {
      waText += `• Destino: Provincias (${deliveryDetails.departamento})\n`;
      waText += `• Modalidad: ${deliveryDetails.modalidad === 'domicilio' ? 'Entrega a Domicilio' : 'Recojo en Agencia (' + (deliveryDetails.agenciaSede || 'Shalom/Olva') + ')'}\n`;
    }
    if (deliveryDetails.fechaDeseada) {
      waText += `• Fecha deseada: ${deliveryDetails.fechaDeseada}\n`;
    }
    waText += `• Metodo de pago: ${paymentMethod || 'Yape / Transferencia'}\n\n`;

    waText += `_¿Tienen disponibilidad inmediata para confirmar mi pedido? ¡Muchas gracias!_`;

    const whatsappMessageUrl = `https://api.whatsapp.com/send/?phone=${cleanPhone}&text=${encodeURIComponent(waText)}`;

    const newOrder: Order = {
      id: orderId,
      orderCode,
      createdAt: new Date().toISOString(),
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      discountAmount,
      couponCode,
      courtesyGift,
      shippingCost,
      shippingNote: isFreeShipping ? 'Envío Gratis por Promoción' : undefined,
      total,
      deliveryZoneType,
      deliveryDetails,
      deliveryStatus: 'pendiente',
      paymentStatus: 'pendiente',
      paymentMethod: paymentMethod || 'yape_plin',
      whatsappMessageUrl,
    };

    const savedOrder = db.createOrder(newOrder);
    res.json({
      success: true,
      order: savedOrder,
      whatsappMessageUrl,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Error procesando el pedido en el servidor' });
  }
});

// ==========================================
// ADMIN API ROUTES (Protected)
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'La contraseña es requerida.' });
    return;
  }

  if (db.verifyAdmin(password)) {
    res.json({
      success: true,
      token: 'inspomood2026',
      message: 'Autenticado correctamente como Administrador de InspoMood'
    });
  } else {
    res.status(401).json({ error: 'Contraseña de administrador incorrecta.' });
  }
});

// Admin Products CRUD
app.get('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getAllProductsAdmin());
});

app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const product: Product = req.body;
    if (!product.name || !product.price) {
      res.status(400).json({ error: 'Nombre y precio son obligatorios.' });
      return;
    }
    if (!product.id) {
      product.id = `prod-${Date.now()}`;
    }
    if (!product.slug) {
      product.slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    const saved = db.saveProduct(product);
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteProduct(req.params.id);
  res.json({ success });
});

// Admin Categories CRUD
app.get('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getAllCategoriesAdmin());
});

app.post('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  const category = req.body;
  if (!category.id) {
    category.id = `cat-${Date.now()}`;
  }
  const saved = db.saveCategory(category);
  res.json(saved);
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteCategory(req.params.id);
  res.json({ success });
});

// Admin Orders
app.get('/api/admin/orders', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getAllOrders());
});

app.patch('/api/admin/orders/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const updated = db.updateOrder(id, updates);
  if (!updated) {
    res.status(404).json({ error: 'Pedido no encontrado' });
    return;
  }
  res.json(updated);
});

// Admin Store Settings
app.get('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.post('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.saveSettings(req.body);
  res.json(updated);
});

// Admin Promotions CRUD
app.get('/api/admin/promotions', requireAdminAuth, (req: Request, res: Response) => {
  res.json(db.getAllPromotions());
});

app.post('/api/admin/promotions', requireAdminAuth, (req: Request, res: Response) => {
  const promo = req.body;
  if (!promo.id) {
    promo.id = `promo-${Date.now()}`;
  }
  const saved = db.savePromotion(promo);
  res.json(saved);
});

app.delete('/api/admin/promotions/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deletePromotion(req.params.id);
  res.json({ success });
});

// Admin FAQs
app.post('/api/admin/faqs', requireAdminAuth, (req: Request, res: Response) => {
  const faq = req.body;
  if (!faq.id) {
    faq.id = `faq-${Date.now()}`;
  }
  const saved = db.saveFaq(faq);
  res.json(saved);
});

app.delete('/api/admin/faqs/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteFaq(req.params.id);
  res.json({ success });
});

// Admin Demo Products Reset / Clear
app.post('/api/admin/reset-demo', requireAdminAuth, (req: Request, res: Response) => {
  db.resetDemoProducts();
  res.json({ success: true, message: 'Productos de demostración restaurados exitosamente.' });
});

app.post('/api/admin/clear-demo', requireAdminAuth, (req: Request, res: Response) => {
  db.clearDemoProducts();
  res.json({ success: true, message: 'Productos de demostración desactivados.' });
});

// ==========================================
// VITE SETUP & STATIC SERVING
// ==========================================

async function startServer() {
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[InspoMood Server] listening on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
