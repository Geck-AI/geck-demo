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
import { Card } from '@/components/ui/card';
import { generateReviewSchema } from '@/lib/seo';
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
      <main className="min-h-screen bg-stone-50 p-4" role="main" aria-label="Product detail page">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Search
          </Button>
          <div className="text-center py-12" role="status" aria-live="polite" aria-label="Loading product" aria-busy="true">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto"
              aria-hidden="true"
            ></div>
            <p className="text-stone-600 mt-4">Loading product...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-stone-50 p-4" role="main" aria-label="Product detail page">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Search
          </Button>
          <div className="text-center py-12" role="alert" aria-live="assertive">
            <h1 className="text-2xl font-semibold text-stone-800">Product not found</h1>
            <p className="text-stone-600 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
            <Button
              variant="outline"
              onClick={() => router.push("/shop")}
              className="mt-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Browse all products"
            >
              Browse All Products
            </Button>
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

  return (
    <main className="min-h-screen bg-stone-50 p-4" role="main" aria-label="Product detail page">
      <noscript>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>JavaScript is disabled.</strong> Some features like adding to cart may not work. 
            <Link href="/shop" className="underline ml-1">Continue shopping</Link>.
          </p>
        </div>
      </noscript>
      <StructuredData data={reviewSchema} id="review-schema" />
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <nav aria-label="Breadcrumb navigation">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-stone-600 hover:text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Go back to previous page"
            data-testid="product-back-button"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Search
          </Button>
        </nav>

        {/* Product Details */}
        <article className="p-6 bg-white shadow-sm">
          <Card className="p-6 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <figure className="flex justify-center">
                <img
                  src={product.imageURL}
                  alt={`${product.productDisplayName}${product.articleType ? ` - ${product.articleType}` : ''}${product.baseColour ? ` in ${product.baseColour}` : ''}${product.masterCategory ? ` from ${product.masterCategory} collection` : ''} - $${product.priceUSD ?? 'N/A'} at THE STORE`}
                  className="w-full max-w-md object-cover rounded-lg shadow-md"
                />
                <figcaption className="mt-2 text-sm text-stone-600 text-center">
                  {product.productDisplayName}
                  {product.articleType && ` - ${product.articleType}`}
                  {product.baseColour && ` in ${product.baseColour}`}
                </figcaption>
              </figure>

              {/* Product Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h1 className="text-2xl font-semibold text-stone-800 flex-1">
                      {product.productDisplayName}
                    </h1>
                        <button
                          type="button"
                          onClick={() => toggleFavorite(product.id)}
                          className="ml-4 p-2 rounded-full hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label={isFavorite ? `Remove ${product.productDisplayName} from favorites` : `Add ${product.productDisplayName} to favorites`}
                          aria-pressed={isFavorite}
                          data-testid="product-favorite-button"
                          data-agent-role="favorite-button"
                          data-agent-action="toggle-favorite"
                          data-agent-hint={`Click to ${isFavorite ? 'remove from' : 'add to'} favorites. Heart icon shows current state.`}
                        >
                          <Heart
                            className={`w-6 h-6 transition-colors ${
                              isFavorite
                                ? "text-red-600 fill-red-600"
                                : "text-stone-400 hover:text-red-400"
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                  </div>
                  <p className="text-stone-600 mb-4" aria-label="Product color">
                    Color: <span className="font-medium">{product.baseColour}</span>
                  </p>
                  <div className="text-3xl font-bold text-stone-900 mb-4" aria-label="Product price">
                    ${product.priceUSD ?? 'N/A'}
                  </div>
                  
                  {/* Publish/Update Dates */}
                  <div className="text-sm text-stone-500 mb-6 space-y-1" aria-label="Product dates">
                    {product.year && (
                      <p>
                        <span className="font-medium">Published:</span>{' '}
                        <time dateTime={`${product.year}-01-01`}>
                          {new Date(product.year, 0, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Last Updated:</span>{' '}
                      <time dateTime={new Date().toISOString().split('T')[0]}>
                        {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </time>
                    </p>
                  </div>
                  
                  {/* Reviews Section */}
                  <div className="mb-6" aria-label="Product ratings and reviews">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center" role="img" aria-label="4.5 out of 5 stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : star === 5 ? 'text-yellow-400 fill-yellow-400 opacity-50' : 'text-stone-300'}`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <span className="text-stone-700 font-medium" aria-label="Average rating 4.5">4.5</span>
                      <span className="text-stone-500 text-sm" aria-label="24 customer reviews">(24 reviews)</span>
                    </div>
                    
                    {/* Sample Reviews */}
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {sampleReviews.map((review, idx) => (
                        <div key={idx} className="border-t border-stone-200 pt-3" itemScope itemType="https://schema.org/Review">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm" itemProp="author" itemScope itemType="https://schema.org/Person">
                              <span itemProp="name">{review.author}</span>
                            </span>
                            <div className="flex items-center" role="img" aria-label={`${review.rating} out of 5 stars`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300'}`}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <time className="text-xs text-stone-500" dateTime={review.datePublished} itemProp="datePublished">
                              {new Date(review.datePublished).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </time>
                          </div>
                          <p className="text-sm text-stone-700" itemProp="reviewBody">
                            {review.reviewBody}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="space-y-4" role="group" aria-label="Cart quantity controls">
                  {quantity > 0 ? (
                    <div className="flex items-center gap-4">
                      <label htmlFor="product-quantity" className="text-sm font-medium text-stone-700">
                        Quantity:
                      </label>
                      <div className="flex items-center border border-stone-300 rounded-md" role="group" aria-label="Quantity selector">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDecrement}
                          className="px-3 py-2 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Decrease quantity"
                          disabled={quantity <= 1}
                          aria-disabled={quantity <= 1}
                          data-testid="product-decrement-button"
                          data-agent-role="quantity-decrement"
                          data-agent-action="decrease-quantity"
                          data-agent-hint="Click to decrease quantity by 1. Disabled when quantity is 1."
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <span 
                          id="product-quantity"
                          className="px-4 py-2 text-center min-w-[60px] font-medium"
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
                          className="px-3 py-2 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          aria-label="Increase quantity"
                          data-testid="product-increment-button"
                          data-agent-role="quantity-increment"
                          data-agent-action="increase-quantity"
                          data-agent-hint="Click to increase quantity by 1. Adds item to cart if not already added."
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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

                  {quantity > 0 && (
                    <Button
                      onClick={handleIncrement}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`Add more ${product.productDisplayName} to cart`}
                      data-testid="product-add-more-button"
                    >
                      Add More to Cart
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </article>
      </div>
    </main>
  );
};

export default ProductDetailPage; 