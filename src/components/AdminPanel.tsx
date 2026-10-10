import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Package,
  Layers,
  ShoppingBag,
  Settings,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  LogOut,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  Product,
  Category,
  Order,
  StoreSettings,
  Promotion,
  FAQ,
  OrderDeliveryStatus,
  OrderPaymentStatus
} from '../types';
import { formatSoles } from '../utils/formatters';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  settings: StoreSettings;
  onRefreshData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  categories,
  settings,
  onRefreshData,
}) => {
  // Authentication state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem('inspomood_admin_token') || null;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'categories' | 'promotions' | 'settings' | 'faqs'>('orders');

  // Orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Products data
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  // Categories data
  const [adminCategories, setAdminCategories] = useState<Category[]>(categories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Promotions data
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // Settings form
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // FAQs data
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Load Admin Data when authenticated
  useEffect(() => {
    if (authToken && isOpen) {
      loadAllAdminData();
    }
  }, [authToken, isOpen]);

  const loadAllAdminData = async () => {
    if (!authToken) return;
    try {
      setLoadingOrders(true);
      const headers = { Authorization: `Bearer ${authToken}` };

      const [resOrders, resProducts, resCats, resPromos, resSettings, resFaqs] = await Promise.all([
        fetch('/api/admin/orders', { headers }).then(r => r.json()),
        fetch('/api/admin/products', { headers }).then(r => r.json()),
        fetch('/api/admin/categories', { headers }).then(r => r.json()),
        fetch('/api/admin/promotions', { headers }).then(r => r.json()),
        fetch('/api/admin/settings', { headers }).then(r => r.json()),
        fetch('/api/bootstrap').then(r => r.json()).then(d => d.faqs || []),
      ]);

      setOrders(resOrders || []);
      setProducts(resProducts || []);
      setAdminCategories(resCats || []);
      setPromotions(resPromos || []);
      if (resSettings && resSettings.brandName) {
        setSettingsForm(resSettings);
      }
      setFaqs(resFaqs || []);
    } catch (e) {
      console.error('Error loading admin data:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Contraseña incorrecta');
      }

      setAuthToken(data.token);
      localStorage.setItem('inspomood_admin_token', data.token);
      setPasswordInput('');
    } catch (err: any) {
      setAuthError(err.message || 'Error de autenticación');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('inspomood_admin_token');
  };

  // Order status updates
  const handleUpdateOrderStatus = async (
    orderId: string,
    updates: { deliveryStatus?: OrderDeliveryStatus; paymentStatus?: OrderPaymentStatus; adminNotes?: string }
  ) => {
    if (!authToken) return;
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      setOrders(orders.map(o => (o.id === orderId ? updated : o)));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (e) {
      console.error('Failed to update order:', e);
    }
  };

  // Product Save
  const handleSaveProduct = async (productToSave: Product) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(productToSave),
      });
      const saved = await res.json();
      const exists = products.some(p => p.id === saved.id);
      if (exists) {
        setProducts(products.map(p => (p.id === saved.id ? saved : p)));
      } else {
        setProducts([saved, ...products]);
      }
      setEditingProduct(null);
      setIsCreatingProduct(false);
      onRefreshData();
    } catch (e) {
      console.error('Error saving product:', e);
    }
  };

  // Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!authToken || !confirm('¿Estás seguro de eliminar este producto?')) return;
    try {
      await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setProducts(products.filter(p => p.id !== id));
      onRefreshData();
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  // Reset Demo Products
  const handleResetDemo = async () => {
    if (!authToken || !confirm('¿Restaurar los 12 productos de demostración iniciales de InspoMood?')) return;
    try {
      await fetch('/api/admin/reset-demo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await loadAllAdminData();
      onRefreshData();
      alert('Productos de demostración restaurados exitosamente.');
    } catch (e) {
      console.error(e);
    }
  };

  // Settings Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(settingsForm),
      });
      const updated = await res.json();
      setSettingsForm(updated);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2500);
      onRefreshData();
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div
        className="bg-[#FAF7F2] rounded-3xl w-full max-w-6xl shadow-2xl border border-[#EDE2D2] overflow-hidden my-auto max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EADBCE] bg-[#F7F2E9]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#9A5B36]" />
            <h2 className="text-base font-bold text-[#38261C] font-display">
              Panel de Administración — InspoMood
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {authToken && (
              <button
                onClick={handleLogout}
                className="text-xs text-[#8E786B] hover:text-[#B24E38] flex items-center gap-1 font-semibold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-[#634832] hover:text-[#38261C] rounded-full hover:bg-[#EBDDCB] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area: Login or Dashboard */}
        {!authToken ? (
          /* AUTHENTICATION FORM */
          <div className="p-8 sm:p-12 max-w-md mx-auto w-full text-center space-y-6">
            <div className="w-14 h-14 bg-[#EFE7DC] rounded-2xl flex items-center justify-center mx-auto text-[#9A5B36]">
              <Lock className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#38261C] font-display">
                Acceso Privado para Administrador
              </h3>
              <p className="text-xs text-[#7A6455] mt-1">
                Ingresa la contraseña de administración de InspoMood para gestionar pedidos, productos y configuraciones.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Contraseña de administrador..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] focus:outline-hidden focus:ring-2 focus:ring-[#9A5B36]/30 text-center font-mono"
              />

              {authError && (
                <p className="text-xs text-[#B24E38] font-semibold">{authError}</p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-[#473429] hover:bg-[#34241B] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoggingIn ? 'Verificando credenciales...' : 'Ingresar al Panel'}
              </button>

              <p className="text-[11px] text-[#9E8B7E] italic pt-2">
                Clave por defecto: <code className="bg-[#EFE8DC] px-1 py-0.5 rounded text-[#473429]">inspomood2026</code>
              </p>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN INTERFACE */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Admin Tabs */}
            <div className="flex items-center gap-1 px-6 border-b border-[#EADBCE] bg-[#FAF7F2] overflow-x-auto">
              <button
                onClick={() => setActiveTab('orders')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-[#9A5B36] text-[#9A5B36]'
                    : 'border-transparent text-[#7A6455] hover:text-[#38261C]'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Pedidos ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'border-[#9A5B36] text-[#9A5B36]'
                    : 'border-transparent text-[#7A6455] hover:text-[#38261C]'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Productos ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'border-[#9A5B36] text-[#9A5B36]'
                    : 'border-transparent text-[#7A6455] hover:text-[#38261C]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categorías</span>
              </button>

              <button
                onClick={() => setActiveTab('promotions')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'promotions'
                    ? 'border-[#9A5B36] text-[#9A5B36]'
                    : 'border-transparent text-[#7A6455] hover:text-[#38261C]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Promociones & Cupones</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-[#9A5B36] text-[#9A5B36]'
                    : 'border-transparent text-[#7A6455] hover:text-[#38261C]'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Configuración de Tienda</span>
              </button>

              <button
                onClick={() => setActiveTab('faqs')}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'faqs'
                    ? 'border-[#9A5B36] text-[#9A5B36]'
                    : 'border-transparent text-[#7A6455] hover:text-[#38261C]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>FAQs</span>
              </button>
            </div>

            {/* TAB CONTENTS */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#38261C]">
                        Gestión de Pedidos
                      </h3>
                      <p className="text-xs text-[#7A6455]">
                        Supervisa el estado de entrega y valida pagos manualmente contra los comprobantes de WhatsApp.
                      </p>
                    </div>

                    <button
                      onClick={loadAllAdminData}
                      className="px-3 py-1.5 bg-[#EFE7DC] hover:bg-[#E4D8C8] text-[#473429] text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Actualizar</span>
                    </button>
                  </div>

                  {orders.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-2xl border border-[#EDE2D2]">
                      <ShoppingBag className="w-8 h-8 text-[#9A5B36] mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-[#7A6455]">
                        Aún no se han registrado pedidos en la tienda.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 bg-white rounded-2xl border border-[#EDE2D2] shadow-xs space-y-3"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F5ECE0] pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-extrabold text-[#9A5B36] bg-[#F7EFE4] px-2.5 py-1 rounded-lg">
                                {ord.orderCode}
                              </span>
                              <span className="text-xs text-[#7A6455]">
                                {new Date(ord.createdAt).toLocaleString('es-PE')}
                              </span>
                            </div>

                            {/* Dual status controllers: Delivery & Payment (Separated per guidelines) */}
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Delivery Status Selector */}
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-[#7A6455] font-medium">Entrega:</span>
                                <select
                                  value={ord.deliveryStatus}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(ord.id, {
                                      deliveryStatus: e.target.value as OrderDeliveryStatus,
                                    })
                                  }
                                  className="text-xs font-bold p-1 rounded-lg border border-[#D9C8B5] bg-[#FAF7F2] text-[#38261C] cursor-pointer"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="confirmado">Confirmado</option>
                                  <option value="preparando">Preparando</option>
                                  <option value="enviado">Enviado</option>
                                  <option value="entregado">Entregado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </div>

                              {/* Payment Status Selector */}
                              <div className="flex items-center gap-1 text-xs">
                                <span className="text-[#7A6455] font-medium">Pago:</span>
                                <select
                                  value={ord.paymentStatus}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(ord.id, {
                                      paymentStatus: e.target.value as OrderPaymentStatus,
                                    })
                                  }
                                  className={`text-xs font-bold p-1 rounded-lg border cursor-pointer ${
                                    ord.paymentStatus === 'pagado'
                                      ? 'bg-[#E5F2E3] text-[#2C6228] border-[#CCE0C9]'
                                      : ord.paymentStatus === 'rechazado'
                                      ? 'bg-[#FBEBE8] text-[#9A2E16] border-[#F3C2B8]'
                                      : 'bg-[#FAF7F2] text-[#9A5B36] border-[#D9C8B5]'
                                  }`}
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="pagado">Pagado</option>
                                  <option value="rechazado">Rechazado</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Customer & Destination info */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#523E32]">
                            <div>
                              <span className="font-semibold text-[#38261C]">Destinatario:</span>
                              <p>{ord.deliveryDetails.recipientName}</p>
                              <p className="text-[#7A6455]">{ord.deliveryDetails.phone}</p>
                            </div>

                            <div>
                              <span className="font-semibold text-[#38261C]">Destino:</span>
                              <p>
                                {ord.deliveryZoneType === 'lima'
                                  ? `Lima - ${ord.deliveryDetails.distrito || ''}`
                                  : `Provincia (${ord.deliveryDetails.departamento || ''} - ${ord.deliveryDetails.modalidad || ''})`}
                              </p>
                              <p className="text-[#7A6455] truncate">
                                {ord.deliveryDetails.direccion || ord.deliveryDetails.agenciaSede}
                              </p>
                            </div>

                            <div>
                              <span className="font-semibold text-[#38261C]">Fecha Deseada:</span>
                              <p>{ord.deliveryDetails.fechaDeseada || 'A coordinar'}</p>
                              <p className="text-[#7A6455]">Método: {ord.paymentMethod}</p>
                            </div>
                          </div>

                          {/* Items List */}
                          <div className="bg-[#FAF7F2] rounded-xl p-3 border border-[#F0E6D8] space-y-1.5 text-xs">
                            <span className="font-bold text-[#473429] uppercase tracking-wide block text-[10px]">
                              Productos ({ord.items.length}):
                            </span>
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-start text-xs">
                                <div>
                                  <span className="font-semibold text-[#38261C]">
                                    {it.name} (x{it.quantity})
                                  </span>
                                  {it.coupleSizes && (
                                    <span className="block text-[11px] text-[#9A5B36]">
                                      • Tallas Dúo: P1: {it.coupleSizes.person1Size} | P2: {it.coupleSizes.person2Size}
                                    </span>
                                  )}
                                  {it.singleSize && (
                                    <span className="block text-[11px] text-[#7A6455]">
                                      • Talla: {it.singleSize}
                                    </span>
                                  )}
                                  {it.bouquetConfig && (
                                    <span className="block text-[11px] text-[#7A6455]">
                                      • Ramo: {it.bouquetConfig.sizeLabel} | {it.bouquetConfig.flowerColor}
                                      {it.bouquetConfig.dedicationText && ` - Dedicatoria: "${it.bouquetConfig.dedicationText}"`}
                                    </span>
                                  )}
                                  {it.personalizedValues && (
                                    <span className="block text-[11px] text-[#7A6455]">
                                      • Grabado: {Object.entries(it.personalizedValues).map(([k, v]) => `${k}: ${v}`).join(' | ')}
                                    </span>
                                  )}
                                </div>
                                <span className="font-bold tabular-nums text-[#38261C]">
                                  {formatSoles(it.finalUnitPrice * it.quantity)}
                                </span>
                              </div>
                            ))}

                            <div className="border-t border-[#EADBCE] pt-2 flex justify-between font-bold text-[#38261C]">
                              <span>Total con Envío ({ord.shippingCost > 0 ? formatSoles(ord.shippingCost) : 'Gratis'}):</span>
                              <span className="text-sm tabular-nums text-[#9A5B36]">
                                {formatSoles(ord.total)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-[#38261C]">
                        Catálogo de Productos
                      </h3>
                      <p className="text-xs text-[#7A6455]">
                        Agrega, edita precios, gestiona stock y configura tallas individuales para parejas.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetDemo}
                        className="px-3 py-1.5 bg-[#EFE7DC] hover:bg-[#E3D6C5] text-[#523E32] text-xs font-semibold rounded-xl cursor-pointer"
                        title="Restaurar los 12 productos de prueba"
                      >
                        Restaurar Demos
                      </button>

                      <button
                        onClick={() => {
                          setEditingProduct({
                            id: `prod-${Date.now()}`,
                            name: '',
                            slug: '',
                            category: adminCategories[0]?.id || 'cat-ramos',
                            shortDescription: '',
                            description: '',
                            price: 99,
                            comparePrice: undefined,
                            images: ['/imagenes/20_Ramos_y_Regalos/Flores_Limpiapipas_Premium_Final.png'],
                            whatIncludes: ['Empaque de lujo InspoMood', 'Tarjeta de dedicatoria'],
                            whatExcludes: [],
                            variants: [{ id: 'v1', name: 'Estándar', stock: 10 }],
                            stock: 10,
                            occasions: ['aniversario', 'porque-si'],
                            isFeatured: true,
                            isCoupleItem: false,
                            active: true,
                          });
                          setIsCreatingProduct(true);
                        }}
                        className="px-3.5 py-1.5 bg-[#473429] hover:bg-[#34241B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Nuevo Producto</span>
                      </button>
                    </div>
                  </div>

                  {/* Product Form Modal (if creating or editing) */}
                  {editingProduct && (
                    <div className="p-5 bg-white rounded-2xl border-2 border-[#9A5B36] space-y-4">
                      <div className="flex justify-between items-center border-b border-[#F0E6D8] pb-2">
                        <h4 className="text-xs font-bold text-[#473429] uppercase tracking-wide">
                          {isCreatingProduct ? 'Crear Nuevo Producto' : `Editar: ${editingProduct.name}`}
                        </h4>
                        <button
                          onClick={() => {
                            setEditingProduct(null);
                            setIsCreatingProduct(false);
                          }}
                          className="text-xs text-[#8A7160] hover:text-[#38261C]"
                        >
                          Cancelar
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Nombre:</label>
                          <input
                            type="text"
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Categoría:</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          >
                            {adminCategories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Precio Actual (S/):</label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Precio Anterior / Oferta (Opcional S/):</label>
                          <input
                            type="number"
                            value={editingProduct.comparePrice || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                comparePrice: e.target.value ? parseFloat(e.target.value) : undefined,
                              })
                            }
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Stock Disponible:</label>
                          <input
                            type="number"
                            value={editingProduct.stock}
                            onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">URL de Imagen Principal:</label>
                          <input
                            type="text"
                            value={editingProduct.images?.[0] || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>
                      </div>

                      <div className="text-xs space-y-1">
                        <label className="block font-semibold text-[#473429]">Descripción Corta:</label>
                        <input
                          type="text"
                          value={editingProduct.shortDescription}
                          onChange={(e) => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                          className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                        />
                      </div>

                      <div className="text-xs space-y-1">
                        <label className="block font-semibold text-[#473429]">Descripción Detallada:</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                        />
                      </div>

                      {/* Couple Item Checkbox */}
                      <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EADBCE] text-xs space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-[#473429]">
                          <input
                            type="checkbox"
                            checked={Boolean(editingProduct.isCoupleItem)}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                isCoupleItem: e.target.checked,
                                coupleDetails: e.target.checked
                                  ? {
                                      person1Label: 'Talla Persona 1',
                                      person2Label: 'Talla Persona 2',
                                      sizes: ['S', 'M', 'L', 'XL'],
                                      pricingNote: 'Precio incluye ambas prendas para la pareja.',
                                    }
                                  : undefined,
                              })
                            }
                            className="rounded text-[#9A5B36]"
                          />
                          <span>Es un conjunto o disfraz de pareja (con tallas independientes)</span>
                        </label>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsCreatingProduct(false);
                          }}
                          className="px-4 py-2 border border-[#D9C8B5] rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveProduct(editingProduct)}
                          className="px-4 py-2 bg-[#473429] text-white rounded-xl text-xs font-bold hover:bg-[#34241B] cursor-pointer"
                        >
                          Guardar Producto
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Products Table/List */}
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-white rounded-xl border border-[#EDE2D2] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="w-12 h-12 rounded-lg object-cover bg-[#F3EDE3] shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="font-bold text-[#38261C] truncate">{p.name}</h4>
                            <p className="text-[#7A6455] text-[11px]">
                              {formatSoles(p.price)} · Stock: <strong>{p.stock}</strong> {p.isDemo ? '(Demostración)' : ''}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() =>
                              handleSaveProduct({ ...p, active: !p.active })
                            }
                            className={`p-1.5 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                              p.active
                                ? 'bg-[#E5F2E3] text-[#2C6228] border-[#CCE0C9]'
                                : 'bg-[#F2ECE3] text-[#7A6455] border-[#D9C8B5]'
                            }`}
                            title={p.active ? 'Desactivar producto' : 'Activar producto'}
                          >
                            {p.active ? 'Activo' : 'Oculto'}
                          </button>

                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setIsCreatingProduct(false);
                            }}
                            className="p-1.5 hover:bg-[#F3EDE3] rounded-lg text-[#523E32] cursor-pointer"
                            title="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 hover:bg-[#FBEBE8] rounded-lg text-[#B24E38] cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-bold text-[#38261C]">
                        Categorías de InspoMood
                      </h3>
                      <p className="text-xs text-[#7A6455]">
                        Ordena, oculta o crea nuevas categorías de productos.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newCat: Category = {
                          id: `cat-${Date.now()}`,
                          name: 'Nueva Categoría',
                          slug: 'nueva-categoria',
                          description: 'Descripción breve',
                          icon: 'sparkles',
                          order: adminCategories.length + 1,
                          visible: true,
                        };
                        setEditingCategory(newCat);
                      }}
                      className="px-3 py-1.5 bg-[#473429] text-white text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar Categoría</span>
                    </button>
                  </div>

                  {editingCategory && (
                    <div className="p-4 bg-white rounded-2xl border-2 border-[#9A5B36] space-y-3 text-xs">
                      <h4 className="font-bold text-[#38261C]">Configurar Categoría</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Nombre:</label>
                          <input
                            type="text"
                            value={editingCategory.name}
                            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-[#473429] mb-1">Descripción:</label>
                          <input
                            type="text"
                            value={editingCategory.description}
                            onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                            className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="px-3 py-1.5 border border-[#D9C8B5] rounded-xl text-xs"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={async () => {
                            if (!authToken) return;
                            await fetch('/api/admin/categories', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                              },
                              body: JSON.stringify(editingCategory),
                            });
                            setAdminCategories(adminCategories.map(c => c.id === editingCategory.id ? editingCategory : c));
                            setEditingCategory(null);
                            onRefreshData();
                          }}
                          className="px-3 py-1.5 bg-[#473429] text-white font-semibold rounded-xl"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    {adminCategories.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 bg-white rounded-xl border border-[#EDE2D2] flex items-center justify-between text-xs"
                      >
                        <div>
                          <h4 className="font-bold text-[#38261C]">{c.name}</h4>
                          <p className="text-[11px] text-[#7A6455]">{c.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingCategory(c)}
                            className="p-1 hover:bg-[#F3EDE3] rounded text-[#523E32]"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: PROMOTIONS */}
              {activeTab === 'promotions' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#38261C]">
                      Promociones, Cupones y Cortesías
                    </h3>
                    <p className="text-xs text-[#7A6455]">
                      Configura descuentos, regalos de cortesía por compras mínimas o beneficios de envío gratis.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {promotions.map((promo) => (
                      <div
                        key={promo.id}
                        className="p-4 bg-white rounded-2xl border border-[#EDE2D2] flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-[#38261C]">{promo.name}</span>
                            {promo.couponCode && (
                              <span className="bg-[#FAF0E4] text-[#8D4415] px-2 py-0.5 rounded font-mono font-bold">
                                {promo.couponCode}
                              </span>
                            )}
                          </div>
                          <p className="text-[#7A6455]">{promo.description}</p>
                          <p className="text-[11px] text-[#9A5B36]">
                            Monto mínimo de compra: <strong>{formatSoles(promo.minPurchaseAmount)}</strong>
                          </p>
                        </div>

                        <button
                          onClick={async () => {
                            if (!authToken) return;
                            const updated = { ...promo, active: !promo.active };
                            await fetch('/api/admin/promotions', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${authToken}`,
                              },
                              body: JSON.stringify(updated),
                            });
                            setPromotions(promotions.map(p => p.id === promo.id ? updated : p));
                            onRefreshData();
                          }}
                          className={`px-3 py-1.5 rounded-xl font-bold border text-xs cursor-pointer ${
                            promo.active
                              ? 'bg-[#E5F2E3] text-[#2C6228] border-[#CCE0C9]'
                              : 'bg-[#F2ECE3] text-[#7A6455] border-[#D9C8B5]'
                          }`}
                        >
                          {promo.active ? 'Activa' : 'Inactiva'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: STORE SETTINGS */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="space-y-5 text-xs max-w-3xl">
                  <div>
                    <h3 className="text-sm font-bold text-[#38261C]">
                      Configuración de la Tienda
                    </h3>
                    <p className="text-xs text-[#7A6455]">
                      Modifica textos de portada, número de WhatsApp para pedidos, tarifas de envío en Lima y Provincias.
                    </p>
                  </div>

                  {settingsSaved && (
                    <div className="p-3 bg-[#E5F2E3] text-[#2C6228] rounded-xl font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>Configuración guardada en la base de datos exitosamente.</span>
                    </div>
                  )}

                  {/* Texts & Brand */}
                  <div className="p-4 bg-white rounded-2xl border border-[#EDE2D2] space-y-3">
                    <h4 className="font-bold text-[#473429] uppercase tracking-wider">
                      Textos de Portada & Contacto
                    </h4>
                    
                    {/* Logo & Brand preview */}
                    <div className="flex items-center gap-4 p-3 bg-[#FAF7F2] rounded-xl border border-[#EDE2D2]">
                      <img
                        src={settingsForm.logoUrl || '/logo/logo.png'}
                        alt="Logo Preview"
                        className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-[#D8C7B4] shadow-xs"
                      />
                      <div className="flex-1">
                        <label className="block font-semibold text-[#473429] mb-1">Ruta del Logo Oficial:</label>
                        <input
                          type="text"
                          value={settingsForm.logoUrl || '/logo/logo.png'}
                          onChange={(e) => setSettingsForm({ ...settingsForm, logoUrl: e.target.value })}
                          placeholder="/logo/logo.png"
                          className="w-full p-2 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#473429] mb-1">Título de Portada:</label>
                        <input
                          type="text"
                          value={settingsForm.heroTitle}
                          onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#473429] mb-1">WhatsApp para Pedidos (con código de país):</label>
                        <input
                          type="text"
                          value={settingsForm.whatsappNumber}
                          onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                          placeholder="+51 987 654 321"
                          className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C] font-semibold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#473429] mb-1">Texto de Apoyo de Portada:</label>
                      <textarea
                        rows={2}
                        value={settingsForm.heroSubtitle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                      />
                    </div>
                  </div>

                  {/* Payment accounts */}
                  <div className="p-4 bg-white rounded-2xl border border-[#EDE2D2] space-y-3">
                    <h4 className="font-bold text-[#473429] uppercase tracking-wider">
                      Métodos de Pago & Cuentas Oficiales
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-[#473429] mb-1">Número Yape / Plin:</label>
                        <input
                          type="text"
                          value={settingsForm.paymentInstructions?.yapePlin?.number || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              paymentInstructions: {
                                ...settingsForm.paymentInstructions,
                                yapePlin: {
                                  ...settingsForm.paymentInstructions.yapePlin,
                                  number: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-[#473429] mb-1">Titular Yape / Plin:</label>
                        <input
                          type="text"
                          value={settingsForm.paymentInstructions?.yapePlin?.holder || ''}
                          onChange={(e) =>
                            setSettingsForm({
                              ...settingsForm,
                              paymentInstructions: {
                                ...settingsForm.paymentInstructions,
                                yapePlin: {
                                  ...settingsForm.paymentInstructions.yapePlin,
                                  holder: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-full p-2.5 rounded-xl border border-[#D9C8B5] bg-white text-[#38261C]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#473429] hover:bg-[#34241B] text-white font-bold rounded-xl cursor-pointer shadow-sm text-xs"
                    >
                      Guardar todos los cambios
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 6: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#38261C]">
                      Preguntas Frecuentes
                    </h3>
                    <p className="text-xs text-[#7A6455]">
                      Modifica o añade respuestas a las consultas habituales de los clientes.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="p-4 bg-white rounded-2xl border border-[#EDE2D2] text-xs space-y-1">
                        <h4 className="font-bold text-[#38261C]">{faq.question}</h4>
                        <p className="text-[#634832] leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
