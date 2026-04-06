"use client";
import React, { useState } from 'react';

export default function Home() {
  // --- STATE MANAGEMENT ---
  const [cart, setCart] = useState<{id: number, name: string, price: number}[]>([]);
  const [view, setView] = useState<'home' | 'cart' | 'checkout'>('home');
  const [customLiters, setCustomLiters] = useState(0);
  
  // Order Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');

  // --- ASSETS ---
  const mangoJuiceImg = "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=1974&auto=format&fit=crop";
  const passionImg = "https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?q=80&w=1974&auto=format&fit=crop";
  const tropicalImg = "https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=1974&auto=format&fit=crop";
  const fruitPlateImg = "https://images.unsplash.com/photo-1519996529931-28324d5a630e?q=80&w=1974&auto=format&fit=crop";
  
  // Updated Disposable Cups Image from your upload
  const cocktailImg = "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800";
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const deliveryCharge = (cartSubtotal >= 100000 || cartSubtotal === 0) ? 0 : 5000;
  const finalTotal = cartSubtotal + deliveryCharge;
  const cartSummary = cart.length > 0 
    ? cart.map(item => `${item.name}`).join(", ") 
    : "Empty";
    
  const fullOrderString = `Items: ${cartSummary} | Total: ${finalTotal} UGX`;
  // --- ACTIONS ---
  const addToCart = (name: string, price: number) => {
    setCart([...cart, { id: Date.now(), name, price }]);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  // --- ORDER SUBMISSION LOGIC ---
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderItems = cart.map(item => item.name).join(", ");

    // Logic to simulate sending data to gabrilemaurice@gmail.com
    console.log("Order submitted to gabrilemaurice@gmail.com", {
      client: customerName,
      phone: phoneNumber,
      email: email,
      location: location,
      order: orderItems,
      total: finalTotal
    });

    alert(`Success, ${customerName}!\n\nYour order has been sent to our team. You will receive a confirmation email at ${email} shortly.\n\nDelivery will be processed within 24 hours.`);
    
    // Resetting state
    setCart([]);
    setCustomerName('');
    setPhoneNumber('');
    setEmail('');
    setLocation('');
    setView('home');
    window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-2xl font-black text-green-700 cursor-pointer tracking-tighter" onClick={() => setView('home')}>
          M&R JUICE 
        </h1>
        <div className="hidden md:flex gap-8 font-bold text-xs uppercase tracking-widest text-gray-500">
          <button onClick={() => setView('home')} className="hover:text-green-600 transition">Home</button>
          <a href="#juices" className="hover:text-green-600 transition">Juices</a>
          <a href="#subscriptions" className="hover:text-green-600 transition">Packages</a>
          <a href="#events" className="hover:text-green-600 transition">Events</a>
        </div>
        <button onClick={() => setView('cart')} className="bg-orange-500 text-white px-5 py-2 rounded-full font-black text-sm shadow-lg">
          🛒 CART ({cart.length})
        </button>
      </nav>

      {view === 'home' && (
        <main className="animate-in fade-in duration-500">
          {/* Hero */}
          <div className="bg-green-800 text-white py-20 px-6 text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Freshness Delivered.</h2>
            <p className="text-green-100 max-w-2xl mx-auto text-lg mb-8">Naturally processed juices with zero added sugars.</p>
            <a href="#juices" className="bg-orange-500 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest shadow-xl inline-block">Shop Now</a>
          </div>

          {/* Juices Section */}
          <section id="juices" className="py-20 px-6 max-w-7xl mx-auto">
            <h2 className="text-3xl font-black mb-10 border-l-8 border-orange-500 pl-4 uppercase italic text-gray-800 text-left">The Juice Bar (6,000 / LTR)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: "Pure Mango (Processed)", price: 6000, img: mangoJuiceImg, desc: "Smooth, fiber-free mango nectar." },
                { name: "Passion Paradise", price: 6000, img: passionImg, desc: "Tangy local passion fruit." },
                { name: "Tropical Zest", price: 6000, img: tropicalImg, desc: "Signature seasonal blend." }
              ].map((p, i) => (
                <div key={i} className="group border rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all duration-500">
                  <div className="h-64 overflow-hidden relative">
                    <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={p.name} />
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-black">{p.name}</h3>
                    <p className="text-gray-500 text-sm mt-2 mb-6 text-left">{p.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-green-700 font-black text-xl">6,000 UGX <span className="text-xs text-gray-400">/ L</span></span>
                      <button onClick={() => addToCart(p.name, 6000)} className="bg-green-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg">+ Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Monthly & Custom Packages */}
          <section id="subscriptions" className="bg-gray-900 py-20 px-6 text-white text-left">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-green-700 p-10 rounded-[3rem] shadow-2xl">
                <h3 className="text-3xl font-black mb-4">Family Monthly Pack</h3>
                <p className="text-green-100 mb-8">Get 10 Liters delivered every week (40L/month). Perfect for healthy households.</p>
                <div className="text-4xl font-black mb-8">30,000 UGX <span className="text-lg font-normal opacity-60">/ 5 Liters</span></div>
                <button onClick={() => addToCart("Family Monthly Pack (5L Portion)", 30000)} className="w-full bg-white text-green-800 py-4 rounded-2xl font-black uppercase tracking-widest">Subscribe</button>
              </div>

              <div className="bg-white text-gray-900 p-10 rounded-[3rem]">
                <h3 className="text-3xl font-black mb-4">Custom Bulk Order</h3>
                <p className="text-gray-500 mb-6">Enter liters needed. Rate: 6,000 UGX per Liter.</p>
                <input 
                  type="number" 
                  placeholder="Liters" 
                  className="w-full p-4 border-2 border-green-600 rounded-2xl text-2xl font-black mb-4" 
                  onChange={(e) => setCustomLiters(Number(e.target.value))}
                />
                <p className="text-2xl font-black text-green-700 mb-6">Total: {(customLiters * 6000).toLocaleString()} UGX</p>
                <button onClick={() => addToCart(`Custom Order (${customLiters}L)`, customLiters * 6000)} className="w-full bg-orange-500 text-white py-4 rounded-2xl font-black uppercase">Add Bulk to Cart</button>
              </div>
            </div>
          </section>

          {/* Sides & Cups */}
          <section id="sides" className="py-20 px-6 max-w-7xl mx-auto text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200">
                <h3 className="text-2xl font-black mb-6">🍓 Fruit Side Plates</h3>
                <img src={fruitPlateImg} className="w-full h-48 object-cover rounded-2xl mb-6" alt="Fruit Plates" />
                <div className="space-y-3">
                  {[ {s: "Small", p: 3000}, {s: "Medium", p: 5000}, {s: "Large", p: 10000} ].map(f => (
                    <button key={f.s} onClick={() => addToCart(`${f.s} Fruit Plate`, f.p)} className="w-full flex justify-between items-center p-4 bg-white rounded-xl hover:bg-orange-50 transition font-bold">
                      <span>{f.s} Plate</span>
                      <span className="text-orange-600">{f.p.toLocaleString()} UGX</span>
                    </button>
                  ))}
                </div>
              </div>

              <div id="cups" className="bg-gray-50 p-8 rounded-[2rem] border border-gray-200">
                <h3 className="text-2xl font-black mb-6">🍸 Signature Cocktails</h3>
                <img src={cocktailImg} className="w-full h-48 object-cover rounded..." />
                <div className="space-y-3">
                  {[ {v: "200ml", p: 1000}, {v: "350ml", p: 2000}, {v: "500ml", p: 3000} ].map(c => (
                    <button key={c.v} onClick={() => addToCart(`${c.v} Cocktail`, c.p)} className="w-full flex justify-between items-center p-4 bg-white rounded-xl hover:bg-green-50 transition font-bold">
                      <span>{c.v} Cocktail</span>
                      <span className="text-green-700">{c.p.toLocaleString()} UGX</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section id="events" className="py-24 px-6 bg-black text-white text-center">
            <div className="max-w-4xl mx-auto">
              <span className="bg-orange-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Premium Service</span>
              <h2 className="text-5xl font-black mt-6 mb-8 uppercase italic">Functions & Parties</h2>
              <p className="text-gray-400 text-lg mb-12">
                Make your event unforgettable with high-end natural juice service. We accommodate weddings, office functions, and private parties with customized dispensers and staffing.
              </p>
              <a href="mailto:gabrilemaurice@gmail.com?subject=Event Quote Request" className="bg-white text-black px-12 py-5 rounded-full font-black text-xl hover:bg-green-500 hover:text-white transition-all shadow-2xl inline-block">
                Request a Custom Quote
              </a>
            </div>
          </section>
        </main>
      )}

      {/* Cart Review */}
      {view === 'cart' && (
        <section className="py-16 px-6 max-w-3xl mx-auto text-left">
          <h2 className="text-4xl font-black mb-10">Review Your Order</h2>
          {cart.length === 0 ? (
            <p className="text-gray-400">Empty basket.</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <span className="font-bold">{item.name}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">Remove</button>
                </div>
              ))}
              <div className="pt-8 text-right">
                <p className="text-3xl font-black mb-6">Subtotal: {cartSubtotal.toLocaleString()} UGX</p>
                <button onClick={() => setView('checkout')} className="bg-orange-500 text-white px-12 py-4 rounded-2xl font-black text-xl">Proceed to Order Details</button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* NEW ORDER WINDOW (Checkout) */}
      {view === 'checkout' && (
        <section className="py-16 px-6 max-w-2xl mx-auto text-left">
          <div className="bg-white border-4 border-green-600 rounded-[3rem] p-10 shadow-2xl">
            <h2 className="text-3xl font-black mb-8 uppercase text-green-800 tracking-tighter">Order Window</h2>
            
          <form action="https://formspree.io/f/xqegnzbe" method="POST" className="flex flex-col gap-4">
  {/* Basic Customer Info */}
  <input type="text" name="name" placeholder="Full Name" required className="p-2 border rounded" />
  <input type="text" name="phone" placeholder="WhatsApp / Phone Number" required className="p-2 border rounded" />
  <input type="text" name="address" placeholder="Delivery Address (e.g., Buloba/Wakiso)" required className="p-2 border rounded" />

  {/* The Hidden Cart Data - This sends the juices to your email */}
  <input type="hidden" name="order_details" value={fullOrderString} />

  {/* Space for them to tell you anything else */}
  <textarea name="message" placeholder="Special instructions (optional)" className="p-2 border rounded h-24"></textarea>

  {/* The Submit Button showing the dynamic total */}
  <button 
    type="submit" 
    disabled={cart.length === 0}
    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
  >
    {cart.length > 0 ? `Confirm Order (${finalTotal} UGX)` : "Add Items to Cart First"}
  </button>
</form>
          </div>
        </section>
      )}

      <footer className="bg-green-900 text-white py-12 border-t border-green-800">
  <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
    
    {/* Business Info */}
    <div>
      <h3 className="text-xl font-bold mb-4">M & R Juice Processing</h3>
      <p className="text-green-200 text-sm">
        Providing natural, sugar-free juices to the Wakiso, Kalambi, and Buloba areas.
      </p>
    </div>

    {/* Contact Details */}
    <div>
      <h3 className="text-xl font-bold mb-4">Contact Us</h3>
      <ul className="space-y-2 text-green-200">
        <li>
          <span className="font-semibold text-white">Email:</span>{" "}
          <a href="mailto:gabrilemaurice@gmail.com" className="hover:underline">
            gabrilemaurice@gmail.com
          </a>
        </li>
        <li>
          <span className="font-semibold text-white">Phone:</span>{" "}
          <a href="tel:+256747200442" className="hover:underline">
            +256 747 200 442
          </a>
        </li>
        <li>
          <span className="font-semibold text-white">Location:</span> Buloba, Wakiso District
        </li>
      </ul>
    </div>

    {/* Quick Links or Trading Hours */}
    <div>
      <h3 className="text-xl font-bold mb-4">Business Hours</h3>
      <p className="text-green-200 text-sm">
        Monday - Saturday: 8:00 AM - 6:00 PM<br />
        Sunday: Closed
      </p>
    </div>

  </div>

  <div className="mt-12 text-center text-green-500 text-xs border-t border-green-800 pt-6">
    &copy; {new Date().getFullYear()} M & R Juice Processing Enterprise. All rights reserved.
  </div>
</footer>
    </div>
  );
}