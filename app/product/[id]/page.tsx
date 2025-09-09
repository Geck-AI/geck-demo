'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { useStylesStore } from '@/stores/stylesStore';
import { Minus, Plus, ArrowLeft } from 'lucide-react';
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

  useEffect(() => {
    if (data.length === 0) {
      fetchStyles();
    }
  }, [data.length, fetchStyles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto"></div>
            <p className="text-stone-600 mt-4">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-stone-800">Product not found</h1>
            <p className="text-stone-600 mt-2">The product you&apos;re looking for doesn&apos;t exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product.id);
  };

  const handleIncrement = () => {
    increment(product.id);
  };

  const handleDecrement = () => {
    decrement(product.id);
  };

  return (
    <div className="min-h-screen bg-stone-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-stone-600 hover:text-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Search
        </Button>

        {/* Product Details */}
        <Card className="p-6 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="flex justify-center">
              <img
                src={product.imageURL}
                alt={product.productDisplayName}
                className="w-full max-w-md object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-stone-800 mb-2">
                  {product.productDisplayName}
                </h1>
                <p className="text-stone-600 mb-4">
                  Color: {product.baseColour}
                </p>
                <div className="text-3xl font-bold text-stone-900 mb-6">
                  ${product.priceUSD ?? 'N/A'}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="space-y-4">
                {quantity > 0 ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-stone-700">Quantity:</span>
                    <div className="flex items-center border border-stone-300 rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDecrement}
                        className="px-3 py-2 hover:bg-stone-100"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="px-4 py-2 text-center min-w-[60px] font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleIncrement}
                        className="px-3 py-2 hover:bg-stone-100"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md"
                  >
                    Add to Cart
                  </Button>
                )}

                {quantity > 0 && (
                  <Button
                    onClick={handleIncrement}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 px-6 rounded-md transition-colors duration-200 shadow-md"
                  >
                    Add More to Cart
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage; 