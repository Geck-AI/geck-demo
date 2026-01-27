import { Metadata } from 'next';
import { generateMetadata as generateSEOMetadata } from '@/lib/seo';
import { getEnvironment, isStaging, getStagingUrl, getProductionUrl } from '@/lib/environment';
import Link from 'next/link';

export const metadata: Metadata = generateSEOMetadata({
  title: 'Staging & Test Environment Guide',
  description: 'Complete guide for using THE STORE staging environment for automated testing and partner agent workflows.',
  url: '/staging-guide',
  noindex: true, // Don't index staging guide
});

export default function StagingGuidePage() {
  const environment = getEnvironment();
  const stagingUrl = getStagingUrl();
  const productionUrl = getProductionUrl();

  return (
    <main className="min-h-screen bg-stone-50 p-4" role="main">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-stone-900 mb-4">
            Staging & Test Environment Guide
          </h1>
          
          {isStaging() && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6" role="alert">
              <p className="text-yellow-800 font-medium">
                🧪 You are currently in STAGING mode. This environment is safe for automated testing.
              </p>
            </div>
          )}

          <div className="prose prose-stone max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Environment Information</h2>
              <div className="bg-stone-50 rounded-md p-4 mb-4">
                <p><strong>Current Environment:</strong> <code className="bg-stone-200 px-2 py-1 rounded">{environment}</code></p>
                <p><strong>Staging URL:</strong> <code className="bg-stone-200 px-2 py-1 rounded">{stagingUrl}</code></p>
                <p><strong>Production URL:</strong> <code className="bg-stone-200 px-2 py-1 rounded">{productionUrl}</code></p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Getting Started</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>Access the staging environment at <code className="bg-stone-200 px-2 py-1 rounded">{stagingUrl}</code></li>
                <li>Check environment status: <Link href="/api/staging/info" className="text-blue-600 hover:underline">GET /api/staging/info</Link></li>
                <li>Review API documentation: <Link href="/api/docs" className="text-blue-600 hover:underline">/api/docs</Link></li>
                <li>Generate API keys for programmatic access: <Link href="/api-keys" className="text-blue-600 hover:underline">/api-keys</Link></li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">API Endpoints</h2>
              <div className="bg-stone-50 rounded-md p-4">
                <ul className="space-y-2">
                  <li><strong>Environment Info:</strong> <code className="bg-stone-200 px-2 py-1 rounded">GET /api/staging/info</code></li>
                  <li><strong>API Documentation:</strong> <code className="bg-stone-200 px-2 py-1 rounded">GET /api/docs</code></li>
                  <li><strong>Products:</strong> <code className="bg-stone-200 px-2 py-1 rounded">GET /api/store/styles</code></li>
                  <li><strong>Product by ID:</strong> <code className="bg-stone-200 px-2 py-1 rounded">GET /api/store/styles/{'{id}'}</code></li>
                  <li><strong>Authentication:</strong> <code className="bg-stone-200 px-2 py-1 rounded">POST /api/auth/login</code></li>
                  <li><strong>API Keys:</strong> <code className="bg-stone-200 px-2 py-1 rounded">POST /api/auth/api-keys</code></li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Testing Workflows</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">1. Product Browsing</h3>
                  <p>Test product listing, filtering, and search functionality.</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Browse products: <Link href="/shop" className="text-blue-600 hover:underline">/shop</Link></li>
                    <li>Search products: <Link href="/search" className="text-blue-600 hover:underline">/search</Link></li>
                    <li>View product details: <Link href="/product/12345" className="text-blue-600 hover:underline">/product/{'{id}'}</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">2. Shopping Cart</h3>
                  <p>Test adding items, updating quantities, and cart management.</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Add to cart via UI or API</li>
                    <li>Update quantities</li>
                    <li>View cart: <Link href="/cart" className="text-blue-600 hover:underline">/cart</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">3. Checkout Process</h3>
                  <p>Test complete checkout workflow with shipping details.</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Fill shipping form</li>
                    <li>Submit order</li>
                    <li>Verify order confirmation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-stone-800 mb-2">4. Authentication</h3>
                  <p>Test user registration, login, and API key generation.</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Register new user: <Link href="/register" className="text-blue-600 hover:underline">/register</Link></li>
                    <li>Login: <Link href="/login" className="text-blue-600 hover:underline">/login</Link></li>
                    <li>Generate API keys: <Link href="/api-keys" className="text-blue-600 hover:underline">/api-keys</Link></li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Rate Limiting</h2>
              <p>
                Staging environment has more lenient rate limits to support automated testing:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li><strong>Staging:</strong> 200 requests per minute</li>
                <li><strong>Production:</strong> 60 requests per minute</li>
              </ul>
              <p className="mt-4">
                Rate limit headers are included in all responses:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li><code className="bg-stone-200 px-2 py-1 rounded">X-RateLimit-Limit</code></li>
                <li><code className="bg-stone-200 px-2 py-1 rounded">X-RateLimit-Remaining</code></li>
                <li><code className="bg-stone-200 px-2 py-1 rounded">X-RateLimit-Reset</code></li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Environment Variables</h2>
              <p>To enable staging mode, set the following environment variable:</p>
              <div className="bg-stone-900 text-green-400 p-4 rounded-md mt-4 font-mono text-sm">
                <code>NEXT_PUBLIC_ENVIRONMENT=staging</code>
              </div>
              <p className="mt-4">Or use a staging URL pattern:</p>
              <div className="bg-stone-900 text-green-400 p-4 rounded-md mt-4 font-mono text-sm">
                <code>NEXT_PUBLIC_BASE_URL=https://staging.yourdomain.com</code>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Best Practices</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Use staging environment for all automated testing</li>
                <li>Generate API keys for programmatic access</li>
                <li>Monitor rate limits using response headers</li>
                <li>Test complete workflows end-to-end</li>
                <li>Verify error handling and edge cases</li>
                <li>Check API documentation for latest endpoints</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">Support</h2>
              <p>
                For questions or issues with the staging environment, please refer to:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>API Documentation: <Link href="/api/docs" className="text-blue-600 hover:underline">/api/docs</Link></li>
                <li>Environment Info: <Link href="/api/staging/info" className="text-blue-600 hover:underline">/api/staging/info</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

