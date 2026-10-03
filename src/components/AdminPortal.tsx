import React, { useState } from 'react';
import {
  Language,
  CreatorProfile,
  PortfolioItem,
  Order,
  OrderStatus,
  PricingPlan,
  ClientReview,
  FAQItem,
  SiteUIConfig,
} from '../types';
import { compressImage } from '../utils/imageCompressor';
import { parseVideoUrl } from '../utils/videoHelper';
import { UniversalVideoPlayer } from './UniversalVideoPlayer';
import { AdminUIEditor } from './AdminUIEditor';
import { defaultUIConfig } from '../data/defaultUIConfig';
import {
  LayoutDashboard,
  ShoppingBag,
  Image as ImageIcon,
  DollarSign,
  Star,
  Settings,
  HelpCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit2,
  Phone,
  MessageCircle,
  CheckCircle,
  Clock,
  Search,
  Download,
  Save,
  Key,
  Upload,
  AlertCircle,
  RefreshCw,
  LogOut,
  Eye,
  EyeOff,
  Sliders,
  Palette,
} from 'lucide-react';

interface AdminPortalProps {
  lang: Language;
  onLanguageToggle: () => void;
  onExitAdmin: () => void;
  creator: CreatorProfile;
  orders: Order[];
  portfolioItems: PortfolioItem[];
  pricingPlans: PricingPlan[];
  clientReviews: ClientReview[];
  faqs: FAQItem[];
  uiConfig?: SiteUIConfig;
  onUpdateUIConfig?: (newConfig: SiteUIConfig) => void;
  serverSyncStatus?: 'saved' | 'syncing' | 'error';
  lastSyncTime?: string;
  onForceSyncServer?: () => void;
  onExportBackup?: () => void;
  onImportBackup?: (file: File) => void;
  onUpdateCreator: (updated: CreatorProfile) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateOrderNotes: (orderId: string, notes: string) => void;
  onDeleteOrder: (orderId: string) => void;
  onAddPortfolioItem: (item: PortfolioItem) => void;
  onUpdatePortfolioItem: (item: PortfolioItem) => void;
  onDeletePortfolioItem: (itemId: string) => void;
  onUpdatePricingPlans: (plans: PricingPlan[]) => void;
  onAddClientReview: (review: ClientReview) => void;
  onDeleteClientReview: (reviewId: string) => void;
  onUpdateFaqs: (faqs: FAQItem[]) => void;
  onResetToDemoData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  lang,
  onLanguageToggle,
  onExitAdmin,
  creator,
  orders,
  portfolioItems,
  pricingPlans,
  clientReviews,
  faqs,
  uiConfig,
  onUpdateUIConfig,
  serverSyncStatus = 'saved',
  lastSyncTime,
  onForceSyncServer,
  onExportBackup,
  onImportBackup,
  onUpdateCreator,
  onUpdateOrderStatus,
  onUpdateOrderNotes,
  onDeleteOrder,
  onAddPortfolioItem,
  onUpdatePortfolioItem,
  onDeletePortfolioItem,
  onUpdatePricingPlans,
  onAddClientReview,
  onDeleteClientReview,
  onUpdateFaqs,
  onResetToDemoData,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'portfolio' | 'pricing' | 'reviews' | 'faq' | 'ui_editor' | 'settings'
  >('dashboard');

  // Orders Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [editingNotesOrderId, setEditingNotesOrderId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Portfolio Add/Edit State
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [portfolioSavedToast, setPortfolioSavedToast] = useState<{ show: boolean; msg: string; type: 'success' | 'delete' } | null>(null);

  const [itemTitleGu, setItemTitleGu] = useState('');
  const [itemTitleEn, setItemTitleEn] = useState('');
  const [itemCategory, setItemCategory] = useState<'poster' | 'video' | 'thumbnail'>('poster');
  const [itemPrice, setItemPrice] = useState('299');
  const [itemDeliveryGu, setItemDeliveryGu] = useState('૨૪ કલાક');
  const [itemDeliveryEn, setItemDeliveryEn] = useState('24 Hours');
  const [itemImageUrl, setItemImageUrl] = useState('/src/assets/images/poster_festive_design_1790948328946.jpg');
  const [itemVideoUrl, setItemVideoUrl] = useState('');
  const [itemSoftware, setItemSoftware] = useState('Photoshop, Illustrator');
  const [itemDescGu, setItemDescGu] = useState('');
  const [itemDescEn, setItemDescEn] = useState('');

  // Pricing Plans Local Editable State
  const [editablePlans, setEditablePlans] = useState<PricingPlan[]>(pricingPlans);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [newPlanNameGu, setNewPlanNameGu] = useState('');
  const [newPlanNameEn, setNewPlanNameEn] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('499');
  const [newPlanTaglineGu, setNewPlanTaglineGu] = useState('');
  const [newPlanFeaturesGu, setNewPlanFeaturesGu] = useState('૧ હાઈ ક્વોલિટી ડિઝાઇન, ૨ ફ્રી રિવિઝન, ૨૪ કલાકમાં ડિલિવરી');
  const [pricingSavedToast, setPricingSavedToast] = useState(false);

  // Settings & Custom Password State
  const [studioNameGu, setStudioNameGu] = useState(creator.studioNameGu);
  const [studioNameEn, setStudioNameEn] = useState(creator.studioName);
  const [creatorNameGu, setCreatorNameGu] = useState(creator.creatorNameGu);
  const [creatorNameEn, setCreatorNameEn] = useState(creator.creatorName);
  const [whatsappNumber, setWhatsappNumber] = useState(creator.whatsapp);
  const [phoneNumber, setPhoneNumber] = useState(creator.phone);
  const [upiId, setUpiId] = useState(creator.upiId);
  const [instagram, setInstagram] = useState(creator.instagram);
  const [logoImage, setLogoImage] = useState(creator.logoImage || '');
  const [heroImage, setHeroImage] = useState(creator.heroImage || '');
  const [heroHeadlineGu, setHeroHeadlineGu] = useState(creator.heroHeadlineGu || '');
  const [heroSubheadGu, setHeroSubheadGu] = useState(creator.heroSubheadGu || '');
  const [newPassword, setNewPassword] = useState(creator.adminPassword || creator.adminPin || '1234');
  const [confirmPassword, setConfirmPassword] = useState(creator.adminPassword || creator.adminPin || '1234');
  const [showPassword, setShowPassword] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Review State
  const [newRevName, setNewRevName] = useState('');
  const [newRevLocation, setNewRevLocation] = useState('');
  const [newRevBusiness, setNewRevBusiness] = useState('');
  const [newRevRating, setNewRevRating] = useState(5);
  const [newRevCommentGu, setNewRevCommentGu] = useState('');

  // FAQ Add State
  const [newFaqQGu, setNewFaqQGu] = useState('');
  const [newFaqAGu, setNewFaqAGu] = useState('');

  // Calculations
  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const inProgressOrders = orders.filter((o) => o.status === 'in_progress');
  const completedOrders = orders.filter((o) => o.status === 'completed');

