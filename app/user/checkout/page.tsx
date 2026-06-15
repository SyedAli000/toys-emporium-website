'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, CreditCard, ClipboardList, Check } from 'lucide-react';
import { cartService, orderService, CartItemResponse } from '@/lib/services';
import { useAppPopup } from '@/contexts/AppPopupContext';
import './checkout.css';

type Step = 1 | 2 | 3;

export default function CheckoutPage() {
  const router = useRouter();
  const popup = useAppPopup();
  const [step, setStep] = useState<Step>(1);
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod'>('cod');
  const [notes, setNotes] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    streetAddress: '',
    landmark: '',
    zipCode: '',
    country: 'Pakistan',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    cartService
      .get()
      .then((res) => {
        const items = res.items || [];
        setCartItems(items);
        if (items.length === 0) router.replace('/user/cart');
      })
      .catch(() => router.replace('/user/cart'))
      .finally(() => setLoading(false));
  }, [router]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!address.fullName.trim()) e.fullName = 'Full name is required';
    if (!address.phone.trim() || address.phone.length < 10)
      e.phone = 'Valid phone number is required';
    if (!address.email.trim() || !address.email.includes('@'))
      e.email = 'Valid email is required';
    if (!address.city.trim()) e.city = 'City is required';
    if (!address.streetAddress.trim()) e.streetAddress = 'Street address is required';
    if (!address.zipCode.trim()) e.zipCode = 'Postal code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => Math.min(3, s + 1) as Step);
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1) as Step);

  const handlePlaceOrder = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    setPlacing(true);
    try {
      await orderService.create({
        shippingAddress: {
          fullName: address.fullName,
          phone: address.phone,
          email: address.email,
          address: [address.streetAddress, address.landmark]
            .filter(Boolean)
            .join(', '),
          city: address.city,
          state: address.city,
          zipCode: address.zipCode,
          country: address.country,
          userId: '',
          isDefault: true,
        },
        paymentMethod: 'cod',
        notes: notes || undefined,
      });
      popup.success(
        'Order placed successfully! Shipping cost for your city and area will be shared with you shortly.',
      );
      router.push('/user/orders?placed=1');
    } catch {
      popup.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Checkout</h1>

      <div className="checkout-steps">
        <div className={`checkout-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'done' : ''}`}>
          <span className="checkout-step-num">{step > 1 ? <Check className="w-3 h-3" /> : '1'}</span>
          <MapPin className="w-4 h-4 hidden sm:block" />
          <span>Delivery</span>
        </div>
        <div className="checkout-step-divider" />
        <div className={`checkout-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'done' : ''}`}>
          <span className="checkout-step-num">{step > 2 ? <Check className="w-3 h-3" /> : '2'}</span>
          <CreditCard className="w-4 h-4 hidden sm:block" />
          <span>Payment</span>
        </div>
        <div className="checkout-step-divider" />
        <div className={`checkout-step ${step >= 3 ? 'active' : ''}`}>
          <span className="checkout-step-num">3</span>
          <ClipboardList className="w-4 h-4 hidden sm:block" />
          <span>Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card className="p-6 space-y-6">
              <div>
                <h2 className="checkout-section-title">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name *</label>
                    <Input
                      value={address.fullName}
                      onChange={(e) =>
                        setAddress({ ...address, fullName: e.target.value })
                      }
                      placeholder="Your full name"
                      className="mt-1"
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive mt-1">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mobile Number *</label>
                    <Input
                      value={address.phone}
                      onChange={(e) =>
                        setAddress({ ...address, phone: e.target.value })
                      }
                      placeholder="03XX XXXXXXX"
                      className="mt-1"
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      value={address.email}
                      onChange={(e) =>
                        setAddress({ ...address, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="mt-1"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="checkout-section-title">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">City *</label>
                    <Input
                      value={address.city}
                      onChange={(e) =>
                        setAddress({ ...address, city: e.target.value })
                      }
                      placeholder="e.g. Karachi, Lahore"
                      className="mt-1"
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Street / House / Area *</label>
                    <Input
                      value={address.streetAddress}
                      onChange={(e) =>
                        setAddress({ ...address, streetAddress: e.target.value })
                      }
                      placeholder="House #, Street, Area"
                      className="mt-1"
                    />
                    {errors.streetAddress && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.streetAddress}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">Landmark (optional)</label>
                    <Input
                      value={address.landmark}
                      onChange={(e) =>
                        setAddress({ ...address, landmark: e.target.value })
                      }
                      placeholder="Near mosque, school, etc."
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Postal Code *</label>
                      <Input
                        value={address.zipCode}
                        onChange={(e) =>
                          setAddress({ ...address, zipCode: e.target.value })
                        }
                        className="mt-1"
                      />
                      {errors.zipCode && (
                        <p className="text-xs text-destructive mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium">Country</label>
                      <Input
                        value={address.country}
                        onChange={(e) =>
                          setAddress({ ...address, country: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-6 space-y-4">
              <h2 className="checkout-section-title">Select Payment Method</h2>
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`checkout-cod-card w-full text-left ${paymentMethod === 'cod' ? 'selected' : 'border-border bg-white'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                    {paymentMethod === 'cod' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Cash on Delivery (COD)</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pay with cash when your order is delivered to your doorstep.
                    </p>
                  </div>
                </div>
              </button>
            </Card>
          )}

          {step === 3 && (
            <Card className="p-6 space-y-4">
              <h2 className="checkout-section-title">Review Your Order</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item._id || item.productId}
                    className="flex justify-between text-sm border-b border-border pb-3"
                  >
                    <span>
                      {item.product?.name || 'Product'} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="text-sm space-y-2 pt-2">
                <p>
                  <span className="text-muted-foreground">Payment:</span>{' '}
                  <strong>Cash on Delivery</strong>
                </p>
                <p>
                  <span className="text-muted-foreground">Deliver to:</span>{' '}
                  {address.fullName}, {address.streetAddress}, {address.city}
                </p>
              </div>
              <div className="checkout-shipping-notice">
                Shipping charges are not included in this total. After placing
                your order, we will contact you with the shipping price based on
                your city and area ({address.city}).
              </div>
              <div>
                <label className="text-sm font-medium">Order notes (optional)</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery instructions"
                  className="mt-1"
                />
              </div>
            </Card>
          )}

          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <Link href="/user/cart">
                <Button variant="outline">Back to Cart</Button>
              </Link>
            )}
            {step < 3 ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={handlePlaceOrder} disabled={placing}>
                {placing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Place Order'
                )}
              </Button>
            )}
          </div>
        </div>

        <div>
          <Card className="p-6 sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <p className="text-sm text-muted-foreground mb-2">
              {cartItems.length} item(s)
            </p>
            <div className="flex justify-between text-lg font-bold mb-3">
              <span>Subtotal</span>
              <span className="text-primary">${subtotal.toFixed(2)}</span>
            </div>
            <p className="checkout-shipping-notice checkout-shipping-notice--compact">
              Shipping cost will be confirmed based on your city and area.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
