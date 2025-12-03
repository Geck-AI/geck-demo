'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '@/stores/cartStore';
import { useStylesStore } from '@/stores/stylesStore';
import { useFavoritesStore } from '@/stores/favoritesStore';
import { Minus, Plus, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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
            className="mb-4 flex items-center gap-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Search
          </Button>
          <div className="text-center py-12" role="status" aria-live="polite" aria-label="Loading product">
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
            className="mb-4 flex items-center gap-2"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Search
          </Button>
          <div className="text-center py-12" role="alert">
            <h1 className="text-2xl font-semibold text-stone-800">Product not found</h1>
            <p className="text-stone-600 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id);
    toast.success(`${product.productDisplayName} added to cart!`);
  };

  const handleIncrement = () => {
    increment(product.id);
    toast.success(`Added one more ${product.productDisplayName} to cart!`);
  };

  const handleDecrement = () => {
    decrement(product.id);
  };

  return (
    <main className="min-h-screen bg-stone-50 p-4" role="main" aria-label="Product detail page">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <nav aria-label="Breadcrumb navigation">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-stone-600 hover:text-stone-800"
            aria-label="Go back to previous page"
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
              <div className="flex justify-center" role="img" aria-label={`Product image: ${product.productDisplayName}`}>
                <img
                  src={product.imageURL}
                  alt={product.productDisplayName}
                  className="w-full max-w-md object-cover rounded-lg shadow-md"
                />
              </div>

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
                      className="ml-4 p-2 rounded-full hover:bg-stone-100 transition-colors"
                      aria-label={isFavorite ? `Remove ${product.productDisplayName} from favorites` : `Add ${product.productDisplayName} to favorites`}
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
                  <div className="text-3xl font-bold text-stone-900 mb-6" aria-label="Product price">
                    ${product.priceUSD ?? 'N/A'}
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
                          className="px-3 py-2 hover:bg-stone-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                        <span 
                          id="product-quantity"
                          className="px-4 py-2 text-center min-w-[60px] font-medium"
                          aria-label={`Current quantity: ${quantity}`}
                        >
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleIncrement}
                          className="px-3 py-2 hover:bg-stone-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md"
                      aria-label={`Add ${product.productDisplayName} to cart`}
                    >
                      Add to Cart
                    </Button>
                  )}

                  {quantity > 0 && (
                    <Button
                      onClick={handleIncrement}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md"
                      aria-label={`Add more ${product.productDisplayName} to cart`}
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