  const totalCompletedRevenue = completedOrders.reduce((sum, o) => sum + (o.estimatedPrice || 0), 0);
  const totalPendingRevenue = [...pendingOrders, ...inProgressOrders].reduce(
    (sum, o) => sum + (o.estimatedPrice || 0),
    0
  );

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = orderStatusFilter === 'all' || ord.status === orderStatusFilter;
    const q = orderSearch.toLowerCase().trim();
    const matchesQuery =
      !q ||
      ord.id.toLowerCase().includes(q) ||
      ord.clientName.toLowerCase().includes(q) ||
      ord.phone.includes(q) ||
      ord.city.toLowerCase().includes(q) ||
      ord.requirementsText.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // Export Orders as CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Client Name', 'Phone', 'City', 'Service', 'Urgency', 'Price', 'Status', 'Date', 'Requirements'];
    const rows = orders.map((o) => [
      o.id,
      `"${o.clientName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.city.replace(/"/g, '""')}"`,
      `"${(o.serviceCategoryLabel || o.serviceCategory).replace(/"/g, '""')}"`,
      o.urgency,
      o.estimatedPrice,
      o.status,
      o.createdAt,
      `"${o.requirementsText.replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp quick templates
  const sendWhatsAppTemplate = (order: Order, templateType: 'accepted' | 'proof_ready' | 'completed') => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    let msg = '';
    if (templateType === 'accepted') {
      msg = lang === 'gu'
        ? `નમસ્તે ${order.clientName}જી! તમારા ઓર્ડર (${order.id} - ${order.serviceCategoryLabel || order.serviceCategory}) નું કામ શરૂ કરી દીધું છે. ટૂંક સમયમાં તમને પ્રિવ્યુ સેમ્પલ મોકલીશું.`
        : `Hello ${order.clientName}! Work on your order (${order.id}) has officially started. We will share a proof preview shortly.`;
    } else if (templateType === 'proof_ready') {
      msg = lang === 'gu'
        ? `નમસ્તે ${order.clientName}જી! તમારા ઓર્ડર (${order.id}) નું ડ્રાફ્ટ સેમ્પલ તૈયાર છે. કૃપા કરીને ચેક કરી જણાવો કે કોઈ ફેરફાર કરાવવો છે કે નહીં.`
        : `Hello ${order.clientName}! Your draft preview for order (${order.id}) is ready. Please review and let us know if any corrections are needed.`;
    } else {
      msg = lang === 'gu'
        ? `નમસ્તે ${order.clientName}જી! તમારો ઓર્ડર (${order.id}) સંપૂર્ણ તૈયાર છે. ફાઇનલ અલ્ટ્રા HD ફાઇલ મોકલવા માટે કૃપા કરીને ₹${order.estimatedPrice} નું પેમેન્ટ UPI ID: ${creator.upiId} પર કરી સ્ક્રીનશોટ મોકલો. આભાર!`
        : `Hello ${order.clientName}! Your final design (${order.id}) is ready. Please complete payment of ₹${order.estimatedPrice} via UPI ID: ${creator.upiId} to receive the Full HD files. Thank you!`;
    }
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Handle Logo Upload from Local Device with Compression
  const handleLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 400, 400, 0.88);
        setLogoImage(compressed);
      } catch (err) {
        console.error('Logo compression failed, fallback to reader', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          setLogoImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  // Handle Hero Image Upload with Compression
  const handleHeroFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 1600, 1200, 0.82);
        setHeroImage(compressed);
      } catch (err) {
        console.error('Hero compression failed, fallback to reader', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          setHeroImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  // Handle Poster / Video Image Upload with Compression
  const handleItemImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const compressed = await compressImage(file, 1200, 1200, 0.82);
        setItemImageUrl(compressed);
      } catch (err) {
        console.error('Poster compression failed, fallback to reader', err);
        const reader = new FileReader();
        reader.onload = (event) => {
          setItemImageUrl(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  // Handle Portfolio Save
  const handleSavePortfolioItem = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitleGu = itemTitleGu.trim() || itemTitleEn.trim();
    const finalTitleEn = itemTitleEn.trim() || itemTitleGu.trim();
    if (!finalTitleGu) {
      alert(lang === 'gu' ? 'કૃપા કરીને પોસ્ટર/વિડિઓનું નામ (ટાઇટલ) લખો' : 'Please enter a title');
      return;
    }

    const finalImage = itemImageUrl.trim() || '/src/assets/images/poster_festive_design_1790948328946.jpg';

    if (editingItem) {
      const updated: PortfolioItem = {
        ...editingItem,
        title: finalTitleEn,
        titleGu: finalTitleGu,
        category: itemCategory,
        price: parseInt(itemPrice) || 299,
        deliveryTime: itemDeliveryEn || '24 Hours',
        deliveryTimeGu: itemDeliveryGu || '૨૪ કલાક',
        image: finalImage,
        videoUrl: itemVideoUrl.trim() || undefined,
        software: itemSoftware.split(',').map((s) => s.trim()).filter(Boolean),
        description: itemDescEn.trim() || editingItem.description,
        descriptionGu: itemDescGu.trim() || editingItem.descriptionGu,
      };
      onUpdatePortfolioItem(updated);
      setEditingItem(null);
      setPortfolioSavedToast({
        show: true,
        msg: lang === 'gu' ? `"${finalTitleGu}" માં ફેરફારો સાચવાઈ ગયા!` : `"${finalTitleEn}" updated successfully!`,
        type: 'success',
      });
    } else {
      const newItem: PortfolioItem = {
        id: `item-${Date.now()}`,
        title: finalTitleEn,
        titleGu: finalTitleGu,
        category: itemCategory,
        subcategory: itemCategory === 'video' ? 'reels' : 'festival',
        image: finalImage,
        videoUrl: itemVideoUrl.trim() || undefined,
        price: parseInt(itemPrice) || 299,
        deliveryTime: itemDeliveryEn || '24 Hours',
        deliveryTimeGu: itemDeliveryGu || '૨૪ કલાક',
        software: itemSoftware.split(',').map((s) => s.trim()).filter(Boolean),
        featured: true,
        description: itemDescEn.trim() || 'Custom creative design tailored to brand identity.',
        descriptionGu: itemDescGu.trim() || 'બિઝનેસ અને સોશિયલ મીડિયા માટે પ્રોફેશનલ ડિઝાઇન.',
      };
      onAddPortfolioItem(newItem);
      setIsAddingItem(false);
      setPortfolioSavedToast({
        show: true,
        msg: lang === 'gu' ? `"${finalTitleGu}" સફળતાપૂર્વક વેબસાઇટ પર પબ્લિશ થઈ ગયું છે!` : `"${finalTitleEn}" published successfully!`,
        type: 'success',
      });
    }

    // Reset Form
    setItemTitleGu('');
    setItemTitleEn('');
    setItemDescGu('');
    setItemDescEn('');
    setItemVideoUrl('');
    setItemImageUrl('/src/assets/images/poster_festive_design_1790948328946.jpg');

    setTimeout(() => {
      setPortfolioSavedToast(null);
    }, 7000);
  };

  const startEditItem = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsAddingItem(false);
    setItemTitleGu(item.titleGu);
    setItemTitleEn(item.title);
    setItemCategory(item.category as any);
    setItemPrice(item.price.toString());
    setItemDeliveryGu(item.deliveryTimeGu);
    setItemDeliveryEn(item.deliveryTime);
    setItemImageUrl(item.image);
    setItemVideoUrl(item.videoUrl || '');
    setItemSoftware(item.software.join(', '));
    setItemDescGu(item.descriptionGu);
    setItemDescEn(item.description);
  };

  // Add New Pricing Plan
  const handleAddNewPricingPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanNameGu.trim()) return;

    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: newPlanNameEn.trim() || newPlanNameGu.trim(),
      nameGu: newPlanNameGu.trim(),
      tagline: 'Customized package tailored for your business',
      taglineGu: newPlanTaglineGu.trim() || 'તમારા બિઝનેસ માટે વિશેષ પેકેજ',
      price: parseInt(newPlanPrice) || 499,
      features: newPlanFeaturesGu.split(',').map((f) => f.trim()).filter(Boolean),
      featuresGu: newPlanFeaturesGu.split(',').map((f) => f.trim()).filter(Boolean),
      idealFor: 'Businesses & Individuals',
      idealForGu: 'દુકાનો અને વેપારીઓ માટે',
      category: 'poster',
      popular: false,
    };

    const updated = [...editablePlans, newPlan];
    setEditablePlans(updated);
    onUpdatePricingPlans(updated);
    setIsAddingPlan(false);
    setNewPlanNameGu('');
    setNewPlanNameEn('');
    setNewPlanTaglineGu('');
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm(lang === 'gu' ? 'શું તમે આ પેકેજ દૂર કરવા માંગો છો?' : 'Delete this package?')) {
      const updated = editablePlans.filter((p) => p.id !== planId);
      setEditablePlans(updated);
      onUpdatePricingPlans(updated);
    }
  };

  const handleSavePricing = () => {
    onUpdatePricingPlans(editablePlans);
    setPricingSavedToast(true);
    setTimeout(() => setPricingSavedToast(false), 2500);
  };

  // FAQ Handlers
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQGu.trim() || !newFaqAGu.trim()) return;

    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      qGu: newFaqQGu.trim(),
      qEn: newFaqQGu.trim(),
      aGu: newFaqAGu.trim(),
      aEn: newFaqAGu.trim(),
    };

    onUpdateFaqs([...faqs, newFaq]);
    setNewFaqQGu('');
    setNewFaqAGu('');
  };

  const handleDeleteFaq = (faqId: string) => {
    if (window.confirm(lang === 'gu' ? 'આ પ્રશ્ન દૂર કરવો છે?' : 'Delete this FAQ?')) {
      onUpdateFaqs(faqs.filter((f) => f.id !== faqId));
    }
  };

  // Save Settings & Password
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert(lang === 'gu' ? 'બંને પાસવર્ડ સરખા નથી!' : 'Passwords do not match!');
      return;
    }

    onUpdateCreator({
      ...creator,
      studioName: studioNameEn,
      studioNameGu: studioNameGu,
      creatorName: creatorNameEn,
      creatorNameGu: creatorNameGu,
      whatsapp: whatsappNumber,
      phone: phoneNumber,
      upiId: upiId,
      instagram: instagram,
      logoImage: logoImage,
      heroImage: heroImage,
      heroHeadlineGu: heroHeadlineGu,
      heroSubheadGu: heroSubheadGu,
      adminPassword: newPassword,
      adminPin: newPassword,
    });

    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col antialiased">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between shadow-md">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          {creator.logoImage ? (
            <img src={creator.logoImage} alt="Logo" className="h-9 w-auto max-w-[120px] object-contain rounded" />
          ) : (
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center font-black text-sm">
              MK
            </span>
          )}
          <div>
            <span className="text-base font-extrabold text-white tracking-tight">
              {lang === 'gu' ? creator.studioNameGu : creator.studioName}
            </span>
            <span className="ml-2 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950">
              {lang === 'gu' ? 'કન્ટ્રોલ સેન્ટર' : 'CMS'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Server Sync Status Badge */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold ${
              serverSyncStatus === 'saved'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : serverSyncStatus === 'syncing'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
            title={lang === 'gu' ? 'વેબસાઇટ સર્વર સ્થિતિ' : 'Website Server Status'}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                serverSyncStatus === 'saved'
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400'
                  : serverSyncStatus === 'syncing'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-red-400'
              }`}
            />
            <span>
              {serverSyncStatus === 'saved'
                ? (lang === 'gu' ? 'સર્વર સેવડ (Publish Ready)' : 'Saved Live (Publish Ready)')
                : serverSyncStatus === 'syncing'
                ? (lang === 'gu' ? 'સેવ થઈ રહ્યું છે...' : 'Syncing...')
                : (lang === 'gu' ? 'સર્વર ઓફલાઇન' : 'Offline')}
            </span>
          </div>

          {/* Quick Force Save Button */}
          {onForceSyncServer && (
            <button
              onClick={onForceSyncServer}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all cursor-pointer shadow"
              title={lang === 'gu' ? 'તમામ ફેરફારો સર્વર પર સેવ કરો' : 'Save all changes to server'}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'સર્વર સેવ' : 'Save Live'}</span>
            </button>
          )}

