import React, { useState, useEffect } from 'react';
import {
  Language,
  PortfolioItem,
  PricingPlan,
  CreatorProfile,
  Order,
  OrderStatus,
  ClientReview,
  FAQItem,
  SiteUIConfig,
} from './types';
import { defaultUIConfig } from './data/defaultUIConfig';
import {
  initialCreatorProfile,
  initialPortfolioItems,
  initialPricingPlans,
  initialClientReviews,
  initialOrders,
  initialFaqItems,
} from './data/initialData';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PortfolioSection } from './components/PortfolioSection';
import { VideoShowcase } from './components/VideoShowcase';
import { PricingSection } from './components/PricingSection';
import { MediaLightboxModal } from './components/MediaLightboxModal';
import { OrderModal } from './components/OrderModal';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { ShieldCheck, ArrowRight, LogOut } from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<Language>('gu');
  const [currentView, setCurrentView] = useState<'public' | 'admin'>('public');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('mk_admin_auth') === 'true';
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [serverSyncStatus, setServerSyncStatus] = useState<'saved' | 'syncing' | 'error'>('saved');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ show: boolean; msg: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ show: true, msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Creator profile state
  const [creator, setCreator] = useState<CreatorProfile>(() => {
    const saved = localStorage.getItem('mk_creator_profile');
    return saved ? JSON.parse(saved) : initialCreatorProfile;
  });

  // Portfolio items state
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('mk_portfolio_items');
    return saved ? JSON.parse(saved) : initialPortfolioItems;
  });

  // Pricing plans state
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>(() => {
    const saved = localStorage.getItem('mk_pricing_plans');
    return saved ? JSON.parse(saved) : initialPricingPlans;
  });

  // Reviews state
  const [clientReviews, setClientReviews] = useState<ClientReview[]>(() => {
    const saved = localStorage.getItem('mk_client_reviews');
    return saved ? JSON.parse(saved) : initialClientReviews;
  });

  // FAQs state
  const [faqs, setFaqs] = useState<FAQItem[]>(() => {
    const saved = localStorage.getItem('mk_site_faqs');
    return saved ? JSON.parse(saved) : initialFaqItems;
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mk_client_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  // Public Modal states
  const [selectedLightboxItem, setSelectedLightboxItem] = useState<PortfolioItem | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [preselectedOrderItem, setPreselectedOrderItem] = useState<PortfolioItem | null>(null);
  const [preselectedOrderPlan, setPreselectedOrderPlan] = useState<PricingPlan | null>(null);
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);

  // Sync data to persistent server storage
  const syncToServer = async (payload: {
    creator: CreatorProfile;
    portfolioItems: PortfolioItem[];
    pricingPlans: PricingPlan[];
    clientReviews: ClientReview[];
    faqs: FAQItem[];
    orders: Order[];
  }) => {
    setServerSyncStatus('syncing');
    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setServerSyncStatus('saved');
        setLastSyncTime(new Date().toLocaleTimeString());
        return true;
      } else {
        setServerSyncStatus('error');
        return false;
      }
    } catch (err) {
      console.error('Server sync failed:', err);
      setServerSyncStatus('error');
      return false;
    }
  };

  const syncWithOverrides = (overrides?: Partial<{
    creator: CreatorProfile;
    portfolioItems: PortfolioItem[];
    pricingPlans: PricingPlan[];
    clientReviews: ClientReview[];
    faqs: FAQItem[];
    orders: Order[];
  }>) => {
    const payload = {
      creator: overrides?.creator ?? creator,
      portfolioItems: overrides?.portfolioItems ?? portfolioItems,
      pricingPlans: overrides?.pricingPlans ?? pricingPlans,
      clientReviews: overrides?.clientReviews ?? clientReviews,
      faqs: overrides?.faqs ?? faqs,
      orders: overrides?.orders ?? orders,
    };
    return syncToServer(payload);
  };

  // Load latest data from server on initial mount
  useEffect(() => {
    let isMounted = true;
    const fetchServerData = async () => {
      try {
        const res = await fetch('/api/data');
        if (res.ok) {
          const json = await res.json();
          if (json?.success && json?.data && isMounted) {
            const d = json.data;
            if (d.creator) {
              setCreator(d.creator);
              localStorage.setItem('mk_creator_profile', JSON.stringify(d.creator));
            }
            if (d.portfolioItems && Array.isArray(d.portfolioItems)) {
              setPortfolioItems(d.portfolioItems);
              localStorage.setItem('mk_portfolio_items', JSON.stringify(d.portfolioItems));
            }
            if (d.pricingPlans && Array.isArray(d.pricingPlans)) {
              setPricingPlans(d.pricingPlans);
              localStorage.setItem('mk_pricing_plans', JSON.stringify(d.pricingPlans));
            }
            if (d.clientReviews && Array.isArray(d.clientReviews)) {
              setClientReviews(d.clientReviews);
              localStorage.setItem('mk_client_reviews', JSON.stringify(d.clientReviews));
            }
            if (d.faqs && Array.isArray(d.faqs)) {
              setFaqs(d.faqs);
              localStorage.setItem('mk_site_faqs', JSON.stringify(d.faqs));
            }
            if (d.orders && Array.isArray(d.orders)) {
              setOrders(d.orders);
              localStorage.setItem('mk_client_orders', JSON.stringify(d.orders));
            }
            setServerSyncStatus('saved');
            setLastSyncTime(new Date().toLocaleTimeString());
          }
        }
      } catch (err) {
        console.warn('Server fetch skipped/failed, using current state:', err);
      }
    };
    fetchServerData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage safely with quota protection
  useEffect(() => {
    try {
      localStorage.setItem('mk_creator_profile', JSON.stringify(creator));
    } catch (e) {
      console.warn('localStorage quota warning for creator profile:', e);
    }
  }, [creator]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_portfolio_items', JSON.stringify(portfolioItems));
    } catch (e) {
      console.warn('localStorage quota warning for portfolio items:', e);
    }
  }, [portfolioItems]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_pricing_plans', JSON.stringify(pricingPlans));
    } catch (e) {
      console.warn('localStorage quota warning for pricing plans:', e);
    }
  }, [pricingPlans]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_client_reviews', JSON.stringify(clientReviews));
    } catch (e) {
      console.warn('localStorage quota warning for client reviews:', e);
    }
  }, [clientReviews]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_site_faqs', JSON.stringify(faqs));
    } catch (e) {
      console.warn('localStorage quota warning for site faqs:', e);
    }
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem('mk_client_orders', JSON.stringify(orders));
    } catch (e) {
      console.warn('localStorage quota warning for client orders:', e);
    }
  }, [orders]);

  // Language toggle
  const handleToggleLanguage = () => {
    setLang((prev) => (prev === 'gu' ? 'en' : 'gu'));
  };

  // Admin access handler
  const handleRequestAdminAccess = () => {
    if (isAdminLoggedIn) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    sessionStorage.setItem('mk_admin_auth', 'true');
    setIsAdminLoginModalOpen(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('mk_admin_auth');
    setCurrentView('public');
  };

  // Force Save & Sync
  const handleForceSyncServer = async () => {
    const success = await syncWithOverrides();
    if (success) {
      showToast(
        lang === 'gu'
          ? '✅ તમામ ડેટા સર્વર પર સફળતાપૂર્વક સેવ થઈ ગયો છે! હવે જ્યારે પણ Publish કરશો, આ જ ડેટા બધાને દેખાશે.'
          : '✅ All changes saved to server successfully! Ready for publishing.',
        'success'
      );
    } else {
      showToast(
        lang === 'gu'
          ? '⚠️ સર્વર સાથે સિંક કરવામાં સમસ્યા આવી, લોકલી સેવ થઈ ગયું છે.'
          : '⚠️ Could not reach server, saved locally in browser.',
        'error'
      );
    }
  };

  // Export Backup JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      creator,
      portfolioItems,
      pricingPlans,
      clientReviews,
      faqs,
      orders,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mk_creative_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(lang === 'gu' ? '📥 બેકઅપ ફાઇલ ડાઉનલોડ થઈ ગઈ છે!' : 'Backup downloaded successfully!');
  };

  // Import Backup JSON
  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.creator) setCreator(parsed.creator);
        if (parsed.portfolioItems) setPortfolioItems(parsed.portfolioItems);
        if (parsed.pricingPlans) setPricingPlans(parsed.pricingPlans);
        if (parsed.clientReviews) setClientReviews(parsed.clientReviews);
        if (parsed.faqs) setFaqs(parsed.faqs);
        if (parsed.orders) setOrders(parsed.orders);

        const newPayload = {
          creator: parsed.creator || creator,
          portfolioItems: parsed.portfolioItems || portfolioItems,
          pricingPlans: parsed.pricingPlans || pricingPlans,
          clientReviews: parsed.clientReviews || clientReviews,
          faqs: parsed.faqs || faqs,
          orders: parsed.orders || orders,
        };
        await syncToServer(newPayload);
        showToast(
          lang === 'gu'
            ? '✅ બેકઅપ સફળતાપૂર્વક રિસ્ટોર અને સર્વર પર સેવ થઈ ગયું છે!'
            : '✅ Backup restored and synced to server successfully!',
          'success'
        );
      } catch (err) {
        showToast(lang === 'gu' ? '❌ અમાન્ય બેકઅપ ફાઇલ!' : 'Invalid backup JSON file!', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Order Handlers
  const handleOpenGeneralOrder = () => {
    setPreselectedOrderItem(null);
    setPreselectedOrderPlan(null);
    setIsOrderModalOpen(true);
  };

  const handleOrderStyle = (item: PortfolioItem) => {
    setPreselectedOrderItem(item);
    setPreselectedOrderPlan(null);
    setIsOrderModalOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan) => {
    setPreselectedOrderPlan(plan);
    setPreselectedOrderItem(null);
    setIsOrderModalOpen(true);
  };

  const handleSubmitOrder = (newOrder: Order) => {
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    setActiveReceiptOrder(newOrder);
    syncWithOverrides({ orders: nextOrders });
  };

  // Admin Management Handlers
  const handleUpdateCreator = (updated: CreatorProfile) => {
    setCreator(updated);
    syncWithOverrides({ creator: updated });
    showToast(
      lang === 'gu'
        ? '✅ પ્રોફાઇલ અને સેટિંગ્સ સર્વર પર સેવ થઈ ગયા છે! હવે પબ્લિશ કરવા પર આ જ ચેન્જ દેખાશે.'
        : 'Profile updated and saved to server! Live changes ready.',
      'success'
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const nextOrders = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(nextOrders);
    syncWithOverrides({ orders: nextOrders });
  };

  const handleUpdateOrderNotes = (orderId: string, notes: string) => {
    const nextOrders = orders.map((o) => (o.id === orderId ? { ...o, customNotes: notes } : o));
    setOrders(nextOrders);
    syncWithOverrides({ orders: nextOrders });
  };

  const handleDeleteOrder = (orderId: string) => {
    const nextOrders = orders.filter((o) => o.id !== orderId);
    setOrders(nextOrders);
    syncWithOverrides({ orders: nextOrders });
    showToast(lang === 'gu' ? 'ઓર્ડર દૂર કરવામાં આવ્યો છે' : 'Order removed');
  };

  const handleAddPortfolioItem = (item: PortfolioItem) => {
    const nextItems = [item, ...portfolioItems];
    setPortfolioItems(nextItems);
    syncWithOverrides({ portfolioItems: nextItems });
    showToast(
      lang === 'gu'
        ? `✅ "${item.titleGu}" સર્વર પર સેવ થઈ ગયું છે! હવે પબ્લિશ કરવા પર પણ દેખાશે.`
        : `✅ "${item.title}" saved to server! Ready for publish.`,
      'success'
    );
  };

  const handleUpdatePortfolioItem = (updated: PortfolioItem) => {
    const nextItems = portfolioItems.map((item) => (item.id === updated.id ? updated : item));
    setPortfolioItems(nextItems);
    syncWithOverrides({ portfolioItems: nextItems });
    showToast(
      lang === 'gu'
        ? `✅ "${updated.titleGu}" અપડેટ સર્વર પર સેવ થઈ ગયું છે!`
        : `✅ "${updated.title}" updated and synced to server!`,
      'success'
    );
  };

  const handleDeletePortfolioItem = (itemId: string) => {
    const nextItems = portfolioItems.filter((i) => i.id !== itemId);
    setPortfolioItems(nextItems);
    syncWithOverrides({ portfolioItems: nextItems });
    showToast(lang === 'gu' ? 'સેમ્પલ દૂર કરવામાં આવ્યું છે' : 'Item removed');
  };

  const handleUpdatePricingPlans = (updatedPlans: PricingPlan[]) => {
    setPricingPlans(updatedPlans);
    syncWithOverrides({ pricingPlans: updatedPlans });
    showToast(
      lang === 'gu'
        ? '✅ પ્રાઇસિંગ પેકેજ સર્વર પર સેવ થઈ ગયા છે! હવે પબ્લિશ કરવા પર આ જ રેટ દેખાશે.'
        : '✅ Pricing packages saved to server! Live rates ready.',
      'success'
    );
  };

  const handleAddClientReview = (review: ClientReview) => {
    const nextReviews = [review, ...clientReviews];
    setClientReviews(nextReviews);
    syncWithOverrides({ clientReviews: nextReviews });
    showToast(lang === 'gu' ? '✅ રિવ્યૂ સેવ થઈ ગયો છે' : 'Review saved');
  };

  const handleDeleteClientReview = (reviewId: string) => {
    const nextReviews = clientReviews.filter((r) => r.id !== reviewId);
    setClientReviews(nextReviews);
    syncWithOverrides({ clientReviews: nextReviews });
  };

  const handleUpdateFaqs = (updatedFaqs: FAQItem[]) => {
    setFaqs(updatedFaqs);
    syncWithOverrides({ faqs: updatedFaqs });
    showToast(lang === 'gu' ? 'FAQ અપડેટ સેવ થઈ ગઈ છે' : 'FAQ updated');
  };

  const handleResetToDemoData = async () => {
    setCreator(initialCreatorProfile);
    setPortfolioItems(initialPortfolioItems);
    setPricingPlans(initialPricingPlans);
    setClientReviews(initialClientReviews);
    setFaqs(initialFaqItems);
    setOrders(initialOrders);
    localStorage.clear();
    sessionStorage.removeItem('mk_admin_auth');
    setIsAdminLoggedIn(false);
    setCurrentView('public');
    await syncToServer({
      creator: initialCreatorProfile,
      portfolioItems: initialPortfolioItems,
      pricingPlans: initialPricingPlans,
      clientReviews: initialClientReviews,
      faqs: initialFaqItems,
      orders: initialOrders,
    });
    showToast(lang === 'gu' ? 'વેબસાઇટ સફળતાપૂર્વક રીસેટ થઈ ગઈ છે!' : 'Website reset successfully!', 'info');
  };

  const scrollToPortfolio = () => {
    const el = document.getElementById('portfolio');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToPricing = () => {
    const el = document.getElementById('pricing');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // If in Admin Mode, show full-page Admin Portal
  if (currentView === 'admin') {
    return (
      <>
        <AdminPortal
          lang={lang}
          onLanguageToggle={handleToggleLanguage}
          onExitAdmin={() => setCurrentView('public')}
          creator={creator}
          orders={orders}
          portfolioItems={portfolioItems}
          pricingPlans={pricingPlans}
          clientReviews={clientReviews}
          faqs={faqs}
          serverSyncStatus={serverSyncStatus}
          lastSyncTime={lastSyncTime}
          onForceSyncServer={handleForceSyncServer}
          onExportBackup={handleExportBackup}
          onImportBackup={handleImportBackup}
          onUpdateCreator={handleUpdateCreator}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateOrderNotes={handleUpdateOrderNotes}
          onDeleteOrder={handleDeleteOrder}
          onAddPortfolioItem={handleAddPortfolioItem}
          onUpdatePortfolioItem={handleUpdatePortfolioItem}
          onDeletePortfolioItem={handleDeletePortfolioItem}
          onUpdatePricingPlans={handleUpdatePricingPlans}
          onAddClientReview={handleAddClientReview}
          onDeleteClientReview={handleDeleteClientReview}
          onUpdateFaqs={handleUpdateFaqs}
          onResetToDemoData={handleResetToDemoData}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl text-xs font-semibold flex items-center gap-3 animate-fade-in text-white max-w-md text-center">
            <span>{toastMessage.msg}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      
      {/* Admin Mode Floating Alert Bar if Logged In */}
      {isAdminLoggedIn && (
        <div className="bg-amber-400 text-neutral-950 px-4 py-2 text-xs font-bold flex items-center justify-between z-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {lang === 'gu'
                ? 'એડમિન સેશન સક્રિય છે (તમે એડમિન તરીકે લોગ ઇન છો)'
                : 'Admin Session Active (Logged in as Creator)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('admin')}
              className="px-2.5 py-1 rounded bg-neutral-950 text-amber-400 hover:bg-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'gu' ? 'એડમિન પેનલ ખોલો' : 'Open Admin Panel'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleAdminLogout}
              className="text-neutral-950 hover:underline flex items-center gap-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{lang === 'gu' ? 'લોગ આઉટ' : 'Logout'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <Header
        lang={lang}
        onLanguageToggle={handleToggleLanguage}
        onOpenOrderModal={handleOpenGeneralOrder}
        onOpenAdminModal={handleRequestAdminAccess}
        creator={creator}
        ordersCount={orders.filter((o) => o.status === 'pending').length}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Split Screen Hero with Typography & Metrics */}
        <Hero
          lang={lang}
          creator={creator}
          onOpenOrderModal={handleOpenGeneralOrder}
          onExploreWork={scrollToPortfolio}
          onViewPricing={scrollToPricing}
        />

        {/* Portfolio Gallery (Posters, Business, Festivals, Thumbnails) */}
        <PortfolioSection
          items={portfolioItems}
          lang={lang}
          onSelectItem={(item) => setSelectedLightboxItem(item)}
          onOrderStyle={handleOrderStyle}
        />

        {/* Interactive Video Reels & Cinematic Teaser Showcase */}
        <VideoShowcase
          items={portfolioItems}
          lang={lang}
          onOrderVideo={(videoItem) => {
            if (videoItem) {
              handleOrderStyle(videoItem);
            } else {
              handleOpenGeneralOrder();
            }
          }}
        />

        {/* Transparent Rates, Pricing & Packages */}
        <PricingSection
          plans={pricingPlans}
          lang={lang}
          onSelectPlan={handleSelectPlan}
          onRequestCustom={handleOpenGeneralOrder}
        />

        {/* Client Reviews / Social Proof */}
        <TestimonialsSection
          reviews={clientReviews}
          lang={lang}
        />

        {/* FAQ Section */}
        <FAQSection lang={lang} faqs={faqs} />
      </main>

      {/* Clean Footer */}
      <Footer
        creator={creator}
        lang={lang}
        onOpenOrderModal={handleOpenGeneralOrder}
        onOpenAdminModal={handleRequestAdminAccess}
      />

      {/* Floating WhatsApp and Call CTA */}
      <FloatingActions
        creator={creator}
        lang={lang}
        onOpenOrderModal={handleOpenGeneralOrder}
      />

      {/* Fullscreen Media Lightbox */}
      <MediaLightboxModal
        item={selectedLightboxItem}
        lang={lang}
        onClose={() => setSelectedLightboxItem(null)}
        onOrderStyle={handleOrderStyle}
      />

      {/* Order Booking Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setPreselectedOrderItem(null);
          setPreselectedOrderPlan(null);
        }}
        lang={lang}
        creator={creator}
        preselectedItem={preselectedOrderItem}
        preselectedPlan={preselectedOrderPlan}
        onSubmitOrder={handleSubmitOrder}
      />

      {/* Order Confirmation Receipt */}
      <OrderReceiptModal
        order={activeReceiptOrder}
        creator={creator}
        lang={lang}
        onClose={() => setActiveReceiptOrder(null)}
      />

      {/* Admin Login Modal (PIN Auth) */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
        creator={creator}
        lang={lang}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl text-xs font-semibold flex items-center gap-3 animate-fade-in text-white max-w-md text-center">
          <span>{toastMessage.msg}</span>
        </div>
      )}
    </div>
  );
}

