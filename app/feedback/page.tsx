'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FeedbackPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: 'correction',
    url: '',
    description: '',
    correctInformation: '',
    name: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback/corrections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
      toast({
        title: 'Feedback submitted',
        description: 'Thank you for your feedback. We will review it shortly.',
      });

      // Reset form
      setFormData({
        type: 'correction',
        url: '',
        description: '',
        correctInformation: '',
        name: '',
        email: '',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to submit feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <main className="min-h-screen p-8 bg-white" role="main" aria-label="Feedback submission page">
        <div className="max-w-2xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" aria-hidden="true" />
            <h2 className="text-2xl font-semibold text-green-800 mb-2">Thank You!</h2>
            <p className="text-green-700 mb-4">
              Your feedback has been submitted successfully. We appreciate your help in keeping our content accurate.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              className="mt-4"
              aria-label="Submit another feedback"
            >
              Submit Another Feedback
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Feedback and corrections submission page">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Submit Feedback or Correction</h1>
        <p className="text-stone-600 mb-8">
          Help us maintain accurate information by reporting errors or suggesting improvements.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> For urgent corrections (safety, legal, pricing errors), please contact us directly at{' '}
                <a 
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com'}`}
                  className="underline font-medium"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'support@thestore.com'}
                </a>
                {' '}or call{' '}
                <a 
                  href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-800-THE-STORE'}`}
                  className="underline font-medium"
                >
                  {process.env.NEXT_PUBLIC_CONTACT_PHONE || '+1-800-THE-STORE'}
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Feedback submission form">
          <div>
            <Label htmlFor="type" className="text-base font-semibold">
              Type of Feedback <span className="text-red-500">*</span>
            </Label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full mt-2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
              data-testid="feedback-type-select"
            >
              <option value="correction">Correction (Error in content)</option>
              <option value="update">Update (Outdated information)</option>
              <option value="suggestion">Suggestion (Improvement idea)</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="url" className="text-base font-semibold">
              Page URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://www.thestore.com/product/123"
              className="mt-2"
              aria-required="true"
              aria-describedby="url-help"
              data-testid="feedback-url-input"
            />
            <p id="url-help" className="text-sm text-stone-500 mt-1">
              The URL of the page where you found the error or want to suggest an improvement.
            </p>
          </div>

          <div>
            <Label htmlFor="description" className="text-base font-semibold">
              Description of Issue <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              className="w-full mt-2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Please describe the error or issue you found..."
              aria-required="true"
              data-testid="feedback-description-textarea"
            />
          </div>

          <div>
            <Label htmlFor="correctInformation" className="text-base font-semibold">
              Correct Information (if known)
            </Label>
            <textarea
              id="correctInformation"
              name="correctInformation"
              value={formData.correctInformation}
              onChange={handleChange}
              rows={4}
              className="w-full mt-2 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="If you know the correct information, please provide it here..."
              data-testid="feedback-correct-info-textarea"
            />
          </div>

          <div className="border-t border-stone-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Information (Optional)</h2>
            <p className="text-sm text-stone-600 mb-4">
              Providing your contact information is optional but helps us follow up if we need clarification.
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name (optional)"
                  data-testid="feedback-name-input"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com (optional)"
                  data-testid="feedback-email-input"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              aria-label="Submit feedback"
              data-testid="feedback-submit-button"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  type: 'correction',
                  url: '',
                  description: '',
                  correctInformation: '',
                  name: '',
                  email: '',
                });
              }}
              aria-label="Clear form"
              data-testid="feedback-clear-button"
            >
              Clear
            </Button>
          </div>
        </form>

        <div className="mt-8 text-sm text-stone-600">
          <p>
            By submitting this form, you agree to our{' '}
            <a href="/corrections-policy" className="text-blue-600 hover:underline">
              Corrections Policy
            </a>
            . Your information will be kept confidential and used only for processing your feedback.
          </p>
        </div>
      </div>
    </main>
  );
}

