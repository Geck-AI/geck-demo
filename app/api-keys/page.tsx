'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Trash2, Key, Eye, EyeOff } from 'lucide-react';

interface ApiKey {
  id: string;
  key: string;
  createdAt: string;
  expiresAt: string;
  scopes: string[];
}

export default function ApiKeysPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [keyName, setKeyName] = useState('');

  useEffect(() => {
    if (!token) {
      router.push('/login?next=/api-keys');
      return;
    }
    // Load existing keys
    loadApiKeys();
  }, [token, router]);

  const loadApiKeys = async () => {
    try {
      const response = await fetch('/api/auth/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.keys || []);
      }
    } catch {
      // Silently fail - API keys loading is optional
    }
  };

  const handleGenerateKey = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/auth/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: keyName }),
      });

      if (response.ok) {
        const data = await response.json();
        setNewKey(data.apiKey);
        setKeyName('');
        toast({
          title: 'API Key Generated',
          description: 'Your API key has been generated. Store it securely - it will not be shown again.',
        });
        loadApiKeys();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to generate API key',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to generate API key',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: 'Copied',
      description: 'API key copied to clipboard',
    });
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/auth/api-keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keyId }),
      });

      if (response.ok) {
        toast({
          title: 'API Key Revoked',
          description: 'The API key has been revoked successfully',
        });
        loadApiKeys();
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to revoke API key',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to revoke API key',
        variant: 'destructive',
      });
    }
  };

  if (!token) {
    return null;
  }

  return (
    <main className="min-h-screen p-8 bg-stone-50" role="main" aria-label="API Keys management page">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-stone-600 mb-8">
          Generate API keys for programmatic access to THE STORE API. Use these keys to authenticate requests from partner agents, bots, or integrations.
        </p>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>API Key Authentication:</strong> Use API keys to authenticate programmatic requests. 
            Include the key in the <code className="bg-blue-100 px-1 rounded">Authorization</code> header as <code className="bg-blue-100 px-1 rounded">Bearer YOUR_API_KEY</code>.
            <a href="/api/docs" className="text-blue-600 hover:underline ml-1" data-testid="api-docs-link">View API documentation</a> for more details.
          </p>
        </div>

        {/* Generate New Key */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Key className="w-5 h-5" aria-hidden="true" />
            Generate New API Key
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="key-name">Key Name (Optional)</Label>
              <Input
                id="key-name"
                type="text"
                placeholder="e.g., Production Bot, Development Integration"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button
              onClick={handleGenerateKey}
              disabled={isGenerating}
              aria-label="Generate new API key"
            >
              {isGenerating ? 'Generating...' : 'Generate API Key'}
            </Button>
          </div>

          {/* Display newly generated key */}
          {newKey && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ Store this key securely - it will not be shown again
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white border border-yellow-300 rounded text-sm font-mono break-all">
                  {newKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyKey(newKey)}
                  aria-label="Copy API key to clipboard"
                >
                  <Copy className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Existing Keys */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your API Keys</h2>
          {apiKeys.length === 0 ? (
            <p className="text-stone-600 text-center py-8">
              No API keys found. Generate one above to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-4 border border-stone-200 rounded-md flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-sm font-mono bg-stone-100 px-2 py-1 rounded">
                        {showKey[key.id] ? key.key : `${key.key.substring(0, 12)}...`}
                      </code>
                      <button
                        type="button"
                        onClick={() => setShowKey((prev) => ({ ...prev, [key.id]: !prev[key.id] }))}
                        className="text-stone-600 hover:text-stone-900"
                        aria-label={showKey[key.id] ? 'Hide API key' : 'Show API key'}
                      >
                        {showKey[key.id] ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    </div>
                    <div className="text-xs text-stone-500 space-y-1">
                      <p>Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                      <p>Expires: {new Date(key.expiresAt).toLocaleDateString()}</p>
                      <p>Scopes: {key.scopes.join(', ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyKey(key.key)}
                      aria-label="Copy API key to clipboard"
                    >
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeKey(key.id)}
                      aria-label="Revoke API key"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Documentation Link */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Need help?</strong> Check out our{' '}
            <a href="/api/docs" className="underline font-medium">
              API documentation
            </a>{' '}
            to learn how to use your API keys.
          </p>
        </div>
      </div>
    </main>
  );
}