          <button
            onClick={onLanguageToggle}
            type="button"
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-700 bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
          >
            {lang === 'gu' ? 'English' : 'ગુજરાતી'}
          </button>

          <button
            onClick={onExitAdmin}
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-all cursor-pointer shadow"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{lang === 'gu' ? 'લાઇવ સાઇટ જુઓ' : 'View Live Site'}</span>
          </button>

          <button
            onClick={onExitAdmin}
            type="button"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
            title={lang === 'gu' ? 'લોગ આઉટ' : 'Logout'}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Admin Workspace (Sidebar + Content) */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-neutral-800 bg-neutral-900/60 p-4 shrink-0">
          <div className="space-y-1">
            
            <button
              onClick={() => setActiveTab('dashboard')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ડેશબોર્ડ' : 'Dashboard'}</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ગ્રાહકોના ઓર્ડર્સ' : 'Client Orders'}</span>
              </div>
              {pendingOrders.length > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === 'orders' ? 'bg-neutral-950 text-amber-400' : 'bg-amber-500 text-neutral-950'
                  }`}
                >
                  {pendingOrders.length}
                </span>
              )}
            </button>

            {/* Portfolio Works Tab */}
            <button
              onClick={() => setActiveTab('portfolio')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'portfolio'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ImageIcon className="w-4 h-4" />
                <span>{lang === 'gu' ? 'પોસ્ટર & વિડિઓ (સેમ્પલ)' : 'Posters & Videos'}</span>
              </div>
              <span className="text-[11px] text-neutral-500 tabular-nums">
                {portfolioItems.length}
              </span>
            </button>

            {/* Pricing Tab */}
            <button
              onClick={() => setActiveTab('pricing')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ભાવ અને પેકેજ' : 'Pricing Plans'}</span>
              </div>
              <span className="text-[11px] text-neutral-500 tabular-nums">
                {editablePlans.length}
              </span>
            </button>

            {/* Reviews Tab */}
            <button
              onClick={() => setActiveTab('reviews')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4" />
                <span>{lang === 'gu' ? 'ગ્રાહક રીવ્યુ' : 'Client Reviews'}</span>
              </div>
              <span className="text-[11px] text-neutral-500 tabular-nums">
                {clientReviews.length}
              </span>
            </button>

            {/* FAQ Tab */}
            <button
              onClick={() => setActiveTab('faq')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'faq'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4" />
                <span>{lang === 'gu' ? 'પ્રશ્નોત્તરી (FAQ)' : 'Manage FAQ'}</span>
              </div>
              <span className="text-[11px] text-neutral-500 tabular-nums">
                {faqs.length}
              </span>
            </button>

            {/* Full UI & Text Customizer Tab */}
            <button
              onClick={() => setActiveTab('ui_editor')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'ui_editor'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Palette className="w-4 h-4 text-amber-400" />
                <span>{lang === 'gu' ? 'આખી સાઇટ UI & લખાણ' : 'Full Site UI & Text'}</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400">
                PRO
              </span>
            </button>

            {/* Settings & Password Tab */}
            <button
              onClick={() => setActiveTab('settings')}
              type="button"
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Settings className="w-4 h-4" />
                <span>{lang === 'gu' ? 'લોગો, પાસવર્ડ & સેટિંગ્સ' : 'Logo, Password & Setup'}</span>
              </div>
            </button>

          </div>

          {/* Quick Info Block */}
          <div className="mt-8 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span>{lang === 'gu' ? 'એડમિન પાસવર્ડ:' : 'Password:'}</span>
              <span className="text-amber-400 font-mono font-bold">{creator.adminPassword || '1234'}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-400">
              <span>{lang === 'gu' ? 'ઓર્ડર WhatsApp:' : 'WA Number:'}</span>
              <span className="text-emerald-400 font-mono font-bold">+{creator.whatsapp}</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 text-center">
              <button
                onClick={onResetToDemoData}
                type="button"
                className="text-[10px] text-neutral-500 hover:text-amber-400 transition-colors cursor-pointer"
              >
                🔄 {lang === 'gu' ? 'ડેમો ડેટા રીસેટ કરો' : 'Reset to Demo Data'}
              </button>
            </div>
          </div>
        </aside>

        {/* Right Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {lang === 'gu' ? 'નમસ્તે! સ્ટુડિયો કન્ટ્રોલ સેન્ટર' : 'Welcome to Your Creative Studio'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-1">
                    {lang === 'gu'
                      ? 'અહીંથી તમે તમારો પોતાનો લોગો, પોસ્ટર્સ, વિડિઓઝ અને પાસવર્ડ સંપૂર્ણપણે કંટ્રોલ કરી શકો છો.'
                      : 'You have complete control to add your own logo, posters, reels, and custom password.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('portfolio');
                      setIsAddingItem(true);
                    }}
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === 'gu' ? 'પોતાનું પોસ્ટર / વિડિઓ ઉમેરો' : 'Add My Work'}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'gu' ? 'પોતાનો લોગો બદલો' : 'Set Logo'}</span>
                  </button>
                </div>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs font-semibold text-neutral-400 mb-1">{lang === 'gu' ? 'કુલ ઓર્ડર્સ' : 'Total Orders'}</div>
                  <div className="text-3xl font-black text-white tabular-nums">{orders.length}</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-amber-500/30">
                  <div className="text-xs font-semibold text-amber-400 mb-1">{lang === 'gu' ? 'નવા / બાકી ઓર્ડર્સ' : 'Pending Orders'}</div>
                  <div className="text-3xl font-black text-amber-400 tabular-nums">{pendingOrders.length + inProgressOrders.length}</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-emerald-500/30">
                  <div className="text-xs font-semibold text-emerald-400 mb-1">{lang === 'gu' ? 'પૂર્ણ થયેલ આવક' : 'Completed Revenue'}</div>
                  <div className="text-3xl font-black text-emerald-400 tabular-nums">₹{totalCompletedRevenue}</div>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="text-xs font-semibold text-neutral-400 mb-1">{lang === 'gu' ? 'ગેલેરીમાં પોસ્ટર & વિડિઓ' : 'Showcase Items'}</div>
                  <div className="text-3xl font-black text-white tabular-nums">{portfolioItems.length}</div>
                </div>
              </div>

              {/* Quick Actions Shortcuts */}
              <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
                <h3 className="text-sm font-bold text-white mb-3">{lang === 'gu' ? 'ઝડપી શોર્ટકટ:' : 'Quick Customization Shortcuts:'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-left cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-xs text-white">🎨 {lang === 'gu' ? 'પોતાનો લોગો & નામ બદલો' : 'Upload Logo & Studio Name'}</div>
                    <div className="text-[11px] text-neutral-400 mt-1">{lang === 'gu' ? 'તમારો ઓરિજિનલ લોગો ફોટો અપલોડ કરો' : 'Upload image or change title'}</div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('portfolio');
                      setIsAddingItem(true);
                    }}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-left cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-xs text-white">🖼️ {lang === 'gu' ? 'પોતાના પોસ્ટર ઉમેરો' : 'Upload My Posters'}</div>
                    <div className="text-[11px] text-neutral-400 mt-1">{lang === 'gu' ? 'તમારા બનાવેલા પોસ્ટર ફાઇલથી અપલોડ કરો' : 'Upload directly from device'}</div>
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-400 text-left cursor-pointer transition-colors"
                  >
                    <div className="font-bold text-xs text-white">🔑 {lang === 'gu' ? 'પોતાનો પાસવર્ડ બદલો' : 'Change My Password'}</div>
                    <div className="text-[11px] text-neutral-400 mt-1">{lang === 'gu' ? 'મનપસંદ સિક્રેટ પાસવર્ડ રાખો' : 'Set custom secure password'}</div>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: CLIENT ORDERS */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {lang === 'gu' ? 'ગ્રાહકોના બધા ઓર્ડર્સ' : 'Client Orders Management'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lang === 'gu' ? 'ઓર્ડર્સ ચેક કરો, WhatsApp પર પ્રિવ્યુ મોકલો અને સ્ટેટસ બદલો.' : 'Manage client requests.'}
                  </p>
                </div>

                <button
                  onClick={handleExportCSV}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-white transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'gu' ? 'CSV ડાઉનલોડ કરો' : 'Export Orders CSV'}</span>
                </button>
              </div>

              {/* Status Tabs & Search Box */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
                  {[
                    { id: 'all', gu: 'બધા ઓર્ડર્સ', en: 'All' },
                    { id: 'pending', gu: 'નવા (Pending)', en: 'Pending' },
                    { id: 'in_progress', gu: 'કામ ચાલુ', en: 'In Progress' },
                    { id: 'completed', gu: 'પતી ગયું (Done)', en: 'Completed' },
                    { id: 'cancelled', gu: 'રદ', en: 'Cancelled' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setOrderStatusFilter(tab.id)}
                      type="button"
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        orderStatusFilter === tab.id
                          ? 'bg-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {lang === 'gu' ? tab.gu : tab.en}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={lang === 'gu' ? 'નામ, ફોન કે શહેર શોધો...' : 'Search orders...'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="py-16 text-center border border-neutral-800 rounded-2xl bg-neutral-900/40">
                  <p className="text-neutral-400 text-xs">
                    {lang === 'gu' ? 'કોઈ ઓર્ડર મળ્યો નથી.' : 'No orders found matching criteria.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const clientPhoneClean = ord.phone.replace(/[^0-9]/g, '');
                    const isEditingNotes = editingNotesOrderId === ord.id;

                    return (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/70 hover:border-neutral-700 transition-colors shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-sm font-bold text-amber-400">{ord.id}</span>
                              <span className="text-neutral-500">·</span>
                              <span className="text-sm font-bold text-white">{ord.clientName}</span>
                              <span className="text-xs text-neutral-400">({ord.city})</span>
                              {ord.urgency === 'express' && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-neutral-950 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>6h Express</span>
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-400 mt-1">
                              {lang === 'gu' ? 'સર્વિસ:' : 'Service:'}{' '}
                              <strong className="text-neutral-200">{ord.serviceCategoryLabel || ord.serviceCategory}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-lg font-black text-amber-400 tabular-nums">
                              ₹{ord.estimatedPrice}
                            </span>

                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border focus:outline-none cursor-pointer ${
                                ord.status === 'completed'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : ord.status === 'in_progress'
                                  ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                  : ord.status === 'cancelled'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              }`}
                            >
                              <option value="pending" className="bg-neutral-900 text-white">
                                {lang === 'gu' ? 'નવો ઓર્ડર (Pending)' : 'Pending'}
                              </option>
                              <option value="in_progress" className="bg-neutral-900 text-white">
                                {lang === 'gu' ? 'કામ ચાલુ (In Progress)' : 'In Progress'}
                              </option>
                              <option value="completed" className="bg-neutral-900 text-white">
                                {lang === 'gu' ? 'પૂર્ણ થયું (Completed)' : 'Completed'}
                              </option>
                              <option value="cancelled" className="bg-neutral-900 text-white">
                                {lang === 'gu' ? 'રદ (Cancelled)' : 'Cancelled'}
                              </option>
                            </select>
                          </div>
                        </div>

                        <div className="py-3 text-xs text-neutral-200 whitespace-pre-line leading-relaxed bg-neutral-950/40 p-3 rounded-xl border border-neutral-800/80 my-3">
                          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                            {lang === 'gu' ? 'ગ્રાહકની જરૂરીયાત અને પોસ્ટર લખાણ:' : 'Client Requirements:'}
                          </span>
                          {ord.requirementsText}
                        </div>

                        {/* WhatsApp Templates & Direct Actions */}
                        <div className="pt-3 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] text-neutral-400 font-semibold mr-1">
                              {lang === 'gu' ? 'WhatsApp મેસેજ:' : 'WA Reply:'}
                            </span>
                            <button
                              onClick={() => sendWhatsAppTemplate(ord, 'accepted')}
                              type="button"
                              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
                            >
                              {lang === 'gu' ? '૧. ઓર્ડર સ્વીકાર્યો' : '1. Accepted'}
                            </button>
                            <button
                              onClick={() => sendWhatsAppTemplate(ord, 'proof_ready')}
                              type="button"
                              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] transition-colors cursor-pointer"
                            >
                              {lang === 'gu' ? '૨. સેમ્પલ તૈયાર છે' : '2. Proof Ready'}
                            </button>
                            <button
                              onClick={() => sendWhatsAppTemplate(ord, 'completed')}
                              type="button"
                              className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[11px] font-semibold transition-colors cursor-pointer"
                            >
                              {lang === 'gu' ? '૩. પેમેન્ટ રીમાઇન્ડર' : '3. Payment'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${clientPhoneClean}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                            <a
                              href={`tel:${clientPhoneClean}`}
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-amber-400" />
                              <span>{ord.phone}</span>
                            </a>
                            <button
                              onClick={() => onDeleteOrder(ord.id)}
                              type="button"
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PORTFOLIO (ADD OWN POSTERS & VIDEOS, REMOVE ANY) */}
          {/* ========================================================= */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {lang === 'gu' ? 'પોતાના પોસ્ટર & વિડિઓ ઉમેરો અથવા દૂર કરો' : 'Posters & Video Showcase Manager'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lang === 'gu'
                      ? 'તમારા મોબાઇલ કે કોમ્પ્યુટરથી પોસ્ટરનો ફોટો સીધો અપલોડ કરો અને કોઈપણ સેમ્પલ દૂર કરો.'
                      : 'Upload poster images directly from your device and remove any existing item.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsAddingItem(true);
                    setEditingItem(null);
                    setItemTitleGu('');
                    setItemTitleEn('');
                  }}
                  type="button"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'નવું પોસ્ટર / વિડિઓ અપલોડ કરો' : 'Upload New Design'}</span>
                </button>
              </div>

              {/* Add / Edit Form */}
              {(isAddingItem || editingItem) && (
                <div className="p-6 rounded-2xl bg-neutral-900 border border-amber-400/30 mb-6 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                    <h3 className="text-base font-bold text-amber-400">
                      {editingItem
                        ? (lang === 'gu' ? 'સેમ્પલમાં ફેરફાર કરો' : 'Edit Showcase Item')
                        : (lang === 'gu' ? 'નવું પોસ્ટર / વિડિઓ સેમ્પલ મૂકો' : 'Add New Showcase Item')}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingItem(false);
                        setEditingItem(null);
                      }}
                      className="text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
                    >
                      {lang === 'gu' ? 'રદ કરો (Cancel)' : 'Cancel'}
                    </button>
                  </div>

                  <form onSubmit={handleSavePortfolioItem} className="space-y-4">
                    
                    {/* Device Upload Section */}
                    <div className="p-4 rounded-xl bg-neutral-950 border border-dashed border-amber-400/40">
                      <label className="block text-xs font-bold text-amber-400 mb-2">
                        📁 {lang === 'gu' ? 'તમારા ડિવાઇસમાંથી પોસ્ટર ફોટો પસંદ કરો (File Upload)' : 'Upload Poster from Mobile/PC:'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleItemImageUpload}
                        className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-neutral-950 hover:file:bg-amber-300 cursor-pointer"
                      />
                      {itemImageUrl && (
                        <div className="mt-3 flex items-center gap-3">
                          <img src={itemImageUrl} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-neutral-700" />
                          <span className="text-xs text-emerald-400">✓ {lang === 'gu' ? 'ફોટો પસંદ થઈ ગયો છે' : 'Image loaded'}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          {lang === 'gu' ? 'ટાઇટલ (ગુજરાતીમાં) *' : 'Title (Gujarati) *'}
                        </label>
                        <input
                          type="text"
                          value={itemTitleGu}
                          onChange={(e) => setItemTitleGu(e.target.value)}
                          placeholder="દા.ત. શ્રાવણ માસ મહાપૂજા પોસ્ટર"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          {lang === 'gu' ? 'Title (English)' : 'Title (English)'}
                        </label>
                        <input
                          type="text"
                          value={itemTitleEn}
                          onChange={(e) => setItemTitleEn(e.target.value)}
                          placeholder="e.g. Festive Promotion Poster"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          {lang === 'gu' ? 'કેટેગરી' : 'Category'}
                        </label>
                        <select
                          value={itemCategory}
                          onChange={(e) => setItemCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="poster">{lang === 'gu' ? 'પોસ્ટર ડિઝાઇન' : 'Poster'}</option>
                          <option value="video">{lang === 'gu' ? 'વિડિઓ રીલ' : 'Video Reel'}</option>
                          <option value="thumbnail">{lang === 'gu' ? 'યુટ્યુબ થંબનેલ' : 'Thumbnail'}</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          {lang === 'gu' ? 'ભાવ (₹)' : 'Price (₹)'}
                        </label>
                        <input
                          type="number"
                          value={itemPrice}
                          onChange={(e) => setItemPrice(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-neutral-300 mb-1">
                          {lang === 'gu' ? 'ડિલિવરી સમય' : 'Delivery Turnaround'}
                        </label>
                        <input
                          type="text"
                          value={itemDeliveryGu}
                          onChange={(e) => setItemDeliveryGu(e.target.value)}
                          placeholder="૨૪ કલાક"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    {itemCategory === 'video' && (
                      <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-amber-400">
                            🎬 {lang === 'gu' ? 'વિડિઓ લિંક (Google Drive, YouTube અથવા MP4) *' : 'Video Link (Google Drive, YouTube, or MP4) *'}
                          </label>
                          {itemVideoUrl && (() => {
                            const info = parseVideoUrl(itemVideoUrl);
                            if (info.type === 'google_drive') {
                              return (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/40">
                                  ✓ Google Drive વિડિઓ
                                </span>
                              );
                            }
                            if (info.type === 'youtube') {
                              return (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/40">
                                  ✓ YouTube વિડિઓ
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>

                        <input
                          type="text"
                          value={itemVideoUrl}
                          onChange={(e) => setItemVideoUrl(e.target.value)}
                          placeholder="https://drive.google.com/file/d/.../view અથવા YouTube / MP4 લિંક"
                          className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                        />

                        {/* Google Drive Instructions Guide */}
                        <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-300 space-y-1.5">
                          <p className="font-bold text-amber-400">
                            💡 ગૂગલ ડ્રાઇવ (Google Drive) વિડિઓ કેવી રીતે સેટ કરવો:
                          </p>
                          <ol className="list-decimal pl-4 space-y-1 text-neutral-400 text-[11px] leading-relaxed">
                            <li>તમારા ગૂગલ ડ્રાઇવમાં વિડિઓ પર <strong className="text-white">Right-Click ➔ Share</strong> કરો.</li>
                            <li><strong className="text-white">General Access</strong> માં <strong className="text-amber-300">'Anyone with the link' (કોઈપણ વ્યક્તિ લિંક જોઈ શકે)</strong> પસંદ કરો. <em>(આ સૌથી મહત્વપૂર્ણ છે!)</em></li>
                            <li><strong className="text-white">Copy link</strong> કરીને અહીં બોક્સમાં પેસ્ટ કરો. તે આપમેળે લાઇવ પ્લેયરમાં કન્વર્ટ થઈ જશે!</li>
                          </ol>
                        </div>

                        {/* Live Video Preview Box */}
                        {itemVideoUrl && (
                          <div className="mt-3 pt-3 border-t border-neutral-800">
                            <span className="block text-[11px] font-semibold text-neutral-400 mb-1.5">
                              {lang === 'gu' ? 'લાઇવ વિડિઓ પ્રિવ્યુ (અહીં ચેક કરો):' : 'Live Video Preview (Test Player):'}
                            </span>
                            <div className="w-full max-w-[280px] aspect-[9/16] rounded-xl overflow-hidden border border-neutral-700 bg-black shadow-lg">
                              <UniversalVideoPlayer
                                videoUrl={itemVideoUrl}
                                posterImage={itemImageUrl}
                                className="w-full h-full"
                                controls={true}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'સોફ્ટવેર ટૂલ્સ' : 'Software Used'}
                      </label>
                      <input
                        type="text"
                        value={itemSoftware}
                        onChange={(e) => setItemSoftware(e.target.value)}
                        placeholder="Photoshop, Premiere Pro"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'વર્ણન (Gujarati Description)' : 'Description'}
                      </label>
                      <textarea
                        rows={2}
                        value={itemDescGu}
                        onChange={(e) => setItemDescGu(e.target.value)}
                        placeholder="આ ડિઝાઇન કે વિડિઓની ખાસિયતો..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition-colors cursor-pointer shadow"
                      >
                        {editingItem
                          ? (lang === 'gu' ? 'ફેરફાર સાચવો' : 'Save Changes')
                          : (lang === 'gu' ? 'વેબસાઇટ પર મૂકો (Publish)' : 'Publish Item')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingItem(false);
                          setEditingItem(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold cursor-pointer"
                      >
                        {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Items Grid with 1-Click Delete */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolioItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between hover:border-neutral-700 transition-colors"
                  >
                    <div>
                      <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-neutral-950 mb-3 relative">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-400 text-neutral-950 text-xs font-bold tabular-nums">
                          ₹{item.price}
                        </span>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neutral-950/80 text-white text-[10px] uppercase font-bold">
                          {item.category}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{item.titleGu}</h4>
                      <p className="text-xs text-neutral-400 line-clamp-2 mb-3">{item.descriptionGu}</p>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
                      <span className="text-neutral-400 font-medium">{item.deliveryTimeGu}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditItem(item)}
                          className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>{lang === 'gu' ? 'એડિટ' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => onDeletePortfolioItem(item.id)}
                          className="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Delete from website"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>{lang === 'gu' ? 'દૂર કરો' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PRICING (ADD, EDIT & DELETE PACKAGES) */}
          {/* ========================================================= */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {lang === 'gu' ? 'ભાવ પત્રક અને પેકેજ મેનેજર' : 'Pricing & Rate Cards Manager'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lang === 'gu'
                      ? 'કોઈપણ પેકેજનો ભાવ બદલો, નવું પેકેજ ઉમેરો અથવા અનિચ્છનીય પેકેજ દૂર કરો.'
                      : 'Add new packages, update prices, or remove packages from the website.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddingPlan(true)}
                    type="button"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs border border-neutral-700 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'gu' ? 'નવું પેકેજ ઉમેરો' : 'Add New Plan'}</span>
                  </button>
                  <button
                    onClick={handleSavePricing}
                    type="button"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs shadow transition-colors cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'gu' ? 'ભાવ સાચવો' : 'Save All Pricing'}</span>
                  </button>
                </div>
              </div>

              {pricingSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'નવા ભાવ સફળતાપૂર્વક અપડેટ થઈ ગયા!' : 'Pricing plans updated successfully!'}</span>
                </div>
              )}

              {/* Add New Plan Drawer */}
              {isAddingPlan && (
                <div className="p-5 rounded-2xl bg-neutral-900 border border-amber-400/40 space-y-3">
                  <h4 className="text-sm font-bold text-amber-400">{lang === 'gu' ? 'નવું સર્વિસ પેકેજ ઉમેરો' : 'Add New Pricing Package'}</h4>
                  <form onSubmit={handleAddNewPricingPlan} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={newPlanNameGu}
                        onChange={(e) => setNewPlanNameGu(e.target.value)}
                        placeholder="પેકેજ નામ (દા.ત. લગ્ન આલ્બમ સ્પેશિયલ)"
                        className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        required
                      />
                      <input
                        type="number"
                        value={newPlanPrice}
                        onChange={(e) => setNewPlanPrice(e.target.value)}
                        placeholder="ભાવ (₹)"
                        className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        required
                      />
                      <input
                        type="text"
                        value={newPlanTaglineGu}
                        onChange={(e) => setNewPlanTaglineGu(e.target.value)}
                        placeholder="સૂત્ર / ટેગલાઈન"
                        className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={newPlanFeaturesGu}
                        onChange={(e) => setNewPlanFeaturesGu(e.target.value)}
                        placeholder="પેકેજમાં શું મળશે? (અલ્પવિરામથી અલગ કરો)"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer">
                        {lang === 'gu' ? 'પેકેજ સાચવો' : 'Save Plan'}
                      </button>
                      <button type="button" onClick={() => setIsAddingPlan(false)} className="px-3 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs cursor-pointer">
                        {lang === 'gu' ? 'રદ કરો' : 'Cancel'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Editable Pricing Cards with Delete */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {editablePlans.map((plan, idx) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-2xl border border-neutral-800 bg-neutral-900/60 space-y-4 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          {plan.category} Plan
                        </span>
                        <h4 className="text-base font-bold text-white">{plan.nameGu}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-1">{plan.taglineGu}</p>
                      </div>

                      <button
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer transition-colors"
                        title={lang === 'gu' ? 'પેકેજ દૂર કરો' : 'Delete Package'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          {lang === 'gu' ? 'ઓફર ભાવ (₹) *' : 'Offer Price (₹) *'}
                        </label>
                        <input
                          type="number"
                          value={plan.price}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditablePlans((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, price: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-white font-bold text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                          {lang === 'gu' ? 'ડિસ્કાઉન્ટ ભાવ (₹)' : 'Strike-off (₹)'}
                        </label>
                        <input
                          type="number"
                          value={plan.discountPrice || ''}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setEditablePlans((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, discountPrice: val } : p))
                            );
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-neutral-400 text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={plan.popular}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setEditablePlans((prev) =>
                              prev.map((p, i) => (i === idx ? { ...p, popular: checked } : p))
                            );
                          }}
                          className="accent-amber-400"
                        />
                        <span className="text-neutral-300">{lang === 'gu' ? 'સૌથી વધુ પસંદગી (Popular Badge)' : 'Most Popular'}</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: CLIENT REVIEWS */}
          {/* ========================================================= */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {lang === 'gu' ? 'ગ્રાહક રીવ્યુ મેનેજર' : 'Client Reviews Manager'}
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {lang === 'gu' ? 'નવા રિવ્યુ ઉમેરો અથવા જૂના રિવ્યુ દૂર કરો.' : 'Add testimonials or remove feedback.'}
                  </p>
                </div>
              </div>

              {/* Add New Review Form */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-3">
                  {lang === 'gu' ? 'નવો રિવ્યુ ઉમેરો' : 'Add New Client Review'}
                </h4>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newRevName.trim() || !newRevCommentGu.trim()) return;
                    onAddClientReview({
                      id: `rev-${Date.now()}`,
                      clientName: newRevName.trim(),
                      location: newRevLocation.trim() || 'અમદાવાદ',
                      businessType: newRevBusiness.trim() || 'સ્થાનિક વેપારી',
                      businessTypeGu: newRevBusiness.trim() || 'સ્થાનિક વેપારી',
                      rating: newRevRating,
                      comment: newRevCommentGu.trim(),
                      commentGu: newRevCommentGu.trim(),
                      projectType: 'Design',
                      projectTypeGu: 'ડિઝાઇન',
                      date: 'Just Now',
                    });
                    setNewRevName('');
                    setNewRevLocation('');
                    setNewRevBusiness('');
                    setNewRevCommentGu('');
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={newRevName}
                      onChange={(e) => setNewRevName(e.target.value)}
                      placeholder={lang === 'gu' ? 'ગ્રાહકનું નામ' : 'Client Name'}
                      className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                      required
                    />
                    <input
                      type="text"
                      value={newRevLocation}
                      onChange={(e) => setNewRevLocation(e.target.value)}
                      placeholder={lang === 'gu' ? 'શહેર (દા.ત. સુરત)' : 'City'}
                      className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                    <input
                      type="text"
                      value={newRevBusiness}
                      onChange={(e) => setNewRevBusiness(e.target.value)}
                      placeholder={lang === 'gu' ? 'દુકાન / બિઝનેસ' : 'Business'}
                      className="px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={newRevCommentGu}
                    onChange={(e) => setNewRevCommentGu(e.target.value)}
                    placeholder={lang === 'gu' ? 'ગ્રાહકનો રિવ્યુ / લખાણ...' : 'Review comment...'}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    required
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer">
                    {lang === 'gu' ? 'રીવ્યુ ઉમેરો' : 'Add Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clientReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <button
                          onClick={() => onDeleteClientReview(rev.id)}
                          className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-neutral-300 italic mb-3">"{rev.commentGu}"</p>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 text-[11px]">
                      <div className="font-bold text-white">{rev.clientName}</div>
                      <div className="text-neutral-400">{rev.businessTypeGu} ({rev.location})</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: FAQ MANAGEMENT */}
          {/* ========================================================= */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              
              <div className="pb-4 border-b border-neutral-800">
                <h2 className="text-xl font-bold text-white">
                  {lang === 'gu' ? 'પ્રશ્નોત્તરી (FAQ) મેનેજર' : 'Frequently Asked Questions Manager'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {lang === 'gu' ? 'વેબસાઇટ પર દેખાતા પ્રશ્નો-જવાબો ઉમેરો અથવા દૂર કરો.' : 'Add or remove FAQ items.'}
                </p>
              </div>

              {/* Add FAQ Form */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-3">{lang === 'gu' ? 'નવો પ્રશ્ન અને જવાબ ઉમેરો' : 'Add New FAQ'}</h4>
                <form onSubmit={handleAddFaq} className="space-y-3">
                  <input
                    type="text"
                    value={newFaqQGu}
                    onChange={(e) => setNewFaqQGu(e.target.value)}
                    placeholder={lang === 'gu' ? 'પ્રશ્ન (દા.ત. ડિલિવરી માટે કેટલો સમય લાગે છે?)' : 'Question'}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    required
                  />
                  <textarea
                    rows={2}
                    value={newFaqAGu}
                    onChange={(e) => setNewFaqAGu(e.target.value)}
                    placeholder={lang === 'gu' ? 'તેનો સાચો જવાબ...' : 'Answer'}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    required
                  />
                  <button type="submit" className="px-4 py-2 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer">
                    {lang === 'gu' ? 'પ્રશ્ન પબ્લિશ કરો' : 'Publish FAQ'}
                  </button>
                </form>
              </div>

              {/* FAQ List with Delete */}
              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex items-start justify-between gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-white mb-1">❓ {f.qGu}</h5>
                      <p className="text-xs text-neutral-300 leading-relaxed">{f.aGu}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteFaq(f.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 cursor-pointer shrink-0"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: LOGO, CUSTOM PASSWORD & ALL SETTINGS */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              
              <div className="pb-4 border-b border-neutral-800">
                <h2 className="text-xl font-bold text-white">
                  {lang === 'gu' ? 'પોતાનો લોગો, પાસવર્ડ & સ્ટુડિયો સેટિંગ્સ' : 'Logo, Custom Password & Settings'}
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {lang === 'gu'
                    ? 'અહીંથી તમારો પોતાનો લોગો અપલોડ કરો, મનપસંદ પાસવર્ડ રાખો અને સંપર્ક વિગતો બદલો.'
                    : 'Upload your own logo file, set a custom password, and customize studio information.'}
                </p>
              </div>

              {settingsSavedToast && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{lang === 'gu' ? 'તમારો લોગો, પાસવર્ડ અને સેટિંગ્સ સાચવાઈ ગયા!' : 'Logo, password and settings saved!'}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 1. CUSTOM LOGO UPLOAD SECTION */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">🎨 {lang === 'gu' ? 'તમારો પોતાનો લોગો (Studio Logo)' : 'Your Studio Logo'}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {lang === 'gu' ? 'તમારા મોબાઈલ કે કમ્પ્યુટરથી લોગો અપલોડ કરો જે હેડરમાં દેખાશે.' : 'Upload logo image from your device.'}
                      </p>
                    </div>

                    {logoImage && (
                      <button
                        type="button"
                        onClick={() => setLogoImage('')}
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        {lang === 'gu' ? 'લોગો દૂર કરો' : 'Remove Logo'}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="w-24 h-24 rounded-xl border border-neutral-700 bg-neutral-950 flex items-center justify-center overflow-hidden shrink-0">
                      {logoImage ? (
                        <img src={logoImage} alt="Studio Logo" className="w-full h-full object-contain p-2" />
                      ) : (
                        <span className="text-xs text-neutral-500 text-center px-1">કોઈ લોગો નથી</span>
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <label className="block text-xs font-semibold text-neutral-300">
                        {lang === 'gu' ? 'ડિવાઇસમાંથી લોગો ફાઇલ પસંદ કરો:' : 'Select Logo File:'}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoFileUpload}
                        className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-neutral-950 hover:file:bg-amber-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={logoImage}
                        onChange={(e) => setLogoImage(e.target.value)}
                        placeholder={lang === 'gu' ? 'અથવા ઇમેજ URL લિંક પેસ્ટ કરો...' : 'Or paste image URL...'}
                        className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. CUSTOM ADMIN PASSWORD SECTION */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'gu' ? 'તમારો પોતાનો એડમિન પાસવર્ડ (Custom Password)' : 'Set Your Admin Password'}</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {lang === 'gu'
                        ? 'તમે જે પણ પાસવર્ડ રાખવા માંગતા હોવ તે અહીં લખો. હવેથી આ પાસવર્ડથી જ એડમિન પેનલ ખુલશે.'
                        : 'Set any password of your choice to protect your admin portal.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'નવો પાસવર્ડ *' : 'New Password *'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="નવો પાસવર્ડ..."
                          className="w-full px-3 py-2 pr-10 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'પાસવર્ડ ફરી લખો (Confirm) *' : 'Confirm Password *'}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="પાસવર્ડ કન્ફર્મ કરો..."
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-sm focus:outline-none focus:border-amber-400 font-mono"
                        required
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-400 font-semibold">
                    💡 {lang === 'gu' ? `હાલનો સેટ થયેલો પાસવર્ડ: "${newPassword}"` : `Current Password: "${newPassword}"`}
                  </p>
                </div>

                {/* 3. STUDIO INFO & CONTACT */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h4 className="text-sm font-bold text-white">🏢 {lang === 'gu' ? 'સ્ટુડિયો નામ અને સંપર્ક વિગતો' : 'Studio Name & Contact'}</h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'સ્ટુડિયો નામ (ગુજરાતી)' : 'Studio Name (Gujarati)'}
                      </label>
                      <input
                        type="text"
                        value={studioNameGu}
                        onChange={(e) => setStudioNameGu(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'Studio Name (English)' : 'Studio Name (English)'}
                      </label>
                      <input
                        type="text"
                        value={studioNameEn}
                        onChange={(e) => setStudioNameEn(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'ઓર્ડર સ્વીકારવાનો WhatsApp નંબર *' : 'WhatsApp Number (for Orders) *'}
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="919876543210"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                        required
                      />
                      <p className="text-[10px] text-neutral-500 mt-1">
                        {lang === 'gu' ? '💡 કન્ટ્રી કોડ સાથે લખો (દા.ત. 919876543210)' : 'Include country code without +'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {lang === 'gu' ? 'પેમેન્ટ UPI ID (GPay / PhonePe) *' : 'Payment UPI ID *'}
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="mkcreative@okaxis"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 4. HOMEPAGE HEADLINE & HERO BANNER CUSTOMIZATION */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <h4 className="text-sm font-bold text-white">✨ {lang === 'gu' ? 'મુખ્ય બેનર અને હોમપેજ લખાણ' : 'Home Page Banner & Headlines'}</h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {lang === 'gu' ? 'મુખ્ય હેડલાઇન (ગુજરાતી)' : 'Main Headline (Gujarati)'}
                    </label>
                    <input
                      type="text"
                      value={heroHeadlineGu}
                      onChange={(e) => setHeroHeadlineGu(e.target.value)}
                      placeholder="તમારા બિઝનેસ માટે આકર્ષક પોસ્ટર અને સિનેમેટિક વિડિઓઝ"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {lang === 'gu' ? 'સબ-ટાઇટલ / વિગત (ગુજરાતી)' : 'Subtitle Description (Gujarati)'}
                    </label>
                    <textarea
                      rows={2}
                      value={heroSubheadGu}
                      onChange={(e) => setHeroSubheadGu(e.target.value)}
                      placeholder="તહેવારની શુભેચ્છાઓ, દુકાન-શોરૂમની જાહેરાત..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      {lang === 'gu' ? 'મુખ્ય ફોટો અપલોડ કરો (Hero Studio Banner):' : 'Hero Banner Image:'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroFileUpload}
                      className="block w-full text-xs text-neutral-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-neutral-950 hover:file:bg-amber-300 cursor-pointer mb-2"
                    />
                    <input
                      type="text"
                      value={heroImage}
                      onChange={(e) => setHeroImage(e.target.value)}
                      placeholder="અથવા ફોટો URL લિંક..."
                      className="w-full px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-white text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm transition-all cursor-pointer shadow-lg shadow-amber-400/10"
                >
                  {lang === 'gu' ? 'બધા સેટિંગ્સ, લોગો અને નવો પાસવર્ડ સાચવો' : 'Save All Settings, Logo & Password'}
                </button>

              </form>

              {/* 5. PUBLISH & SERVER PERSISTENCE STATUS */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Save className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'gu' ? 'વેબસાઇટ Publish અને સર્વર ડેટા સ્થિતિ' : 'Publish & Server Sync Status'}</span>
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {lang === 'gu'
                        ? 'જ્યારે તમે વેબસાઇટ Publish કરો છો ત્યારે આ કાયમી સર્વર ડેટા ગ્રાહકોને દેખાશે. તમે અહીંથી લાઈવ સર્વર સાથે સિંક કરી શકો છો.'
                        : 'When you publish the website, this permanent server data is shown to visitors across all devices.'}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold ${
                      serverSyncStatus === 'saved'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : serverSyncStatus === 'syncing'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {serverSyncStatus === 'saved'
                      ? (lang === 'gu' ? '🟢 સર્વર પર સેવડ (Publish Ready)' : '🟢 Server Saved')
                      : serverSyncStatus === 'syncing'
                      ? (lang === 'gu' ? '🟡 સેવ થઈ રહ્યું છે...' : '🟡 Syncing...')
                      : (lang === 'gu' ? '🔴 ઓફલાઇન મોડ' : '🔴 Offline')}
                  </div>
                </div>

                {lastSyncTime && (
                  <p className="text-[11px] text-neutral-400">
                    {lang === 'gu' ? `છેલ્લું સિંક સમય: ${lastSyncTime}` : `Last synced: ${lastSyncTime}`}
                  </p>
                )}

                {onForceSyncServer && (
                  <button
                    onClick={onForceSyncServer}
                    type="button"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{lang === 'gu' ? 'અત્યારે જ સર્વર સાથે સિંક કરો (Save & Sync to Server)' : 'Force Sync to Server Now'}</span>
                  </button>
                )}
              </div>

              {/* 6. BACKUP DOWNLOAD & RESTORE */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'gu' ? 'વેબસાઇટ બેકઅપ ડાઉનલોડ અને રિસ્ટોર' : 'Site Backup & Restore'}</span>
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    {lang === 'gu'
                      ? 'તમારી વેબસાઇટનો સંપૂર્ણ ડેટા (બધા પોસ્ટર, વિડિઓ, ભાવ, લોગો, રિવ્યૂ) ડાઉનલોડ કરી સુરક્ષિત રાખો અથવા ગમે ત્યારે રિસ્ટોર કરો.'
                      : 'Download your full website configuration JSON file or restore from a previous backup file.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {onExportBackup && (
                    <button
                      onClick={onExportBackup}
                      type="button"
                      className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-neutral-700"
                    >
                      <Download className="w-4 h-4 text-cyan-400" />
                      <span>{lang === 'gu' ? 'બેકઅપ ડાઉનલોડ કરો (Export JSON)' : 'Download Backup (JSON)'}</span>
                    </button>
                  )}

                  {onImportBackup && (
                    <label className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 border border-neutral-700">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'gu' ? 'બેકઅપ અપલોડ કરો (Import JSON)' : 'Upload Backup (JSON)'}</span>
                      <input
                        type="file"
                        accept=".json,application/json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onImportBackup(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: FULL UI & TEXT CUSTOMIZER (ALL SECTIONS & THEMES)   */}
          {/* ========================================================= */}
          {activeTab === 'ui_editor' && (
            <AdminUIEditor
              lang={lang}
              uiConfig={uiConfig || defaultUIConfig}
              onSaveUIConfig={onUpdateUIConfig || (() => {})}
              onResetUIConfig={() => onUpdateUIConfig?.(defaultUIConfig)}
            />
          )}

        </main>
      </div>

    </div>
  );
};
