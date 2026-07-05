import { useState } from 'react';
import { requestAuthCode, verifyAuthCode } from '../api/auth';
import { setToken } from '../api/client';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export function AuthModal({ open, onClose, onAuthSuccess }: AuthModalProps) {
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const handleSendCode = async () => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 10) { setError('Введите корректный номер телефона'); return; }
    setError('');
    setLoading(true);
    try {
      await requestAuthCode('+' + cleaned);
      setStep('code');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 4) { setError('Введите код из SMS'); return; }
    setError('');
    setLoading(true);
    try {
      const result = await verifyAuthCode('+' + phone.replace(/\D/g, ''), code);
      setToken(result.token);
      onAuthSuccess();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h2>{step === 'phone' ? 'Войти' : 'Подтверждение'}</h2>

        {step === 'phone' ? (
          <>
            <p className="modal-sub">Введите номер телефона для входа</p>
            <input
              type="tel"
              className="input"
              placeholder="+7 900 123-45-67"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              autoFocus
            />
            <button className="btn primary" onClick={handleSendCode} disabled={loading}>
              {loading ? 'Отправка…' : 'Получить код'}
            </button>
          </>
        ) : (
          <>
            <p className="modal-sub">Код отправлен на {phone}</p>
            <input
              type="text"
              className="input"
              placeholder="Код из SMS"
              value={code}
              onChange={e => setCode(e.target.value)}
              autoFocus
              inputMode="numeric"
            />
            <button className="btn primary" onClick={handleVerifyCode} disabled={loading}>
              {loading ? 'Проверка…' : 'Подтвердить'}
            </button>
          </>
        )}

        {error && <div className="err-text">{error}</div>}
      </div>
    </div>
  );
}
