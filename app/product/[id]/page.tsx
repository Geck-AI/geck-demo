'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCartStore } from '@/stores/cartStore';
import { useStylesStore } from '@/stores/stylesStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Minus, Plus, ArrowLeft, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateReviewSchema, generateStructuredData } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

const ProductDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);
  
  const { data, loading, fetchStyles } = useStylesStore();
  const product = data.find((style) => style.id === productId);
  
  const addItem = useCartStore((s) => s.addItem);
  const increment = useCartStore((s) => s.incrementItem);
  const decrement = useCartStore((s) => s.decrementItem);
  const quantity = useCartStore(
    (s) => s.items.find((i) => i.id === productId)?.quantity || 0
  );
  const toggleFavorite = useFavoritesStore((s) => s.toggleItem);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(productId));

  useEffect(() => {
    if (data.length === 0) {
      fetchStyles();
    }
  }, [data.length, fetchStyles]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" role="main" aria-label="Product detail page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">Back to Search</span>
          </Button>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center" role="status" aria-live="polite" aria-label="Loading product" aria-busy="true">
            <div 
              className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-yellow-400 mx-auto"
              aria-hidden="true"
            ></div>
            <p className="text-gray-600 mt-6 text-lg font-medium">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" role="main" aria-label="Product detail page">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">Back to Search</span>
          </Button>
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center" role="alert" aria-live="assertive">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Product not found</h1>
              <p className="text-gray-600 mb-8 text-lg">The product you&apos;re looking for doesn&apos;t exist.</p>
              <Button
                onClick={() => router.push("/shop")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
                aria-label="Browse all products"
              >
                Browse All Products
              </Button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id);
    toast.success(`${product.productDisplayName} added to cart!`);
    
    // Track conversion by agent source
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/conversion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversionType: 'add_to_cart',
          productId: product.id,
          value: product.priceUSD || 0,
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(err => {
        console.error('Failed to track conversion:', err);
      });
    }
  };

  const handleIncrement = () => {
    increment(product.id);
    toast.success(`Added one more ${product.productDisplayName} to cart!`);
  };

  const handleDecrement = () => {
    decrement(product.id);
  };

  // Generate review schema with sample reviews
  const sampleReviews = [
    {
      author: 'John D.',
      rating: 5,
      reviewBody: 'Excellent quality and fast shipping. Highly recommend!',
      datePublished: '2025-01-10',
    },
    {
      author: 'Sarah M.',
      rating: 4,
      reviewBody: 'Great product, fits perfectly. Very satisfied with my purchase.',
      datePublished: '2025-01-08',
    },
    {
      author: 'Mike T.',
      rating: 5,
      reviewBody: 'Love this product! Great value for money.',
      datePublished: '2025-01-05',
    },
  ];

  const reviewSchema = generateReviewSchema(sampleReviews);

  // Generate ImageObject schema for product image
  const productImageSchema = generateStructuredData('ImageObject', {
    contentUrl: product.imageURL,
    url: product.imageURL,
    caption: `${product.productDisplayName}${product.articleType ? ` - ${product.articleType}` : ''}${product.baseColour ? ` in ${product.baseColour}` : ''}`,
    description: `${product.productDisplayName}${product.articleType ? ` - ${product.articleType}` : ''}${product.baseColour ? ` in ${product.baseColour}` : ''}${product.masterCategory ? ` from ${product.masterCategory} collection` : ''} - $${product.priceUSD ?? 'N/A'} at THE STORE`,
    width: 800,
    height: 800,
  });

  return (
    <>
      {/* JSON-LD structured data at top of body */}
      {/* Note: BuyAction schema is in the layout.tsx file */}
      <StructuredData data={productImageSchema} id="product-image-schema" />
      <StructuredData data={reviewSchema} id="review-schema" />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white" role="main" aria-label="Product detail page">
        <noscript>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4 max-w-7xl mx-auto">
            <p className="text-yellow-800 text-sm">
              <strong>JavaScript is disabled.</strong> Some features like adding to cart may not work. 
              <Link href="/shop" className="underline ml-1">Continue shopping</Link>.
            </p>
          </div>
        </noscript>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <nav aria-label="Breadcrumb navigation" className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Go back to previous page"
              data-testid="product-back-button"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span className="text-sm font-medium">Back to Search</span>
            </Button>
          </nav>

          {/* Product Details */}
          <article className="bg-white rounded-2xl  overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image Section */}
              <div className="bg-gray-50 p-8 lg:p-12 flex items-start justify-center">
                <figure className="w-full max-w-lg">
                  <div className="relative bg-white rounded-xl overflow-hidden group">
                    <img
                      src={product.imageURL}
                      alt={`${product.productDisplayName}${product.articleType ? ` - ${product.articleType}` : ''}${product.baseColour ? ` in ${product.baseColour}` : ''}${product.masterCategory ? ` from ${product.masterCategory} collection` : ''} - $${product.priceUSD ?? 'N/A'} at THE STORE`}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="mt-4 text-center text-sm text-gray-500">
                    {product.productDisplayName}
                    {product.articleType && ` - ${product.articleType}`}
                    {product.baseColour && ` in ${product.baseColour}`}
                  </figcaption>
                </figure>
              </div>

              {/* Product Info Section */}
              <div className="p-8 lg:p-8 flex flex-col">
                <div className="flex-1">
                  {/* Header with Title and Favorite */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-4">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-3">
                        {product.productDisplayName}
                      </h1>
                      {product.masterCategory && (
                        <p className="text-sm text-gray-500 uppercase tracking-wide font-medium mb-2">
                          {product.masterCategory}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mb-4">
                        <time dateTime={product.year ? `${product.year}-01-01` : new Date().toISOString().split('T')[0]}>
                          Published: {product.year ? `${product.year}` : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                        <span className="mx-2">•</span>
                        <time dateTime={new Date().toISOString().split('T')[0]}>
                          Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className="flex-shrink-0 p-3 rounded-full hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                      aria-label={isFavorite ? `Remove ${product.productDisplayName} from favorites` : `Add ${product.productDisplayName} to favorites`}
                      aria-pressed={isFavorite}
                      data-testid="product-favorite-button"
                      data-agent-role="favorite-button"
                      data-agent-action="toggle-favorite"
                      data-agent-hint={`Click to ${isFavorite ? 'remove from' : 'add to'} favorites. Heart icon shows current state.`}
                    >
                      <Heart
                        className={`w-6 h-6 transition-all duration-200 ${
                          isFavorite
                            ? "text-red-500 fill-red-500 scale-110"
                            : "text-gray-400 hover:text-red-400"
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  </div>

                  {/* Price Section */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl lg:text-5xl font-bold text-gray-900" aria-label="Product price">
                        ${product.priceUSD ?? 'N/A'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm" aria-label="Product color">
                      <span className="font-medium">Color:</span> {product.baseColour}
                    </p>
                  </div>

                  {/* Rating Section */}
                  <div className="mb-6 pb-6 border-b border-gray-200" aria-label="Product ratings and reviews">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1" role="img" aria-label="4.5 out of 5 stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= 4 
                                ? 'text-yellow-400 fill-yellow-400' 
                                : star === 5 
                                ? 'text-yellow-400 fill-yellow-400 opacity-50' 
                                : 'text-gray-300'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold text-gray-900" aria-label="Average rating 4.5">4.5</span>
                        <span className="text-gray-500 text-sm">(24 reviews)</span>
                      </div>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                      {sampleReviews.map((review, idx) => (
                        <div 
                          key={idx} 
                          className="bg-gray-50 rounded-lg p-4 border border-gray-100" 
                          itemScope 
                          itemType="https://schema.org/Review"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-sm text-gray-900" itemProp="author" itemScope itemType="https://schema.org/Person">
                              <span itemProp="name">{review.author}</span>
                            </span>
                            <div className="flex items-center gap-0.5" role="img" aria-label={`${review.rating} out of 5 stars`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating 
                                      ? 'text-yellow-400 fill-yellow-400' 
                                      : 'text-gray-300'
                                  }`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <time 
                              className="text-xs text-gray-500 ml-auto" 
                              dateTime={review.datePublished} 
                              itemProp="datePublished"
                            >
                              {new Date(review.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </time>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed" itemProp="reviewBody">
                            {review.reviewBody}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="mb-6 space-y-3 text-sm">
                    {product.articleType && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Type:</span>
                        <span className="text-gray-900">{product.articleType}</span>
                      </div>
                    )}
                    {product.season && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Season:</span>
                        <span className="text-gray-900">{product.season}</span>
                      </div>
                    )}
                    {product.usage && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Style:</span>
                        <span className="text-gray-900">{product.usage}</span>
                      </div>
                    )}
                    {product.year && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Published:</span>
                        <time 
                          className="text-gray-900" 
                          dateTime={`${product.year}-01-01`}
                        >
                          {new Date(product.year, 0, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </div>
                    )}
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600 font-medium">Last Updated:</span>
                      <time 
                        className="text-gray-900" 
                        dateTime={new Date().toISOString().split('T')[0]}
                      >
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </div>
                  </div>
                </div>

                {/* Action Buttons Section */}
                <div className="space-y-4 pt-6 border-t border-gray-200" role="group" aria-label="Cart quantity controls">
                  {quantity > 0 ? (
                    <>
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                        <label htmlFor="product-quantity" className="text-sm font-semibold text-gray-700">
                          Quantity:
                        </label>
                        <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white" role="group" aria-label="Quantity selector">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDecrement}
                            className="px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-none border-r border-gray-300"
                            aria-label="Decrease quantity"
                            disabled={quantity <= 1}
                            aria-disabled={quantity <= 1}
                            data-testid="product-decrement-button"
                            data-agent-role="quantity-decrement"
                            data-agent-action="decrease-quantity"
                            data-agent-hint="Click to decrease quantity by 1. Disabled when quantity is 1."
                          >
                            <Minus className="w-5 h-5" aria-hidden="true" />
                          </Button>
                          <span 
                            id="product-quantity"
                            className="px-6 py-2 text-center min-w-[80px] font-bold text-lg text-gray-900"
                            aria-label={`Current quantity: ${quantity}`}
                            aria-live="polite"
                            aria-atomic="true"
                            data-testid="product-quantity-display"
                          >
                            {quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleIncrement}
                            className="px-4 py-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-none border-l border-gray-300"
                            aria-label="Increase quantity"
                            data-testid="product-increment-button"
                            data-agent-role="quantity-increment"
                            data-agent-action="increase-quantity"
                            data-agent-hint="Click to increase quantity by 1. Adds item to cart if not already added."
                          >
                            <Plus className="w-5 h-5" aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={handleIncrement}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 text-lg"
                        aria-label={`Add more ${product.productDisplayName} to cart`}
                        data-testid="product-add-more-button"
                      >
                        Add More to Cart
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 text-lg"
                      aria-label={`Add ${product.productDisplayName} to cart`}
                      data-testid="product-add-to-cart-button"
                      data-agent-role="add-to-cart-button"
                      data-agent-action="add-to-cart"
                      data-agent-hint="Click to add product to shopping cart. Quantity controls appear after adding."
                      data-agent-expected="Product added to cart, quantity controls shown"
                    >
                      Add to Cart
                    </Button>
                  )}

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Secure Payment</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Easy Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </main>
    </>
  );
};

export default ProductDetailPage; 