"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import PaymentStepper from "@/components/modules/checkout/paymentStepper";
import StepAddress from "@/components/modules/checkout/stepAddress";
import StepPaymentCard from "@/components/modules/checkout/stepPayment";
import BasketSummaryCard from "@/components/modules/checkout/cartSummary";
import { AddressFormData } from "@/components/modules/profile/addressForm";
import { getCart, clearGuestCart, GuestCartItem } from "@/utils/cart";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import { ShieldCheck, Lock, HelpCircle, ArrowRight } from "lucide-react";

const cargoOptions = [
  { id: "standart", name: "Standart Kargo", fee: 0.0 },
  { id: "express", name: "Hızlı Kargo", fee: 0.0 },
];

const installmentRates = [
  { count: 1, rate: 0 },
  { count: 2, rate: 3.5 },
  { count: 3, rate: 5.2 },
  { count: 6, rate: 9.8 },
  { count: 9, rate: 13.5 },
  { count: 12, rate: 17.0 },
];

interface Address {
  id: number;
  title: string;
  firstName: string;
  lastName: string;
  address: string;
  district: string;
  city: string;
  neighborhood?: string | null;
  zip?: string;
  phone?: string;
  country?: string;
  email?: string;
  tcno?: string;
}

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role?: string;
  phone?: string;
  addresses?: Address[];
}

interface Product {
  id: number;
  title: string;
  price: number;
  mainImage: string;
  oldPrice?: number;
  category: string;
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface UserUser {
  user: User;
}

interface CouponData {
  code: string;
  type: "PERCENTAGE" | "FIXED";
  discountAmount: number;
  finalPrice: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const [user, setUser] = useState<UserUser | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [selectedCargo, setSelectedCargo] = useState<string>(
    cargoOptions[0].id,
  );
  const [selectedInstallment, setSelectedInstallment] = useState<number>(1);
  const [cardNumber, setCardNumber] = useState("");
  const [expireMonth, setExpireMonth] = useState("");
  const [expireYear, setExpireYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  // Coupon states
  const [appliedCoupon, setAppliedCoupon] = useState<CouponData | null>(null);

  const initialAddressForm: AddressFormData & { email?: string } = {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    district: "",
    city: "",
    neighborhood: "",
    zip: "",
    phone: "",
    country: "Türkiye",
    tcno: "",
  };
  const [newAddressForm, setNewAddressForm] = useState(initialAddressForm);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const userRes = await fetch("/api/user", {
        credentials: "include",
        cache: "no-store",
      });
      let userData = null;
      if (userRes.ok) {
        userData = await userRes.json();
        setUser(userData);
      } else {
        setUser(null);
      }

      if (userData?.user?.id) {
        const cartRes = await fetch("/api/cart", {
          credentials: "include",
          cache: "no-store",
        });
        if (cartRes.ok) {
          setCartItems(await cartRes.json());
        } else {
          setCartItems([]);
        }
      } else {
        const guestCart = localStorage.getItem("cart");
        setCartItems(guestCart ? JSON.parse(guestCart) : []);
      }
    } catch (err) {
      setError("Veriler yüklenirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const subTotal = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );

  const selectedCargoFee = useMemo(
    () => cargoOptions.find((c) => c.id === selectedCargo)?.fee || 0,
    [selectedCargo],
  );

  // Kupon indirimi uygulanmadan önceki toplam (KDV dahil)
  const baseTotalBeforeDiscount = useMemo(
    () => (subTotal + selectedCargoFee) * 1.1,
    [subTotal, selectedCargoFee],
  );

  // Kupon indiriminden sonraki ara toplam
  const baseTotalAfterDiscount = useMemo(() => {
    if (appliedCoupon) {
      return Math.max(
        0,
        baseTotalBeforeDiscount - appliedCoupon.discountAmount,
      );
    }
    return baseTotalBeforeDiscount;
  }, [baseTotalBeforeDiscount, appliedCoupon]);

  // Taksit hesaplaması (kupon uygulandıktan sonra)
  const totalPriceWithInstallment = useMemo(() => {
    const selectedRate = installmentRates.find(
      (r) => r.count === selectedInstallment,
    );
    if (!selectedRate) return baseTotalAfterDiscount;
    return (
      baseTotalAfterDiscount +
      baseTotalAfterDiscount * (selectedRate.rate / 100)
    );
  }, [baseTotalAfterDiscount, selectedInstallment]);

  const validateAddressForm = (): boolean => {
    const required = [
      "firstName",
      "lastName",
      "address",
      "city",
      "district",
      "phone",
    ];
    for (const field of required) {
      if (!newAddressForm[field as keyof typeof newAddressForm]) {
        alert(`Lütfen ${field} alanını doldurun.`);
        return false;
      }
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateAddressForm()) return;
    try {
      setIsSavingAddress(true);
      let userId = user?.user?.id;
      if (!userId) {
        const guestEmail =
          newAddressForm.email || `guest_${Date.now()}@example.com`;
        const password = Math.random().toString(36).slice(-8);
        const registerRes = await fetch("/api/account/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newAddressForm.firstName,
            surname: newAddressForm.lastName,
            email: guestEmail,
            password,
          }),
        });
        if (!registerRes.ok) throw new Error("Kayıt başarısız");
        const registerData = await registerRes.json();
        userId = registerData.user.id;
        setUser({ user: registerData.user });
        await signIn("credentials", {
          email: guestEmail,
          password,
          redirect: false,
        });
      }

      const addressRes = await fetch("/api/address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newAddressForm, userId, country: "Türkiye" }),
      });
      const addressData = await addressRes.json();
      setUser((prev) =>
        prev
          ? {
              ...prev,
              user: {
                ...prev.user,
                addresses: [
                  addressData.address,
                  ...(prev.user.addresses ?? []),
                ],
              },
            }
          : prev,
      );
      setSelectedAddress(addressData.address.id);

