import { generateCorrectionCommentSchema } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';
import { AlertCircle } from 'lucide-react';

interface CorrectionNoteProps {
  text: string;
  datePublished: string;
  url: string;
  author?: string;
  authorType?: 'Person' | 'Organization';
  position?: 'top' | 'bottom';
}

export default function CorrectionNote({
  text,
  datePublished,
  url,
  author,
  authorType,
  position = 'top',
}: CorrectionNoteProps) {
  const correctionSchema = generateCorrectionCommentSchema({
    text,
    datePublished,
    url,
    author,
    authorType,
  });

  const formattedDate = new Date(datePublished).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <StructuredData data={correctionSchema} id="correction-note-schema" />
      <div
        className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 ${
          position === 'top' ? 'mt-6' : ''
        }`}
        role="alert"
        aria-live="polite"
        itemScope
        itemType="https://schema.org/CorrectionComment"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <strong className="text-yellow-800" itemProp="author" itemScope itemType="https://schema.org/Organization">
                <span itemProp="name">Correction</span>
              </strong>
              <time
                dateTime={datePublished}
                className="text-sm text-yellow-700"
                itemProp="datePublished"
              >
                {formattedDate}
              </time>
            </div>
            <p className="text-yellow-800" itemProp="text">
              {text}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