      const guestCart: GuestCartItem[] = getCart();
      if (guestCart.length > 0) {
        for (const item of guestCart) {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              productId: item.productId,
              quantity: item.quantity || 1,
            }),
          });
        }
        clearGuestCart();
        await fetchData();
      }
      setIsAddingNewAddress(false);
    } catch (err) {
      alert("Adres kaydedilemedi.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    try {
      let currentUser = user;
      const userId = Number(currentUser?.user?.id);
      const shippingAddr =
        currentUser?.user.addresses?.[0] || (newAddressForm as Address);

      // Taksit oranını bul
      const selectedRate = installmentRates.find(
        (r) => r.count === selectedInstallment,
      );

      // 1. totalPrice: Kupon uygulanmamış + taksit dahil (liste fiyatı)
      const totalWithoutCoupon = selectedRate
        ? baseTotalBeforeDiscount +
          baseTotalBeforeDiscount * (selectedRate.rate / 100)
        : baseTotalBeforeDiscount;

      // 2. paidPrice: Kupon uygulanmış + taksit dahil (gerçek ödenen)
      const finalBaseTotalAfterDiscount = appliedCoupon
        ? Math.max(0, baseTotalBeforeDiscount - appliedCoupon.discountAmount)
        : baseTotalBeforeDiscount;

      const finalTotalWithInstallment = selectedRate
        ? finalBaseTotalAfterDiscount +
          finalBaseTotalAfterDiscount * (selectedRate.rate / 100)
        : finalBaseTotalAfterDiscount;

      const payload = {
        userId,
        basketItems: cartItems.map((item) => ({
          id: item.product.id.toString(),
          name: item.product.title,
          category1: item.product.category || "Genel",
          itemType: "PHYSICAL",
          price: (item.product.price * item.quantity).toFixed(2),
          quantity: item.quantity,
          unitPrice: item.product.price.toFixed(2),
          totalPrice: (item.product.price * item.quantity).toFixed(2),
        })),
        shippingAddress: {
          contactName: `${shippingAddr.firstName} ${shippingAddr.lastName}`,
          city: shippingAddr.city,
          country: "Türkiye",
          address: shippingAddr.address,
          zipCode: shippingAddr.zip || "",
          phone: shippingAddr.phone,
          tcno: shippingAddr.tcno || "11111111111",
          district: shippingAddr.district,
        },
        billingAddress: {
          contactName: `${shippingAddr.firstName} ${shippingAddr.lastName}`,
          city: shippingAddr.city,
          country: "Türkiye",
          address: shippingAddr.address,
          zipCode: shippingAddr.zip || "",
          phone: shippingAddr.phone,
          tcno: shippingAddr.tcno || "11111111111",
          district: shippingAddr.district,
        },
        totalPrice: totalWithoutCoupon, // Kupon yok + taksit var
        paidPrice: finalTotalWithInstallment, // Kupon var + taksit var (gerçek ödenen)
        baseTotalPrice: baseTotalBeforeDiscount, // Kupon yok + taksit yok (ara toplam)
        currency: "TRY",
        paymentMethod: "iyzipay",
        paymentCard: {
          cardHolderName: holderName,
          cardNumber: cardNumber.replace(/\s/g, ""),
          expireMonth,
          expireYear,
          cvc,
        },
        buyer: {
          id: userId.toString(),
          buyerName: shippingAddr.firstName,
          buyerSurname: shippingAddr.lastName,
          email: currentUser?.user.email,
          identityNumber: shippingAddr.tcno || "11111111111",
          city: shippingAddr.city,
          country: "Türkiye",
          phone: shippingAddr.phone,
          ip: "127.0.0.1",
        },
        installment: selectedInstallment,
        couponCode: appliedCoupon?.code || null,
        discountAmount: appliedCoupon?.discountAmount || 0,
      };

      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.status === "success") {
        await Promise.all(
          cartItems.map((item) =>
            fetch(`/api/cart/${item.id}`, { method: "DELETE" }),
          ),
        );
        localStorage.removeItem("cart");
        router.push("/checkout/success");
      } else {
        throw new Error();
      }
    } catch (err) {
      router.push("/checkout/unsuccess");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-20 font-sans text-slate-950">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            Güvenli Ödeme
          </h1>
          <p className="text-slate-500 text-sm">
            Siparişinizi tamamlamak için lütfen bilgilerinizi kontrol edin.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-10">
            <PaymentStepper currentStep={step} />

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              {step === 1 ? (
                <div className="p-8 md:p-10">
                  <StepAddress
                    addresses={user?.user.addresses ?? []}
                    selectedAddress={selectedAddress}
                    onSelectAddress={setSelectedAddress}
                    onNext={() => setStep(2)}
                    newAddressForm={newAddressForm}
                    setNewAddressForm={setNewAddressForm}
                    onSaveAddress={handleSaveAddress}
                    isAddingNewAddress={isAddingNewAddress}
                    setIsAddingNewAddress={setIsAddingNewAddress}
                    isSavingAddress={isSavingAddress}
                  />
                </div>
              ) : (
                <div className="p-8 md:p-10">
                  <StepPaymentCard
                    holderName={holderName}
                    setHolderName={setHolderName}
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    formattedCardNumber={cardNumber}
                    expireMonth={expireMonth}
                    setExpireMonth={setExpireMonth}
                    expireYear={expireYear}
                    setExpireYear={setExpireYear}
                    cvc={cvc}
                    setCvc={setCvc}
                    totalPrice={baseTotalAfterDiscount}
                    setStep={setStep}
                    handlePayment={handlePayment}
                    isProcessing={processingPayment}
                    selectedInstallment={selectedInstallment}
                    setSelectedInstallment={setSelectedInstallment}
                  />
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 py-4 opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <Lock className="w-4 h-4" /> 256-Bit SSL
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> PCI-DSS Uyumlu
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-10">
            <div className=" p-6 rounded-[2rem] flex justify-center">
              <img
                src="/iyzico/iyzico_ile_ode_colored_horizontal.webp"
                alt="iyzico"
                className="h-8 opacity-80"
              />
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <BasketSummaryCard
                selectedCargoFee={selectedCargoFee}
                selectedInstallment={selectedInstallment}
                appliedCoupon={appliedCoupon}
                onCouponApply={setAppliedCoupon}
                subTotal={subTotal}
              />
            </div>

            <Link
              href="/contact"
              className="group block p-6 bg-slate-950 rounded-[2rem] text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm uppercase tracking-tighter">
                  Yardım Merkezi
                </h3>
                <HelpCircle className="w-5 h-5 opacity-50" />
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Ödeme ile ilgili bir sorun mu yaşıyorsunuz? Ekibimiz burada.
              </p>
              <span className="text-xs font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                Destek Al <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modern Overlay - Processing */}
      {processingPayment && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-xl flex items-center justify-center z-[100] animate-in fade-in duration-500">
          <div className="text-center space-y-8 max-w-xs">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-t-4 border-slate-950 rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-slate-100 rounded-full flex items-center justify-center">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tighter">
                İşlem Yapılıyor
              </h3>
              <p className="text-slate-500 text-xs font-medium">
                Lütfen bekleyin, bankanızla güvenli bağlantı kuruluyor. Bu
                sayfayı kapatmayın.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
